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
      {/* Public Routes */}
      <Route path="/" element={<HomeLayout />}>
        <Route index element={<HomePage />} />
      </Route>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignupPage />} />
      
      {/* This is the route that catches the Google Token */}
      <Route path="/auth/callback" element={<AuthCallbackPage />} />

      {/* Protected App Routes */}
      <Route element={<ProtectedRoute />}>
        
        {/* 1. Onboarding is accessible to ANY logged in user without a profile */}
        <Route path="/app/onboarding" element={<OnboardingPage />} />

        {/* 2. All other app routes REQUIRE a completed profile */}
        <Route element={<OnboardingRoute />}>
          <Route path="/app" element={<Layout />}>
            <Route index element={<Dashboard />} />
            <Route path="roadmap" element={<RoadmapPage />} />
          </Route>
        </Route>

      </Route>
    </Routes>
  );
}

export default App;