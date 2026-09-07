# Implementation checklist against the reference video

## 1. ₹0 prices
- The demo catalog contains positive numeric prices.
- The UI uses `safePrice()`.
- Zero/invalid values are prevented from being rendered as ₹0.
- Sorting uses numbers, never the displayed rupee string.

## 2. Sign in at the correct point
- Cart button says `Sign In to Continue` when not authenticated.
- Checkout route is protected.
- Login redirects to checkout after successful sign-in.
- User cannot place an order without authentication.

## 3. Scrolling and working controls
- Entire page uses normal browser scrolling.
- Product grid is responsive.
- Product cards support details, wishlist and cart quantity.
- Search/filter/sort controls update immediately.
- Cart quantity and remove actions update totals immediately.
- Product detail quantity and Add to Cart work.

## 4. A-Z / Z-A
- `localeCompare(..., { sensitivity: "base" })` is used.
- This avoids broken lexical comparisons caused by case differences.

## 5. Pincode / delivery date
- Product detail pincode check only says whether delivery is available.
- No delivery date is generated from typing/checking a pincode.
- Only `placeOrder()` creates an expected delivery date.
- Orders page displays the date and a tracking timeline after successful order placement.

## Important
The supplied video is a visual reference, not the original source repository. Therefore this is a clean-room prototype implementing the requested behavior rather than a claim that it is the original website's code.
