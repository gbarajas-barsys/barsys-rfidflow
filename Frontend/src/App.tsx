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
import RFIDSettingsPage from "./pages/settings/RFIDSettingsPage";
import RolesPage from "./pages/settings/RolesPage";
import CompaniesPage from "./pages/settings/CompaniesPage";
import UsersPage from "./pages/settings/UsersPage";

import TestReaderPage from "./pages/TestReaderPage";
import AssetPresencePage from "./pages/assets/AssetPresencePage";
import ProductsPage from "./pages/products/ProductsPage";
import LoginPage from "./pages/login/LoginPage";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <BrowserRouter>
      <Routes>

        <Route
          path="/login"
          element={<LoginPage />}
        />

        <Route
          element={
            <ProtectedRoute>
              <MainLayout />
            </ProtectedRoute>
          }
        >
        
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
            path="/products"
            element={<ProductsPage />}
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

          <Route
            path="/settings/rfid"
            element={<RFIDSettingsPage />}
          />

          <Route
            path="/settings/roles"
            element={<RolesPage />}
          />

          <Route
            path="/settings/companies"
            element={<CompaniesPage />}
          />

          <Route
            path="/settings/users"
            element={<UsersPage />}
          />

          <Route
            path="/asset-presence"
            element={<AssetPresencePage />}
          />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;