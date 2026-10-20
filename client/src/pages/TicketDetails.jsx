import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../services/api.js";
import ChatWindow from "../components/ChatWindow.jsx";
export default function TicketDetails() {
 const {id}=useParams(); const [ticket,setTicket]=useState(null); const [messages,setMessages]=useState([]); const [error,setError]=useState("");
 const user=JSON.parse(localStorage.getItem("user")||"{}");
 async function load(){try{const {data}=await api.get(`/tickets/${id}`);setTicket(data.ticket);setMessages(data.messages);}catch(e){setError(e.response?.data?.message||"Could not load ticket");}}
 useEffect(()=>{load();},[id]);
 async function statusChange(e){try{await api.patch(`/tickets/${id}/status`,{status:e.target.value});await load();}catch(e){setError(e.response?.data?.message||"Could not update status");}}
 if(error&&!ticket)return <main><p className="error">{error}</p></main>;
 if(!ticket)return <main><p>Loading ticket…</p></main>;
 return <main><p className="eyebrow">{ticket.ticketNumber}</p><h1>{ticket.subject}</h1><div className="ticket-meta"><span className={`status ${ticket.status}`}>{ticket.status.replaceAll("_"," ")}</span><span className="status">{ticket.priority} priority</span><span className="muted">{ticket.category}</span></div><section className="panel"><h2>Issue description</h2><p className="preserve">{ticket.description}</p><p className="muted">Created by {ticket.customer?.name || "Customer"}</p>{["agent","admin"].includes(user.role)&&<label>Update status<select value={ticket.status} onChange={statusChange}><option value="open">Open</option><option value="in_progress">In progress</option><option value="waiting_customer">Waiting for customer</option><option value="resolved">Resolved</option><option value="closed">Closed</option></select></label>}</section>{error&&<p className="error">{error}</p>}<ChatWindow key={ticket._id} ticketId={ticket._id} initialMessages={messages}/></main>;
}
