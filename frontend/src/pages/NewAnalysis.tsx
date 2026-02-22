import { Link } from "react-router-dom";

export default function NewAnalysis() {
  return (
    <div>
      <h1>New Analysis Page</h1>
      <nav>
        <Link to="/dashboard">Dashboard</Link> | 
        <Link to="/profile">Profile</Link> | 
        <Link to="/">Login</Link> |
        <Link to="/analysis/:id">Analysis Detail</Link>
      </nav>
    </div>
  );
}