import { Heart } from "lucide-react";
import { Link } from "react-router-dom";
import { useStore } from "../context/StoreContext";

export default function ProductCard({ product }) {
  const { addToCart, wishlist, toggleWishlist, safePrice, cart, updateQty } = useStore();
  const inWish = wishlist.includes(product.id);
  const item = cart.find(x => x.id === product.id);
  const price = safePrice(product);

  return (
    <article className="product-card">
      <div className="product-image-wrap">
        <button className={`heart ${inWish ? "active" : ""}`} onClick={() => toggleWishlist(product.id)}>
          <Heart size={19} fill={inWish ? "currentColor" : "none"} />
        </button>
        <Link to={`/product/${product.id}`}>
          <img src={product.image} alt={product.name} loading="lazy" onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = "/src/assets/products/placeholder.svg"; }} />
        </Link>
      </div>
      <div className="product-body">
        <Link to={`/product/${product.id}`} className="product-name">{product.name}</Link>
        <p className="muted">{product.category} · {product.region}</p>
        <div className="price-row">
          <strong>₹{price}</strong>
          <span>{product.weight}</span>
        </div>
        {item ? (
          <div className="qty-control">
            <button onClick={() => updateQty(product.id, item.qty - 1)}>−</button>
            <b>{item.qty}</b>
            <button onClick={() => updateQty(product.id, item.qty + 1)}>+</button>
          </div>
        ) : (
          <button className="primary full" onClick={() => addToCart(product)}>Add to Cart</button>
        )}
      </div>
    </article>
  );
}
