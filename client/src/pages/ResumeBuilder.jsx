import React, { useState } from 'react';
import axios from 'axios';

const ResumeBuilder = () => {
    // State for Professional Summary
    const [industry, setIndustry] = useState('Software Development');
    const [summarySkills, setSummarySkills] = useState('React, Node.js, Express, MongoDB');
    const [generatedSummary, setGeneratedSummary] = useState('');
    const [isSummaryLoading, setIsSummaryLoading] = useState(false);

    // State for Experience Bullets
    const [accomplishment, setAccomplishment] = useState('');
    const [bulletSkills, setBulletSkills] = useState('Agile, CI/CD, Jest, REST APIs');
    const [generatedBullets, setGeneratedBullets] = useState([]);
    const [isBulletsLoading, setIsBulletsLoading] = useState(false);

    const handleGenerateSummary = async () => {
        setIsSummaryLoading(true);
        setGeneratedSummary('');
        try {
            const response = await axios.post('http://localhost:5000/ai/generate-resume-content', {
                industry,
                skills: summarySkills,
            });
            setGeneratedSummary(response.data.content);
        } catch (error) {
            console.error('Error generating summary:', error);
            setGeneratedSummary('Failed to generate content. Please check the server.');
        } finally {
            setIsSummaryLoading(false);
        }
    };

    const handleGenerateBullets = async () => {
        setIsBulletsLoading(true);
        setGeneratedBullets([]);
        try {
            const response = await axios.post('http://localhost:5000/ai/generate-resume-bullets', {
                accomplishment,
                skills: bulletSkills,
            });
            setGeneratedBullets(response.data.bullets);
        } catch (error) {
            console.error('Error generating bullets:', error);
        } finally {
            setIsBulletsLoading(false);
        }
    };

    return (
        <div>
            <h1 className="text-3xl font-bold mb-8">AI Resume Builder</h1>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* --- PROFESSIONAL SUMMARY GENERATOR --- */}
                <div className="bg-gray-800 p-8 rounded-lg space-y-6 flex flex-col">
                    <h2 className="text-xl font-semibold text-white">Professional Summary</h2>
                    <div>
                        <label htmlFor="industry" className="block text-sm font-medium text-gray-400 mb-2">Your Industry</label>
                        <input type="text" id="industry" value={industry} onChange={(e) => setIndustry(e.target.value)} className="w-full bg-gray-700 border border-gray-600 rounded-md p-3 focus:ring-blue-500 focus:border-blue-500" />
                    </div>
                    <div>
                        <label htmlFor="summarySkills" className="block text-sm font-medium text-gray-400 mb-2">Your Key Skills (comma-separated)</label>
                        <textarea id="summarySkills" rows="3" value={summarySkills} onChange={(e) => setSummarySkills(e.target.value)} className="w-full bg-gray-700 border border-gray-600 rounded-md p-3 focus:ring-blue-500 focus:border-blue-500"></textarea>
                    </div>
                    <button onClick={handleGenerateSummary} disabled={isSummaryLoading} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-md transition-colors disabled:bg-gray-500">
                        {isSummaryLoading ? 'Generating...' : 'Generate Summary'}
                    </button>
                    {generatedSummary && (
                        <div className="mt-4 bg-gray-900 p-4 rounded-md flex-grow">
                            <p className="text-gray-300 whitespace-pre-wrap">{generatedSummary}</p>
                        </div>
                    )}
                </div>

                {/* --- EXPERIENCE BULLET POINT GENERATOR --- */}
                <div className="bg-gray-800 p-8 rounded-lg space-y-6 flex flex-col">
                    <h2 className="text-xl font-semibold text-white">Work Experience Bullet Points</h2>
                    <div>
                        <label htmlFor="accomplishment" className="block text-sm font-medium text-gray-400 mb-2">Describe an Accomplishment</label>
                        <textarea id="accomplishment" rows="3" value={accomplishment} onChange={(e) => setAccomplishment(e.target.value)} placeholder="e.g., I built a new feature that improved user engagement." className="w-full bg-gray-700 border border-gray-600 rounded-md p-3 focus:ring-blue-500 focus:border-blue-500"></textarea>
                    </div>
                     <div>
                        <label htmlFor="bulletSkills" className="block text-sm font-medium text-gray-400 mb-2">Relevant Skills for this Accomplishment</label>
                        <input type="text" id="bulletSkills" value={bulletSkills} onChange={(e) => setBulletSkills(e.target.value)} className="w-full bg-gray-700 border border-gray-600 rounded-md p-3 focus:ring-blue-500 focus:border-blue-500" />
                    </div>
                    <button onClick={handleGenerateBullets} disabled={isBulletsLoading} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-md transition-colors disabled:bg-gray-500">
                        {isBulletsLoading ? 'Generating...' : 'Generate Bullet Points'}
                    </button>
                     {generatedBullets.length > 0 && (
                        <div className="mt-4 bg-gray-900 p-4 rounded-md flex-grow">
                            <ul className="list-disc list-inside space-y-2 text-gray-300">
                                {generatedBullets.map((bullet, index) => (
                                    <li key={index}>{bullet.substring(1).trim()}</li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ResumeBuilder;