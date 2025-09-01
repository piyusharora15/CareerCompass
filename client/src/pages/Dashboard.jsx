import React from 'react';
import { TrendingUp, BarChart, Building, Briefcase } from 'lucide-react';

const StatCard = ({ icon, title, value }) => (
    <div className="bg-gray-800 p-6 rounded-lg">
        <div className="flex items-center space-x-4">
            <div className="bg-gray-700 p-3 rounded-full">
                {icon}
            </div>
            <div>
                <p className="text-gray-400 text-sm">{title}</p>
                <p className="text-2xl font-bold">{value}</p>
            </div>
        </div>
    </div>
);

const Dashboard = () => {
    const industryData = {
        industry: 'Software Development',
        inDemandSkills: ['Cloud Computing (AWS/Azure)', 'AI & Machine Learning', 'Cybersecurity', 'React', 'Node.js', 'Python', 'Go'],
        salaryTrend: { average: '$125,000/yr', growth: '+6.8%' },
        topCompanies: ['Google', 'Microsoft', 'Amazon', 'Netflix', 'Salesforce']
    };

    return (
        <div>
            <h1 className="text-3xl font-bold mb-2">Industry Insights</h1>
            <p className="text-gray-400 mb-8">Weekly trends for the {industryData.industry} sector.</p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                <StatCard icon={<Briefcase className="text-blue-400"/>} title="Your Industry" value={industryData.industry} />
                <StatCard icon={<TrendingUp className="text-green-400"/>} title="Avg. Salary" value={industryData.salaryTrend.average} />
                <StatCard icon={<BarChart className="text-purple-400"/>} title="1-Year Growth" value={industryData.salaryTrend.growth} />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-gray-800 p-6 rounded-lg">
                    <h2 className="text-xl font-semibold mb-4 flex items-center"><TrendingUp className="mr-2 h-5 w-5 text-green-400"/>Top In-Demand Skills</h2>
                    <div className="flex flex-wrap gap-3">
                        {industryData.inDemandSkills.map(skill => (
                            <span key={skill} className="bg-blue-600/50 text-blue-200 px-3 py-1 rounded-full text-sm font-medium">
                                {skill}
                            </span>
                        ))}
                    </div>
                </div>
                 <div className="bg-gray-800 p-6 rounded-lg">
                    <h2 className="text-xl font-semibold mb-4 flex items-center"><Building className="mr-2 h-5 w-5 text-yellow-400"/>Top Companies Hiring</h2>
                    <div className="flex flex-wrap gap-3">
                        {industryData.topCompanies.map(company => (
                            <span key={company} className="bg-gray-700 text-gray-200 px-3 py-1 rounded-full text-sm font-medium">
                                {company}
                            </span>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;