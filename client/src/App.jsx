import { Navigate, Route, Routes } from "react-router-dom";
import { StoreProvider, useStore } from "./context/StoreContext";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import ProductDetails from "./pages/ProductDetails";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import Login from "./pages/Login";
import Orders from "./pages/Orders";
import Profile from "./pages/Profile";

function Protected({ children }) {
  const { user } = useStore();
  return user ? children : <Navigate to="/login?next=/checkout" replace />;
}

function AppShell() {
  return (
    <>
      <Navbar />
      <main className="page">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/product/:id" element={<ProductDetails />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/login" element={<Login />} />
          <Route path="/profile" element={<Protected><Profile /></Protected>} />
          <Route path="/orders" element={<Protected><Orders /></Protected>} />
          <Route path="/checkout" element={<Protected><Checkout /></Protected>} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      <footer>© 2026 Naik Foods Prototype · Secure shopping flow</footer>
    </>
  );
}

export default function App() {
  return <StoreProvider><AppShell /></StoreProvider>;
}
