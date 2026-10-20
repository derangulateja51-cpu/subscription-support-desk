# Subscription Product Support Desk (MERN)

Academic demo project: React + Vite, Express, MongoDB/Mongoose, JWT authentication, and Socket.IO live chat. No real payment processing.

## Requirements
- Node.js 20+
- MongoDB Community running locally, or a MongoDB Atlas connection string

## 1. Backend setup
```bash
cd server
cp .env.example .env
npm install
npm run seed
npm run dev
```
Edit `server/.env` before starting. The seed command creates demo plans and demo accounts:
- Admin: `admin@example.com` / `Admin123!`
- Agent: `agent@example.com` / `Agent123!`
- Customer: `customer@example.com` / `Customer123!`

These credentials are for local demos only. Change them before sharing or deploying.

Backend runs at `http://localhost:5000`.

## 2. Frontend setup
In another terminal:
```bash
cd client
npm install
npm run dev
```
Open the URL printed by Vite (usually `http://localhost:5173`).

## Included
- Register and login using JWT
- Role-aware navigation and dashboard
- List demo subscription records
- Create and list support tickets
- Ticket detail page with persisted messages
- Socket.IO live chat room per ticket
- Admin list of users, tickets, and plans
- Demo seeding script

## API overview
- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/auth/me`
- `GET /api/subscriptions/me`
- `GET /api/tickets`
- `POST /api/tickets`
- `GET /api/tickets/:id`
- `POST /api/tickets/:id/messages`
- `PATCH /api/tickets/:id/status` (agent/admin)
- `GET /api/admin/overview` (admin)

## Notes / next steps
This is starter code for an academic demo, not production-hardened software. Before production, add email verification/password reset, rate limiting, robust validation, CSRF strategy if using cookies, file upload scanning, audit logs, tests, pagination, notification delivery, and stronger operational monitoring. Socket messages are persisted through the REST message endpoint; the socket event is for real-time delivery. Only join ticket rooms after the server verifies ticket access.
