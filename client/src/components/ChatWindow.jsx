import { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";
import api from "../services/api.js";

export default function ChatWindow({ ticketId, initialMessages = [] }) {
  const [messages, setMessages] = useState(initialMessages);
  const [body, setBody] = useState("");
  const [error, setError] = useState("");
  const bottom = useRef(null);
  const token = localStorage.getItem("token");

  useEffect(() => { setMessages(initialMessages); }, [initialMessages]);
  useEffect(() => {
    const socket = io(import.meta.env.VITE_SOCKET_URL || "http://localhost:5000", { auth: { token } });
    socket.on("connect", () => socket.emit("ticket:join", ticketId));
    socket.on("chat:message", message => setMessages(prev => prev.some(m => m._id === message._id) ? prev : [...prev, message]));
    socket.on("connect_error", () => setError("Live connection unavailable. You can still send messages."));
    return () => socket.disconnect();
  }, [ticketId, token]);

  useEffect(() => { bottom.current?.scrollIntoView({ behavior: "smooth" }); }, [messages]);

  async function send(e) {
    e.preventDefault(); if (!body.trim()) return;
    setError("");
    try {
      const { data } = await api.post(`/tickets/${ticketId}/messages`, { body });
      setMessages(prev => prev.some(m => m._id === data.message._id) ? prev : [...prev, data.message]);
      setBody("");
    } catch (err) { setError(err.response?.data?.message || "Could not send message"); }
  }
  return <section className="panel">
    <h2>Ticket conversation</h2>
    <div className="messages">{messages.map(m => <article className="message" key={m._id}><strong>{m.sender?.name || "User"}</strong><p>{m.body}</p><small>{new Date(m.createdAt).toLocaleString()}</small></article>)}<div ref={bottom}/></div>
    {error && <p className="error">{error}</p>}
    <form onSubmit={send} className="chat-form"><input value={body} onChange={e=>setBody(e.target.value)} placeholder="Write a message..." maxLength="4000"/><button>Send</button></form>
  </section>;
}
