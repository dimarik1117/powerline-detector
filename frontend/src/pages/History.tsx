import { Link } from "react-router-dom";

export default function History() {
  return (
    <div>
      <h1>History Page</h1>
      <nav>
        <Link to="/dashboard">Dashboard</Link> | 
        <Link to="/profile">Profile</Link> | 
        <Link to="/">Login</Link> |
        <Link to="/analysis/:id">Analysis Detail</Link>
      </nav>
    </div>
  );
}