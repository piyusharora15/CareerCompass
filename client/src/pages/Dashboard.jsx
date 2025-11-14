import React, { useEffect, useState, useContext } from 'react';
// 'axios' is our library for making API calls to our backend.
import axios from 'axios';
// We import our 'AuthContext' to get the logged-in user's 'user' object and 'token'.
import { AuthContext } from '../context/AuthContext';
// We import the specific chart components we need from the 'recharts' library.
import { 
    RadialBarChart, // The main container for the donut chart.
    RadialBar,      // The actual colored bar (the "progress" part).
    ResponsiveContainer, // A wrapper that makes the chart fit its parent div.
    PolarAngleAxis  // This is a clever trick we use to draw the gray background "track" for the donut.
} from 'recharts';
// We import icons from 'lucide-react' to make the UI look professional.
import { TrendingUp, BrainCircuit } from 'lucide-react';

// --- LoadingSpinner Component ---
// This is a small, reusable component we show while the AI is thinking.
// It's good practice to keep this separate so our main 'return' block stays clean.
const LoadingSpinner = () => (
    // 'flex justify-center items-center' is a Tailwind trick to perfectly center the spinner.
    <div className="flex justify-center items-center h-64">
        {/* 'animate-spin' is a Tailwind class that applies a CSS spinning animation. */}
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
    </div>
);

// --- SkillChart Component ---
// This is a small, reusable component that renders one single "donut" chart.
// This makes our main dashboard code much cleaner.
const SkillChart = ({ skill, status }) => {
    // We check if the skill is 'matched' or 'missing'.
    const isMatched = status === 'matched';
    // The 'recharts' library needs data in an array format.
    // 'value' is the property the chart will read. We set it to 100 (full) or 0 (empty).
    const data = [
        { name: skill, value: isMatched ? 100 : 0 }
    ];
    // We set the fill color based on the status.
    const fill = isMatched ? '#82ca9d' : '#ef4444'; // Green for matched, Red for missing.

    return (
        // 'flex flex-col items-center' centers the chart and its label vertically.
        <div className="flex flex-col items-center">
            {/* We give the chart a fixed size. 'ResponsiveContainer' will make it fill this 100x100 box. */}
            <ResponsiveContainer width={100} height={100}>
                {/* This is the main chart component. */}
                <RadialBarChart
                    cx="50%" // 'cx' and 'cy' center the chart horizontally and vertically inside its container.
                    cy="50%"
                    innerRadius="60%" // This creates the "donut hole" (60% of the total radius).
                    outerRadius="80%" // This is the outer edge of the donut.
                    barSize={10} // This sets the thickness of the progress bar.
                    data={data} // This tells the chart what data to render.
                    startAngle={90} // This starts the bar at the top (12 o'clock).
                    endAngle={-270} // This makes the bar go a full 360 degrees clockwise.
                >
                    {/* This 'PolarAngleAxis' is a trick to draw the gray background track. */}
                    <PolarAngleAxis
                        type="number" // It's a numerical axis (0-100).
                        domain={[0, 100]} // It goes from 0 to 100.
                        angleAxisId={0} // We give it an ID.
                        tick={false} // We hide the "0" and "100" text labels.
                    />
                    {/* This is the actual progress bar. */}
                    <RadialBar
                        background={{ fill: '#374151' }} // This draws the gray background track (Tailwind's gray-700).
                        dataKey="value" // It tells the bar to use the 'value' property from our data (which is 0 or 100).
                        fill={fill} // This sets the color (green or red).
                        cornerRadius={5} // This makes the end of the bar rounded and look clean.
                        angleAxisId={0} // This links the bar to the background track we defined above.
                    />
                    {/* This 'text' element is manually placed in the center of the chart. */}
                    <text
                        x="50%" // Center horizontally
                        y="50%" // Center vertically
                        textAnchor="middle" // CSS property to ensure the center of the text is at the 50% mark.
                        dominantBaseline="middle" // CSS property to ensure the middle of the text is at the 50% mark.
                        className="fill-white font-bold"
                        fontSize="18"
                    >
                        {isMatched ? '100%' : '0%'}
                    </text>
                </RadialBarChart>
            </ResponsiveContainer>
            {/* This is the text label (the skill name) that appears *under* the chart. */}
            <p className="text-center text-sm text-gray-300 mt-2">{skill}</p>
        </div>
    );
};


