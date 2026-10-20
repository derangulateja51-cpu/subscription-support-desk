import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api.js";
export default function Dashboard() {
 const [tickets,setTickets]=useState([]); const [subs,setSubs]=useState([]); const [error,setError]=useState("");
 useEffect(()=>{Promise.all([api.get("/tickets"),api.get("/subscriptions/me")]).then(([t,s])=>{setTickets(t.data.tickets);setSubs(s.data.subscriptions);}).catch(()=>setError("Could not load dashboard data. Is the backend running?"));},[]);
 const user=JSON.parse(localStorage.getItem("user")||"{}");
 return <main><div className="page-head"><div><p className="eyebrow">OVERVIEW</p><h1>Hello, {user.name || "there"}</h1><p className="muted">Manage your subscription and get support.</p></div><Link className="button-link" to="/tickets/new">+ New ticket</Link></div>{error&&<p className="error">{error}</p>}
 <div className="stats"><div className="stat"><span>Subscriptions</span><strong>{subs.length}</strong></div><div className="stat"><span>Open tickets</span><strong>{tickets.filter(t=>!["resolved","closed"].includes(t.status)).length}</strong></div><div className="stat"><span>Total tickets</span><strong>{tickets.length}</strong></div></div>
 <section className="panel"><div className="section-head"><h2>Recent tickets</h2><Link to="/tickets">View all</Link></div>{tickets.slice(0,5).map(t=><Link className="list-row" key={t._id} to={`/tickets/${t._id}`}><div><strong>{t.subject}</strong><small>{t.ticketNumber} · {t.category}</small></div><span className={`status ${t.status}`}>{t.status.replace("_"," ")}</span></Link>)}{tickets.length===0&&<p className="muted">No tickets yet. Create one when you need help.</p>}</section>
 <section className="panel"><div className="section-head"><h2>My subscriptions</h2><Link to="/subscriptions">View plans</Link></div>{subs.map(s=><div className="list-row" key={s._id}><div><strong>{s.plan?.name || "Subscription"}</strong><small>Renewal: {new Date(s.renewalDate).toLocaleDateString()}</small></div><span className="status active">{s.status}</span></div>)}{subs.length===0&&<p className="muted">No demo subscriptions assigned.</p>}</section></main>;
}
