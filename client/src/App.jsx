import { Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import HomeLayout from "./components/HomeLayout";
import ProtectedRoute from "./components/ProtectedRoute";
import OnboardingRoute from "./components/OnboardingRoute";

// Pages
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignUpPage";
import AuthCallbackPage from "./pages/AuthCallbackPage";
import Dashboard from "./pages/Dashboard";
import OnboardingPage from "./pages/OnboardingPage";
import RoadmapPage from "./pages/Roadmap";

function App() {
  return (
    <Routes>
      {/* --- PUBLIC ROUTES --- */}
      <Route path="/" element={<HomeLayout />}>
        <Route index element={<HomePage />} />
      </Route>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignupPage />} />

      {/* Google Auth Redirect Handler */}
      <Route path="/auth/callback" element={<AuthCallbackPage />} />

      {/* --- PROTECTED APP ROUTES --- */}
      <Route element={<ProtectedRoute />}>
        
        {/* 1. Onboarding Path 
          Accessible to any logged-in user who hasn't completed their profile.
        */}
        <Route path="/onboarding" element={<OnboardingPage />} />

        {/* 2. Feature Routes 
          Requires both Login AND a completed Onboarding Profile.
        */}
        <Route element={<OnboardingRoute />}>
          <Route element={<Layout />}>
            <Route path="/insights" element={<Dashboard />} />
            <Route path="/roadmap" element={<RoadmapPage />} />
          </Route>
        </Route>
      </Route>
    </Routes>
  );
}

export default App;