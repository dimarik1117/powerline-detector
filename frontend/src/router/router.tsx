import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "../pages/Login/Login";
import Register from "../pages/Register/Register";
import Dashboard from "../pages/Dashboard/Dashboard";
import NewAnalysis from "../pages/NewAnalysis/NewAnalysis";
import History from "../pages/History/History";
import AnalysisDetail from "../pages/AnalysisDetail/AnalysisDetail";
import Profile from "../pages/Profile/Profile";

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/new-analysis" element={<NewAnalysis />} />
        <Route path="/history" element={<History />} />
        <Route path="/analysis/:id" element={<AnalysisDetail />} />
        <Route path="/profile" element={<Profile />} />
      </Routes>
    </BrowserRouter>
  );
}
