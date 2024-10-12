# Pro-Shop E-Commerce Platform

> E-Commerce platform built with the MERN stack

# Demo

https://github.com/user-attachments/assets/efd06cd6-3185-49d8-964c-202b9826810a

## Screenshots 📸

<table>
  <tbody>
  <tr>
      <td align="center"><img width="100%" src="images/login.png" alt="Application Image 1"></td>
      <td align="center"><img width="100%" src="images/signup.png" alt="Application Image 2"></td>
      <td align="center"><img width="100%" src="images/home-page.png" alt="Application Image 3"></td>
    </tr>
    <tr>
      <td align="center"><img width="100%" src="images/featured-products.png" alt="Application Image 1"></td>
      <td align="center"><img width="100%" src="images/products.png" alt="Application Image 2"></td>
      <td align="center"><img width="100%" src="images/categories.png" alt="Application Image 3"></td>
    </tr>
    <tr>
      <td align="center"><img width="100%" src="images/drop-down.png" alt="Application Image 4"></td>
      <td align="center"><img width="100%" src="images/menu.png" alt="Application Image 5"></td>
      <td align="center"><img width="100%" src="images/cart.png" alt="Application Image 6"></td>
    </tr>
    <tr>
      <td align="center"><img width="100%" src="images/product.png" alt="Application Image 7"></td>
      <td align="center"><img width="100%" src="images/reviews.png" alt="Application Image 8"></td>
      <td align="center"><img width="100%" src="images/shipping.png" alt="Application Image 9"></td>
    </tr>
    <tr>
      <td align="center"><img width="100%" src="images/payment.png" alt="Application Image 10"></td>
      <td align="center"><img width="100%" src="images/place-order.png" alt="Application Image 11"></td>
      <td align="center"><img width="100%" src="images/stripe.png" alt="Application Image 12"></td>
    </tr>
    <tr>
      <td align="center"><img width="100%" src="images/profile1.png" alt="Application Image 13"></td>
      <td align="center"><img width="100%" src="images/profile2.png" alt="Application Image 14"></td>
      <td align="center"><img width="100%" src="images/pagination.png" alt="Application Image 15"></td>
    </tr>
    <tr>
      <td align="center"><img width="100%" src="images/footer.png" alt="Application Image 16"></td>
      <td align="center"><img width="100%" src="images/orders-admin.png" alt="Application Image 17"></td>
      <td align="center"><img width="100%" src="images/users-admin.png" alt="Application Image 18"></td>
    </tr>
    <tr>
      <td align="center"><img width="100%" src="images/add-product.png" alt="Application Image 19"></td>
      <td align="center"><img width="100%" src="images/edit-user.png" alt="Application Image 20"></td>
      <td align="center"><img width="100%" src="images/products-admin.png" alt="Application Image 21"></td>
    </tr>
  </tbody>
</table>

## Usage

- Create a MongoDB database and obtain your `MongoDB URI` - [MongoDB Atlas](https://www.mongodb.com/cloud/atlas/register)
- Create a Stripe account and obtain your `Secret Key` - [Stripe Developer](https://stripe.com/)

### Env Variables

Rename the `.env.example` file to `.env` and add the following

```
NOVE_END=development
PORT=8080
MONGO_CONNECTION=<your_mongo_connection>
JWT_SECRET=<your_jwt_secret>
STRIPE_SECRET_KEY=<your_stripe_secret>
STRIPE_PUBLISHABLE_KEY=<your_stripe_publishable_key>
STRIPE_WEBHOOK_SECRET=<your_stripe_webhook_secret>
```

### Install Dependencies (frontend & backend)

```
cd backend/
npm install
cd frontend/
npm install
```

### Run

```
# Run frontend (:5173) & backend (:8080)
cd backend/
npm run server
cd frontend/
npm run dev
# Run backend only
cd backend/
npm run server
# Run frontend only
cd frontend/
npm run dev
```

### Seed Database

You can use the following commands to seed the database with some sample users and products as well as destroy all data

```
# Import data
npm run data:import
# Destroy data
npm run data:destroy
```

### Sample User Logins

```
admin@email.com (Admin)
123456

yousef@email.com (Customer)
123456

mohamed@email.com (Customer)
123456
```
