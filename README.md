
# Sports Facility Court Booking Platform

Full-stack project implementing multi-resource court booking with dynamic pricing.

## Tech Stack

- **Backend:** Node.js, Express, MySQL, Sequelize
- **Frontend:** React, Vite, Tailwind CSS

## Features

- 4 badminton courts (2 indoor, 2 outdoor)
- Equipment (rackets, shoes) with limited stock
- 3 coaches with availability
- Multi-resource booking (court + equipment + coach)
- Dynamic pricing engine (peak hours, weekend, indoor premium, custom rules)
- Admin configuration for courts, equipment, coaches, pricing rules
- Waitlist support for full slots
- Booking history and cancellation with waitlist promotion
- Simple, clean UI

## Backend Setup

1. Create MySQL database:

```sql
CREATE DATABASE sports_booking;
```

2. Copy `.env.example` to `.env` inside `backend` and set your MySQL credentials.

3. Install dependencies and seed:

```bash
cd backend
npm install
npm run seed
npm run dev
```

Backend runs on `http://localhost:5000`.

## Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

Frontend runs on `http://localhost:5173`.

## Usage

- **Book Court:** Choose date, time, court, optional coach & equipment; view live price; confirm booking.
- **Waitlist:** If slot is full and waitlist is allowed, you will be added with a waitlist position.
- **My Bookings:** View all your bookings (user id 1 demo), cancel confirmed bookings.
- **Admin:** Manage courts, coaches, equipment, and pricing rules via simple forms.
