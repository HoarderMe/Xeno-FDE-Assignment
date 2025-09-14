# Xeno FDE Internship Assignment – 2025 
 
It shows the structure for a multi-tenant Shopify Data Ingestion & Insights Service

---

## Features
- REST APIs for Customers, Orders, Products (using MySQL + Express)
- Multi-tenant support via `tenant_id`
- Simple React dashboard with:
  - Total customers, orders, revenue
  - Orders by date
  - Top 5 customers (dummy chart)

---

## Tech Stack
- Backend: Node.js + Express.js
- Database: MySQL (Sequelize ORM)
- Frontend: React.js + Chart.js

---

## Setup
Backend:
```bash
cd backend
npm install
npm run dev
```

Frontend:
```bash
cd frontend
npm install
npm start
```
