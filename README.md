# Dishari Cyber Café - Full Stack E-Commerce Website

A modern, fully animated cyber café website built with Next.js, featuring e-commerce functionality, admin panel, and payment integration.

## 🚀 Features

### Frontend
- ✅ Fully animated UI with Framer Motion
- ✅ Responsive design (mobile, tablet, desktop)
- ✅ Green & white color theme
- ✅ Smooth page transitions
- ✅ Animated hero sections, cards, forms
- ✅ Scroll animations and parallax effects
- ✅ Product catalog with filters
- ✅ Shopping cart with persistent storage
- ✅ Secure checkout with Stripe
- ✅ Contact form with validation

### Backend
- ✅ RESTful API with Next.js App Router
- ✅ MongoDB database with Mongoose
- ✅ User authentication (NextAuth.js)
- ✅ Admin panel with full CRUD operations
- ✅ Cloudinary image upload & optimization
- ✅ Stripe payment integration
- ✅ Webhook handling for order confirmation
- ✅ Email notifications (Nodemailer)
- ✅ Server-side validation (Zod)

### Admin Panel
- ✅ Secure login system
- ✅ Product management (Create, Read, Update, Delete)
- ✅ Image upload with Cloudinary
- ✅ Order management
- ✅ Contact message management
- ✅ Animated dashboard

## 📋 Prerequisites

- Node.js 18+ 
- MongoDB database (local or Atlas)
- Cloudinary account
- Stripe account
- SMTP email service (Gmail, etc.)

## 🔧 Installation

### 1. Clone the repository

```bash
git clone <your-repo-url>
cd dishari
```

### 2. Install dependencies

```bash
npm install
```

### 3. Environment Setup

Create a `.env` file in the root directory:

```env
# MongoDB Connection
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/dishari?retryWrites=true&w=majority

# Cloudinary Configuration
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Stripe Configuration
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_xxxxxxx
STRIPE_SECRET_KEY=sk_test_xxxxxxx
STRIPE_WEBHOOK_SECRET=whsec_xxxxxxx

# Authentication
NEXTAUTH_SECRET=your-super-secret-key-min-32-characters-long
NEXTAUTH_URL=http://localhost:3000

# Email Configuration
EMAIL_SERVER=smtp://username:password@smtp.gmail.com:587
EMAIL_FROM=noreply@dishari.com

# Admin Credentials (initial setup)
ADMIN_EMAIL=admin@dishari.com
ADMIN_PASSWORD=ChangeThisPassword123!

# Application
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 4. Configure Services

#### MongoDB Atlas
1. Create account at [mongodb.com](https://www.mongodb.com/cloud/atlas)
2. Create a new cluster
3. Get connection string
4. Add to `MONGODB_URI`

#### Cloudinary
1. Sign up at [cloudinary.com](https://cloudinary.com)
2. Get cloud name, API key, and API secret from dashboard
3. Add to environment variables

#### Stripe
1. Sign up at [stripe.com](https://stripe.com)
2. Get publishable and secret keys from dashboard
3. Set up webhook endpoint: `https://yourdomain.com/api/webhooks/stripe`
4. Get webhook secret
5. Add all keys to environment variables

#### Email (Gmail example)
1. Enable 2-factor authentication on Gmail
2. Generate an app password
3. Use format: `smtp://your-email@gmail.com:app-password@smtp.gmail.com:587`

### 5. Create Admin User

Run this script to create the initial admin user:

```bash
node scripts/createAdmin.js
```

Or manually create via MongoDB:

```javascript
{
  name: "Admin",
  email: "admin@dishari.com",
  password: "$2a$12$hashedpassword", // Use bcrypt
  role: "admin",
  active: true
}
```

### 6. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📁 Project Structure

```
dishari/
├── app/
│   ├── api/              # API routes
│   │   ├── auth/         # Authentication
│   │   ├── products/     # Product CRUD
│   │   ├── orders/       # Order management
│   │   ├── contact/      # Contact form
│   │   ├── upload/       # Image upload
│   │   └── webhooks/     # Stripe webhooks
│   ├── admin/            # Admin panel pages
│   ├── shop/             # Shop pages
│   ├── about/            # About page
│   ├── services/         # Services page
│   ├── contact/          # Contact page
│   ├── cart/             # Shopping cart
│   ├── checkout/         # Checkout page
│   ├── layout.js         # Root layout
│   ├── page.js           # Home page
│   └── globals.css       # Global styles
├── components/           # Reusable components
│   ├── Navbar.js
│   ├── Footer.js
│   ├── ProductCard.js
│   ├── Button.js
│   ├── Modal.js
│   ├── Alert.js
│   └── LoadingSpinner.js
├── lib/                  # Utility functions
│   ├── mongodb.js        # Database connection
│   ├── cloudinary.js     # Image upload
│   ├── stripe.js         # Payment processing
│   ├── email.js          # Email sending
│   └── validations.js    # Schema validation
├── models/               # Mongoose models
│   ├── User.js
│   ├── Product.js
│   ├── Order.js
│   └── Contact.js
├── store/                # State management
│   └── cartStore.js      # Cart state (Zustand)
├── public/               # Static assets
├── .env.example          # Environment template
├── package.json
├── next.config.js
├── tailwind.config.js
└── README.md
```