// --- Main Dashboard Component ---
const Dashboard = () => {
    // --- State & Context ---
    // We get the 'user' object and 'token' from our global AuthContext.
    const { user, token } = useContext(AuthContext);
    // 'insights' will store the JSON object we get back from the AI. It starts as 'null'.
    const [insights, setInsights] = useState(null);
    // 'isLoading' controls our loading spinner. It starts as 'true' so we show the spinner on first load.
    const [isLoading, setIsLoading] = useState(true);
    // 'error' will store any error messages.
    const [error, setError] = useState('');

    // --- Data Fetching Effect ---
    // 'useEffect' runs its code *after* the component has rendered.
    // The `[user, token]` at the end is the "dependency array." It tells React to re-run this code *only* if the 'user' or 'token' objects change.
    useEffect(() => {
        // We define an 'async' function inside the effect so we can use 'await'.
        const fetchInsights = async () => {
            // We get the user's profile for easier access.
            const profile = user?.careerProfile;
            
            // This is our "guard clause." We only proceed if the user exists AND their profile is complete.
            // This is the check that was failing before we fixed the onboarding form.
            if (user && profile && profile.industry && profile.currentRole && profile.desiredRole && profile.skills) {
                // We are about to make an API call, so we ensure the loading state is set.
                setIsLoading(true);
                setError('');
                try {
                    // This is the API call to our backend.
                    const response = await axios.post(
                        'http://localhost:5000/ai/generate-insights', // The URL of our backend endpoint.
                        profile, // The 'req.body' we're sending (the user's profile).
                        { headers: { Authorization: `Bearer ${token}` } } // The security token.
                    );
                    // If the call is successful, we save the AI's JSON response in our 'insights' state.
                    setInsights(response.data);
                } catch (err) {
                    // If the 'axios.post' call fails (e.g., a 500 error), this 'catch' block runs.
                    console.error("API Error fetching insights:", err); 
                    setError('Failed to load AI insights. The server might be busy. Please try refreshing.');
                } finally {
                    // This 'finally' block runs no matter what (success or error).
                    // We're done loading, so we hide the spinner.
                    setIsLoading(false);
                }
            } else if (user) {
                // This 'else if' catches the case where the 'user' is loaded but the 'profile' is incomplete.
                // We stop loading, but we don't set an error. The 'if (!insights)' check below will handle this.
                setIsLoading(false);
            }
            // If 'user' is still null (i.e., AuthContext is still loading), we do nothing and let the effect run again when 'user' updates.
        };

        // We only call our fetch function if the user object has actually been loaded.
        if (user) {
          fetchInsights();
        }
    }, [user, token]); // End of useEffect

    // --- Conditional Rendering (Handling different states) ---
    // This is the first check. If 'isLoading' is true, we show the spinner and stop.
    if (isLoading) return <LoadingSpinner />;
    
    // This is the second check. If an error occurred, we show the error message and stop.
    if (error) return <p className="text-red-500 text-center text-lg bg-gray-800 p-8 rounded-lg">{error}</p>;
    
    // This is the third check. If loading is done AND there was no error, but 'insights' is still null...
    // ...it means the 'user.careerProfile' was incomplete. We show this helpful message and stop.
    if (!insights) {
        return (
            <div className="text-center text-lg text-gray-400 bg-gray-800 p-8 rounded-lg">
                <h2 className="text-2xl font-bold mb-4">Welcome!</h2>
                <p>Could not load insights because your career profile is not fully set up.</p>
            </div>
        );
    }

    // --- Main JSX (The "Success" State) ---
    // If we get past all the checks above, it means we have valid 'insights' data to display.
    return (
        // 'space-y-8' adds vertical spacing between all the sections.
        <div className="space-y-8">
            {/* Header Section */}
            <div>
                <h1 className="text-4xl font-bold">Your AI Career Dashboard</h1>
                <p className="text-gray-400 mt-2">Personalized insights for your goal of becoming a {user.careerProfile.desiredRole}.</p>
            </div>
            
            {/* Main Content Grid. 'lg:grid-cols-2' makes it a 2-column layout on large screens. */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                
                {/* Skill Gap Chart Section. 'lg:col-span-2' makes this item take up both columns on large screens. */}
                <div className="bg-gray-800 p-6 rounded-lg lg:col-span-2">
                    <h2 className="text-xl font-semibold mb-6">Skill Gap Analysis</h2>
                    {/* This 'grid' will hold all our little donut charts. */}
                    {/* It's responsive: 2 columns on mobile, up to 6 on large screens. 'gap-6' adds space between them. */}
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
                        {/* We map over the 'matchedSkills' from our AI data... */}
                        {insights.skillGapAnalysis.matchedSkills.map(skill => (
                            // ...and render a 'SkillChart' for each one, passing the name and 'matched' status.
                            <SkillChart key={skill} skill={skill} status="matched" />
                        ))}
                        {/* We do the same for 'missingSkills', passing the 'missing' status. */}
                        {insights.skillGapAnalysis.missingSkills.map(skill => (
                            <SkillChart key={skill} skill={skill} status="missing" />
                        ))}
                    </div>
                </div>

                {/* In-Demand Skills Section */}
                <div className="bg-gray-800 p-6 rounded-lg space-y-4">
                    <h2 className="text-xl font-semibold flex items-center"><TrendingUp className="mr-2 text-green-400"/>In-Demand Skills</h2>
                    {/* We render the AI-generated skills as a simple bulleted list. */}
                    <ul className="list-disc list-inside space-y-2 text-gray-300">
                        {insights.inDemandSkills.map((skill, i) => <li key={i}>{skill}</li>)}
                    </ul>
                </div>

                {/* Industry Trends Section */}
                <div className="bg-gray-800 p-6 rounded-lg space-y-4">
                    <h2 className="text-xl font-semibold">Industry Trends</h2>
                    {/* We render the AI-generated trends as a simple bulleted list. */}
                    <ul className="list-disc list-inside space-y-2 text-gray-300">
                        {insights.industryTrends.map((trend, i) => <li key={i}>{trend}</li>)}
                    </ul>
                </div>

                {/* Actionable Feedback Section. This also spans both columns. */}
                <div className="bg-gray-800 p-6 rounded-lg lg:col-span-2 space-y-4">
                    <h2 className="text-xl font-semibold flex items-center"><BrainCircuit className="mr-2 text-blue-400"/>Actionable Feedback</h2>
                    {/* 'whitespace-pre-line' is a useful Tailwind class that respects newlines (\n) in the AI's response text. */}
                    <p className="text-gray-300 leading-relaxed whitespace-pre-line">{insights.actionableFeedback}</p>
                </div>
            </div>
        </div>
    );
};

// We export the component so it can be used in 'App.jsx'.
export default Dashboard;