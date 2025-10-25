import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { TrendingUp, BrainCircuit } from "lucide-react";

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
        user &&
        profile &&
        profile.industry &&
        profile.currentRole &&
        profile.desiredRole &&
        profile.skills
      ) {
        // If we are about to fetch, ensure loading is true and errors are cleared.
        setIsLoading(true);
        setError("");
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
          console.error("API Error fetching insights:", err);
          setError(
            "Failed to load AI insights. The server might be busy. Please try refreshing."
          );
        } finally {
          // Whether it succeeds or fails, we're done loading.
          setIsLoading(false);
        }
      } else if (user) {
        // This case handles a logged-in user who somehow has an incomplete profile.
        // We stop the loading spinner but don't try to fetch data.
        setIsLoading(false);
      }
    };

    fetchInsights();
  }, [user, token]); // The effect re-runs whenever the user object changes.

  // --- Data Preparation for Chart ---
  // The Radar Chart needs data in a specific format: an array of objects with 'skill' and value properties.
  const chartData = insights
    ? [
        ...insights.skillGapAnalysis.matchedSkills.map((skill) => ({
          skill,
          "Your Skills": 1,
          "Desired Role": 1,
        })),
        ...insights.skillGapAnalysis.missingSkills.map((skill) => ({
          skill,
          "Your Skills": 0,
          "Desired Role": 1,
        })),
      ]
    : [];

  // --- Conditional Rendering ---
  // If we're still waiting for the initial user object from AuthContext OR fetching insights, show the spinner.
  if (isLoading) return <LoadingSpinner />;

  // If an error occurred during the API call, show a clear error message.
  if (error)
    return (
      <p className="text-red-500 text-center text-lg bg-gray-800 p-8 rounded-lg">
        {error}
      </p>
    );

  // If loading is done but there are no insights, it means the user's profile is incomplete.
  if (!insights) {
    return (
      <div className="text-center text-lg text-gray-400 bg-gray-800 p-8 rounded-lg">
        <h2 className="text-2xl font-bold mb-4">Welcome!</h2>
        <p>
          Could not load insights because your career profile is not fully set
          up.
        </p>
        {/* We can add a link here later to guide them back to onboarding if needed */}
      </div>
    );
  }
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold">Your AI Career Dashboard</h1>
        <p className="text-gray-400 mt-2">
          Personalized insights for your goal of becoming a{" "}
          {user.careerProfile.desiredRole}.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Skill Gap Chart */}
        <div className="bg-gray-800 p-6 rounded-lg lg:col-span-2">
          <h2 className="text-xl font-semibold mb-4">Skill Gap Analysis</h2>
          {chartData.length > 0 ? (
            <ResponsiveContainer
              width="100%"
              height={200 + chartData.length * 40}
            >
              <BarChart
                layout="vertical"
                data={chartData}
                // We increased the 'left' margin to make room for the long skill names.
                margin={{ top: 5, right: 30, left: 200, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#4a5568" />
                <XAxis
                  type="number"
                  allowDecimals={false}
                  tickFormatter={(tick) => (tick === 1 ? "Yes" : "No")}
                />
                {/* We increased the 'width' of the Y-axis to 300 to give labels space.
                                  We added the 'tick' prop to set a smaller, cleaner font size.
                                  'textAnchor="end"' ensures the text is right-aligned.
                                */}
                <YAxis
                  dataKey="skill"
                  type="category"
                  width={300}
                  tick={{ fontSize: 12, textAnchor: "end" }}
                  interval={0} // 'interval={0}' guarantees that every single skill label is rendered.
                />
                <Tooltip
                  cursor={{ fill: "rgba(255, 255, 255, 0.1)" }}
                  contentStyle={{ backgroundColor: "#2D3748", border: "none" }}
                />
                <Legend />
                <Bar dataKey="Your Skills" fill="#8884d8" />
                <Bar dataKey="Desired Role" fill="#82ca9d" />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-gray-400">
              No skill gap data to display. Your skills perfectly match the
              desired role!
            </p>
          )}
        </div>

        {/* In-Demand Skills & Industry Trends */}
        <div className="bg-gray-800 p-6 rounded-lg space-y-4">
          <h2 className="text-xl font-semibold flex items-center">
            <TrendingUp className="mr-2 text-green-400" />
            In-Demand Skills
          </h2>
          <ul className="list-disc list-inside space-y-2 text-gray-300">
            {insights.inDemandSkills.map((skill, i) => (
              <li key={i}>{skill}</li>
            ))}
          </ul>
        </div>
        <div className="bg-gray-800 p-6 rounded-lg space-y-4">
          <h2 className="text-xl font-semibold">Industry Trends</h2>
          <ul className="list-disc list-inside space-y-2 text-gray-300">
            {insights.industryTrends.map((trend, i) => (
              <li key={i}>{trend}</li>
            ))}
          </ul>
        </div>

        {/* Actionable Feedback */}
        <div className="bg-gray-800 p-6 rounded-lg lg:col-span-2 space-y-4">
          <h2 className="text-xl font-semibold flex items-center">
            <BrainCircuit className="mr-2 text-blue-400" />
            Actionable Feedback
          </h2>
          <p className="text-gray-300 leading-relaxed whitespace-pre-line">
            {insights.actionableFeedback}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
