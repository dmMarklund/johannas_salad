import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Select from "react-select";
import {
  LineChart,
  Legend,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";
import useGraphData from "./useGraphData";

//Line chart with orsak/week

function WastePerWeek() {
  const {
    yearMultiArray,
    selectedItemNames,
    selectedYear,
    selectedWeekNumbers,
    availableItemNames,
    availableWeekNumbers,
    graphData,
    graphDataChartType,
    sortColumn,
    sortDirection,
    handleYearChange,
    handleItemChange,
    handleWeekChange,
    handleSort,
    renderLineElements,
    generateGraph,
    CustomXAxisTick,
  } = useGraphData("orsak"); //!IMPORTANT

  return (
    <div className="graph_container">
      <h1>Waste reason Graph</h1>
      <div>
        <Link to="/dashboard/graphs">
          <button className="graph_back">Back</button>
        </Link>
        <div>
          <h2>Select Year</h2>
          <Select
            options={yearMultiArray}
            value={selectedYear}
            onChange={handleYearChange}
            getOptionLabel={(option) => option.label}
            getOptionValue={(option) => option.value}
          />
          <h2>Select Reason</h2>
          <Select
            isMulti
            options={availableItemNames}
            value={selectedItemNames}
            onChange={handleItemChange}
            getOptionLabel={(option) => option.label}
            getOptionValue={(option) => option.value}
          />

          <h2>Select Week</h2>
          <Select
            isMulti
            options={availableWeekNumbers}
            value={selectedWeekNumbers}
            onChange={handleWeekChange}
            getOptionLabel={(option) => option.label}
            getOptionValue={(option) => option.value}
          />
          <button className="graph_generate" onClick={generateGraph}>
            Generate Graph
          </button>
        </div>
      </div>
      <div>
        {graphData.length === 0 ? (
          <div className="no-data-message" style={{ textAlign: "center" }}>
            No data or no data matches the selected criteria.
          </div>
        ) : (
          <div className="graph_container_graphic">
            <LineChart
              width={900}
              height={400}
              data={graphDataChartType}
              margin={{ top: 0, right: 10, left: 10, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="weekNumber" tick={CustomXAxisTick} />
              <YAxis />
              <Tooltip />
              <Legend />
              {renderLineElements()}
            </LineChart>
          </div>
        )}

        <h2>Data Table</h2>
        <table className="graph_container_table">
          <thead>
            <tr>
              <th onClick={() => handleSort("orsak")}>
                Reason
                {sortColumn === "orsak" && (
                  <span>{sortDirection === "asc" ? " ▲" : " ▼"}</span>
                )}
              </th>
              <th onClick={() => handleSort("rensade")}>
                Disposed count
                {sortColumn === "rensade" && (
                  <span>{sortDirection === "asc" ? " ▲" : " ▼"}</span>
                )}
              </th>
              <th onClick={() => handleSort("weekNumber")}>
                Week Number
                {sortColumn === "weekNumber" && (
                  <span>{sortDirection === "asc" ? " ▲" : " ▼"}</span>
                )}
              </th>
            </tr>
          </thead>
          <tbody>
            {graphData.map((data, index) => (
              <tr key={index}>
                <td>{data.itemName}</td>
                <td>{data.rensade}</td>
                <td>{data.weekNumber}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default WastePerWeek;
