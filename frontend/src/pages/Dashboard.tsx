import { Link } from "react-router-dom";

export default function Dashboard() {
  return (
    <div>
      <h1>Dashboard Page</h1>
      <nav>
        <Link to="/dashboard">Dashboard</Link> | 
        <Link to="/profile">Profile</Link> | 
        <Link to="/">Login</Link> |
        <Link to="/new-analysis">New Analysis</Link> |
        <Link to="/history">History</Link>
      </nav>
    </div>
  );
}