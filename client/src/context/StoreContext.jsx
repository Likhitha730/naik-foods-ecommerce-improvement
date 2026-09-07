import { createContext, useContext, useEffect, useMemo, useState } from "react";
import axios from "axios";
import { products as fallbackProducts } from "../data/products";

const StoreContext = createContext(null);
const API = "http://localhost:5000/api";

const read = (key, fallback) => {
  try { return JSON.parse(localStorage.getItem(key)) ?? fallback; }
  catch { return fallback; }
};

export function StoreProvider({ children }) {
  const [products, setProducts] = useState(fallbackProducts);
  const [cart, setCart] = useState(() => read("nf_cart", []));
  const [wishlist, setWishlist] = useState(() => read("nf_wishlist", []));
  const [user, setUser] = useState(() => read("nf_user", null));
  const [orders, setOrders] = useState(() => read("nf_orders", []));

  useEffect(() => {
    axios.get(`${API}/products`).then(r => {
      if (Array.isArray(r.data) && r.data.length) setProducts(r.data);
    }).catch(() => {});
  }, []);

  useEffect(() => localStorage.setItem("nf_cart", JSON.stringify(cart)), [cart]);
  useEffect(() => localStorage.setItem("nf_wishlist", JSON.stringify(wishlist)), [wishlist]);
  useEffect(() => localStorage.setItem("nf_user", JSON.stringify(user)), [user]);
  useEffect(() => localStorage.setItem("nf_orders", JSON.stringify(orders)), [orders]);

  const safePrice = (p) => {
    const n = Number(p?.price);
    return Number.isFinite(n) && n > 0 ? n : 1;
  };

  const addToCart = (product) => {
    setCart(prev => {
      const found = prev.find(x => x.id === product.id);
      if (found) return prev.map(x => x.id === product.id ? { ...x, qty: x.qty + 1 } : x);
      return [...prev, { ...product, price: safePrice(product), qty: 1 }];
    });
  };

  const updateQty = (id, qty) => {
    setCart(prev => prev
      .map(x => x.id === id ? { ...x, qty: Math.max(0, qty) } : x)
      .filter(x => x.qty > 0)
    );
  };

  const removeFromCart = (id) => setCart(prev => prev.filter(x => x.id !== id));

  const toggleWishlist = (id) => {
    setWishlist(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  };

  const logout = () => setUser(null);

  const login = async (email, password) => {
    try {
      const { data } = await axios.post(`${API}/auth/login`, { email, password });
      setUser(data.user);
      return data.user;
    } catch {
      const demo = { id: "demo-user", name: email.split("@")[0], email };
      setUser(demo);
      return demo;
    }
  };

  const register = async (name, email, password) => {
    try {
      const { data } = await axios.post(`${API}/auth/register`, { name, email, password });
      setUser(data.user);
      return data.user;
    } catch {
      const demo = { id: "demo-user", name, email };
      setUser(demo);
      return demo;
    }
  };

  const placeOrder = async ({ pincode, address }) => {
    if (!user) throw new Error("Please sign in before ordering.");
    if (!cart.length) throw new Error("Your cart is empty.");
    if (!/^\d{6}$/.test(pincode)) throw new Error("Enter a valid 6-digit pincode.");

    const payload = { user, items: cart, pincode, address };
    let order;
    try {
      const { data } = await axios.post(`${API}/orders`, payload);
      order = data;
    } catch {
      const delivery = new Date();
      delivery.setDate(delivery.getDate() + 4);
      order = {
        orderId: "NF" + Date.now().toString().slice(-8),
        status: "Confirmed",
        orderedAt: new Date().toISOString(),
        expectedDelivery: delivery.toISOString(),
        pincode,
        address,
        items: cart
      };
    }

    const completedOrder = {
      ...order,
      tracking: [
        { label: "Order placed", done: true, time: new Date(order.orderedAt).toLocaleString() },
        { label: "Order confirmed", done: true, time: "Confirmed" },
        { label: "Packed", done: false, time: "Pending" },
        { label: "Shipped", done: false, time: "Pending" },
        { label: "Out for delivery", done: false, time: "Pending" },
        { label: "Delivered", done: false, time: new Date(order.expectedDelivery).toLocaleDateString() }
      ]
    };
    setOrders(prev => [completedOrder, ...prev]);
    setCart([]);
    return completedOrder;
  };

  const value = useMemo(() => ({
    products, cart, wishlist, user, orders,
    addToCart, updateQty, removeFromCart, toggleWishlist,
    login, register, logout, placeOrder, safePrice
  }), [products, cart, wishlist, user, orders]);

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export const useStore = () => useContext(StoreContext);
