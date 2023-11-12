import React, { useEffect } from "react";
import { Link } from "react-router-dom";

//way to our services

function Dashboard() {
  useEffect(() => {
    checkToken();
  }, []);

  const checkToken = () => {
    const token = localStorage.getItem("token");

    if (token) {
      console.log("Token found");
    } else {
      console.log("Token not found");
      // redirect
    }
  };

  return (
    <div className="dashboard">
      <h1 className="dashboard_h1">Dashboard</h1>
      <div className="dashboard_buttons">
        <Link to="/dashboard/data">
          <button className="data_button">Data</button>
        </Link>
        <Link to="/dashboard/convert">
          <button className="graphs_button">Convert Data</button>
        </Link>
        <Link to="/dashboard/graphs">
          <button className="graphs_button">Graphs</button>
        </Link>
      </div>
    </div>
  );
}

export default Dashboard;
