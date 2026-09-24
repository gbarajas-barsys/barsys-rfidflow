import { BrowserRouter, Routes, Route } from "react-router-dom";

import MainLayout from "./layouts/MainLayout";

import DashboardPage from "./pages/dashboard/DashboardPage";
import InventoryPage from "./pages/inventory/InventoryPage";
import AssetsPage from "./pages/assets/AssetsPage";
import LocationsPage from "./pages/locations/LocationsPage";
import RFIDPage from "./pages/RFID/RFIDPage";
import RFIDLivePage from "./pages/rfid-live/RFIDLivePage";
import RFIDFacilityMapPage from "./pages/RFID/RFIDFacilityMapPage";
import WorkOrdersPage from "./pages/workorders/WorkOrdersPage";
import ReportsPage from "./pages/reports/ReportsPage";
import SettingsPage from "./pages/settings/SettingsPage";
import RFIDSettingsPage from "./pages/settings/RFIDSettingsPage";
import RFIDPrintersPage from "./pages/settings/RFIDPrintersPage";
import RolesPage from "./pages/settings/RolesPage";
import CompaniesPage from "./pages/settings/CompaniesPage";
import UsersPage from "./pages/settings/UsersPage";

import TestReaderPage from "./pages/TestReaderPage";
import AssetPresencePage from "./pages/assets/AssetPresencePage";
import ProductsPage from "./pages/products/ProductsPage";
import LoginPage from "./pages/login/LoginPage";
import ProtectedRoute from "./components/ProtectedRoute";
import ProductionTrackingPage from "./pages/rfid/ProductionTrackingPage";
import RfidCenterPage from "./pages/RFID/RfidCenterPage";
import RfidTemplatesPage from "./pages/rfid/RfidTemplatesPage";
import PermissionGuard from "./security/PermissionGuard";
import ForbiddenPage from "./pages/errors/ForbiddenPage";
import ProfilePage from "./pages/profile/ProfilePage";

function App() {
  return (
    <BrowserRouter>
      <Routes>

        <Route
          path="/login"
          element={<LoginPage />}
        />

        <Route
          path="/403"
          element={<ForbiddenPage />}
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
          element={
            <PermissionGuard
              permission="inventory.read"
            >
              <InventoryPage />
            </PermissionGuard>
          }
        />

        <Route
          path="/assets"
          element={
            <PermissionGuard
              permission="assets.read"
            >
              <AssetsPage />
            </PermissionGuard>
          }
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
            path="/rfid-facility-map"
            element={<RFIDFacilityMapPage />}
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
            path="/rfid-center"
            element={<RfidCenterPage />}
          />

          <Route
            path="/rfid-templates"
            element={<RfidTemplatesPage />}
          />

          <Route
            path="/settings/rfid/printers"
            element={<RFIDPrintersPage />}
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
            element={
              <PermissionGuard
                permission="roles.read"
              >
                <RolesPage />
              </PermissionGuard>
            }
          />

          <Route
            path="/settings/companies"
            element={
              <PermissionGuard
                permission="companies.read"
              >
                <CompaniesPage />
              </PermissionGuard>
            }
          />

          <Route
            path="/settings/users"
            element={
              <PermissionGuard
                permission="users.read"
              >
                <UsersPage />
              </PermissionGuard>
            }
          />

          <Route
            path="/asset-presence"
            element={<AssetPresencePage />}
          />
          
          <Route
            path="/production-tracking"
            element={
              <ProductionTrackingPage />}
          />

          <Route
            path="/profile"
            element={<ProfilePage />}
          />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;