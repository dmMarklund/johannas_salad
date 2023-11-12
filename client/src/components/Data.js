import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

//Data table with POST, GET and DELETE
function Data() {
  const [salads, setSalads] = useState([]);
  const [formData, setFormData] = useState({
    year: 2023,
    weekNumber: 0,
    saladName: "Alaine",
    rensade: 0,
    orsak: "Mögel",
  }); // default values

  const [sortColumn, setSortColumn] = useState("weekNumber");
  const [sortDirection, setSortDirection] = useState("asc");

  const apiUrl = "http://159.89.110.54:4000/api/data/salads";

  useEffect(() => {
    fetchSalads();
  }, []);

  //Fetch/GET logic

  const fetchSalads = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      console.log("Authentication required");
      return;
    }

    try {
      const response = await fetch(apiUrl, {
        method: "GET",
        headers: {
          Accept: "application/json, text/plain, */*",
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setSalads(data);
        console.log("data:", data);
      } else {
        console.error("Failed to fetch salads");
      }
    } catch (error) {
      console.error("Error fetching salads:", error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  //POST

  const handleAddSalad = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      console.log("Authentication required");
      return;
    }

    try {
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          Accept: "application/json, text/plain, */*",
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        await fetchSalads();
        setFormData({
          year: 2023,
          weekNumber: 0,
          saladName: "Alaine",
          rensade: 0,
          orsak: "Mögel",
        });
      } else {
        console.error("Failed to add salad");
      }
    } catch (error) {
      console.error("Error adding salad:", error);
    }
  };

  //DELETE

  const handleDeleteSalad = async (id) => {
    const token = localStorage.getItem("token");

    if (!token) {
      console.log("Authentication required");
      return;
    }

    try {
      const response = await fetch(`${apiUrl}/${id}`, {
        method: "DELETE",
        headers: {
          Accept: "application/json, text/plain, */*",
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        await fetchSalads();
      } else {
        console.error("Failed to delete salad");
      }
    } catch (error) {
      console.error("Error deleting salad:", error);
    }
  };

  //Sorting logic

  const handleSort = (column) => {
    const newSortDirection =
      sortColumn === column && sortDirection === "asc" ? "desc" : "asc";
    setSortColumn(column);
    setSortDirection(newSortDirection);

    const sortedData = [...salads];

    // Sorting logic based on column and direction
    sortedData.sort((a, b) => {
      if (column === "year") {
        return newSortDirection === "asc" ? a.year - b.year : b.year - a.year;
      } else if (column === "weekNumber") {
        return newSortDirection === "asc"
          ? a.weekNumber - b.weekNumber
          : b.weekNumber - a.weekNumber;
      } else if (column === "saladName") {
        return newSortDirection === "asc"
          ? a.saladName.localeCompare(b.saladName)
          : b.saladName.localeCompare(a.saladName);
      } else if (column === "rensade") {
        return newSortDirection === "asc"
          ? a.rensade - b.rensade
          : b.rensade - a.rensade;
      } else if (column === "orsak") {
        return newSortDirection === "asc"
          ? a.orsak.localeCompare(b.orsak)
          : b.orsak.localeCompare(a.orsak);
      }
      return 0;
    });

    setSalads(sortedData);
  }; // will do with switch in other component

  return (
    <div className="data_container">
      <h1>Salad Management</h1>
      <div>
        <h2>Add a Salad</h2>
        <Link to="/dashboard">
          <button className="data_back">Back</button>
        </Link>
        <div>
          <input
            type="number"
            name="year"
            value={formData.year}
            placeholder="År"
            onChange={handleInputChange}
          />
          <input
            type="number"
            name="weekNumber"
            value={formData.weekNumber}
            placeholder="Vecka"
            onChange={handleInputChange}
          />
          <select
            name="saladName"
            value={formData.saladName}
            onChange={handleInputChange}
          >
            <option value="Alaine">Alaine</option>
            <option value="Koriander">Koriander</option>
            <option value="Kiribati">Kiribati</option>
            <option value="Nordice">Nordice</option>
            <option value="Pak Choi 'Arax'">Pak Choi 'Arax'</option>
          </select>
          <input
            type="number"
            name="rensade"
            value={formData.rensade}
            placeholder="Rensade"
            onChange={handleInputChange}
          />
          <select
            name="orsak"
            value={formData.orsak}
            onChange={handleInputChange}
          >
            <option value="Mögel">Mögel</option>
            <option value="Svinn">Svinn</option>
            <option value="Maskangrepp">Maskangrepp</option>
          </select>
          <button className="data_addbutton" onClick={handleAddSalad}>
            Add Salad
          </button>
        </div>
      </div>
      <div>
        <h2>Salad List</h2>
        <table>
          <thead>
            <tr>
              <th onClick={() => handleSort("year")}>
                Year
                {sortColumn === "Year" && (
                  <span>{sortDirection === "asc" ? " ▲" : " ▼"}</span>
                )}
              </th>
              <th onClick={() => handleSort("weekNumber")}>
                Week Number
                {sortColumn === "weekNumber" && (
                  <span>{sortDirection === "asc" ? " ▲" : " ▼"}</span>
                )}
              </th>
              <th onClick={() => handleSort("saladName")}>
                Salad Name
                {sortColumn === "saladName" && (
                  <span>{sortDirection === "asc" ? " ▲" : " ▼"}</span>
                )}
              </th>
              <th onClick={() => handleSort("rensade")}>
                Rensade
                {sortColumn === "rensade" && (
                  <span>{sortDirection === "asc" ? " ▲" : " ▼"}</span>
                )}
              </th>
              <th onClick={() => handleSort("orsak")}>
                Orsak
                {sortColumn === "orsak" && (
                  <span>{sortDirection === "asc" ? " ▲" : " ▼"}</span>
                )}
              </th>
              <th>Delete</th>
            </tr>
          </thead>
          <tbody>
            {salads.map((salad) => (
              <tr key={salad._id}>
                <td>{salad.year}</td>
                <td>{salad.weekNumber}</td>
                <td>{salad.saladName}</td>
                <td>{salad.rensade}</td>
                <td>{salad.orsak}</td>
                <td>
                  <button onClick={() => handleDeleteSalad(salad._id)}>
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Data;
