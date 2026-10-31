import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { SoundProvider } from './context/SoundContext';
import Layout from './components/layout/Layout';

// Pages
import Home from './pages/Home';
import CreateMystery from './pages/CreateMystery';
import InvestigationRoom from './pages/InvestigationRoom';
import Accusation from './pages/Accusation';
import Results from './pages/Results';
import CaseHistory from './pages/CaseHistory';
import NotFound from './pages/NotFound';

export default function App() {
  return (
    <SoundProvider>
      <BrowserRouter>
        <Layout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/create" element={<CreateMystery />} />
            <Route path="/case/:id" element={<InvestigationRoom />} />
            <Route path="/case/:id/accuse" element={<Accusation />} />
            <Route path="/case/:id/result" element={<Results />} />
            <Route path="/history" element={<CaseHistory />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Layout>
        
        {/* Dark Detective Noir Notifications */}
        <Toaster
          position="bottom-right"
          toastOptions={{
            duration: 3500,
            style: {
              background: '#1B1D20',
              color: '#E8E2D5',
              border: '1px solid #343438',
              fontFamily: 'Inter, sans-serif',
              fontSize: '13px',
              boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.8)',
            },
            success: {
              iconTheme: {
                primary: '#C69B52',
                secondary: '#101113',
              },
            },
            error: {
              iconTheme: {
                primary: '#8F3939',
                secondary: '#E8E2D5',
              },
            },
          }}
        />
      </BrowserRouter>
    </SoundProvider>
  );
}

