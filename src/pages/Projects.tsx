import React from "react";
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { cn } from '../utils/cn';

const Projects = () => {
  const projects = [
    {
      title: 'UrbanDraw AI',
      description: 'An AI app to explore children\'s perceptions of urban spaces through psychological analysis of their drawings, object detection, and color interpretation.',
      image: '/images/urbandrawai.webp',
      status: 'completed',
      tags: ['Multimodal AI', 'Computer Vision', 'Large Language Model', 'Object Detection', 'Psychology'],
      demo: '/UrbanDrawAI',
      isInternalLink: true
    },
    {
      title: 'SmartCharge PA',
      description: 'Analysis of Palo Alto\'s public EV charging infrastructure through data exploration, policy evaluation, and deep learning-based forecasting.',
      image: '/images/ev-project.webp',
      status: 'completed',
      tags: ['Machine Learning', 'Deep Learning', 'Time Series', 'Exploratory Data Analysis', 'Data Visualization'],
      demo: '/SmartChargePA',
      isInternalLink: true
    },
    {
      title: 'Geospatial DataViz',
      description: 'A collection of spatial data visualizations showcasing urban analytics and mapping techniques, built with open-source tools and datasets.',
      image: '/images/visualization.webp',
      status: 'completed',
      tags: ['Python', 'QGIS', 'Blender', 'OpenStreetMap', 'OSMnx', 'NetworkX', 'H3', 'GeoPandas', 'Kepler', 'Folium', 'Plotly'],
      demo: '/GeoDataViz',
      isInternalLink: true
    },
  ];

  return (
    <div className="py-16">
      <motion.div
        initial={false}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.1 }}
        className="text-center mb-16"
      >
        <h2 className="section-title">Projects</h2>
        <p className="text-secondary-600 dark:text-secondary-400 max-w-2xl mx-auto">
          A selection of my recent work in urban analytics and data science
        </p>
      </motion.div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {projects.map((project, index) => (
          <motion.div
            key={project.title}
            initial={false}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.1 }}
            className={cn(
              "card overflow-hidden group cursor-pointer",
              "hover:scale-[1.01] transition-all duration-200"
            )}
          >
            {project.isInternalLink && project.demo ? (
              <Link to={project.demo} className="block h-full w-full">
                <div className="aspect-w-16 aspect-h-9 bg-secondary-100 dark:bg-secondary-800 relative">
                  <img
                    src={project.image}
                    alt={project.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                  <div className="absolute top-4 right-4">
                    <span className={cn(
                      "px-3 py-1 rounded-full text-sm font-medium backdrop-blur-sm",
                      project.status === 'ongoing' 
                        ? 'bg-yellow-100/80 text-yellow-800 dark:bg-yellow-900/80 dark:text-yellow-200' 
                        : 'bg-green-100/80 text-green-800 dark:bg-green-900/80 dark:text-green-200'
                    )}>
                      {project.status === 'ongoing' ? 'Ongoing' : 'Completed'}
                    </span>
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-display font-semibold mb-2 text-secondary-900 dark:text-white">
                    {project.title}
                  </h3>
                  <p className="text-secondary-600 dark:text-secondary-400 mb-4">
                    {project.description}
                  </p>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {project.tags.map(tag => (
                      <span 
                        key={tag}
                        className="bg-secondary-100 dark:bg-secondary-800 text-secondary-700 dark:text-secondary-300 px-2 py-1 rounded-md text-sm"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </Link>
            ) : null}
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default Projects;
