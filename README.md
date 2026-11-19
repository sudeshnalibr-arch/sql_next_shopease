# ShopEase – Full-Stack E-Commerce Application

ShopEase is a full-stack e-commerce web application designed to provide a smooth online shopping experience with product management, order processing, authentication, role-based access control, and real-time communication.

The project is built using **Next.js, TypeScript, Node.js, Express.js, MySQL, and Sequelize ORM**.

## Features

### Authentication & Authorization
- User registration and login
- JWT-based authentication
- Role-based access control (RBAC)
- Multiple user roles: Admin, Manager, Staff, and Customer
- Protected routes and API endpoints

### Product Management
- Create, update, delete, and view products
- Product image upload using Multer
- Product categories
- Product listing and pagination

### Shopping Features
- Shopping cart management
- Wishlist
- Product reviews and ratings
- Order placement and order history
- Coupon and discount management

### Order & Payment Management
- Order processing
- Order status tracking
- Payment management
- Invoice generation

### Notifications & Communication
- Real-time notifications using Socket.IO
- Persistent notification history
- Read/unread notification status
- Real-time messaging and communication features

> Note: Update this feature list to reflect the functionality that is actually implemented and tested in your current project.

## Technology Stack

### Frontend
- Next.js
- React
- TypeScript
- Tailwind CSS
- TanStack Query
- Axios
- Socket.IO Client
- Lucide React
- Framer Motion

### Backend
- Node.js
- Express.js
- Sequelize ORM
- MySQL
- JWT Authentication
- Joi Validation
- Multer
- Socket.IO
- PDFKit

### Development Tools
- Git
- GitHub
- Postman
- Visual Studio Code
- XAMPP / MySQL

## Project Structure

```text
nodejs_sql_ecommerce/
│
├── backend/
│   ├── src/
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── middlewares/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── services/
│   │   └── utils/
│   ├── uploads/
│   ├── package.json
│   └── server.js
│
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── app/
│   │   ├── components/
│   │   ├── features/
│   │   ├── hooks/
│   │   ├── lib/
│   │   └── providers/
│   ├── package.json
│   └── README.md
│
├── .gitignore
└── README.md
```

## Prerequisites

Before running the project, make sure you have installed:

- Node.js (LTS version)
- npm
- MySQL
- XAMPP or another MySQL server
- Git

## Installation & Setup

### 1. Clone the Repository

```bash
git clone https://github.com/YOUR_USERNAME/YOUR_REPOSITORY.git

cd nodejs_sql_ecommerce
```

Replace the repository URL with your actual GitHub repository URL.

### 2. Backend Setup

Navigate to the backend folder:

```bash
cd backend
```

Install dependencies:

```bash
npm install
```

Create a `.env` file in the backend root directory.

Example environment configuration:

```env
PORT=3008

DB_HOST=localhost
DB_PORT=3306
DB_NAME=ecommerce
DB_USER=root
DB_PASSWORD=

JWT_SECRET=your_access_token_secret
JWT_REFRESH_SECRET=your_refresh_token_secret

CLIENT_URL=http://localhost:3000
```

Use the exact environment variable names expected by your backend configuration. Do not upload your actual `.env` file to GitHub.

Start the backend:

```bash
npm run dev
```

### 3. Frontend Setup

Open another terminal and navigate to the frontend folder:

```bash
cd frontend
```

Install dependencies:

```bash
npm install
```

Create a `.env.local` file in the frontend root directory:

```env
NEXT_PUBLIC_SERVER_URL=http://localhost:3008/api
```

Start the frontend:

```bash
npm run dev
```

Open your browser:

```text
http://localhost:3000
```

## Database Setup

1. Start MySQL using XAMPP or your preferred MySQL server.
2. Create the database configured in your backend environment.
3. Configure the database credentials in the backend `.env` file.
4. Start the backend.
5. Allow Sequelize to synchronize the models if your development configuration uses `sequelize.sync()`.

For production, use proper database migrations instead of relying on automatic schema synchronization.

## Available Scripts

### Backend

```bash
npm run dev
npm start
```

### Frontend

```bash
npm run dev
npm run build
npm start
npm run lint
```

Refer to each folder's `package.json` for the exact scripts available.

## API Overview

The backend exposes REST API endpoints for application functionality, including:

| Module | Description |
|---|---|
| Authentication | Registration, login, logout |
| Users | User and role management |
| Products | Product CRUD and listing |
| Categories | Product category management |
| Orders | Order creation and management |
| Payments | Payment management |
| Coupons | Discount and coupon management |
| Reviews | Product reviews and ratings |
| Wishlist | Customer wishlist |
| Notifications | Notification management |
| Invoices | Invoice generation |

## Security

- Password hashing
- JWT-based authentication
- Role-based authorization
- Request validation
- Protected API routes
- Environment variables for sensitive configuration

## Future Improvements

- Payment gateway integration
- Advanced product search and filtering
- Improved analytics dashboard
- Automated testing
- CI/CD deployment pipeline
- Production deployment and monitoring

## Author

**Sudeshna Mandal**

Full Stack Developer | Node.js | React.js | Next.js | TypeScript

## License

This project is intended for learning and portfolio demonstration purposes.