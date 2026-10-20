import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../services/api.js";
export default function Login() {
  const [email,setEmail]=useState("customer@example.com"); const [password,setPassword]=useState("Customer123!"); const [error,setError]=useState("");
  const navigate=useNavigate();
  async function submit(e){e.preventDefault();setError("");try{const {data}=await api.post("/auth/login",{email,password});localStorage.setItem("token",data.token);localStorage.setItem("user",JSON.stringify(data.user));navigate("/");}catch(err){setError(err.response?.data?.message||"Login failed");}}
  return <main className="auth panel"><h1>Welcome back</h1><p className="muted">Log in to your support desk.</p><form onSubmit={submit} className="stack"><label>Email<input type="email" value={email} onChange={e=>setEmail(e.target.value)} required/></label><label>Password<input type="password" value={password} onChange={e=>setPassword(e.target.value)} required/></label>{error&&<p className="error">{error}</p>}<button>Log in</button></form><p>New here? <Link to="/register">Create an account</Link></p><p className="hint">Demo: customer@example.com / Customer123!</p></main>;
}
