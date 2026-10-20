import { useEffect, useState } from "react";
import api from "../services/api.js";
export default function AdminDashboard() {
 const [data,setData]=useState(null); const [users,setUsers]=useState([]); const [error,setError]=useState("");
 useEffect(()=>{Promise.all([api.get("/admin/overview"),api.get("/admin/users")]).then(([a,u])=>{setData(a.data);setUsers(u.data.users);}).catch(e=>setError(e.response?.data?.message||"Could not load admin dashboard"));},[]);
 return <main><p className="eyebrow">ADMINISTRATION</p><h1>Admin dashboard</h1>{error&&<p className="error">{error}</p>}{data&&<><section className="stats"><div className="stat"><span>Customers</span><strong>{data.counts.users}</strong></div><div className="stat"><span>Agents</span><strong>{data.counts.agents}</strong></div><div className="stat"><span>Total tickets</span><strong>{data.counts.tickets}</strong></div><div className="stat"><span>Open tickets</span><strong>{data.counts.openTickets}</strong></div></section><section className="panel"><h2>Demo plans</h2>{data.plans.map(p=><div className="list-row" key={p._id}><strong>{p.name}</strong><span>₹{p.price} / {p.interval}</span></div>)}</section></>}<section className="panel"><h2>Users</h2>{users.map(u=><div className="list-row" key={u._id}><div><strong>{u.name}</strong><small>{u.email}</small></div><span className="status">{u.role}</span></div>)}</section></main>;
}
