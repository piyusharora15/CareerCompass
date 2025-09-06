import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import HomeLayout from './components/HomeLayout';
import HomePage from './pages/HomePage';
import Dashboard from './pages/Dashboard';
import ResumeBuilder from './pages/ResumeBuilder';
import MockInterview from './pages/MockInterview';
import CoverLetter from './pages/CoverLetter';

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomeLayout />}>
        <Route index element={<HomePage />} />
      </Route>

      <Route path="/app" element={<Layout />}>
        <Route index element={<Dashboard />} /> 
        <Route path="resume-builder" element={<ResumeBuilder />} />
        <Route path="mock-interview" element={<MockInterview />} />
        <Route path="cover-letter" element={<CoverLetter />} />
      </Route>
    </Routes>
  );
}

export default App;