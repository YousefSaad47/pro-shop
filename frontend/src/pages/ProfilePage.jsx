import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { setCredentials } from "@/store";
import { useMutation, useQuery } from "@tanstack/react-query";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { FaTimes, FaCheck } from "react-icons/fa";

const ProfilePage = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const dispatch = useDispatch();
  const { userInfo } = useSelector((state) => state.auth);

  const { mutateAsync: updateProfile, isLoading: isUpdateLoading } =
    useMutation({
      mutationKey: ["updateProfile"],
      mutationFn: async (body) => {
        const { data } = await axios.put("/api/users/profile", body);
        return data;
      },
    });

  const { data: myOrders, isLoading: isMyOrdersLoading } = useQuery({
    queryKey: ["myOrders"],
    queryFn: async () => {
      const { data } = await axios.get("/api/orders/myorders");
      return data;
    },
  });

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    if (userInfo) {
      setName(userInfo.name);
      setEmail(userInfo.email);
    }
  }, [userInfo]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    try {
      const res = await updateProfile({
        _id: userInfo._id,
        name,
        email,
        password,
      });
      dispatch(setCredentials(res));
      toast.success("Profile updated successfully");
    } catch (err) {
      toast.error(err?.response?.data?.message || err.message);
    }
  };

  return (
    <div className="container mx-auto px-4 md:px-8 py-8 bg-white">
      <h1 className="text-3xl font-semibold mb-8 text-center text-gray-800">
        Profile
      </h1>
      <div className="flex flex-col lg:flex-row gap-12">
        {/* Form Section */}
        <div className="lg:w-1/2">
          <h2 className="text-2xl font-semibold mb-6 text-gray-700">
            Update Profile
          </h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <div>
                <Label
                  htmlFor="name"
                  className="text-sm font-medium text-gray-600"
                >
                  Name
                </Label>
                <Input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter your name"
                  required
                  className="mt-1"
                />
              </div>
              <div>
                <Label
                  htmlFor="email"
                  className="text-sm font-medium text-gray-600"
                >
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  required
                  className="mt-1"
                />
              </div>
              <div>
                <Label
                  htmlFor="password"
                  className="text-sm font-medium text-gray-600"
                >
                  New Password
                </Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter new password"
                  className="mt-1"
                />
              </div>
              <div>
                <Label
                  htmlFor="confirmPassword"
                  className="text-sm font-medium text-gray-600"
                >
                  Confirm New Password
                </Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm new password"
                  className="mt-1"
                />
              </div>
            </div>
            <Button
              type="submit"
              disabled={isUpdateLoading}
              className="w-full text-white"
            >
              {isUpdateLoading ? "Updating..." : "Update Profile"}
            </Button>
          </form>
        </div>

        {/* Table Section */}
        <div className="lg:w-1/2">
          <h2 className="text-2xl font-semibold mb-6 text-gray-700">
            My Orders
          </h2>
          {isMyOrdersLoading ? (
            <div className="text-center text-gray-600">Loading...</div>
          ) : (
            // Add fixed height and overflow-y-auto for scrollable table
            <div className="overflow-y-auto max-h-96">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-gray-600">ID</TableHead>
                    <TableHead className="text-gray-600">Date</TableHead>
                    <TableHead className="text-gray-600">Total</TableHead>
                    <TableHead className="text-gray-600">Paid</TableHead>
                    <TableHead className="text-gray-600">Delivered</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {myOrders?.map((order) => (
                    <TableRow key={order._id}>
                      <TableCell className="font-medium text-gray-700">
                        {order._id}
                      </TableCell>
                      <TableCell className="text-gray-600">
                        {order.createdAt.substring(0, 10)}
                      </TableCell>
                      <TableCell className="text-gray-600">
                        ${order.totalPrice.toFixed(2)}
                      </TableCell>
                      <TableCell>
                        {order.isPaid ? (
                          <FaCheck className="text-green-500" />
                        ) : (
                          <FaTimes className="text-red-500" />
                        )}
                      </TableCell>
                      <TableCell>
                        {order.isDelivered ? (
                          <FaCheck className="text-green-500" />
                        ) : (
                          <FaTimes className="text-red-500" />
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
