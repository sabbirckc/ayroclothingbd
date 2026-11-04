# ClothSpace — Peer-to-Peer Apparel Marketplace & Designer Clothing Sharing Platform

> **Live Application URL**: [https://clothspace-marketplace.vercel.app](https://clothspace-marketplace.vercel.app) *(Deployable to Vercel / Render)*  
> **Server Repository**: [https://github.com/sabbirckc/ayroclothingbd-server](https://github.com/sabbirckc/ayroclothingbd-server)  
> **Client Repository**: [https://github.com/sabbirckc/ayroclothingbd](https://github.com/sabbirckc/ayroclothingbd)

---

## 🌟 Key Features of ClothSpace

- **Peer-to-Peer Designer Wardrobe Marketplace**: Direct discovery and ordering between independent fashion designers, boutique ateliers, and discerning clothing connoisseurs, championing sustainable wardrobe circulation and slow fashion.
- **Dynamic Sizing & Real-Time Stock Inspection**: Detailed fabric compositions, authentic origins, and dynamic size availability (S, M, L, XL, XXL) with zero Lorem Ipsum text.
- **Challenge 1 — JWT Security with HTTPOnly Cookies**: Robust authentication and server mutation guards (`POST /api/clothes`, `DELETE /api/clothes/:id`, `POST /api/orders`) rejecting unauthorized requests with `401 Unauthorized` and utilizing secure HTTPOnly cookies.
- **Challenge 2 — Atomic Stock Double-Booking & Out-of-Stock Prevention**: Real-time atomic verification and stock decrements via MongoDB operators (`findOneAndUpdate({ _id, stock: { $gte: qty } }, { $inc: { stock: -qty } })`), rejecting orders exceeding current stock with a clean error message and automatically restoring stock on order cancellations.
- **Challenge 3 — System-Wide Theme Customization**: Interactive dark/light mode toggle with theme persistence in `localStorage` and system preference detection.
- **PDF Order Invoice Receipt Generator (Optional Requirement)**: One-click downloadable PDF invoice receipts for clothing purchases generated client-side using `jsPDF`.
- **Saved Apparel Wishlist (Optional Requirement)**: Persistent heart toggle allowing logged-in collectors to save favorite garments directly to MongoDB.
- **Zero-Alert Notifications & Custom Modals**: 100% modern Sonner toast notifications and custom modal dialogs for deletion confirmations and order checkouts.

---

## 🛠️ Technology Stack

| Layer | Technologies |
|---|---|
| **FrontEnd** | Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS v4, Lucide Icons |
| **UI Components** | Shadcn UI primitives, Embla / custom interactive Hero Slider, Sonner Toaster, jsPDF |
| **Authentication** | JWT, HTTPOnly Cookies, Session Preservation across reloads, Google Social Auth |
| **BackEnd** | Express.js, Node.js (ES Modules), Cookie-Parser, CORS |
| **Database** | MongoDB Atlas, native MongoDB Driver (`clothspaceDB`) |

---

## 🔑 Examiner Test Credentials

To streamline evaluation, ClothSpace includes both a **1-Click Auto Login** button on the Login page and manual credentials:

- **Examiner Email**: `examiner@clothspace.com`
- **Password**: `ClothSpace2026!`
- **Role**: `designer`
- **Atelier Name**: `Alex Rivera (Test Examiner)`

*(Alternative Creator Account: `designer@clothspace.com` / `ClothSpace2026!`)*

---

## 🚀 Local Setup Instructions

### 1. Server Setup (`ayroclothingbd-server`)
```bash
git clone https://github.com/sabbirckc/ayroclothingbd-server.git
cd ayroclothingbd-server

# Install server dependencies
npm install

# Verify .env has MONGODB_URI and JWT_SECRET
# Seed authentic designer clothing and examiner accounts
node seed.js

# Start Express API Server (runs on http://localhost:8000)
node index.js
```

### 2. Client Setup (`ayroclothingbd`)
```bash
git clone https://github.com/sabbirckc/ayroclothingbd.git
cd ayroclothingbd

# Install client dependencies
npm install

# Run the Next.js development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser. All API calls default to `http://localhost:8000`.

---

## 📋 Evaluation Checklist

- [x] Minimum 15 notable commits on client-side repository.
- [x] Minimum 8 notable commits on server-side repository.
- [x] Meaningful README with live site link, 5+ features, tech stack, local setup steps, and examiner test credentials.
- [x] No Lorem Ipsum text used anywhere.
- [x] No default browser `alert()` or `confirm()` used; all feedback uses Sonner toasts and custom dialogs.
- [x] Page reloading does not throw errors on any route; logged-in user is NOT redirected to login on reload of private routes.
- [x] Clean ClothSpace header with needle/hanger logo, sticky layout, active route indicators, user avatar dropdown, and theme toggle.
- [x] Footer with new X logo (no old Twitter bird), newsletter with toast, categories, and assurances.
- [x] Hero Slider with 3+ slides, dynamic Featured Clothes (.limit(6)), Category cards, and 2 extra home sections.
- [x] Password validation: Uppercase, Lowercase, Length >= 6.
- [x] Full CRUD operations for clothes (`/add-cloth`, `/clothes`, `/clothes/[id]`, `/my-listings`, `/clothes/edit/[id]`).
- [x] Complete Ordering System (`/my-orders`), status tracking, and cancellation with inventory restoration.
- [x] Challenge 1 (JWT in HTTPOnly cookies), Challenge 2 (Atomic stock double-booking prevention), Challenge 3 (Dark/Light theme toggle).
- [x] Optional: PDF Invoice Generator & Saved Clothes Wishlist.
