import React from "react";
import { Link } from "react-router-dom";

// way to our graphics
function Graphs() {
  return (
    <div className="graph_container">
      <Link to="/dashboard">
        <button className="graph_back" style={{ marginTop: "4rem" }}>
          Back
        </button>
      </Link>
      <div>
        <Link to="/dashboard/graphs/bar">
          <button className="graph_chart_link graph_chart_link_bar">
            Bar chart
          </button>
        </Link>
        <Link to="/dashboard/graphs/line">
          <button className="graph_chart_link">Line chart</button>
        </Link>
      </div>
    </div>
  );
}

export default Graphs;
