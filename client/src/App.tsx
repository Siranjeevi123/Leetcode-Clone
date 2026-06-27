import { lazy, Suspense } from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import AuthGate from "./components/auth/AuthGate";
import GuestRoute from "./components/auth/GuestRoute";
import AdminRoute from "./components/AdminRoute";
import ProtectedRoute from "./components/ProtectedRoute";
import ToastContainer from "./components/ToastContainer";
import LoadingScreen from "./components/ui/LoadingScreen";

const LandingPage = lazy(() => import("./pages/LandingPage"));
const LoginPage = lazy(() => import("./pages/LoginPage"));
const SignupPage = lazy(() => import("./pages/SignupPage"));
const ProblemsPage = lazy(() => import("./pages/ProblemsPage"));
const ProblemEditorPage = lazy(() => import("./pages/ProblemEditorPage"));
const ProfilePage = lazy(() => import("./pages/ProfilePage"));
const SolvedPage = lazy(() => import("./pages/SolvedPage"));
const AdminProblemPage = lazy(() => import("./pages/AdminProblemPage"));
const AdminSignupPage = lazy(() => import("./pages/AdminSignupPage"));

function PageLoader() {
  return <LoadingScreen message="Loading page..." />;
}

export default function App() {
  return (
    <BrowserRouter>
      <ToastContainer />
      <AuthGate>
        <Suspense fallback={<PageLoader />}>
          <Routes>
            <Route path="/" element={<LandingPage />} />

            <Route element={<GuestRoute />}>
              <Route path="/login" element={<LoginPage />} />
              <Route path="/signup" element={<SignupPage />} />
            </Route>

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
        </Suspense>
      </AuthGate>
    </BrowserRouter>
  );
}
