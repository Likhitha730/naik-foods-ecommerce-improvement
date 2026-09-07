import { CheckCircle2, Clock3, Package, Truck } from "lucide-react";
import { useSearchParams } from "react-router-dom";
import { useStore } from "../context/StoreContext";

export default function Orders() {
  const { orders } = useStore();
  const [params] = useSearchParams();
  const selected = params.get("order");
  const shown = selected ? orders.filter(o => o.orderId === selected) : orders;

  if (!orders.length) return <div className="empty page-empty"><h2>No orders yet</h2><p>Place an order and its tracking details will appear here.</p></div>;

  return (
    <div className="orders-page">
      <span className="eyebrow">ORDER TRACKING</span>
      <h1>{selected ? "Order Confirmed" : "My Orders"}</h1>
      {shown.map(order => (
        <article className="order-card" key={order.orderId}>
          <div className="order-head">
            <div><b>Order #{order.orderId}</b><span>Placed {new Date(order.orderedAt).toLocaleString()}</span></div>
            <div className="confirmed"><CheckCircle2 size={18}/> {order.status}</div>
          </div>
          <div className="delivery-banner">
            <Package/>
            <div><b>Expected delivery</b><strong>{new Date(order.expectedDelivery).toLocaleDateString(undefined, { day:"numeric", month:"long", year:"numeric" })}</strong></div>
          </div>
          <div className="timeline">
            {order.tracking.map((t, i) => (
              <div className={`timeline-item ${t.done ? "done" : ""}`} key={t.label}>
                <div className="dot">{t.done ? <CheckCircle2 size={18}/> : <Clock3 size={17}/>}</div>
                <div><b>{t.label}</b><span>{t.time}</span></div>
              </div>
            ))}
          </div>
          <h3>Items</h3>
          {order.items.map(item => <div className="mini-item" key={item.id}><span>{item.name} × {item.qty}</span><b>₹{Number(item.price)*item.qty}</b></div>)}
          <p className="muted"><Truck size={16}/> Delivery pincode: {order.pincode}</p>
        </article>
      ))}
    </div>
  );
}
