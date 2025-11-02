// --- Imports ---
// We import React's 'useState' (for managing state), 'useRef' (for linking to the PDF preview), and 'useContext' (for getting user data).
import React, { useState, useRef, useContext } from 'react';
// 'axios' is our tool for making API calls to the backend.
import axios from 'axios';
// This is the hook from 'react-to-print' that makes the PDF download work.
import { useReactToPrint } from 'react-to-print';
// This is our global state, used to get the user's token and profile data.
import { AuthContext } from '../context/AuthContext';
// These are icon components to make our buttons look good.
import { Download, Sparkles } from 'lucide-react';
// This is the code editor component.
import Editor from 'react-simple-code-editor';
// These are functions from PrismJS for syntax highlighting.
import { highlight, languages } from 'prismjs/components/prism-core';
// We specifically import the rules for the 'json' language.
import 'prismjs/components/prism-json';

// --- Component Definition ---
const ResumeBuilder = () => {
    // --- State & Context ---
    // We get the 'user' object and 'token' from our global AuthContext.
    const { user, token } = useContext(AuthContext);
    
    // This object defines the default structure and content of our resume.
    // We pre-fill it with the user's name and email if we have them.
    const initialResumeData = {
        contact: {
            name: user?.username || 'Your Name', // 'user?.username' safely checks if 'user' exists before getting 'username'.
            email: user?.email || 'your.email@example.com',
            phone: '123-456-7890',
            linkedin: 'linkedin.com/in/yourprofile',
        },
        summary: 'A brief professional summary about you...',
        experience: [
            {
                id: 1,
                role: 'Software Engineer',
                company: 'Tech Corp',
                date: 'Jan 2022 - Present',
                bullets: [
                    'Developed and maintained web applications using React and Node.js.',
                    'Collaborated with cross-functional teams to deliver high-quality software.'
                ]
            }
        ],
        skills: 'React, Node.js, Express, MongoDB, JavaScript, HTML, CSS'
    };

    // --- State Declarations ---
    // State 1: 'resumeData' (an Object). This holds the *parsed* JSON and is used to render the live preview on the right.
    const [resumeData, setResumeData] = useState(initialResumeData);
    // State 2: 'editorText' (a String). This holds the *raw text* in the code editor on the left.
    // We initialize it by converting our 'initialResumeData' object into a formatted JSON string.
    const [editorText, setEditorText] = useState(JSON.stringify(initialResumeData, null, 2)); // 'null, 2' formats it with 2-space indentation.
    // State 3: 'syntaxError' (String or null). This holds any JSON parsing errors to show the user.
    const [syntaxError, setSyntaxError] = useState(null);
    // State 4: 'isAiLoading' (Boolean). This is for showing a loading spinner on the AI button.
    const [isAiLoading, setIsAiLoading] = useState(false);
    
    // --- Ref Declaration ---
    // 'useRef' creates a "link" to a specific DOM element.
    // We will attach 'componentRef' to the live preview 'div' so 'react-to-print' knows exactly what to print.
    const componentRef = useRef();

    // --- Event Handler: Editor Change ---
    // This function runs on every single keystroke in the code editor.
    const handleEditorChange = (newText) => {
        // First, we update the 'editorText' state. This is what you see in the editor.
        setEditorText(newText);
        
        // Second, we try to parse this new text as JSON.
        try {
            // 'JSON.parse' will throw an error if the text is not valid JSON.
            const parsedData = JSON.parse(newText);
            // If it succeeds, we update the 'resumeData' state, which updates the live preview.
            setResumeData(parsedData);
            // If it succeeds, we also clear any old syntax errors.
            setSyntaxError(null);
        } catch (error) {
            // If 'JSON.parse' fails, this 'catch' block runs.
            // We set a helpful error message to show the user.
            setSyntaxError('Invalid JSON format. Check for missing commas, quotes, or brackets.');
        }
    };

    // --- Event Handler: PDF Download ---
    // We call the 'useReactToPrint' hook, which gives us a function ('handlePrint') to trigger the print dialog.
    const handlePrint = useReactToPrint({
        // 'content' is a function that returns the DOM node we want to print.
        content: () => componentRef.current, // We return the element we linked with 'useRef'.
        // 'documentTitle' sets the default file name for the PDF.
        documentTitle: `${resumeData.contact.name.replace(' ', '_')}_Resume`,
    });

    // --- Event Handler: AI Summary Generation ---
    // This is an 'async' function because it needs to 'await' the API call.
    const handleGenerateSummary = async () => {
        // Show the loading spinner on the button.
        setIsAiLoading(true);
        try {
            // Get the user's industry from their profile, or default to 'tech'.
            const industry = user?.careerProfile?.industry || 'tech';
            // Get the skills from the *current* resume data.
            const skills = resumeData.skills;
            
            // We call our backend API endpoint.
            const response = await axios.post(
                'http://localhost:5000/ai/generate-resume-content', 
                { industry, skills }, // This is the 'req.body'
                { headers: { Authorization: `Bearer ${token}` } } // This is the security token.
            );
            
            // When we get the response, we create a new object with the AI-generated summary.
            const newResumeData = {
                ...resumeData, // This copies all existing data...
                summary: response.data.content // ...and overwrites just the 'summary'.
            };
            
            // We update the live preview with the new object.
            setResumeData(newResumeData);
            // We also update the code editor with the new data, formatted as a string.
            setEditorText(JSON.stringify(newResumeData, null, 2));

        } catch (error) {
            console.error('Error generating summary:', error);
            // We could set an error state here to show the user.
        } finally {
            // This 'finally' block runs whether the 'try' or 'catch' was executed.
            // It hides the loading spinner.
            setIsAiLoading(false);
        }
    };

    // --- JSX (The component's HTML structure) ---
    return (
        // A 'div' to hold the entire page with some vertical spacing.
        <div className="space-y-8">
            {/* The page header. */}
            <div className="flex justify-between items-center">
                <h1 className="text-4xl font-bold">AI Resume Builder</h1>
                {/* The "Download" button, which calls 'handlePrint' when clicked. */}
                <button
                    onClick={handlePrint}
                    className="flex items-center bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition-colors"
                >
                    <Download className="mr-2 h-5 w-5"/>
                    Download as PDF
                </button>
            </div>

            {/* The main 2-column layout. 'grid-cols-1' on mobile, 'lg:grid-cols-2' on large screens. */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                
                {/* --- Column 1: The Code Editor --- */}
                <div className="bg-gray-800 p-8 rounded-lg space-y-4">
                    {/* Header for the editor column. */}
                    <div className="flex justify-between items-center">
                        <h2 className="text-2xl font-bold">Edit Your Resume (JSON)</h2>
                        {/* The "AI Generate" button, which calls 'handleGenerateSummary'. */}
                        <button
                            onClick={handleGenerateSummary}
                            disabled={isAiLoading} // The button is disabled while the AI is working.
                            className="flex items-center text-sm bg-blue-600/50 hover:bg-blue-600/80 text-white py-1 px-3 rounded-lg disabled:bg-gray-500"
                        >
                            <Sparkles className="mr-2 h-4 w-4"/>
                            {isAiLoading ? 'Generating...' : 'AI Generate Summary'}
                        </button>
                    </div>

                    {/* The Code Editor container. We give it a dark background from our CSS. */}
                    <div className="bg-[#2d2d2d] rounded-md overflow-hidden h-[600px] overflow-y-auto">
                        {/* The <Editor> component itself. */}
                        <Editor
                            value={editorText} // We bind its value to our 'editorText' state.
                            onValueChange={handleEditorChange} // We call our handler on every change.
                            highlight={(code) => highlight(code, languages.json)} // We tell it how to highlight the text (using PrismJS for JSON).
                            padding={16} // Adds nice padding inside the editor.
                            style={{
                                fontFamily: '"Fira Code", "Consolas", "Monaco", "Andale Mono", "Ubuntu Mono", monospace',
                                fontSize: 14,
                                minHeight: '600px', // Ensures the editor is tall.
                            }}
                        />
                    </div>
                    {/* This is our error message. It only renders if 'syntaxError' is not null. */}
                    {syntaxError && (
                        <div className="bg-red-500/20 text-red-300 p-3 rounded-md text-sm">
                            <strong>Error:</strong> {syntaxError}
                        </div>
                    )}
                </div>

                {/* --- Column 2: The Live Preview --- */}
                {/* 'ref={componentRef}' is the magic line that links this 'div' to 'handlePrint' for the PDF. */}
                {/* We use 'bg-white' and 'text-black' so the PDF prints in a standard, readable format. */}
                <div ref={componentRef} className="bg-white text-black p-8 rounded-lg shadow-lg h-[700px] overflow-y-auto">
                    {/* Header Section */}
                    <div className="text-center border-b pb-4 border-gray-300">
                        {/* We read data from our 'resumeData' object state. */}
                        <h1 className="text-4xl font-bold">{resumeData.contact.name}</h1>
                        <p className="text-md text-gray-700">
                            {resumeData.contact.email} | {resumeData.contact.phone} | {resumeData.contact.linkedin}
                        </p>
                    </div>
                    {/* Summary Section */}
                    <div className="mt-6">
                        <h2 className="text-xl font-bold border-b border-gray-300 text-gray-800">Professional Summary</h2>
                        <p className="mt-2 text-sm text-gray-700">{resumeData.summary}</p>
                    </div>
                    {/* Skills Section */}
                    <div className="mt-6">
                        <h2 className="text-xl font-bold border-b border-gray-300 text-gray-800">Skills</h2>
                        <p className="mt-2 text-sm text-gray-700">{resumeData.skills}</p>
                    </div>
                    {/* Experience Section */}
                    <div className="mt-6">
                        <h2 className="text-xl font-bold border-b border-gray-300 text-gray-800">Experience</h2>
                        {/* We check if 'resumeData.experience' exists, then map over it. */}
                        {resumeData.experience && resumeData.experience.map(exp => (
                            // We use 'exp.id' as the unique 'key' for React.
                            <div key={exp.id} className="mt-4">
                                <h3 className="text-lg font-semibold">{exp.role}</h3>
                                <p className="text-md italic text-gray-700">{exp.company} | {exp.date}</p>
                                {/* We map over the 'bullets' array for this specific job. */}
                                <ul className="list-disc list-inside mt-2 space-y-1 text-sm text-gray-700">
                                    {exp.bullets.map((bullet, i) => <li key={i}>{bullet}</li>)}
                                </ul>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

// We export the component to be used in 'App.jsx'.
export default ResumeBuilder;