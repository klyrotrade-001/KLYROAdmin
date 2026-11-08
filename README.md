# KLYRO Ecommerce Admin Panel

Next.js Admin Dashboard for order fulfillment, product catalog management, tracking lifecycle updates, and customer communications.

## Features

* **Store Overview Dashboard**: Total Revenue, Order Counts, Pending WhatsApp Confirmations, Average Basket Size.
* **Order Management**: Search by Order ID, Customer Name, Mobile Number, or City.
* **Instant Lifecycle Updates**: Update statuses (`placed` → `confirmed` → `processing` → `shipped` → `delivered`) with activity notes (e.g. Courier AWB tracking number) which sync immediately to the customer's `/track` page.
* **Direct WhatsApp Contact**: 1-Click WhatsApp messaging with pre-filled order status updates sent directly to the customer's phone number.
* **Product Catalog**: Live inventory view of all 17 items with In-Stock / Out-of-Stock toggles, category filtering, pricing, and ratings.
* **Customer Support & Subscribers**: Overview of collected leads and inquiries.

## Accessing the Admin Panel

The Admin Panel is immediately accessible in the Next.js app at:
```
http://localhost:3000/admin
```

To run as an independent Next.js app on port `3001`:
```bash
cd admin
npm run dev
```

