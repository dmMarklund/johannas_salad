import React from "react";
import { Link } from "react-router-dom";

function ErrorPage() {
  return (
    <div className="error">
      <h1>404</h1>
      <p>Page not found.</p>
      <Link to="/login">Home</Link>
    </div>
  );
}

export default ErrorPage;
