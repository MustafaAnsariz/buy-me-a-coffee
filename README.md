# Buy Me a Coffee Clone

A Next.js application that allows creators to receive support from their audience through Razorpay payments.

## Features

- 🔐 Multiple Authentication Options:
  - GitHub Login
  - Google Login (with email verification)
  - Discord Login
- 💳 Razorpay Payment Integration
- 👤 User Profiles with:
  - Customizable usernames
  - Profile pictures
  - Cover images
- 💰 Support System:
  - Flexible payment amounts
  - Quick payment options
  - Custom messages
- 📊 Payment History & Tracking
- 🎨 Modern UI with Tailwind CSS
- 🚀 Real-time Toast Notifications
- 📱 Fully Responsive Design

## Prerequisites

Before you begin, ensure you have:

- Node.js 18+ installed
- MongoDB Atlas account
- GitHub account (for authentication)
- Google Cloud account (for authentication)
- Discord Developer account (for authentication)
- Razorpay account (for payments)

## Environment Variables

Create a `.env.local` file in the root directory with these variables:

```env
# Authentication
GITHUB_ID=your_github_oauth_client_id
GITHUB_SECRET=your_github_oauth_client_secret
GOOGLE_ID=your_google_client_id
GOOGLE_SECRET=your_google_client_secret
DISCORD_CLIENT_ID=your_discord_client_id
DISCORD_CLIENT_SECRET=your_discord_client_secret

# Razorpay
NEXT_PUBLIC_KEY_ID=your_razorpay_key_id
KEY_SECRET=your_razorpay_secret_key

# Database
MONGODB_URI=your_mongodb_atlas_uri

# NextAuth
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your_nextauth_secret
NEXT_PUBLIC_URL=http://localhost:3000
```

## Setup Instructions

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/buy-me-a-coffee.git
   cd buy-me-a-coffee
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure OAuth Providers**

   ### GitHub OAuth
   - Go to GitHub Settings → Developer settings → OAuth Apps
   - Create new OAuth App
   - Set homepage URL
   - Set callback URL: `http://localhost:3000/api/auth/callback/github`

   ### Google OAuth
   - Go to Google Cloud Console
   - Create new project
   - Enable Google+ API
   - Create OAuth credentials
   - Set callback URL: `http://localhost:3000/api/auth/callback/google`

   ### Discord OAuth
   - Go to Discord Developer Portal
   - Create new application
   - Set callback URL: `http://localhost:3000/api/auth/callback/discord`

4. **Set up MongoDB Atlas**
   - Create MongoDB Atlas account
   - Create new cluster
   - Get connection string
   - Add to `MONGODB_URI` in `.env.local`

5. **Configure Razorpay**
   - Create Razorpay account
   - Get API keys from Dashboard → Settings → API Keys
   - Add to `.env.local`

6. **Run the development server**
   ```bash
   npm run dev
   ```

## Project Structure

```
buy-me-a-coffee/
├── app/                    # Next.js 13 app directory
│   ├── api/               # API routes
│   │   ├── auth/         # Authentication endpoints
│   │   ├── payments/     # Payment endpoints
│   │   └── razorpay/     # Razorpay webhook
│   ├── [username]/       # Dynamic user profiles
│   ├── creators/         # Creators discovery page
│   ├── dashboard/        # User dashboard
│   └── login/           # Authentication page
├── components/           # React components
├── models/              # MongoDB models
└── actions/             # Server actions
```

## Features in Detail

### Authentication
- Multiple OAuth providers
- Email verification for Google accounts
- Automatic user profile creation

### Payments
- Multiple payment options
- Custom amounts
- Message support
- Payment history
- Real-time notifications

### User Profiles
- Custom usernames
- Profile/Cover image customization
- Payment setup
- Dashboard analytics

## Tech Stack

- Next.js 13 (App Router)
- MongoDB & Mongoose
- NextAuth.js
- Razorpay
- Tailwind CSS
- React Toastify
- Framer Motion

## Deployment

1. Create Vercel account
2. Connect GitHub repository
3. Add environment variables
4. Deploy!

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details

## Support

If you found this project helpful, consider supporting me:
[Your Buy Me a Coffee Profile Link]

## Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open Pull Request
