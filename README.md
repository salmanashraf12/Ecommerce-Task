# E-commerce Product Management System

A full-stack web application built with Node.js, Express, React, TypeScript, and PostgreSQL that allows administrators to manage products and categories with a many-to-many relationship.

## Project Structure

```
ecommerce-product-management/
├── backend/
│   ├── controllers/
│   │   ├── authController.ts
│   │   ├── categoryController.ts
│   │   └── productController.ts
│   ├── routes/
│   │   ├── authRoutes.ts
│   │   └── index.ts
│   ├── prisma/
│   │   └── schema.prisma
│   ├── .env
│   ├── package.json
│   └── tsconfig.json
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── ui/
│   │   │   │   └── PrivateRoute.tsx
│   │   │   └── ProductForm.tsx
│   │   ├── context/
│   │   │   └── AuthContext.tsx
│   │   ├── pages/
│   │   │   ├── CategoriesPage.tsx
│   │   │   ├── LoginPage.tsx
│   │   │   ├── ProductsPage.tsx
│   │   │   └── RegisterPage.tsx
│   │   ├── lib/
│   │   ├── api.ts
│   │   ├── App.tsx
│   │   └── main.tsx
│   ├── package.json
│   ├── vite.config.ts
│   ├── tailwind.config.js
│   └── tsconfig.json
└── README.md
```

## Prerequisites

Before running this application, make sure you have the following installed on your system:

- **Node.js** (v16 or higher)
- **npm** or **yarn** package manager
- **PostgreSQL** (v12 or higher)
- **Git**

## Installation & Setup

### 1. Clone the Repository

```bash
git clone (https://github.com/salmanashraf12/Ecommerce-Task)
cd ecommerce-product-management
```

### 2. Backend Setup

Navigate to the backend directory and install dependencies:

```bash
cd backend
npm install
```

#### Backend Dependencies

The backend requires the following dependencies (should be installed automatically with `npm install`):

```
express
cors
dotenv
jsonwebtoken
bcryptjs
prisma
@prisma/client
typescript
ts-node
@types/node
@types/express
@types/cors
@types/bcryptjs
@types/jsonwebtoken
```

#### Environment Configuration

Create a `.env` file in the backend directory with the following variables:

```env
DATABASE_URL="postgresql://username:password@localhost:5432/ecommerce_db"
JWT_SECRET="your-super-secret-jwt-key"
PORT=5000
NODE_ENV=development
```

Replace `username`, `password`, and `ecommerce_db` with your PostgreSQL credentials and database name.

#### Database Setup

1. Create a PostgreSQL database named `ecommerce_db` (or your preferred name)
2. Run Prisma migrations to set up the database schema:

```bash
npx prisma generate
npx prisma migrate dev --name init
```

#### Start the Backend Server

```bash
npm run dev
```

The backend server will start on http://localhost:5000

### 3. Frontend Setup

Open a new terminal and navigate to the frontend directory:

```bash
cd frontend
npm install
```

#### Frontend Dependencies

The frontend requires the following dependencies (should be installed automatically with `npm install`):

```
react
react-dom
typescript
@types/react
@types/react-dom
@tanstack/react-query
axios
lucide-react
class-variance-authority
clsx
tailwind-merge
tailwindcss-animate
@radix-ui/react-slot
framer-motion
vite
@vitejs/plugin-react
autoprefixer
postcss
tailwindcss@3
```

#### Install shadcn/ui Components

The project uses shadcn/ui components. If not already set up, you may need to install them:

```bash
npx shadcn@latest init
```

Follow the prompts to configure shadcn/ui for your project.


#### Start the Frontend Development Server

```bash
npm run dev
```

The frontend application will start on http://localhost:3000

## Usage

1. Open your browser and navigate to http://localhost:3000
2. Register a new account or login with existing credentials
3. The application will load with a product management interface
4. Use the navigation to:
   - View all products in a paginated table
   - Add new products with category associations
   - Edit existing products
   - Manage categories (create, edit, delete)
   - Filter products by category



