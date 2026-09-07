import { useState } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { useStore } from "../context/StoreContext";

export default function Login() {
  const { login, register } = useStore();
  const navigate = useNavigate();
  const location = useLocation();
  const next = new URLSearchParams(location.search).get("next") || "/profile";
  const [mode, setMode] = useState("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const submit = async e => {
    e.preventDefault();
    setError("");
    if (!email || !email.includes("@")) return setError("Enter a valid email.");
    if (password.length < 6) return setError("Password must contain at least 6 characters.");
    if (mode === "register" && !name.trim()) return setError("Enter your name.");

    try {
      if (mode === "login") await login(email, password);
      else await register(name, email, password);
      navigate(next, { replace: true });
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="auth-page">
      <form className="auth-card" onSubmit={submit}>
        <span className="eyebrow">{mode === "login" ? "WELCOME BACK" : "JOIN NAik FOODS"}</span>
        <h1>{mode === "login" ? "Sign In" : "Create Account"}</h1>
        {mode === "register" && <input value={name} onChange={e => setName(e.target.value)} placeholder="Full name"/>}
        <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="Email address"/>
        <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Password (6+ characters)"/>
        {error && <div className="error-msg">{error}</div>}
        <button className="primary full">{mode === "login" ? "Sign In & Continue" : "Create & Continue"}</button>
        <button type="button" className="link-button" onClick={() => setMode(mode === "login" ? "register" : "login")}>
          {mode === "login" ? "New customer? Create an account" : "Already have an account? Sign in"}
        </button>
        <Link to="/" className="back-link">Continue browsing</Link>
      </form>
    </div>
  );
}
