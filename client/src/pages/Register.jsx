import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../services/api.js";
export default function Register() {
  const [form,setForm]=useState({name:"",email:"",password:""}); const [error,setError]=useState(""); const navigate=useNavigate();
  function change(e){setForm({...form,[e.target.name]:e.target.value});}
  async function submit(e){e.preventDefault();setError("");try{const {data}=await api.post("/auth/register",form);localStorage.setItem("token",data.token);localStorage.setItem("user",JSON.stringify(data.user));navigate("/");}catch(err){setError(err.response?.data?.message||"Registration failed");}}
  return <main className="auth panel"><h1>Create account</h1><form className="stack" onSubmit={submit}><label>Full name<input name="name" value={form.name} onChange={change} required maxLength="80"/></label><label>Email<input name="email" type="email" value={form.email} onChange={change} required/></label><label>Password (8+ characters)<input name="password" type="password" value={form.password} onChange={change} minLength="8" required/></label>{error&&<p className="error">{error}</p>}<button>Create account</button></form><p>Already registered? <Link to="/login">Log in</Link></p></main>;
}
