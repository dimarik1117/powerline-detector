import { Link } from "react-router-dom";

export default function AnalysisDetail() {
  return (
    <div>
      <h1>Analysis Detail Page</h1>
      <nav>
        <Link to="/dashboard">Dashboard</Link> | 
        <Link to="/profile">Profile</Link> | 
        <Link to="/">Login</Link>
      </nav>
    </div>
  );
}