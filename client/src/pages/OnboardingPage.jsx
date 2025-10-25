import React, { useState, useContext } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";

// --- Component Definition ---
const OnboardingPage = () => {
  // --- State ---
  // We use 'useState' to manage the data for each form field.
  const [industry, setIndustry] = useState("");
  const [currentRole, setCurrentRole] = useState("");
  const [desiredRole, setDesiredRole] = useState("");
  const [skills, setSkills] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  // --- Hooks ---
  const { token, fetchUser } = useContext(AuthContext); // We get the token (to authorize our API call) and 'fetchUser' (to refresh user data after submission).
  const navigate = useNavigate(); // For redirection.
  const location = useLocation(); // To get the 'from' state we saved in OnboardingRoute.

  // --- Event Handler ---
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevents the default browser form submission.
    setIsLoading(true);
    setError("");

    try {
      // We call our new '/users/profile' endpoint.
      await axios.post(
        "http://localhost:5000/users/profile",
        {
          industry,
          currentRole,
          desiredRole,
          skills: skills.split(",").map((s) => s.trim()),
        }, // We format the skills string into an array.
        { headers: { Authorization: `Bearer ${token}` } } // We include our token for authorization.
      );
      // After successfully saving the profile, we call 'fetchUser()' to update our global user state.
      await fetchUser();
      // We check if we saved a 'from' location and redirect the user there, or to the main dashboard if not.
      const from = location.state?.from?.pathname || "/app";
      navigate(from, { replace: true });
    } catch (err) {
      setError("Failed to save profile. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // --- JSX ---
  return (
    <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center p-4">
      <div className="w-full max-w-2xl bg-gray-800 p-8 rounded-lg shadow-lg">
        <h1 className="text-3xl font-bold text-center mb-2">
          Welcome to LakshyaAI!
        </h1>
        <p className="text-center text-gray-400 mb-8">
          Let's set up your career profile to get started.
        </p>

        {/* The form calls our 'handleSubmit' function when submitted. */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Each form field is a controlled component, linked to its state variable. */}
          <div>
            <label
              htmlFor="industry"
              className="block text-sm font-medium text-gray-300 mb-2"
            >
              What industry are you in?
            </label>
            <input
              type="text"
              id="industry"
              value={industry}
              onChange={(e) => setIndustry(e.target.value)}
              required
              className="w-full bg-gray-700 rounded-md p-3"
              placeholder="e.g., Software Development"
            />
          </div>
          {/* Current Role Field */}
          <div>
            <label
              htmlFor="currentRole"
              className="block text-sm font-medium text-gray-300 mb-2"
            >
              What is your current role?
            </label>
            <input
              type="text"
              id="currentRole"
              value={currentRole}
              onChange={(e) => setCurrentRole(e.target.value)}
              required
              className="w-full bg-gray-700 rounded-md p-3 focus:ring-blue-500 focus:border-blue-500"
              placeholder="e.g., Junior React Developer"
            />
          </div>

          {/* Desired Role Field */}
          <div>
            <label
              htmlFor="desiredRole"
              className="block text-sm font-medium text-gray-300 mb-2"
            >
              What is your desired role?
            </label>
            <input
              type="text"
              id="desiredRole"
              value={desiredRole}
              onChange={(e) => setDesiredRole(e.target.value)}
              required
              className="w-full bg-gray-700 rounded-md p-3 focus:ring-blue-500 focus:border-blue-500"
              placeholder="e.g., Senior Full Stack Engineer"
            />
          </div>
          <div>
            <label
              htmlFor="skills"
              className="block text-sm font-medium text-gray-300 mb-2"
            >
              What are your current skills? (comma-separated)
            </label>
            <textarea
              id="skills"
              value={skills}
              onChange={(e) => setSkills(e.target.value)}
              required
              rows="3"
              className="w-full bg-gray-700 rounded-md p-3"
              placeholder="e.g., React, Node.js, SQL, Agile"
            ></textarea>
          </div>
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-blue-600 hover:bg-blue-700 font-bold py-3 rounded-lg disabled:bg-gray-500"
          >
            {isLoading ? "Saving..." : "Generate My Dashboard"}
          </button>
          {error && <p className="text-red-500 text-center mt-4">{error}</p>}
        </form>
      </div>
    </div>
  );
};

export default OnboardingPage;
