import { Route, Routes } from "react-router-dom";
import NotFoundPage from "./pages/errors/NotFoundPage";
import Loading from "./features/loading/Loading";
import BasicPage from "./pages/demo/BasicPage";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<h1> demo </h1>} />
        <Route path="/basic" element={<BasicPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
      <Loading />
    </>
  );
}

export default App;
