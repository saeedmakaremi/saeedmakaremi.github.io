import React from "react";
import { FaGithub, FaLinkedin, FaEnvelope, FaGraduationCap } from 'react-icons/fa';
import { motion } from 'framer-motion';
import { cn } from '../utils/cn';

const Contact = () => {
  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: window.innerWidth < 768 ? 0.1 : 0.3 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="section-title">Get in Touch</h2>
          <p className="text-secondary-600 dark:text-secondary-400 max-w-2xl mx-auto">
            Feel free to reach out for collaborations, research opportunities, or just to say hello!
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: window.innerWidth < 768 ? 0.1 : 0.3 }}
          viewport={{ once: true }}
          className="max-w-3xl mx-auto"
        >
          {/* Contact Information */}
          <div className="card p-8 space-y-8">
            <div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
                <a
                  href="mailto:saeed.makaremi@gmail.com"
                  className="group flex flex-col items-center"
                >
                  <div className={cn(
                    "card p-4 mb-2",
                    "group-hover:scale-105 transition-all duration-300"
                  )}>
                    <FaEnvelope className="h-7 w-7 text-secondary-700 dark:text-secondary-300 group-hover:text-primary-600 dark:group-hover:text-primary-400" />
                  </div>
                  <span className="text-sm text-secondary-600 dark:text-secondary-400">Email</span>
                </a>
                <a
                  href="https://scholar.google.com/citations?user=Jdofb50AAAAJ&hl=en&authuser=2"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex flex-col items-center"
                >
                  <div className={cn(
                    "card p-4 mb-2",
                    "group-hover:scale-105 transition-all duration-300"
                  )}>
                    <FaGraduationCap className="h-7 w-7 text-secondary-700 dark:text-secondary-300 group-hover:text-primary-600 dark:group-hover:text-primary-400" />
                  </div>
                  <span className="text-sm text-secondary-600 dark:text-secondary-400">Scholar</span>
                </a>
                <a
                  href="https://github.com/saeedmakaremi"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex flex-col items-center"
                >
                  <div className={cn(
                    "card p-4 mb-2",
                    "group-hover:scale-105 transition-all duration-300"
                  )}>
                    <FaGithub className="h-7 w-7 text-secondary-700 dark:text-secondary-300 group-hover:text-primary-600 dark:group-hover:text-primary-400" />
                  </div>
                  <span className="text-sm text-secondary-600 dark:text-secondary-400">GitHub</span>
                </a>
                <a
                  href="https://www.linkedin.com/in/saeedmakaremi"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex flex-col items-center"
                >
                  <div className={cn(
                    "card p-4 mb-2",
                    "group-hover:scale-105 transition-all duration-300"
                  )}>
                    <FaLinkedin className="h-7 w-7 text-secondary-700 dark:text-secondary-300 group-hover:text-primary-600 dark:group-hover:text-primary-400" />
                  </div>
                  <span className="text-sm text-secondary-600 dark:text-secondary-400">LinkedIn</span>
                </a>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Contact; 