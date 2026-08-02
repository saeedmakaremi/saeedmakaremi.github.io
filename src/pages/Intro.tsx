import React from "react";
import { FaLinkedin, FaEnvelope } from 'react-icons/fa';
import { motion } from 'framer-motion';

const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
const getMotionProps = (baseDuration = 0.3, baseDelay = 0) => {
  if (isMobile) return { duration: 0.1, delay: 0 };
  return { duration: baseDuration, delay: baseDelay };
};

const Intro = () => {
  return (
    <div className="space-y-24">
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center">
        <div className="absolute inset-0 z-0">
          <img
            src="/images/bg.webp"
            alt="Urban Data Background"
            className="w-full h-full object-cover scale-105 blur-[2px] brightness-90"
            style={{ filter: 'blur(2px) brightness(0.7)' }}
          />
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="grid md:grid-cols-12 gap-8 md:gap-12 items-center md:text-left text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={getMotionProps()}
              className="md:col-span-8 flex flex-col items-center md:items-start"
            >
              <div className="text-white space-y-6 w-full">
                <div className="space-y-2">
                  <h2 className="text-lg sm:text-2xl font-light text-white/80">Hello, I'm</h2>
                  <h1 className="text-4xl sm:text-6xl md:text-7xl font-display font-bold tracking-tight">Saeed Makaremi</h1>
                </div>
                <h2 className="text-lg sm:text-2xl md:text-3xl text-white/90 font-light max-w-2xl mx-auto md:mx-0">Urban Data Science Researcher</h2>
                <p className="text-base sm:text-lg text-white/80 max-w-2xl mx-auto md:mx-0 leading-relaxed flex items-center gap-2 justify-center md:justify-start">
                  {/* Minimal animated scroll indicator before the text */}
                  <span aria-hidden="true" className="inline-flex items-center">
                    <svg className="w-6 h-6 text-primary-400 animate-bounce-scroll-arrow" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                    </svg>
                  </span>
                  Scroll down to explore some of my recent projects and publications.
                </p>
                <div className="flex flex-col sm:flex-row items-center gap-4 pt-4 w-full justify-center md:justify-start">
                  <a
                    href="#projects"
                    className="btn bg-white text-primary-600 hover:bg-white/90 transition-all duration-200 w-full sm:w-auto text-base sm:text-lg py-3 px-6 rounded-lg font-semibold shadow-md"
                  >
                    View Projects
                  </a>
                  <div className="flex items-center gap-4 text-white mt-2 sm:mt-0">
                    <a
                      href="https://linkedin.com/in/saeedmakaremi"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-3 rounded-full bg-white/10 hover:bg-primary-600/20 transition-colors"
                      aria-label="LinkedIn Profile"
                    >
                      <FaLinkedin className="w-6 h-6" />
                    </a>
                    <a
                      href="mailto:saeed.makaremi@gmail.com"
                      className="p-3 rounded-full bg-white/10 hover:bg-primary-600/20 transition-colors"
                      aria-label="Email Contact"
                    >
                      <FaEnvelope className="w-6 h-6" />
                    </a>
                  </div>
                </div>
              </div>
            </motion.div>
            {/* Profile Image - mobile: above text, desktop: right */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={getMotionProps(0.3, 0.05)}
              className="md:col-span-4 flex justify-center md:justify-end order-first md:order-none mb-8 md:mb-0"
            >
              {/* Enhanced profile image: colored ring, shadow, background glow */}
              <div className="relative max-w-[180px] sm:max-w-[220px] md:max-w-[280px] mx-auto group">
                {/* Glow/gradient background */}
                <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-primary-400/40 via-accent-400/30 to-secondary-400/30 blur-2xl scale-110 z-0" />
                {/* Colored ring */}
                <div className="relative rounded-full p-1 bg-gradient-to-tr from-primary-500 via-accent-500 to-secondary-500 shadow-xl">
                  <div className="rounded-full overflow-hidden aspect-square bg-white dark:bg-secondary-900">
                    <img
                      src="/images/profile.jpg"
                      alt="Portrait of Saeed Makaremi"
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                      loading="lazy"
                    />
                  </div>
                </div>
                {/* Subtle shadow */}
                <div className="absolute inset-0 rounded-full shadow-2xl shadow-primary-900/20 pointer-events-none" />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Bio & Skills Section */}
      <section className="relative py-24 bg-secondary-50 dark:bg-secondary-900/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-24">
            {/* Bio Content */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={getMotionProps()}
              viewport={{ once: true }}
              className="max-w-3xl mx-auto"
            >
              <h3 className="text-4xl font-display font-semibold text-secondary-900 dark:text-white mb-8">About Me</h3>
              <p className="text-lg text-secondary-600 dark:text-secondary-400 leading-relaxed">
                I'm an urban planner and researcher working at the intersection of cities, data, and intelligent systems. I apply Artificial Intelligence, Machine Learning, and Spatial Data Science techniques to explore and address urban challenges, particularly in mobility, energy, and public space. My research and projects focus on transforming complex data into creative applications and actionable insights that contribute to building more sustainable, responsive, and people-centered cities.
              </p>
            </motion.div>

            {/* Skills & Interests */}
            <div className="grid md:grid-cols-2 gap-16">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={getMotionProps(0.8, 0.2)}
                viewport={{ once: true }}
                className="relative"
              >
                <div className="space-y-8">
                  <h4 className="text-3xl font-display font-semibold text-secondary-900 dark:text-white">
                    Research Interests
                  </h4>
                  <ul className="space-y-6">
                    {[
                      "Multimodal AI for interpreting urban environments and human perceptions",
                      "Machine learning applications in mobility and energy systems",
                      "Computational modeling of human behavior and public space dynamics",
                      "Data-driven frameworks for sustainable and equitable urban planning",
                      "Urban analytics and spatial data science"
                    ].map((item, index) => (
                      <li key={index} className="flex items-start gap-4 text-secondary-600 dark:text-secondary-400 group">
                        <span className="w-2 h-2 mt-2.5 bg-primary-500 dark:bg-primary-400 rounded-full flex-shrink-0 group-hover:scale-110 transition-transform"></span>
                        <span className="text-lg">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={getMotionProps(0.8, 0.4)}
                viewport={{ once: true }}
                className="relative"
              >
                <div className="space-y-8">
                  <h4 className="text-3xl font-display font-semibold text-secondary-900 dark:text-white">
                    Technical Skills
                  </h4>
                  <ul className="space-y-6">
                    {[
                      "Programming and data analysis (Python, SQL)",
                      "Machine learning and deep learning frameworks (PyTorch, Scikit-Learn, Transformers)",
                      "Geospatial data analysis and visualization (GeoPandas, QGIS, OSMnx, NetworkX, H3, Kepler.gl, Folium)",
                      "Multimodal AI: computer vision (object detection, image analysis) and NLP with large language models",
                      "Time series analysis and predictive modeling for urban systems"
                    ].map((item, index) => (
                      <li key={index} className="flex items-start gap-4 text-secondary-600 dark:text-secondary-400 group">
                        <span className="w-2 h-2 mt-2.5 bg-primary-500 dark:bg-primary-400 rounded-full flex-shrink-0 group-hover:scale-110 transition-transform"></span>
                        <span className="text-lg">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Intro; 
