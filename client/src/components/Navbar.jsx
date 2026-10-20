import { Link, useNavigate } from "react-router-dom";
export default function Navbar() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user") || "null");
  function logout() { localStorage.removeItem("token"); localStorage.removeItem("user"); navigate("/login"); }
  return <header className="nav"><Link className="brand" to="/">🎧 SupportDesk</Link><nav>
    {user && <><Link to="/">Dashboard</Link><Link to="/subscriptions">Subscriptions</Link><Link to="/tickets">Tickets</Link><Link to="/chat">Live chat</Link>{user.role === "admin" && <Link to="/admin">Admin</Link>}<span className="muted">{user.name}</span><button className="secondary small" onClick={logout}>Log out</button></>}
    {!user && <><Link to="/login">Login</Link><Link to="/register">Register</Link></>}
  </nav></header>;
}
