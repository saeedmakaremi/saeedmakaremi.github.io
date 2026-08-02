import React from "react";
import { BrowserRouter as Router, Routes, Route, Link, useLocation, useNavigate } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';
import { SunIcon, MoonIcon, Bars3Icon as MenuIcon, XMarkIcon as XIcon, HomeIcon } from '@heroicons/react/24/outline';
import { FaGithub, FaLinkedin, FaGraduationCap, FaEnvelope, FaProjectDiagram, FaBookOpen, FaEnvelopeOpenText, FaUser } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from './utils/cn';
import Intro from './pages/Intro';
import Projects from './pages/Projects';
import Publications from './pages/Publications';
import Contact from './pages/Contact';
import EVProject from './pages/EVProject';
import DataVizProject from './pages/DataVizProject';
import UrbanDrawingProject from './pages/UrbanDrawingProject';
import ScrollToTop from './components/ScrollToTop';

function AppContent() {
  const [darkMode, setDarkMode] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('darkMode') === 'true' ||
        window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return false;
  });
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('intro');
  const [targetSection, setTargetSection] = useState<string | null>(null);
  const [projectsDropdownVisible, setProjectsDropdownVisible] = useState(false);
  const projectsDropdownTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    // If the URL is /?SomePath, redirect to /SomePath
    const query = window.location.search;
    if (query && query.startsWith('?/')) {
      const path = query.slice(2); // Remove '?/'
      navigate('/' + path, { replace: true });
    } else if (query && query.startsWith('?')) {
      // For cases like '?UrbanDrawAI' or '?SmartChargePA'
      const path = query.slice(1);
      if (path && !window.location.pathname.includes(path)) {
        navigate('/' + path, { replace: true });
      }
    }
  }, [navigate]);

  useEffect(() => {
    if (location.pathname === '/' && (targetSection || (location.state && location.state.targetSection))) {
      const section = targetSection || location.state?.targetSection;
      const element = document.getElementById(section);
      if (element) {
        setTimeout(() => {
          element.scrollIntoView({ behavior: 'smooth', block: 'start' });
          setActiveSection(section);
          setTargetSection(null);
        }, 100);
      }
    }
  }, [location, targetSection]);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('darkMode', darkMode.toString());
  }, [darkMode]);

  const handleNav = (sectionId: string) => {
    if (location.pathname === '/') {
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        setActiveSection(sectionId);
        setIsMenuOpen(false);
        setProjectsDropdownVisible(false);
      }
    } else {
      setTargetSection(sectionId);
      navigate('/', { state: { targetSection: sectionId } });
      setIsMenuOpen(false);
      setProjectsDropdownVisible(false);
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      const sections = ['intro', 'projects', 'publications', 'contact'];
      const current = sections.find(section => {
        const element = document.getElementById(section);
        if (element) {
          const rect = element.getBoundingClientRect();
          return rect.top >= -100 && rect.top <= 100;
        }
        return false;
      });
      if (current) {
        setActiveSection(current);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-white dark:bg-secondary-900 transition-colors duration-300">
      <ScrollToTop />
      {/* Minimal, modern header */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 dark:bg-secondary-900/80 backdrop-blur-md border-b border-secondary-100 dark:border-secondary-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-14 md:h-16">
            {/* Logo or minimal text */}
            <button 
              onClick={() => handleNav('intro')}
              className="flex items-center gap-2 font-display text-lg font-bold text-primary-600 dark:text-primary-400 tracking-tight focus:outline-none focus:ring-2 focus:ring-primary-400 rounded-md px-2 py-1 bg-transparent border-none"
              aria-label="Home"
            >
              <HomeIcon className="h-6 w-6 sm:ml-1" />
            </button>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-2">
              <button
                className={cn(
                  "nav-link px-3 py-2 rounded-md text-base font-medium focus:outline-none focus:ring-2 focus:ring-primary-400",
                  activeSection === 'intro' && "text-primary-600 dark:text-primary-400 font-semibold"
                )}
                onClick={() => handleNav('intro')}
              >
                About
              </button>
              <div className="relative flex items-center" onMouseLeave={() => {
                projectsDropdownTimeout.current = setTimeout(() => setProjectsDropdownVisible(false), 1000);
              }} onMouseEnter={() => {
                if (projectsDropdownTimeout.current) clearTimeout(projectsDropdownTimeout.current);
                setProjectsDropdownVisible(true);
              }}>
                <button
                  className={cn(
                    "nav-link flex items-center gap-1 px-3 py-2 rounded-md text-base font-medium focus:outline-none focus:ring-2 focus:ring-primary-400",
                    activeSection === 'projects' && "text-primary-600 dark:text-primary-400 font-semibold"
                  )}
                  aria-haspopup="menu"
                  aria-expanded={projectsDropdownVisible}
                  tabIndex={0}
                  onClick={() => handleNav('projects')}
                >
                  Projects
                </button>
                <button
                  className="ml-1 p-1 rounded-full hover:bg-secondary-100 dark:hover:bg-secondary-800 focus:outline-none focus:ring-2 focus:ring-primary-400"
                  aria-label="Open projects menu"
                  onClick={() => setProjectsDropdownVisible(v => !v)}
                  tabIndex={0}
                  type="button"
                >
                  <svg className={cn("w-4 h-4 transition-transform", projectsDropdownVisible ? 'rotate-180' : '')} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
                </button>
                <AnimatePresence>
                  {projectsDropdownVisible && (
                    <motion.div
                      initial={false}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      transition={{ duration: 0.1 }}
                  className={cn(
                        "absolute left-0 top-full mt-2 w-48 bg-white dark:bg-secondary-900 rounded-lg shadow border border-secondary-100 dark:border-secondary-700 z-50"
                      )}
                      role="menu"
                      onMouseLeave={() => {
                        projectsDropdownTimeout.current = setTimeout(() => setProjectsDropdownVisible(false), 1000);
                      }}
                      onMouseEnter={() => {
                        if (projectsDropdownTimeout.current) clearTimeout(projectsDropdownTimeout.current);
                      }}
                >
                      <Link to="/UrbanDrawAI" className="block px-4 py-2 text-sm hover:bg-secondary-50 dark:hover:bg-secondary-800 text-secondary-900 dark:text-white rounded-t-lg transition-colors" role="menuitem" onClick={() => setProjectsDropdownVisible(false)}>UrbanDraw AI</Link>
                      <Link to="/SmartChargePA" className="block px-4 py-2 text-sm hover:bg-secondary-50 dark:hover:bg-secondary-800 text-secondary-900 dark:text-white transition-colors" role="menuitem" onClick={() => setProjectsDropdownVisible(false)}>SmartCharge PA</Link>
                      <Link to="/GeoDataViz" className="block px-4 py-2 text-sm hover:bg-secondary-50 dark:hover:bg-secondary-800 text-secondary-900 dark:text-white rounded-b-lg transition-colors" role="menuitem" onClick={() => setProjectsDropdownVisible(false)}>Geospatial DataViz</Link>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
              <button
                className={cn(
                  "nav-link px-3 py-2 rounded-md text-base font-medium focus:outline-none focus:ring-2 focus:ring-primary-400",
                  activeSection === 'publications' && "text-primary-600 dark:text-primary-400 font-semibold"
                )}
                onClick={() => handleNav('publications')}
              >
                Publications
              </button>
              <button
                className={cn(
                  "nav-link px-3 py-2 rounded-md text-base font-medium focus:outline-none focus:ring-2 focus:ring-primary-400",
                  activeSection === 'contact' && "text-primary-600 dark:text-primary-400 font-semibold"
                )}
                onClick={() => handleNav('contact')}
              >
                Contact
              </button>
              <button
                onClick={() => setDarkMode(!darkMode)}
                className="ml-2 p-2 rounded-full bg-secondary-100 dark:bg-secondary-800 text-secondary-900 dark:text-secondary-100 hover:bg-secondary-200 dark:hover:bg-secondary-700 focus:outline-none focus:ring-2 focus:ring-primary-400"
                aria-label="Toggle dark mode"
              >
                {darkMode ? (
                  <SunIcon className="h-5 w-5" />
                ) : (
                  <MoonIcon className="h-5 w-5" />
                )}
              </button>
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden flex items-center gap-1">
              <button
                onClick={() => setDarkMode(!darkMode)}
                className="p-2 rounded-full bg-secondary-100 dark:bg-secondary-800 text-secondary-900 dark:text-secondary-100 focus:outline-none focus:ring-2 focus:ring-primary-400"
                aria-label="Toggle dark mode"
              >
                {darkMode ? (
                  <SunIcon className="h-5 w-5" />
                ) : (
                  <MoonIcon className="h-5 w-5" />
                )}
              </button>
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="p-2 rounded-full bg-white dark:bg-secondary-900 text-secondary-900 dark:text-secondary-100 shadow border border-secondary-100 dark:border-secondary-800 focus:outline-none focus:ring-2 focus:ring-primary-400"
                aria-label="Open menu"
              >
                {isMenuOpen ? (
                  <XIcon className="h-6 w-6" />
                ) : (
                  <MenuIcon className="h-6 w-6" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation - Slide-in panel from right --> Now: Slide-down from top */}
        <AnimatePresence>
        {isMenuOpen && (
            <>
              {/* Overlay */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.18 }}
                className="fixed inset-0 z-40 bg-black/60 md:hidden"
                onClick={() => setIsMenuOpen(false)}
                aria-label="Close menu overlay"
              />
              {/* Dropdown Menu */}
              <motion.div
                initial={{ opacity: 0, y: -40 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -40 }}
                transition={{ duration: 0.22 }}
                className="fixed top-0 left-0 right-0 z-50 md:hidden w-full bg-white dark:bg-secondary-900 shadow-2xl rounded-b-2xl p-4 flex flex-col gap-2 border-b border-secondary-100 dark:border-secondary-800 max-h-[90vh] overflow-y-auto"
                style={{ marginTop: '64px' }} // adjust if your header height is different
              >
                <button className="self-end mb-2 p-2 rounded-full bg-secondary-100 dark:bg-secondary-800 text-secondary-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-400" onClick={() => setIsMenuOpen(false)} aria-label="Close menu">
                  <XIcon className="h-6 w-6" />
                </button>
                <button className="nav-link text-lg font-medium px-4 py-3 rounded-md flex items-center gap-3 focus:outline-none focus:ring-2 focus:ring-primary-400" onClick={() => handleNav('intro')}><FaUser className="w-5 h-5" /> About Me</button>
                <div className="flex items-center gap-1 w-full">
                <button
                    className="nav-link text-lg font-medium px-4 py-3 rounded-md flex items-center gap-3 flex-1 focus:outline-none focus:ring-2 focus:ring-primary-400"
                    onClick={e => { e.stopPropagation(); handleNav('projects'); setProjectsDropdownVisible(false); }}
                  >
                    <FaProjectDiagram className="w-5 h-5" /> Projects
                  </button>
                  <button
                    className="p-2 rounded-full bg-secondary-100 dark:bg-secondary-800 text-secondary-900 dark:text-white hover:bg-secondary-200 dark:hover:bg-secondary-700 focus:outline-none focus:ring-2 focus:ring-primary-400"
                    aria-label="Open projects menu"
                    onClick={e => { e.stopPropagation(); setProjectsDropdownVisible(v => !v); }}
                    type="button"
                  >
                    <svg className={cn("w-5 h-5 transition-transform", projectsDropdownVisible ? 'rotate-180' : '')} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
                  </button>
                </div>
                {projectsDropdownVisible && (
                  <div className="ml-2 mt-1 bg-white dark:bg-secondary-900 rounded-lg shadow border border-secondary-100 dark:border-secondary-700 flex flex-col">
                    <Link to="/UrbanDrawAI" className="block px-4 py-3 text-base hover:bg-secondary-50 dark:hover:bg-secondary-800 text-secondary-900 dark:text-white rounded-t-lg transition-colors focus:outline-none focus:ring-2 focus:ring-primary-400" onClick={() => { setIsMenuOpen(false); setProjectsDropdownVisible(false); }}><FaProjectDiagram className="inline mr-2 w-4 h-4" /> UrbanDraw AI</Link>
                    <Link to="/SmartChargePA" className="block px-4 py-3 text-base hover:bg-secondary-50 dark:hover:bg-secondary-800 text-secondary-900 dark:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-primary-400" onClick={() => { setIsMenuOpen(false); setProjectsDropdownVisible(false); }}><FaProjectDiagram className="inline mr-2 w-4 h-4" /> SmartCharge PA</Link>
                    <Link to="/GeoDataViz" className="block px-4 py-3 text-base hover:bg-secondary-50 dark:hover:bg-secondary-800 text-secondary-900 dark:text-white rounded-b-lg transition-colors focus:outline-none focus:ring-2 focus:ring-primary-400" onClick={() => { setIsMenuOpen(false); setProjectsDropdownVisible(false); }}><FaProjectDiagram className="inline mr-2 w-4 h-4" /> Geospatial DataViz</Link>
                  </div>
                )}
                <button className="nav-link text-lg font-medium px-4 py-3 rounded-md flex items-center gap-3 focus:outline-none focus:ring-2 focus:ring-primary-400" onClick={() => handleNav('publications')}><FaBookOpen className="w-5 h-5" /> Publications</button>
                <button className="nav-link text-lg font-medium px-4 py-3 rounded-md flex items-center gap-3 focus:outline-none focus:ring-2 focus:ring-primary-400" onClick={() => handleNav('contact')}><FaEnvelopeOpenText className="w-5 h-5" /> Contact</button>
                <button onClick={() => setDarkMode(!darkMode)} className="mt-2 p-2 rounded-full bg-secondary-100 dark:bg-secondary-800 text-secondary-900 dark:text-secondary-100 focus:outline-none focus:ring-2 focus:ring-primary-400" aria-label="Toggle dark mode">
                  {darkMode ? <SunIcon className="h-5 w-5" /> : <MoonIcon className="h-5 w-5" />}
                </button>
              </motion.div>
            </>
        )}
        </AnimatePresence>
      </nav>

      {/* Main Content */}
      <main className="w-full">
        <Routes>
          <Route path="/" element={
            <>
              <section id="intro" className="min-h-screen pt-16">
                <Intro />
              </section>
              <section id="projects" className="min-h-screen py-16 bg-secondary-50 dark:bg-secondary-800/50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                  <Projects />
                </div>
              </section>
              <section id="publications" className="min-h-screen py-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                  <Publications />
                </div>
              </section>
              <section id="contact" className="min-h-screen py-16 bg-secondary-50 dark:bg-secondary-800/50">
                <div className="max-w-7xl mx-auto px-4 sm:px-1 lg:px-8">
                  <Contact />
                </div>
              </section>
            </>
          } />
          <Route path="/SmartChargePA" element={<EVProject />} />
          <Route path="/GeoDataViz" element={<DataVizProject />} />
          <Route path="/UrbanDrawAI" element={<UrbanDrawingProject />} />
          <Route path="*" element={<div className='min-h-screen flex flex-col items-center justify-center text-center'><h1 className='text-3xl font-bold mb-4'>404 - Page Not Found</h1><p className='mb-8'>Sorry, the page you are looking for does not exist.</p><Link to="/" className='btn btn-primary'>Go Home</Link></div>} />
        </Routes>
      </main>

      <footer className="bg-white dark:bg-secondary-900 border-t border-secondary-200 dark:border-secondary-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="text-sm text-secondary-600 dark:text-secondary-400">
              © {new Date().getFullYear()} Saeed Makaremi. All rights reserved.
            </div>
            <div className="flex items-center space-x-6">
              <a
                href="mailto:saeed.makaremi@gmail.com"
                className="text-secondary-600 hover:text-primary-600 dark:text-secondary-400 dark:hover:text-primary-400 transition-colors"
                aria-label="Email"
              >
                <FaEnvelope className="h-6 w-6" />
              </a>
              <a
                href="https://scholar.google.com/citations?user=Jdofb50AAAAJ&hl=en&authuser=2"
                target="_blank"
                rel="noopener noreferrer"
                className="text-secondary-600 hover:text-primary-600 dark:text-secondary-400 dark:hover:text-primary-400 transition-colors"
                aria-label="Google Scholar Profile"
              >
                <FaGraduationCap className="h-6 w-6" />
              </a>
              <a
                href="https://github.com/saeedmakaremi"
                target="_blank"
                rel="noopener noreferrer"
                className="text-secondary-600 hover:text-primary-600 dark:text-secondary-400 dark:hover:text-primary-400 transition-colors"
                aria-label="GitHub Profile"
              >
                <FaGithub className="h-6 w-6" />
              </a>
              <a
                href="https://www.linkedin.com/in/saeedmakaremi"
                target="_blank"
                rel="noopener noreferrer"
                className="text-secondary-600 hover:text-primary-600 dark:text-secondary-400 dark:hover:text-primary-400 transition-colors"
                aria-label="LinkedIn Profile"
              >
                <FaLinkedin className="h-6 w-6" />
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;