## 🎨 Pages

- **Home** (`/`) - Animated hero, services, featured products
- **About** (`/about`) - Company story, values, team
- **Services** (`/services`) - Service listings, pricing packages
- **Shop** (`/shop`) - Product catalog with filters
- **Product Detail** (`/shop/[id]`) - Detailed product view
- **Cart** (`/cart`) - Shopping cart management
- **Checkout** (`/checkout`) - Payment processing
- **Contact** (`/contact`) - Contact form
- **Admin** (`/admin`) - Protected admin panel

## 🔐 Admin Panel

Access: `/admin/login`

Default credentials (change after first login):
- Email: admin@dishari.com
- Password: ChangeThisPassword123!

Features:
- Dashboard with statistics
- Product management (CRUD)
- Image upload with Cloudinary
- Order management
- Contact message management
- Animated UI elements

## 💳 Payment Integration

The application uses **Stripe** for payment processing:

1. Customer adds items to cart
2. Proceeds to checkout
3. Enters shipping information
4. Stripe Elements for secure card input
5. Payment processed via Stripe API
6. Webhook confirms payment
7. Order status updated
8. Confirmation email sent

### Testing Stripe

Use test card numbers:
- Success: `4242 4242 4242 4242`
- Decline: `4000 0000 0000 0002`
- Any future expiry date and any 3-digit CVC

## 📧 Email Notifications

Automated emails are sent for:
- Order confirmation (after successful payment)
- Contact form submission confirmation

Configure SMTP server in `.env`:
```env
EMAIL_SERVER=smtp://user:pass@smtp.gmail.com:587
EMAIL_FROM=noreply@dishari.com
```

## 🧪 Testing

Run tests:
```bash
npm test
```

Run tests in watch mode:
```bash
npm run test:watch
```

## 🚀 Deployment

### Vercel (Recommended)

1. Push code to GitHub
2. Import project in Vercel
3. Add environment variables
4. Deploy

### Manual Deployment

```bash
npm run build
npm start
```

### Environment Variables for Production

Update these in production:
- `NEXTAUTH_URL` - Your production URL
- `NEXT_PUBLIC_APP_URL` - Your production URL
- `STRIPE_WEBHOOK_SECRET` - Production webhook secret
- All other keys should use production values

### Post-Deployment

1. Update Stripe webhook URL to production endpoint
2. Test payment flow
3. Verify email sending
4. Test admin panel access

## 📝 API Documentation

### Products

- `GET /api/products` - Get all products
- `GET /api/products?category=snacks` - Filter by category
- `GET /api/products?featured=true` - Get featured products
- `GET /api/products/[id]` - Get single product
- `POST /api/products` - Create product (admin)
- `PUT /api/products/[id]` - Update product (admin)
- `DELETE /api/products/[id]` - Delete product (admin)

### Orders

- `GET /api/orders` - Get all orders (admin)
- `GET /api/orders/[id]` - Get single order
- `POST /api/orders` - Create order
- `PUT /api/orders/[id]` - Update order (admin)

### Contact

- `GET /api/contact` - Get all messages (admin)
- `POST /api/contact` - Submit contact form
- `PUT /api/contact/[id]` - Update message (admin)
- `DELETE /api/contact/[id]` - Delete message (admin)

### Upload

- `POST /api/upload` - Upload image to Cloudinary (admin)

## 🛠️ Tech Stack

- **Framework:** Next.js 14 (App Router)
- **Language:** JavaScript (No TypeScript)
- **Styling:** Tailwind CSS
- **Animations:** Framer Motion
- **Database:** MongoDB with Mongoose
- **Authentication:** NextAuth.js
- **Payment:** Stripe
- **Image Upload:** Cloudinary
- **Email:** Nodemailer
- **Validation:** Zod
- **State Management:** Zustand
- **Testing:** Jest + React Testing Library

## 🎯 Performance Optimizations

- Server-side rendering (SSR)
- Incremental static regeneration (ISR)
- Image optimization with Next.js Image
- Cloudinary automatic format & quality optimization
- Code splitting
- Lazy loading
- Persistent cart with localStorage

## 🔒 Security Features

- JWT-based authentication
- Password hashing with bcrypt
- CSRF protection
- Input validation (client & server)
- Secure headers
- Environment variable protection
- Stripe webhook signature verification

## 🐛 Troubleshooting

### Database Connection Issues
- Verify MongoDB URI
- Check network access in MongoDB Atlas
- Ensure database user has proper permissions

### Stripe Webhook Issues
- Verify webhook secret
- Check webhook endpoint is publicly accessible
- Use Stripe CLI for local testing: `stripe listen --forward-to localhost:3000/api/webhooks/stripe`

### Email Sending Issues
- Verify SMTP credentials
- Check firewall settings
- For Gmail, use app-specific password

### Image Upload Issues
- Verify Cloudinary credentials
- Check file size limits
- Ensure proper CORS configuration

## 📞 Support

For issues or questions:
- Create an issue on GitHub
- Email: support@dishari.com

## 📄 License

MIT License - feel free to use this project for learning or commercial purposes.

## 👏 Credits

Built with ❤️ by [Your Name]

---

**Happy Coding! 🚀**
