/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Footer from './components/Footer';
import Questionnaire from './components/Questionnaire';
import { SURVEY_UNDERSTUDENTS_CI_001 } from './data';

export default function App() {
  const [view, setView] = useState<'landing' | 'questionnaire'>('landing');

  const handleScrollTo = (id: string) => {
    if (view !== 'landing') {
      setView('landing');
      setTimeout(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }, 150);
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleStartSurvey = () => {
    setView('questionnaire');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBackToHome = () => {
    setView('landing');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen flex flex-col selection:bg-brand-primary/10 selection:text-brand-primary bg-brand-bg">
      {/* Global Navbar */}
      <Navbar
        onStartClick={handleStartSurvey}
        onScrollTo={handleScrollTo}
      />

      {/* Main Content Area with elegant fade and slide transitions */}
      <main className="flex-grow">
        <AnimatePresence mode="wait">
          {view === 'landing' ? (
            <motion.div
              key="landing-page"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              {/* Hero CTA section displaying active study presentation */}
              <Hero onStartClick={handleStartSurvey} />
            </motion.div>
          ) : (
            <motion.div
              key="questionnaire-page"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
              className="py-12 bg-brand-bg"
            >
              {/* Questionnaire engine processing Study 001 dynamically */}
              <Questionnaire 
                survey={SURVEY_UNDERSTUDENTS_CI_001} 
                onBackToHome={handleBackToHome} 
              />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Footer */}
      {view === 'landing' && <Footer />}
    </div>
  );
}
