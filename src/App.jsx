import { Route, Routes } from "react-router-dom";
import NotFoundPage from "./pages/errors/NotFoundPage";
import Loading from "./features/loading/Loading";
import LoginPage from "./features/auth/loginPage/loginPage";
import BasicPage from "./pages/demo/BasicPage";
import AuthRoute from "./features/auth/authRoute";

function App() {
  return (
    <>
      <Routes>
        <Route path="/login" element={<LoginPage />} />

        {/* auth */}
        <Route element={<AuthRoute />}>
          <Route path="/" element={<h1> demo </h1>} />
          <Route path="/basic" element={<BasicPage />} />
        </Route>
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
      <Loading />
    </>
  );
}

export default App;
