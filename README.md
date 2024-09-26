# ProShop eCommerce Platform

> eCommerce platform built with the MERN stack

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
      <td align="center"><img width="100%" src="images/paypal.png" alt="Application Image 12"></td>
    </tr>
    <tr>
      <td align="center"><img width="100%" src="images/profile.png" alt="Application Image 13"></td>
      <td align="center"><img width="100%" src="images/orders-admin.png" alt="Application Image 14"></td>
      <td align="center"><img width="100%" src="images/users-admin.png" alt="Application Image 15"></td>
    </tr>
    <tr>
      <td align="center"><img width="100%" src="images/add-product.png" alt="Application Image 13"></td>
      <td align="center"><img width="100%" src="images/edit-user.png" alt="Application Image 14"></td>
      <td align="center"><img width="100%" src="images/products-admin.png" alt="Application Image 15"></td>
    </tr>
  </tbody>
</table>

## Usage

- Create a MongoDB database and obtain your `MongoDB URI` - [MongoDB Atlas](https://www.mongodb.com/cloud/atlas/register)
- Create a PayPal account and obtain your `Client ID` - [PayPal Developer](https://developer.paypal.com/)

### Env Variables

Rename the `.env.example` file to `.env` and add the following

```
NODE_ENV = development
PORT = 5000
MONGO_URI = your mongodb uri
JWT_SECRET = 'abc123'
PAYPAL_CLIENT_ID = your paypal client id
```

Change the JWT_SECRET and PAGINATION_LIMIT to what you want

### Install Dependencies (frontend & backend)

```
npm install
cd frontend
npm install
```

### Run

```

# Run frontend (:3000) & backend (:5000)
npm run dev

# Run backend only
npm run server
```

### Seed Database

You can use the following commands to seed the database with some sample users and products as well as destroy all data

```
# Import data
npm run data:import

# Destroy data
npm run data:destroy
```

```
Sample User Logins

admin@email.com (Admin)
123456

yousef@email.com (Customer)
12345
```
