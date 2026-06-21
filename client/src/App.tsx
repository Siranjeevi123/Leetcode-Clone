import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import AdminRoute from "./components/AdminRoute";
import ProtectedRoute from "./components/ProtectedRoute";
import ToastContainer from "./components/ToastContainer";
import AdminProblemPage from "./pages/AdminProblemPage";
import AdminSignupPage from "./pages/AdminSignupPage";
import LandingPage from "./pages/LandingPage";
import LoginPage from "./pages/LoginPage";
import ProblemEditorPage from "./pages/ProblemEditorPage";
import ProblemsPage from "./pages/ProblemsPage";
import ProfilePage from "./pages/ProfilePage";
import SignupPage from "./pages/SignupPage";
import SolvedPage from "./pages/SolvedPage";

export default function App() {
  return (
    <BrowserRouter>
      <ToastContainer />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />

        <Route element={<ProtectedRoute />}>
          <Route path="/problems" element={<ProblemsPage />} />
          <Route path="/problems/:id" element={<ProblemEditorPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/solved" element={<SolvedPage />} />
        </Route>

        <Route element={<AdminRoute />}>
          <Route path="/admin/create" element={<AdminProblemPage />} />
          <Route path="/admin/edit/:id" element={<AdminProblemPage />} />
          <Route path="/admin/signup" element={<AdminSignupPage />} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
