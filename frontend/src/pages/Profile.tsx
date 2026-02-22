import { Link } from "react-router-dom";

export default function Profile() {
  return (
    <div>
      <h1>Profile Page</h1>
      <nav>
        <Link to="/dashboard">Dashboard</Link> | 
        <Link to="/profile">Profile</Link> | 
        <Link to="/">Login</Link>
      </nav>
    </div>
  );
}