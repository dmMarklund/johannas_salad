import React from "react";
import { Link } from "react-router-dom";
import Select from "react-select";
import {
  BarChart,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";
import useGraphData from "./useGraphData";

//Bar chart with salad name/week

function SortsAndWeeks() {
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
    renderBarElements,
    generateGraph,
    CustomXAxisTick,
  } = useGraphData("saladName"); //!IMPORTANT

  return (
    <div className="graph_container">
      <h1>Salad Graph</h1>
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
          <h2>Select Salad</h2>
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
            <BarChart
              width={900}
              height={400}
              data={graphDataChartType}
              margin={{
                top: 0,
                right: 10,
                left: 10,
                bottom: 0,
              }}
            >
              <CartesianGrid strokeDasharray="5 5" />
              <XAxis dataKey="weekNumber" tick={CustomXAxisTick} />
              <YAxis />
              <Tooltip />
              <Legend />
              {renderBarElements()}
            </BarChart>
          </div>
        )}

        <h2>Data Table</h2>
        <table className="graph_container_table">
          <thead>
            <tr>
              <th onClick={() => handleSort("saladName")}>
                Salad Name
                {sortColumn === "saladName" && (
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

export default SortsAndWeeks;
