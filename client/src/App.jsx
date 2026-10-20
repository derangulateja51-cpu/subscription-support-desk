import { Navigate, Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import Subscriptions from "./pages/Subscriptions.jsx";
import Tickets from "./pages/Tickets.jsx";
import TicketDetails from "./pages/TicketDetails.jsx";
import LiveChat from "./pages/LiveChat.jsx";
import AdminDashboard from "./pages/AdminDashboard.jsx";

export default function App() {
 return <><Navbar/><Routes>
  <Route path="/login" element={<Login/>}/><Route path="/register" element={<Register/>}/>
  <Route path="/" element={<ProtectedRoute><Dashboard/></ProtectedRoute>}/>
  <Route path="/subscriptions" element={<ProtectedRoute><Subscriptions/></ProtectedRoute>}/>
  <Route path="/tickets" element={<ProtectedRoute><Tickets/></ProtectedRoute>}/>
  <Route path="/tickets/new" element={<ProtectedRoute><Tickets/></ProtectedRoute>}/>
  <Route path="/tickets/:id" element={<ProtectedRoute><TicketDetails/></ProtectedRoute>}/>
  <Route path="/chat" element={<ProtectedRoute><LiveChat/></ProtectedRoute>}/>
  <Route path="/admin" element={<ProtectedRoute roles={["admin"]}><AdminDashboard/></ProtectedRoute>}/>
  <Route path="*" element={<Navigate to="/" replace/>}/>
 </Routes><footer>SupportDesk · Academic demonstration · No real payments</footer></>;
}
