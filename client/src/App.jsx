import { Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import HomeLayout from "./components/HomeLayout";
import ProtectedRoute from "./components/ProtectedRoute";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignUpPage";
import AuthCallbackPage from "./pages/AuthCallbackPage";
import Dashboard from "./pages/Dashboard";
import ResumeBuilder from "./pages/ResumeBuilder";
import MockInterview from "./pages/MockInterview";
import CoverLetter from "./pages/CoverLetter";
import OnboardingRoute from "./components/OnboardingRoute";
import OnboardingPage from "./pages/OnboardingPage";

function App() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<HomeLayout />}>
        <Route index element={<HomePage />} />
      </Route>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignupPage />} />
      <Route path="/auth/callback" element={<AuthCallbackPage />} />

      {/* --- Protected App Routes --- */}
      {/* We wrap our existing ProtectedRoute with the new OnboardingRoute. */}
      {/* This creates a two-step check: 
          1. ProtectedRoute: Are you logged in?
          2. OnboardingRoute: If yes, have you completed your profile? 
      */}
      <Route element={<ProtectedRoute />}>
        <Route element={<OnboardingRoute />}>
          {/* If both checks pass, the user can access the main app layout. */}
          <Route path="/app" element={<Layout />}>
            <Route index element={<Dashboard />} />
            <Route path="resume-builder" element={<ResumeBuilder />} />
            <Route path="mock-interview" element={<MockInterview />} />
            <Route path="cover-letter" element={<CoverLetter />} />
          </Route>
        </Route>

        {/* The onboarding page is also a protected route, but it sits outside the check for a completed profile. */}
        <Route path="/app/onboarding" element={<OnboardingPage />} />
      </Route>
    </Routes>
  );
}

export default App;
