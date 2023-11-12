import React, { useState } from "react";
import { Link } from "react-router-dom";

//Where we get csv document and filter it to cleaner json for database

function DataExport() {
  const [jsonData, setJsonData] = useState(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      convertCsvToJson(file);
    }
  };

  const convertCsvToJson = (file) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      const csvData = event.target.result;
      const lines = csvData.split("\n");
      const headers = lines[0].split(";"); // do not forget to make csv file with ; column separator
      const jsonData = [];

      for (let i = 1; i < lines.length; i++) {
        const line = lines[i].split(";");
        if (line.length === headers.length) {
          const entry = {};
          for (let j = 0; j < headers.length; j++) {
            entry[headers[j]] = line[j];
          }

          //at the beginning remove Antal, Samma\r, Summa
          delete entry["Antal"];
          delete entry["Samma\r"];

          if (entry["Planta"] !== "Summa") {
            jsonData.push(entry);
          }
          console.log(entry);
        }
      }

      // Iterate through jsonData to split Detaljer and create new entries
      const newData = [];
      jsonData.forEach((entry) => {
        const detaljerValues = entry["Detaljer"].split(", ");
        detaljerValues.forEach((detaljer) => {
          const [reason, rensadeValue] = detaljer.split(":");
          if (reason !== "Inventering") {
            const newEntry = { ...entry };
            newEntry["Rensade"] = rensadeValue;
            newEntry["Detaljer"] = reason;
            newData.push(newEntry);
          }
        });
      });
      //Remove zeros
      const filteredJsonData = newData.filter(
        (entry) =>
          !(
            entry.Rensade === "0" ||
            entry.Rensade === null ||
            entry.Detaljer === ""
          )
      );

      setJsonData(filteredJsonData);
      console.log(jsonData);
    };

    reader.readAsText(file);
  };

  //rename our entries to make match with mongoDB database names.
  //Avoid Swedish naming in future, it can be complicated to use å,ö,ä in development.

  const renameKeys = (jsonData) => {
    return jsonData.map((entry) => {
      return {
        year: parseInt(entry["År"], 10),
        weekNumber: parseInt(entry["Vecka"], 10),
        saladName: entry["Planta"],
        rensade: parseInt(entry["Rensade"], 10),
        orsak: entry["Detaljer"],
      };
    });
  };
  //Save file to folder. It can be moved to server and used as database fodder for now.
  const saveJson = () => {
    if (jsonData) {
      const renamedData = renameKeys(jsonData);
      const jsonDataString = JSON.stringify(renamedData, null, 2);
      const blob = new Blob([jsonDataString], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "data.json";
      a.click();
      URL.revokeObjectURL(url);
    }
  };

  return (
    <div>
      <div className="convert_container">
        <Link to="/dashboard/">
          <button className="convert_button">Back</button>
        </Link>

        <div className="convert_container_input">
          <input type="file" accept=".csv" onChange={handleFileChange} />
          {jsonData && (
            <div>
              <h2>Converted JSON:</h2>
              <pre>{JSON.stringify(jsonData, null, 2)}</pre>
              <button onClick={saveJson}>Save JSON</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default DataExport;
