import React, { useState } from 'react';
import axios from 'axios';
import { Clipboard } from 'lucide-react';

const CoverLetter = () => {
    const [jobDescription, setJobDescription] = useState('');
    const [userSkills, setUserSkills] = useState('React, Node.js, Agile Methodologies, REST APIs');
    const [companyName, setCompanyName] = useState('');
    const [generatedLetter, setGeneratedLetter] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [copySuccess, setCopySuccess] = useState('');

    const handleGenerate = async () => {
        setIsLoading(true);
        setGeneratedLetter('');
        setCopySuccess('');
        try {
            const response = await axios.post('http://localhost:5000/ai/generate-cover-letter', {
                jobDescription,
                userSkills,
                companyName
            });
            setGeneratedLetter(response.data.coverLetter);
        } catch (error) {
            console.error('Error generating cover letter:', error);
            setGeneratedLetter('Failed to generate cover letter. Please check the server and make sure all fields are filled.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleCopy = () => {
        navigator.clipboard.writeText(generatedLetter).then(() => {
            setCopySuccess('Copied!');
            setTimeout(() => setCopySuccess(''), 2000);
        }, () => {
            setCopySuccess('Failed to copy.');
        });
    };

    return (
        <div>
            <h1 className="text-3xl font-bold mb-6">Intelligent Cover Letter Generator</h1>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Input Form */}
                <div className="bg-gray-800 p-8 rounded-lg space-y-6">
                    <div>
                        <label htmlFor="companyName" className="block text-sm font-medium text-gray-400 mb-2">Company Name</label>
                        <input
                            type="text"
                            id="companyName"
                            value={companyName}
                            onChange={(e) => setCompanyName(e.target.value)}
                            className="w-full bg-gray-700 border border-gray-600 rounded-md p-3 focus:ring-blue-500 focus:border-blue-500"
                            placeholder="e.g., Google"
                        />
                    </div>
                     <div>
                        <label htmlFor="userSkills" className="block text-sm font-medium text-gray-400 mb-2">Your Key Skills (comma-separated)</label>
                        <textarea
                            id="userSkills"
                            rows="3"
                            value={userSkills}
                            onChange={(e) => setUserSkills(e.target.value)}
                            className="w-full bg-gray-700 border border-gray-600 rounded-md p-3 focus:ring-blue-500 focus:border-blue-500"
                            placeholder="e.g., React, Node.js, Team Leadership"
                        ></textarea>
                    </div>
                    <div>
                        <label htmlFor="jobDescription" className="block text-sm font-medium text-gray-400 mb-2">Paste Job Description Here</label>
                        <textarea
                            id="jobDescription"
                            rows="8"
                            value={jobDescription}
                            onChange={(e) => setJobDescription(e.target.value)}
                            className="w-full bg-gray-700 border border-gray-600 rounded-md p-3 focus:ring-blue-500 focus:border-blue-500"
                            placeholder="Paste the full job description from LinkedIn, Indeed, etc."
                        ></textarea>
                    </div>
                    <button
                        onClick={handleGenerate}
                        disabled={isLoading}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-md transition-colors disabled:bg-gray-500 disabled:cursor-not-allowed"
                    >
                        {isLoading ? 'Crafting Your Letter...' : 'Generate Cover Letter'}
                    </button>
                </div>

                {/* Output Display */}
                <div className="bg-gray-800 p-8 rounded-lg relative">
                    <h2 className="text-xl font-semibold mb-4 text-gray-300">Your Generated Cover Letter</h2>
                    {generatedLetter && (
                         <button onClick={handleCopy} className="absolute top-8 right-8 p-2 bg-gray-700 hover:bg-gray-600 rounded-md">
                            <Clipboard className="h-5 w-5" />
                         </button>
                    )}
                    {copySuccess && <div className="absolute top-20 right-8 text-xs bg-green-500 text-white px-2 py-1 rounded">{copySuccess}</div>}

                    <div className="prose prose-invert prose-sm max-w-none h-full overflow-y-auto bg-gray-900 p-4 rounded-md">
                         {isLoading ? (
                            <div className="flex items-center justify-center h-full">
                                <p className="text-gray-400 animate-pulse">Generating...</p>
                            </div>
                        ) : (
                            <p className="text-gray-300 whitespace-pre-wrap">
                                {generatedLetter || "Your cover letter will appear here once generated..."}
                            </p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CoverLetter;