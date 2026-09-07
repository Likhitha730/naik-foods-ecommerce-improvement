import { Heart, MapPin, Minus, Plus } from "lucide-react";
import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useStore } from "../context/StoreContext";

export default function ProductDetails() {
  const { id } = useParams();
  const { products, addToCart, cart, wishlist, toggleWishlist, safePrice } = useStore();
  const product = products.find(p => p.id === id);
  const [qty, setQty] = useState(1);
  const [pincode, setPincode] = useState("");
  const [delivery, setDelivery] = useState(null);

  if (!product) return <div className="empty"><h2>Product not found</h2><Link className="primary" to="/">Back to Shop</Link></div>;

  const checkPincode = () => {
    if (!/^\d{6}$/.test(pincode)) {
      setDelivery({ ok: false, message: "Enter a valid 6-digit pincode." });
      return;
    }
    // IMPORTANT: This check only tells availability.
    // It deliberately does not show a delivery date before an order exists.
    const ok = pincode.startsWith("5") || pincode.startsWith("4");
    setDelivery(ok
      ? { ok: true, message: "Delivery is available in your area." }
      : { ok: false, message: "Delivery is not available in your area." }
    );
  };

  const add = () => {
    for (let i = 0; i < qty; i++) addToCart(product);
  };

  return (
    <div className="details">
      <div className="details-image"><img src={product.image} alt={product.name}/></div>
      <div className="details-info">
        <span className="eyebrow">{product.category}</span>
        <h1>{product.name}</h1>
        <p className="muted">{product.description}</p>
        <div className="big-price">₹{safePrice(product)} <span>{product.weight}</span></div>

        <div className="qty-control large">
          <button onClick={() => setQty(Math.max(1, qty - 1))}><Minus size={17}/></button>
          <b>{qty}</b>
          <button onClick={() => setQty(qty + 1)}><Plus size={17}/></button>
        </div>

        <div className="details-actions">
          <button className="primary" onClick={add}>Add to Cart</button>
          <button className={`wish-button ${wishlist.includes(product.id) ? "active" : ""}`} onClick={() => toggleWishlist(product.id)}>
            <Heart fill={wishlist.includes(product.id) ? "currentColor" : "none"}/>
          </button>
        </div>

        <div className="delivery-check">
          <h3><MapPin size={19}/> Check Delivery</h3>
          <div className="pin-row">
            <input maxLength="6" value={pincode} onChange={e => { setPincode(e.target.value.replace(/\D/g, "")); setDelivery(null); }} placeholder="Enter 6-digit pincode"/>
            <button onClick={checkPincode}>Check</button>
          </div>
          {delivery && <div className={delivery.ok ? "success-msg" : "error-msg"}>{delivery.message}</div>}
          <small>Delivery date will be shown only after a successful order.</small>
        </div>

        <div className="tabs"><b>Description</b><span>Additional Information</span></div>
      </div>
    </div>
  );
}
