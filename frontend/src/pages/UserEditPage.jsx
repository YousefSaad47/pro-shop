import React, { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import axios from "axios";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import FormContainer from "@/components/FormContainer";
import { FaSpinner } from "react-icons/fa";
import { Checkbox } from "@/components/ui/checkbox";

const UserEditPage = () => {
  const { id: userId } = useParams();
  const { toast } = useToast();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);

  const {
    data: user,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ["user", userId],
    queryFn: async () => {
      const { data } = await axios.get(`/api/users/${userId}`);
      return data;
    },
    enabled: !!userId,
    staleTime: 2 * 60 * 1000,
    cacheTime: 5 * 60 * 1000,
  });

  const { mutateAsync: updateUser, isLoading: updateUserLoading } = useMutation(
    {
      mutationKey: ["updateUser"],
      mutationFn: async (body) => {
        const { data } = await axios.put(`/api/users/${body._id}`, body);
        return data;
      },
      onSuccess: () => {
        refetch();
        toast({
          title: "Success",
          description: "User updated successfully",
          className: "bg-gray-800 text-white",
          duration: 3000,
        });
        const updateUserSound = new Audio("/assets/sounds/success.mp3");
        updateUserSound.play();
      },
      onError: () => {
        toast({
          title: "Error",
          description: "Failed to update user",
          variant: "destructive",
        });
        const updateUserSound = new Audio("/assets/sounds/error.mp3");
        updateUserSound.play();
      },
    }
  );

  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      setName(user.name);
      setEmail(user.email);
      setIsAdmin(user.isAdmin);
    }
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await updateUser({
        _id: userId,
        name,
        email,
        isAdmin,
      });

      navigate("/admin/userlist");
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to update user",
        variant: "destructive",
      });
    }
  };

  return (
    <FormContainer>
      <div className="px-20 md:px-72">
        <Card className="p-10 mt-5 mb-10">
          <CardHeader>
            <div className="flex justify-between items-center">
              <h1 className="text-2xl font-bold">Edit User</h1>
              <Link to="/admin/userlist">
                <Button variant="outline">Back</Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex justify-center items-center h-[400px]">
                <FaSpinner className="h-8 w-8 animate-spin" />
              </div>
            ) : isError ? (
              <p>Error: {error.message}</p>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="name" className="block mb-1 font-medium">
                    Name
                  </label>
                  <Input
                    type="text"
                    id="name"
                    placeholder="Enter name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block mb-1 font-medium">
                    Email Address
                  </label>
                  <Input
                    type="email"
                    id="email"
                    placeholder="Enter email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="isAdmin"
                    checked={isAdmin}
                    onCheckedChange={(checked) => setIsAdmin(checked)}
                  />
                  <label
                    htmlFor="isAdmin"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Is Admin
                  </label>
                </div>
                <Button type="submit" disabled={updateUserLoading}>
                  {updateUserLoading ? (
                    <FaSpinner className="h-6 w-6 animate-spin" />
                  ) : (
                    "Update"
                  )}
                </Button>
              </form>
            )}
          </CardContent>
        </Card>
      </div>
    </FormContainer>
  );
};

export default UserEditPage;
