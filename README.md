# Naik Foods Prototype – Corrected MERN E-commerce Flow

This prototype follows the reference video's shopping flow and fixes the requested issues:

1. Product prices never render as ₹0 in the demo dataset.
2. Price: High to Low and Low to High use numeric sorting.
3. Name: A-Z and Z-A use reliable case-insensitive sorting.
4. Sign In is required when the user tries to proceed to checkout/order.
5. Products area is fully scrollable and responsive.
6. Search, sort, category filtering, wishlist, cart quantity controls and product details work.
7. Pincode checking only validates delivery availability. It does NOT show an order delivery date.
8. A delivery date/tracking timeline is shown only after a successful order.
9. Order tracking is available from the Orders page after placing an order.
10. Refreshing the browser keeps demo auth/cart/orders using localStorage.

## Requirements

- Node.js 18+
- npm 9+
- Optional: MongoDB if you want to extend the prototype to a database.
  The supplied prototype is intentionally self-contained and uses localStorage so it runs immediately.

## Run

Open a terminal:

```bash
cd client
npm install
npm run dev
```

Open another terminal:

```bash
cd server
npm install
npm run dev
```

The client normally runs at http://localhost:5173 and the API at http://localhost:5000.

The client works even if the API is unavailable because the prototype has a local demo product fallback.

## Demo login

Use any valid email and password of at least 6 characters. The prototype creates a demo session locally.

Example:
Email: demo@example.com
Password: 123456

## Main correction logic

### Price sorting
Never sort formatted strings such as `"₹100"`.

Use:
```js
Number(a.price) - Number(b.price)
```
or:
```js
Number(b.price) - Number(a.price)
```

### Name sorting
Use:
```js
a.name.localeCompare(b.name, undefined, { sensitivity: "base" })
```

### Pincode
`checkPincode()` only sets:
- available
- unavailable

It does not create a delivery date.

### Order
Only `placeOrder()` creates:
- order ID
- order date
- expected delivery date
- tracking status history

This keeps delivery estimation tied to a real successful order.


### Navigation fix
About, Shop, Blogs and Contact now use working scroll navigation. The same links also work when clicked from another route by returning to Home and scrolling to the requested section.


### Latest fixes
- Home navigation now always returns to the top of the home page.
- Red Joy Maggi Coin Khakhra uses a local image extracted from the supplied reference video.
- Product cards use a local fallback image if an external image URL fails.
