import { BrowserRouter, Routes, Route } from "react-router-dom";

import MainLayout from "./layouts/MainLayout";

import DashboardPage from "./pages/dashboard/DashboardPage";
import InventoryPage from "./pages/inventory/InventoryPage";
import AssetsPage from "./pages/assets/AssetsPage";
import LocationsPage from "./pages/locations/LocationsPage";
import RFIDPage from "./pages/RFID/RFIDPage";
import RFIDLivePage from "./pages/rfid-live/RFIDLivePage";
import WorkOrdersPage from "./pages/workorders/WorkOrdersPage";
import ReportsPage from "./pages/reports/ReportsPage";
import SettingsPage from "./pages/settings/SettingsPage";

import TestReaderPage from "./pages/TestReaderPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<MainLayout />}>
          <Route
            path="/"
            element={<DashboardPage />}
          />

          <Route
            path="/inventory"
            element={<InventoryPage />}
          />

          <Route
            path="/assets"
            element={<AssetsPage />}
          />

          <Route
            path="/locations"
            element={<LocationsPage />}
          />

          <Route
            path="/rfid"
            element={<RFIDPage />}
          />

          <Route
            path="/rfid-live"
            element={<RFIDLivePage />}
          />

          <Route
            path="/test-reader"
            element={<TestReaderPage />}
          />

          <Route
            path="/work-orders"
            element={<WorkOrdersPage />}
          />

          <Route
            path="/reports"
            element={<ReportsPage />}
          />

          <Route
            path="/settings"
            element={<SettingsPage />}
          />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;