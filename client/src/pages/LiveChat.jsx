import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api.js";
export default function LiveChat() {
 const [tickets,setTickets]=useState([]);
 useEffect(()=>{api.get("/tickets").then(({data})=>setTickets(data.tickets)).catch(()=>{});},[]);
 return <main><p className="eyebrow">REAL-TIME SUPPORT</p><h1>Live chat</h1><p className="muted">Choose a ticket to open its real-time conversation. Messages are saved in the database.</p><section className="panel">{tickets.map(t=><Link className="list-row" key={t._id} to={`/tickets/${t._id}`}><div><strong>{t.subject}</strong><small>{t.ticketNumber}</small></div><span>Open chat →</span></Link>)}{tickets.length===0&&<p>Create a support ticket first to start a chat.</p>}</section></main>;
}
