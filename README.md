# ISKCON Ujjain · Donation Platform

A full-featured donation campaign platform with Cashfree payment integration, built for ISKCON Ujjain (International Society for Krishna Consciousness).

## Features

### Public
- Multi-campaign homepage with progress bars and donor counts
- Campaign detail page with image slideshow
- Dynamic quick donation amounts based on campaign target
- Cashfree payment gateway with UPI, cards, netbanking, wallets
- UPI/QR fallback mode when Cashfree is unavailable
- Anonymous donation option
- Top donors display (aggregated, deduplicated)
- Recent donations ticker (active campaigns only)
- Total raised stats banner
- WhatsApp share with customizable message per campaign
- Copy link to clipboard
- Email donation receipt (Gmail SMTP)
- 80G tax receipt form link (configurable)
- Thank you page after successful payment
- "Find Nearby Centre" link to ISKCON directory
- Rotating Srila Prabhupada quotes in footer
- Contact, Privacy Policy, Terms & Conditions, Cancellation & Refund pages
- Mobile responsive design

### Admin Panel (`/admin`)
- Password-protected access
- Create, edit, hide, delete campaigns
- Multi-image upload (Cloudinary) with cover image
- Custom WhatsApp share message per campaign
- Download donors as CSV
- Payment mode toggle (Cashfree / UPI-QR)
- UPI settings (UPI ID, QR code image, WhatsApp number)
- 80G tax receipt form URL (configurable)
- Record offline/cash donations manually
- Analytics dashboard with daily trends, top campaigns, top donors
- Donor tier system (Platinum/Gold/Silver/Bronze)

### Security
- Helmet security headers
- CORS locked to frontend domain
- Rate limiting (3 orders/min, 15 verifications/15min)
- All admin endpoints password-protected
- Input sanitization (XSS, length, type)
- Atomic payment verification (no double-counting)
- Amount mismatch detection
- Generic error messages (no internal details exposed)

## Tech Stack

- React 18 + Vite 5 + Tailwind CSS 3
- Node.js 18+ + Express.js 4
- MongoDB Atlas + Mongoose 8
- Cashfree Payments API
- Cloudinary (image upload)
- Gmail SMTP (email receipts)

## Local Development

### Backend
```bash
cd backend
npm install
npm run dev
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```

Open http://localhost:5173 · Admin: http://localhost:5173/admin

## Environment Variables

### Backend
| Variable | Description |
|----------|-------------|
| `MONGODB_URI` | MongoDB Atlas connection string |
| `CASHFREE_APP_ID` | Cashfree App ID |
| `CASHFREE_SECRET_KEY` | Cashfree Secret Key |
| `CASHFREE_ENV` | `sandbox` or `production` |
| `ADMIN_PASSWORD` | Admin panel password |
| `FRONTEND_URL` | Frontend URL for CORS |
| `EMAIL_USER` | Gmail address (iyfcentral@iskconujjain.com) |
| `EMAIL_PASS` | Gmail App Password |
| `CLOUDINARY_CLOUD_NAME` | Cloudinary cloud name |
| `CLOUDINARY_API_KEY` | Cloudinary API key |
| `CLOUDINARY_API_SECRET` | Cloudinary API secret |

### Frontend
| Variable | Description |
|----------|-------------|
| `VITE_CASHFREE_ENV` | `sandbox` or `production` |
| `VITE_API_URL` | Backend API URL |

## Deployment

- Frontend → Vercel
- Backend → Render
- Database → MongoDB Atlas
