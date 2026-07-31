import { Route, Routes } from "react-router-dom";
import { Toaster } from "sonner";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Layout from "./components/Layout";
import Dashboard from "./pages/Dashboard";
import Accounts from "./pages/Accounts";
import Scheduler from "./pages/Scheduler";
import AIComposer from "./pages/AIComposer";
import Ideas from "./pages/Ideas";
import ChangePassword from "./pages/ChangePassword";

export default function App() {
  return (
    <>
      <Toaster position="top-right" richColors />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route element={<Layout/>}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/accounts" element={<Accounts />} />
          <Route path="/schedule" element={<Scheduler />} />
          <Route path="/ai-composer" element={<AIComposer />} />
          <Route path="/ideas" element={<Ideas />} />
          <Route path="/change-password" element={<ChangePassword />} />
        </Route>
      </Routes>
    </>
  );
}
