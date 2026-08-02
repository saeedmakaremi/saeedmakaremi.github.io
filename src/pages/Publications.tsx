import React from "react";
import { motion } from 'framer-motion';
import { FaQuoteLeft, FaExternalLinkAlt, FaGraduationCap } from 'react-icons/fa';
import { cn } from '../utils/cn';

const Publications = () => {
  const publications = [
    {
      title: "\"How to study public life\" during pandemic and beyond: an inspiration from Gehl and Svarre in Tehran",
      authors: "B Sepehri, A Sharifi, MR Pourjafar, E Ranjbar, MA Adibhesami, S Makaremi",
      journal: "Cities & Health, 1-18",
      year: 2026,
      link: "https://scholar.google.com/citations?view_op=view_citation&hl=en&oe=ASCII&user=Jdofb50AAAAJ&citation_for_view=Jdofb50AAAAJ:IjCSPb-OGe4C",
      doi: "10.1080/23748834.2026.2678094"
    },
    {
      title: "A multi-output deep learning model for energy demand and port availability forecasting in EV charging infrastructure",
      authors: "S Makaremi",
      journal: "Energy 317, 134582",
      year: 2025,
      link: "https://scholar.google.com/citations?view_op=view_citation&hl=en&oe=ASCII&user=Jdofb50AAAAJ&citation_for_view=Jdofb50AAAAJ:qjMakFHDy7sC",
      doi: "10.1016/j.energy.2025.134582"
    },
    {
      title: "Policy interventions and urban characteristics in modeling electric vehicle charging infrastructure utilization",
      authors: "S Makaremi",
      journal: "Case Studies on Transport Policy 18, 101309",
      year: 2024,
      link: "https://scholar.google.com/citations?view_op=view_citation&hl=en&oe=ASCII&user=Jdofb50AAAAJ&citation_for_view=Jdofb50AAAAJ:u-x6o8ySG0sC",
      doi: "10.1016/j.cstp.2024.101309"
    },
    {
      title: "Artificial intelligence role in Promoting Saudi Arabia's smart cities: addressing SDGs for socio-cultural challenges",
      authors: "B Sepehri, AI Almulhim, MA Adibhesami, S Makaremi, F Ejazi",
      journal: "Социологическое обозрение 23 (4), 20-47",
      year: 2024,
      link: "https://scholar.google.com/citations?view_op=view_citation&hl=en&oe=ASCII&user=Jdofb50AAAAJ&citation_for_view=Jdofb50AAAAJ:UeHWp8X0CEIC",
      doi: "10.17323/1728-192X-2024-4-20-47"
    },
    {
      title: "A Data-Driven Multi-scale Digital Twin Framework for Optimizing Energy Efficiency in Public Pedestrian Infrastructure",
      authors: "MA Adibhesami, H Karimi, B Sepehri, F Pajani, S Makaremi",
      journal: "Digital Twin Computing for Urban Intelligence, 147-166",
      year: 2024,
      link: "https://scholar.google.com/citations?view_op=view_citation&hl=en&oe=ASCII&user=Jdofb50AAAAJ&citation_for_view=Jdofb50AAAAJ:9yKSN-GCB0IC",
      doi: "10.1007/978-981-97-8483-7_7"
    }
  ];

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="section-title">Publications</h2>
          <p className="text-secondary-600 dark:text-secondary-400 max-w-2xl mx-auto">
            Recent research publications in urban analytics, machine learning, and smart cities
          </p>
          <div className="mt-6">
            <a
              href="https://scholar.google.com/citations?user=Jdofb50AAAAJ&hl=en&authuser=2"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center px-4 py-2 rounded-lg bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400 hover:bg-primary-100 dark:hover:bg-primary-900/30 transition-colors"
            >
              <FaGraduationCap className="h-5 w-5 mr-2" />
              View Google Scholar Profile
            </a>
          </div>
        </motion.div>

        <div className="space-y-6">
          {publications.map((pub, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
              viewport={{ once: true }}
              className={cn(
                "card p-6",
                "hover:scale-[1.01] transition-all duration-300"
              )}
            >
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 p-3 bg-primary-50 dark:bg-primary-900/20 rounded-lg">
                  <FaQuoteLeft className="h-6 w-6 text-primary-600 dark:text-primary-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-lg font-semibold text-secondary-900 dark:text-white mb-2">
                    {pub.title}
                  </h3>
                  <p className="text-secondary-600 dark:text-secondary-400 mb-1">
                    {pub.authors}
                  </p>
                  <p className="text-secondary-500 dark:text-secondary-500 text-sm mb-3">
                    {pub.journal} ({pub.year})
                  </p>
                  <div className="flex flex-wrap gap-3">
                    <a
                      href={pub.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center text-sm text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300"
                    >
                      <FaGraduationCap className="h-4 w-4 mr-1" />
                      Google Scholar
                    </a>
                    <a
                      href={`https://doi.org/${pub.doi}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center text-sm text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300"
                    >
                      <FaExternalLinkAlt className="h-3.5 w-3.5 mr-1" />
                      DOI: {pub.doi}
                    </a>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Publications; 