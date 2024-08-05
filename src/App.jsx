import { Route, Routes } from "react-router-dom";
import NotFoundPage from "./pages/errors/NotFoundPage";
import Loading from "./features/loading/Loading";
import LoginPage from "./features/auth/loginPage/loginPage";
import BasicPage from "./pages/demo/BasicPage";
import AuthRoute from "./features/auth/authRoute";
import TestLayout from "./pages/testLayout/TestLayout";
import DashboardPage from "./pages/dashboard/DashboardPage";
import { PATH } from "./constants/path";
import ManageCustome from "./pages/manageCutome/manageCustome";
import EquipmentListPage from "./pages/DeviceManage/EquipmentListPage/EquipmentListPage";
import EquipmentRequestPage from "./pages/DeviceManage/EquipmentRequestPage/EquipmentRequestPage";
import EquipmentHistoryPage from "./pages/DeviceManage/EquipmentHistoryPage/EquipmentHistoryPage";
import MaintenanceSchedulePage from "./pages/MaintenanceSchedulePage/MaintenanceSchedulePage";
import EquipmentManagementPage from "./pages/EquipmentManagementPage/EquipmentManagementPage";
import RoomLoanListPage from "./pages/RoomLoan/RoomLoanListPage/RoomLoanListPage";
import RoomLoanRequestPage from "./pages/RoomLoan/RoomLoanRequestPage/RoomLoanRequestPage";
import RoomLoanHistoryPage from "./pages/RoomLoan/RoomLoanHistoryPage/RoomLoanHistoryPage";
import IssueHistoryPage from "./pages/IssueHistoryPage/IssueHistoryPage";
import ErrorReportsPage from "./pages/ErrorReportsPage/ErrorReportsPage";
import ProfilePage from "./pages/profile/profile";
import CreateErrorReportsPage from "./pages/ErrorReportsPage/CreateErrorReportPage";

import "@/assets/styles/main.css";

function App() {
  return (
    <>
      <Routes>
        <Route path="/login" element={<LoginPage />} />

        {/* auth */}
        <Route element={<AuthRoute />}>
          {/* <Route path={PATH.HOME} element={<h1> demo </h1>} /> */}
          <Route path={PATH.BASIC} element={<BasicPage />} />
          {/* <Route path={PATH.TEST} element={<TestLayout />} /> */}
          <Route path={PATH.DASHBOARD} element={<DashboardPage />} />
          <Route path={PATH.CUSTOME} element={<ManageCustome />} />
          <Route path={PATH.EQUIPMENT.LIST} element={<EquipmentListPage />} />
          <Route path={PATH.EQUIPMENT.REQUEST} element={<EquipmentRequestPage />} />
          <Route path={PATH.EQUIPMENT.HISTORY} element={<EquipmentHistoryPage />} />
          <Route path={PATH.MAINTENANCE_SCHEDULE} element={<MaintenanceSchedulePage />} />
          <Route path={PATH.EQUIPMENT_MANAGEMENT} element={<EquipmentManagementPage />} />
          <Route path={PATH.ROOM_LOAN.LIST} element={<RoomLoanListPage />} />
          <Route path={PATH.ROOM_LOAN.REQUEST} element={<RoomLoanRequestPage />} />
          <Route path={PATH.ROOM_LOAN.HISTORY} element={<RoomLoanHistoryPage />} />
          <Route path={PATH.ISSUE_HISTORY} element={<IssueHistoryPage />} />
          <Route path={PATH.ERROR_REPORTS.LIST} element={<ErrorReportsPage />} />
          <Route path={PATH.ERROR_REPORTS.CREATE} element={<CreateErrorReportsPage />} />

          <Route path={PATH.PROFILE} element={<ProfilePage />} />
        </Route>
        <Route path={PATH.NOT_FOUND} element={<NotFoundPage />} />
        <Route path={"*"} element={<NotFoundPage />} />
      </Routes>
      <Loading />
    </>
  );
}

export default App;
