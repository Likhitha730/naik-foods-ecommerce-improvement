import { LogOut, Package, UserRound } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useStore } from "../context/StoreContext";

export default function Profile() {
  const { user, logout } = useStore();
  const navigate = useNavigate();

  return (
    <div className="profile">
      <div className="profile-card">
        <UserRound size={44}/>
        <h1>{user.name}</h1>
        <p>{user.email}</p>
        <div className="profile-actions">
          <Link className="secondary" to="/orders"><Package size={18}/> My Orders</Link>
          <button className="danger" onClick={() => { logout(); navigate("/"); }}><LogOut size={18}/> Sign Out</button>
        </div>
      </div>
    </div>
  );
}
