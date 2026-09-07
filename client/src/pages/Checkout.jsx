import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useStore } from "../context/StoreContext";

export default function Checkout() {
  const { cart, user, placeOrder } = useStore();
  const navigate = useNavigate();
  const [pincode, setPincode] = useState("");
  const [address, setAddress] = useState("");
  const [checked, setChecked] = useState(false);
  const [error, setError] = useState("");

  if (!cart.length) return <div className="empty page-empty"><h2>No items to order</h2><button className="primary" onClick={() => navigate("/")}>Shop Now</button></div>;

  const total = cart.reduce((s, x) => s + Number(x.price) * x.qty, 0);
  const grand = total >= 399 ? total : total + 40;

  const submit = async e => {
    e.preventDefault();
    setError("");
    if (!/^\d{6}$/.test(pincode)) return setError("Enter a valid 6-digit pincode.");
    if (!address.trim()) return setError("Enter your delivery address.");
    if (!checked) return setError("Please confirm the delivery details.");
    try {
      const order = await placeOrder({ pincode, address });
      navigate(`/orders?order=${order.orderId}`, { replace: true });
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="checkout">
      <form className="checkout-form" onSubmit={submit}>
        <span className="eyebrow">CHECKOUT</span>
        <h1>Delivery Details</h1>
        <p className="muted">Signed in as <b>{user.email}</b></p>
        <label>Delivery address</label>
        <textarea value={address} onChange={e => setAddress(e.target.value)} placeholder="House / street / city / state"/>
        <label>Pincode</label>
        <input value={pincode} maxLength="6" onChange={e => setPincode(e.target.value.replace(/\D/g, ""))} placeholder="6-digit pincode"/>
        <p className="checkout-note">Your delivery date is calculated only after the order is successfully placed.</p>
        <label className="check-line"><input type="checkbox" checked={checked} onChange={e => setChecked(e.target.checked)}/> I confirm the delivery details are correct.</label>
        {error && <div className="error-msg">{error}</div>}
        <button className="primary full">Place Order Securely</button>
      </form>

      <aside className="summary">
        <h2>Your Items</h2>
        {cart.map(x => <div className="mini-item" key={x.id}><span>{x.name} × {x.qty}</span><b>₹{Number(x.price)*x.qty}</b></div>)}
        <hr/>
        <div className="total"><span>Total</span><b>₹{grand}</b></div>
      </aside>
    </div>
  );
}
