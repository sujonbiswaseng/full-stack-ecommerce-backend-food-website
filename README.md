
### Project name : 
##### Bitebase 🍱 | Advanced Full-Stack Multi-Vendor Food Ordering Platform

### Project description : 
##### **BiteBase** is an AI-powered full-stack multi-vendor food ordering platform that allows customers to discover meals, place orders, and track deliveries, while vendors manage menus and orders through a secure and responsive dashboard. The platform includes smart AI features, secure authentication, payment integration, and scalable admin management for a seamless food delivery experience.


### Quick Links
 - Frontend Repo    : https://github.com/sujonbiswaseng/full-stack-ecommerce-frontend-food-website.git
- Backend Repo     :https://github.com/sujonbiswaseng/full-stack-ecommerce-backend-food-website.git
- Frontend Live    : https://full-stack-ecommerce-frontend-websi.vercel.app
- Backend Live     : https://full-stack-ecommerce-backend-food-w.vercel.app



### Key feature
🔐 Advanced Authentication & Authorization

- Secure JWT-based authentication system
- Role-based access control (Customer, Provider, Admin)
- Protected routes and private dashboards
- Persistent login sessions
- Secure logout and token handling

🍽️ Meal Management
- Browse all available meals
- View meal details
- Search meals by name
- Filter by category, cuisine, and price
- Featured meals section
- Browse meals from multiple providers


🛒 Cart & Checkout
- Add meals to cart
- Update quantity or remove items
- Delivery address form
- Cash on Delivery checkout
- Order confirmation system
- Dynamic price calculation

🔍 Search & Filter

📦 Order Management
- Place orders easily
- Track order status
- View order history
- Cancel orders when allowed
- Detailed order summary

👨‍🍳 Provider Features
- Add new meals
- Edit meal information
- Delete meals
- Manage incoming orders
- Update order status

🛡️ Admin Features
- Manage all users
- Suspend or activate accounts
- View all orders
- Manage meal categories
- Monitor platform activity

⭐ Review System
- Add reviews
- Give star ratings
- Edit reviews
- Delete reviews

💳 Payment
- Secure payment integration

⚠️ Error Handling
- Form validation
- Clear error messages
- Loading states 
🎨 UI/UX
- Clean and modern design
- Fully responsive layout
- Consistent colors and spacing
- User-friendly navigation
- Fast and smooth experience

### 🛠️ Technology Stack
Frontend
- Next.js
- Tailwind CSS
- shadcn

Backend
- Node.js
- Express.js
- Prisma ORM
Database
- PostgreSQL
Authentication
- JWT
Payment
 - Stripe

Deployment
- Vercel (Frontend)
- vercel(Backend)

## Setup Instructions
- (frontend) : git clone https://github.com/sujonbiswaseng/full-stack-ecommerce-frontend-food-website.git
- (backend) : git clone https://github.com/sujonbiswaseng/full-stack-ecommerce-backend-food-website.git

### Backend Setup
- cd full-stack-ecommerce-backend-food-website.git
- pnpm install
- Create .env file:
```typescript
DATABASE_URL='postgresql://username:password@localhost:5432/mydatabase?schema=public'

BETTER_AUTH_SECRET=hD7G9Cuksel0tG6Jv7FOLD4Qn8BYNhqC
BETTER_AUTH_URL=http://localhost:5000
FRONTEND_URL=http://localhost:3000
PORT=5000

ACCESS_TOKEN_SECRET=KMUFsIDTnFmyG3nMiGM6H9FNFUROf3wh7SmqJp-QV30
REFRESH_TOKEN_SECRET=refreshtokendata
ACCESS_TOKEN_EXPIRES_IN=1d
REFRESH_TOKEN_EXPIRES_IN=7d

APP_USER='example@gmail.com'
APP_PASS=jkll ddss dsas degc

EMAIL="admin_email_example@gmail.com"
PASSWORD="admin_email_example"
GOOGLE_CLIENT_ID=google-client-id-example.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=google-client-secret-example
NODE_ENV=development

CLOUDINARY_CLOUD_NAME=demo_cloud_name
CLOUDINARY_API_KEY=1234567890
CLOUDINARY_API_SECRET=cloudinary_secret_example



SMTP_USER=example@gmail.com
SMTP_PASS=sadx dswd dagx saeg
SMTP_HOST=smtp.gmail.com
SMTP_PORT=465
SMTP_FROM=example@gmail.com

STRIPE_SECRET_KEY=sk_test_example_stripe_secret_key
STRIPE_WEBHOOK_SECRET=whsec_example_webhook_secret
```

Run the cmd:
- pnpm dlx prisma migrate reset
- pnpm dlx prisma migrate dev

- pnpm dlx prisma generate
- pnpm dev

### Frontend Setup

- cd full-stack-ecommerce-frontend-food-website.git
- pnpm install
- Create .env file:

```typescript

BACKEND_URL=http://localhost:5000
FRONTEND_URL=http://loacalhost:3000

ACCESS_TOKEN_SECRET=accestoken_secret
REFRESH_TOKEN_SECRET=refreshtoken_secret

NEXT_PUBLIC_test=sdfsfsf

NEXT_PUBLIC_BACKEND_URL=http://localhost:5000
```

pnpm dev















 



