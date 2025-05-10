# ÉireCraft: Irish Artisan Marketplace

ÉireCraft is a full-stack web application that connects buyers with independent Irish artisans, providing a vibrant platform for discovering, selling, and purchasing unique handmade products.

---

## Table of Contents

- [Project Overview](#project-overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Environment Variables](#environment-variables)
  - [Running the App](#running-the-app)
- [Usage](#usage)
- [Testing](#testing)
- [Contributing](#contributing)
- [License](#license)
- [Contact](#contact)

---

## Project Overview

ÉireCraft is an online marketplace designed to empower Irish artisans and connect them with a global audience. The platform supports both buyers and sellers, offering features such as product listings, shopping cart, wishlist, order management, feedback, and more.

---

## Features

- **Buyer & Seller Roles:** Separate dashboards and flows for buyers and sellers.
- **Product Marketplace:** Browse, search, and filter handmade products by category, tags, and price.
- **Wishlist & Cart:** Add products to wishlist or cart, move items between them, and manage quantities.
- **Checkout Flow:** Multi-step checkout with shipping, payment simulation, and order confirmation.
- **Order Management:** Buyers can track orders, mark as delivered, and leave feedback; sellers can manage products and shipments.
- **Feedback System:** Buyers can submit, edit, or delete feedback for purchased items; sellers can view feedback on their sales.
- **Authentication:** Role-based login with JWT (dummy login in development).
- **Responsive Design:** Mobile-friendly UI with accessible components.
- **API Integration:** RESTful backend with MongoDB, Express, and secure endpoints.
- **Image Uploads:** Sellers can upload product images.
- **Geolocation & Currency:** Detects user location for shipping autofill and currency conversion (via public APIs).
- **Robust Validation:** Client-side and server-side validation for forms and user input.
- **Testing:** Unit and integration tests for key components and flows.

---

## Tech Stack

- **Frontend:** React, React Router, SCSS, Formspree (contact form), Jest (testing)
- **Backend:** Node.js, Express, MongoDB, Mongoose, JWT, Multer (file uploads)
- **Other:** Axios, dotenv, helmet, cors, express-rate-limit, bcryptjs

---

## Project Structure

```
/api         # HTTP request functions grouped by feature (products, orders, wishlist, etc.)
/assets      # Static assets, images, SCSS, design tokens
/components  # Reusable React components (layouts, forms, UI, shared)
/context     # React Context for authentication and global state
/pages       # Page-level components and logic
/services    # Utility logic (auth, notifications, etc.)
/tests       # Unit and integration tests
/backend     # Express backend (models, controllers, routes, middleware)
```

---

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v16+ recommended)
- [MongoDB](https://www.mongodb.com/) (local or Atlas)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/yourusername/eirecraft.git
   cd eirecraft
   ```

2. **Install dependencies:**
   ```bash
   npm install
   cd backend
   npm install
   ```

### Environment Variables

Create a `.env` file in the `backend/` directory with the following:

```
MONGO_URI=mongodb://localhost:27017/eirecraft
JWT_SECRET=our_jwt_secret
GEODB_API_KEY=our_geodb_rapidapi_key
FRONTEND_URL=http://localhost:3000
NODE_ENV=development
```

> _See `.env.example` for a template._

### Running the App

**Start the backend:**
```bash
cd backend
npm run dev
```

**Start the frontend:**
```bash
cd frontend
npm start
```

The app will be available at [http://localhost:3000](http://localhost:3000).

---

## Usage

- **Buyers:** Browse products, add to wishlist/cart, checkout, track orders, and leave feedback.
- **Sellers:** Manage products, view sales, mark orders as shipped, and view feedback.
- **Contact:** Use the contact form for inquiries (Formspree integration).

---

## Testing

- **Frontend:**  
  Run unit and integration tests with:
  ```bash
  cd frontend
  npm test
  ```
- **Backend:**  
  Add backend tests as needed (e.g., with Jest or Mocha).

---

## Contributing

Pull requests are welcome! For major changes, please open an issue first to discuss what you would like to change.

**How to contribute:**
- Fork the repository
- Create a new branch (`git checkout -b feature/new-feature`)
- Commit your changes (`git commit -am 'Add new feature'`)
- Push to the branch (`git push origin feature/new-feature`)
- Open a pull request

Please ensure code style and tests pass before submitting.

---

## License

[MIT](https://choosealicense.com/licenses/mit/)

---

_ÉireCraft – Connecting Hearts, Hands, and Heritage – From Ireland to the World._
