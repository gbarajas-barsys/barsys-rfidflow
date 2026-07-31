import { BrowserRouter, Routes, Route } from "react-router-dom";

import MainLayout from "./layouts/MainLayout";

import DashboardPage from "./pages/dashboard/DashboardPage";
import InventoryPage from "./pages/inventory/InventoryPage";
import AssetsPage from "./pages/assets/AssetsPage";
import RFIDPage from "./pages/RFID/RFIDPage";
import WorkOrdersPage from "./pages/workorders/WorkOrdersPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<MainLayout />}>
          <Route path="/" element={<DashboardPage />} />

          <Route
            path="/inventory"
            element={<InventoryPage />}
          />

          <Route
            path="/assets"
            element={<AssetsPage />}
          />

          <Route
            path="/rfid"
            element={<RFIDPage />}
          />

          <Route
            path="/work-orders"
            element={<WorkOrdersPage />}
          />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;