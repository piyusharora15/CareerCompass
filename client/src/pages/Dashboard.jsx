import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
// We import components from our charting library, 'recharts'.
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { TrendingUp, CheckCircle, XCircle, BrainCircuit } from "lucide-react";

// --- Loading Component ---
// A simple component to show while data is being fetched.
const LoadingSpinner = () => (
  <div className="flex justify-center items-center h-64">
    <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
  </div>
);

// --- Dashboard Component ---
const Dashboard = () => {
  // --- State ---
  const { user, token } = useContext(AuthContext); // We get the user and token from our global state.
  const [insights, setInsights] = useState(null); // This will store the data we get back from the AI.
  const [isLoading, setIsLoading] = useState(true); // We start in a loading state.
  const [error, setError] = useState("");

  // --- useEffect Hook for Data Fetching ---
  useEffect(() => {
    // This function will fetch the insights from our AI backend.
    const fetchInsights = async () => {
      // We only run this if we have a user and their career profile exists.
      const profile = user?.careerProfile;
      if (
        profile &&
        profile.industry &&
        profile.currentRole &&
        profile.desiredRole &&
        profile.skills
      ) {
        setIsLoading(true); // Ensure loading state is true before fetching.
        setError(""); // Clear previous errors.
        try {
          // We call our new '/ai/generate-insights' endpoint.
          const response = await axios.post(
            "http://localhost:5000/ai/generate-insights",
            user.careerProfile, // We send the user's profile data in the request body.
            { headers: { Authorization: `Bearer ${token}` } } // We include the token for authorization.
          );
          // We store the JSON response from the AI in our 'insights' state.
          setInsights(response.data);
        } catch (err) {
          setError("Failed to load AI insights. Please try again later.");
        } finally {
          // Whether it succeeds or fails, we're done loading.
          setIsLoading(false);
        }
      } else if (user) {
        // This case handles when the user object is loaded but the profile is incomplete.
        // This shouldn't happen with our onboarding flow, but it's good defensive coding.
        setIsLoading(false);
      }
    };

    if (user) {
      fetchInsights();
    }
  }, [user, token]); // This hook re-runs if the 'user' or 'token' changes.

  // --- Data Preparation for Chart ---
  // The Radar Chart needs data in a specific format: an array of objects with 'skill' and value properties.
  const chartData = insights
    ? [
        ...insights.skillGapAnalysis.matchedSkills.map((skill) => ({
          skill,
          A: 1,
          B: 1,
        })), // Matched skills get a value of 1 for both user and desired role.
        ...insights.skillGapAnalysis.missingSkills.map((skill) => ({
          skill,
          A: 0,
          B: 1,
        })), // Missing skills get a value of 0 for the user and 1 for the desired role.
      ]
    : [];

  // --- Conditional Rendering ---
  // If we're loading, show the spinner.
  if (isLoading) return <LoadingSpinner />;
  // If there's an error, show the error message.
  if (error) return <p className="text-red-500 text-center">{error}</p>;
  // If we have no insights data for some reason, show a message.
  if (!insights) return <p>No insights available.</p>;

  // --- Main JSX ---
  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold">Your AI-Powered Career Dashboard</h1>

      {/* Skill Gap Analysis Chart */}
      <div className="bg-gray-800 p-6 rounded-lg">
        <h2 className="text-xl font-semibold mb-4">
          Skill Gap Analysis: {user.careerProfile.desiredRole}
        </h2>
        {/* 'ResponsiveContainer' makes the chart automatically fit its parent container's size. */}
        <ResponsiveContainer width="100%" height={400}>
          <RadarChart cx="50%" cy="50%" outerRadius="80%" data={chartData}>
            <PolarGrid />
            <PolarAngleAxis dataKey="skill" />{" "}
            {/* This creates the labels around the chart (e.g., 'React', 'Node.js'). */}
            <PolarRadiusAxis
              angle={30}
              domain={[0, 1]}
              tick={false}
              axisLine={false}
            />{" "}
            {/* This is the axis from center to edge; we hide the numbers. */}
            <Radar
              name="Your Skills"
              dataKey="A"
              stroke="#8884d8"
              fill="#8884d8"
              fillOpacity={0.6}
            />{" "}
            {/* The purple radar represents the user's skills. */}
            <Radar
              name="Desired Role Skills"
              dataKey="B"
              stroke="#82ca9d"
              fill="#82ca9d"
              fillOpacity={0.6}
            />{" "}
            {/* The green radar represents the skills needed for the desired role. */}
            <Legend />{" "}
            {/* This shows the key for 'Your Skills' and 'Desired Role Skills'. */}
          </RadarChart>
        </ResponsiveContainer>
      </div>

      {/* Other Insights Cards */}
      {/* ... We would create similar cards for 'industryTrends', 'inDemandSkills', and 'actionableFeedback', populating them with data from our 'insights' state object. */}
    </div>
  );
};

export default Dashboard;
