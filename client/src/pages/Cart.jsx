import { Trash2 } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useStore } from "../context/StoreContext";

export default function Cart() {
  const { cart, updateQty, removeFromCart, user } = useStore();
  const navigate = useNavigate();
  const total = cart.reduce((s, x) => s + Number(x.price) * x.qty, 0);

  if (!cart.length) return (
    <div className="empty page-empty">
      <h2>Your cart is empty</h2>
      <p>Add some products to continue.</p>
      <Link to="/" className="primary">Browse Products</Link>
    </div>
  );

  const proceed = () => {
    // Required correction: sign-in happens before checkout/order, not after.
    navigate(user ? "/checkout" : "/login?next=/checkout");
  };

  return (
    <div className="cart-page">
      <div>
        <span className="eyebrow">YOUR BAG</span>
        <h1>Shopping Cart</h1>
        <div className="cart-list">
          {cart.map(item => (
            <div className="cart-item" key={item.id}>
              <img src={item.image} alt={item.name}/>
              <div className="cart-item-main">
                <h3>{item.name}</h3>
                <span className="muted">{item.weight}</span>
                <div className="qty-control">
                  <button onClick={() => updateQty(item.id, item.qty - 1)}>−</button>
                  <b>{item.qty}</b>
                  <button onClick={() => updateQty(item.id, item.qty + 1)}>+</button>
                </div>
              </div>
              <strong>₹{Number(item.price) * item.qty}</strong>
              <button className="icon-danger" onClick={() => removeFromCart(item.id)}><Trash2 size={18}/></button>
            </div>
          ))}
        </div>
      </div>

      <aside className="summary">
        <h2>Order Summary</h2>
        <div><span>Subtotal</span><b>₹{total}</b></div>
        <div><span>Delivery</span><b>{total >= 399 ? "FREE" : "₹40"}</b></div>
        <hr/>
        <div className="total"><span>Total</span><b>₹{total >= 399 ? total : total + 40}</b></div>
        <button className="primary full" onClick={proceed}>
          {user ? "Proceed to Checkout" : "Sign In to Continue"}
        </button>
        <small>You must be signed in before an order can be placed.</small>
      </aside>
    </div>
  );
}
