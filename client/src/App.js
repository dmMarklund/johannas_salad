import React from "react";
import { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Dashboard from "./components/Dashboard";
import Login from "./components/Login";
import ErrorPage from "./components/ErrorPage";
import Data from "./components/Data";
import Graphs from "./components/Graphs";
import ProtectedRoute from "./components/helpers/ProtectedRoute";
import SortsAndWeeks from "./components/charts/SortsAndWeeks";
import WastePerWeek from "./components/charts/WastePerWeek";
import DataExport from "./components/DataExport";
function App() {
  const [user, setUser] = useState(null);

  //Routing v 6 with user privilege checking
  return (
    <BrowserRouter>
      <Routes>
        <Route index element={<Login setUser={setUser} />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute isAllowed={!!user} redirectTo="/dashboard">
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/data"
          element={
            <ProtectedRoute isAllowed={!!user} redirectTo="/dashboard/data">
              <Data />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/convert"
          element={
            <ProtectedRoute isAllowed={!!user} redirectTo="/dashboard/convert">
              <DataExport />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/graphs"
          element={
            <ProtectedRoute isAllowed={!!user} redirectTo="/dashboard/graphs">
              <Graphs />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/graphs/bar"
          element={
            <ProtectedRoute
              isAllowed={!!user}
              redirectTo="/dashboard/graphs/bar"
            >
              <SortsAndWeeks />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/graphs/line"
          element={
            <ProtectedRoute
              isAllowed={!!user}
              redirectTo="/dashboard/graphs/line"
            >
              <WastePerWeek />
            </ProtectedRoute>
          }
        />
        <Route path="/*" element={<ErrorPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
