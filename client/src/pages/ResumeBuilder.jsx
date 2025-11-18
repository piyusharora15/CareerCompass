// --- Imports ---
import React, { useState, useRef, useContext } from 'react';
import axios from 'axios';
import { useReactToPrint } from 'react-to-print';
import { AuthContext } from '../context/AuthContext';
import { Download, Sparkles } from 'lucide-react';
// Imports for the code editor
import Editor from 'react-simple-code-editor';
import { highlight, languages } from 'prismjs/components/prism-core';
import 'prismjs/components/prism-json'; // We're using the JSON language

// --- Component Definition ---
// This component uses two states:
// 1. 'resumeData' (Object): The parsed JSON, used to render the live preview on the right.
// 2. 'editorText' (String): The raw text inside the code editor on the left.
const ResumeBuilder = () => {
    // --- State & Context ---
    const { user, token } = useContext(AuthContext);
    
    // This object defines the default structure and content of our resume.
    const initialResumeData = {
        contact: {
            name: user?.username || 'Your Name',
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
    // State 1: 'resumeData' (an Object). This holds the *parsed* JSON.
    const [resumeData, setResumeData] = useState(initialResumeData);
    // State 2: 'editorText' (a String). This holds the *raw text* in the code editor.
    const [editorText, setEditorText] = useState(JSON.stringify(initialResumeData, null, 2)); // 'null, 2' formats it with 2-space indentation.
    // State 3: 'syntaxError' (String or null). This holds any JSON parsing errors.
    const [syntaxError, setSyntaxError] = useState(null);
    // State 4: 'isAiLoading' (Boolean). This is for the AI button loading spinner.
    const [isAiLoading, setIsAiLoading] = useState(false);
    
    // --- Ref Declaration ---
    // 'useRef' creates a "link" to a specific DOM element.
    // We will attach 'componentRef' to the *inner* div of the preview.
    const componentRef = useRef();

    // --- Event Handler: Editor Change ---
    // This function runs on every single keystroke in the code editor.
    const handleEditorChange = (newText) => {
        // First, we update the 'editorText' state. This is what you see in the editor.
        setEditorText(newText);
        
        // Second, we try to parse this new text as JSON.
        try {
            const parsedData = JSON.parse(newText);
            // If it succeeds, we update the 'resumeData' state, which updates the live preview.
            setResumeData(parsedData);
            // If it succeeds, we also clear any old syntax errors.
            setSyntaxError(null);
        } catch (error) {
            // If 'JSON.parse' fails, we set a helpful error message.
            setSyntaxError('Invalid JSON format. Check for missing commas, quotes, or brackets.');
        }
    };

    // --- Event Handler: PDF Download ---
    // We call the 'useReactToPrint' hook, which gives us a function ('handlePrint') to trigger the print dialog.
    const handlePrint = useReactToPrint({
        // 'content' is a function that returns the DOM node we want to print.
        contentRef: () => componentRef.current, // We return the element we linked with 'useRef'.
        documentTitle: `${resumeData.contact.name.replace(' ', '_')}_Resume`,
    });

    // --- Event Handler: AI Summary Generation ---
    // This is an 'async' function because it needs to 'await' the API call.
    const handleGenerateSummary = async () => {
        setIsAiLoading(true);
        try {
            const industry = user?.careerProfile?.industry || 'tech';
            const skills = resumeData.skills;
            
            const response = await axios.post(
                'http://localhost:5000/ai/generate-resume-content', 
                { industry, skills },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            
            // Create a new object with the AI-generated summary.
            const newResumeData = {
                ...resumeData,
                summary: response.data.content
            };
            
            // Update the live preview with the new object.
            setResumeData(newResumeData);
            // Update the code editor with the new data, formatted as a string.
            setEditorText(JSON.stringify(newResumeData, null, 2));

        } catch (error) {
            console.error('Error generating summary:', error);
        } finally {
            setIsAiLoading(false);
        }
    };

    // --- JSX (The component's HTML structure) ---
    return (
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

            {/* The main 2-column layout. */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                
                {/* --- Column 1: The Code Editor --- */}
                <div className="bg-gray-800 p-8 rounded-lg space-y-4">
                    <div className="flex justify-between items-center">
                        <h2 className="text-2xl font-bold">Edit Your Resume (JSON)</h2>
                        <button
                            onClick={handleGenerateSummary}
                            disabled={isAiLoading}
                            className="flex items-center text-sm bg-blue-600/50 hover:bg-blue-600/80 text-white py-1 px-3 rounded-lg disabled:bg-gray-500"
                        >
                            <Sparkles className="mr-2 h-4 w-4"/>
                            {isAiLoading ? 'Generating...' : 'AI Generate Summary'}
                        </button>
                    </div>

                    {/* The Code Editor container. */}
                    <div className="bg-[#2d2d2d] rounded-md overflow-hidden h-[600px] overflow-y-auto">
                        <Editor
                            value={editorText}
                            onValueChange={handleEditorChange}
                            highlight={(code) => highlight(code, languages.json)}
                            padding={16}
                            style={{
                                fontFamily: '"Fira Code", "Consolas", "Monaco", "Andale Mono", "Ubuntu Mono", monospace',
                                fontSize: 14,
                                minHeight: '600px',
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

                {/* --- Column 2: The Live Preview (THE FIX) --- */}
                
                {/* 1. This OUTER div provides the on-screen styling: fixed height and scrollbar. */}
                {/* It has NO ref. */}
                <div className="h-[700px] overflow-y-auto rounded-lg shadow-lg">
                    
                    {/* 2. This INNER div is what we print. */}
                    {/* It has the 'ref={componentRef}'. */}
                    {/* It has NO fixed height and NO overflow. It will grow as tall as the resume content. */}
                    {/* THIS IS THE COMPLETE, UNTRUNCATED CONTENT */}
                    <div ref={componentRef} className="bg-white text-black p-8">
                        {/* Header Section */}
                        <div className="text-center border-b pb-4 border-gray-300">
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
                        {/* You can add Education section here following the same pattern */}
                    </div>
                </div>
            </div>
        </div>
    );
};

// We export the component to be used in 'App.jsx'.
export default ResumeBuilder;