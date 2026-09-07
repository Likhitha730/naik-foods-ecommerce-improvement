import { Heart, ShoppingBag, UserRound } from "lucide-react";
import { Link, useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { useStore } from "../context/StoreContext";

export default function Navbar() {
  const { cart, wishlist, user } = useStore();
  const navigate = useNavigate();
  const location = useLocation();
  const [, setSearchParams] = useSearchParams();

  const handleHome = (e) => {
    e.preventDefault();
    if (location.pathname !== "/") {
      navigate("/");
    } else {
      setSearchParams({});
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleUser = () => navigate(user ? "/profile" : "/login");

  const goToSection = (id) => {
    if (location.pathname !== "/") {
      navigate(`/?section=${id}`);
      return;
    }
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <header className="navbar">
      <a href="/" className="brand" onClick={handleHome}>
        <span className="brand-mark">NF</span>
        <span>Naik <b>Foods</b></span>
      </a>

      <nav>
        <a href="/" onClick={handleHome}>Home</a>
        <button type="button" className="nav-link" onClick={() => goToSection("about")}>About</button>
        <button type="button" className="nav-link" onClick={() => goToSection("shop")}>Shop</button>
        <button type="button" className="nav-link" onClick={() => goToSection("blogs")}>Blogs</button>
        <button type="button" className="nav-link" onClick={() => goToSection("contact")}>Contact</button>
      </nav>

      <div className="nav-actions">
        <button aria-label="Account" onClick={handleUser}><UserRound size={21}/></button>
        <button aria-label="Wishlist" onClick={() => navigate("/?wishlist=1")} className="badge-wrap">
          <Heart size={21}/>
          {wishlist.length > 0 && <span className="badge">{wishlist.length}</span>}
        </button>
        <button aria-label="Cart" onClick={() => navigate("/cart")} className="badge-wrap">
          <ShoppingBag size={21}/>
          {cart.reduce((s, x) => s + x.qty, 0) > 0 && <span className="badge">{cart.reduce((s, x) => s + x.qty, 0)}</span>}
        </button>
      </div>
    </header>
  );
}
