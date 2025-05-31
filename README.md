# Buy Me a Coffee Clone

A Next.js application that allows creators to receive support from their audience through Razorpay payments.

## Features

- 🔐 GitHub Authentication
- 💳 Razorpay Payment Integration
- 👤 User Profiles
- 💰 Support System
- 📊 Payment History
- 🎨 Customizable Profile & Cover Pictures

## Prerequisites

Before you begin, ensure you have:

- Node.js 18+ installed
- MongoDB Atlas account
- GitHub account (for authentication)
- Razorpay account (for payments)

## Environment Variables

Create a `.env.local` file in the root directory with these variables:

```env
GITHUB_ID=your_github_oauth_client_id
GITHUB_SECRET=your_github_oauth_client_secret
NEXT_PUBLIC_KEY_ID=your_razorpay_key_id
KEY_SECRET=your_razorpay_secret_key
MONGODB_URI=your_mongodb_atlas_uri
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your_nextauth_secret
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

3. **Configure GitHub OAuth**
   - Go to GitHub Settings → Developer settings → OAuth Apps
   - Create a new OAuth App
   - Set homepage URL to `http://localhost:3000`
   - Set callback URL to `http://localhost:3000/api/auth/callback/github`
   - Copy Client ID and Client Secret to `.env.local`

4. **Set up MongoDB Atlas**
   - Create a MongoDB Atlas account
   - Create a new cluster
   - Get your connection string
   - Add it to `MONGODB_URI` in `.env.local`

5. **Configure Razorpay**
   - Create a Razorpay account
   - Get your Key ID and Secret from Dashboard → Settings → API Keys
   - Add them to `.env.local`

6. **Run the development server**
   ```bash
   npm run dev
   ```

## Usage

1. **User Registration/Login**
   - Click "Login" and authenticate with GitHub
   - First-time users are automatically registered

2. **Setup Creator Profile**
   - Go to Dashboard
   - Add your display name
   - Add profile/cover pictures (URLs)
   - Add your Razorpay credentials

3. **Receive Payments**
   - Share your profile URL (`yourdomain.com/username`)
   - Supporters can send payments through Razorpay
   - View supporter list and payment history

## Project Structure

```
buy-me-a-coffee/
├── app/                    # Next.js 13 app directory
│   ├── api/               # API routes
│   ├── [username]/        # Dynamic user profiles
│   ├── dashboard/         # Dashboard page
│   └── login/            # Login page
├── components/            # React components
├── models/               # MongoDB models
└── actions/              # Server actions
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## Tech Stack

- Next.js 13 (App Router)
- MongoDB & Mongoose
- NextAuth.js
- Razorpay
- Tailwind CSS

## Deployment

1. Create a Vercel account
2. Connect your GitHub repository
3. Add environment variables in Vercel dashboard
4. Deploy!

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details

## Support

If you found this project helpful, consider supporting me:
[Your Buy Me a Coffee Profile Link]
