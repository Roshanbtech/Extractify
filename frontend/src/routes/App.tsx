import { Routes, Route } from "react-router-dom";
import LoginPage from "../pages/LoginPage";
import SignupPage from "../pages/SignupPage";
import DashboardPage from "../pages/DashboardPage";
import ErrorBoundary from "../components/error/ErrorBoundary";
import { Public, Private } from "./Guards";

const App = () => {
  return (
    <>
      <Routes>
        <Route path="/login" element={<Public><LoginPage /></Public>} />
        <Route path="/signup" element={<Public><SignupPage /></Public>} />
        <Route path="/" element={<Private><ErrorBoundary><DashboardPage /></ErrorBoundary></Private>} />
      </Routes>
    </>
  );
}

export default App;
