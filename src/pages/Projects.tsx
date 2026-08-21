import React from "react";
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { cn } from '../utils/cn';

const Projects = () => {
  const projects = [
    {
      title: 'Lilt',
      category: 'AI music discovery',
      description: 'An AI-powered music discovery app that turns feelings, memories, and everyday moments into a personalized set of track recommendations.',
      image: '/images/lilt-icon.svg',
      status: 'live',
      tags: ['Generative AI', 'Music Discovery', 'Recommendation System', 'Natural Language Processing'],
      demo: 'https://lilt-app.vercel.app',
      isInternalLink: false,
      isIcon: true,
      actionLabel: 'Open live app'
    },
    {
      title: 'UrbanDraw AI',
      category: 'Multimodal urban research',
      description: 'An AI app to explore children\'s perceptions of urban spaces through psychological analysis of their drawings, object detection, and color interpretation.',
      image: '/images/urbandrawai.webp',
      status: 'completed',
      tags: ['Multimodal AI', 'Computer Vision', 'Large Language Model', 'Object Detection', 'Psychology'],
      demo: '/UrbanDrawAI',
      isInternalLink: true,
      actionLabel: 'View case study'
    },
    {
      title: 'SmartCharge PA',
      category: 'EV infrastructure forecasting',
      description: 'Analysis of Palo Alto\'s public EV charging infrastructure through data exploration, policy evaluation, and deep learning-based forecasting.',
      image: '/images/ev-project.webp',
      status: 'completed',
      tags: ['Machine Learning', 'Deep Learning', 'Time Series', 'Exploratory Data Analysis', 'Data Visualization'],
      demo: '/SmartChargePA',
      isInternalLink: true,
      actionLabel: 'View case study'
    },
    {
      title: 'Geospatial DataViz',
      category: 'Spatial analysis & mapping',
      description: 'A collection of spatial data visualizations showcasing urban analytics and mapping techniques, built with open-source tools and datasets.',
      image: '/images/visualization.webp',
      status: 'completed',
      tags: ['Python', 'QGIS', 'Blender', 'OpenStreetMap', 'OSMnx', 'NetworkX', 'H3', 'GeoPandas', 'Kepler', 'Folium', 'Plotly'],
      demo: '/GeoDataViz',
      isInternalLink: true,
      actionLabel: 'Explore visualizations'
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
          A selection of my recent work across urban analytics, data science, and applied AI
        </p>
      </motion.div>

      <div className="grid lg:grid-cols-2 gap-6 lg:gap-8">
        {projects.map(project => (
          <motion.div
            key={project.title}
            initial={false}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.1 }}
            className={cn(
              "card h-full overflow-hidden group cursor-pointer",
              "hover:-translate-y-1 hover:shadow-xl hover:shadow-secondary-900/10 dark:hover:shadow-black/30 transition-all duration-300"
            )}
          >
            {project.demo ? (
              project.isInternalLink ? (
                <Link to={project.demo} className="block h-full w-full">
                  <ProjectContent project={project} />
                </Link>
              ) : (
                <a
                  href={project.demo}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block h-full w-full focus:outline-none focus:ring-2 focus:ring-primary-400 focus:ring-inset rounded-xl"
                  aria-label={`Open ${project.title} live app`}
                >
                  <ProjectContent project={project} />
                </a>
              )
            ) : null}
          </motion.div>
        ))}
      </div>
    </div>
  );
};

type Project = {
  title: string;
  category: string;
  description: string;
  image: string;
  status: string;
  tags: string[];
  demo: string;
  isInternalLink: boolean;
  isIcon?: boolean;
  actionLabel: string;
};

const ProjectContent = ({ project }: { project: Project }) => (
  <div className="flex h-full flex-col">
    <div className="aspect-[16/8] bg-secondary-100 dark:bg-secondary-800 relative overflow-hidden">
      {project.isIcon ? (
        <div className="flex h-full w-full items-center justify-center bg-[#17181C]">
          <img
            src={project.image}
            alt=""
            className="h-36 w-36 sm:h-40 sm:w-40 object-contain group-hover:scale-105 transition-transform duration-500"
          />
        </div>
      ) : (
        <img
          src={project.image}
          alt={project.title}
          className="w-full h-full object-cover group-hover:scale-[1.035] transition-transform duration-500"
        />
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-transparent" />
      <div className="absolute top-4 left-4 sm:top-5 sm:left-5">
        <span className={cn(
          "inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold tracking-wide backdrop-blur-md shadow-sm",
          project.status === 'ongoing'
            ? 'bg-yellow-100/80 text-yellow-800 dark:bg-yellow-900/80 dark:text-yellow-200'
            : project.status === 'live'
              ? 'bg-[#F6E8C9]/95 text-[#8F2F28]'
              : 'bg-white/90 text-secondary-700 dark:bg-secondary-900/85 dark:text-secondary-200'
        )}>
          <span className={cn(
            "h-1.5 w-1.5 rounded-full",
            project.status === 'live' ? 'bg-[#FF6258]' : project.status === 'ongoing' ? 'bg-yellow-500' : 'bg-green-500'
          )} />
          {project.status === 'ongoing' ? 'Ongoing' : project.status === 'live' ? 'Live app' : 'Completed'}
        </span>
      </div>
    </div>
    <div className="flex flex-1 flex-col p-6 sm:p-7">
      <p className="mb-2 text-xs font-semibold uppercase tracking-[0.12em] text-primary-600 dark:text-primary-400">
        {project.category}
      </p>
      <h3 className="mb-3 text-2xl font-display font-semibold tracking-tight text-secondary-900 dark:text-white">
        {project.title}
      </h3>
      <p className="mb-5 leading-7 text-secondary-600 dark:text-secondary-400">
        {project.description}
      </p>
      <div className="mb-6 flex flex-wrap gap-2" aria-label={`${project.title} technologies`}>
        {project.tags.slice(0, 5).map(tag => (
          <span
            key={tag}
            className="rounded-full border border-secondary-200 bg-secondary-50 px-3 py-1 text-xs font-medium text-secondary-600 dark:border-secondary-700 dark:bg-secondary-900/50 dark:text-secondary-300"
          >
            {tag}
          </span>
        ))}
        {project.tags.length > 5 && (
          <span
            className="rounded-full border border-secondary-200 bg-transparent px-3 py-1 text-xs font-medium text-secondary-500 dark:border-secondary-700 dark:text-secondary-400"
            title={project.tags.slice(5).join(', ')}
          >
            +{project.tags.length - 5} tools
          </span>
        )}
      </div>
      <div className="mt-auto flex items-center justify-between border-t border-secondary-100 pt-5 dark:border-secondary-700">
        <span className="text-sm font-semibold text-secondary-800 transition-colors group-hover:text-primary-600 dark:text-secondary-100 dark:group-hover:text-primary-400">
          {project.actionLabel}
        </span>
        <span
          className={cn(
            "flex h-9 w-9 items-center justify-center rounded-full border transition-all duration-300 group-hover:translate-x-0.5",
            project.status === 'live'
              ? 'border-[#FF6258]/40 bg-[#FF6258]/10 text-[#C34738] group-hover:bg-[#FF6258] group-hover:text-white'
              : 'border-secondary-200 bg-secondary-50 text-secondary-600 group-hover:border-primary-500 group-hover:bg-primary-500 group-hover:text-white dark:border-secondary-700 dark:bg-secondary-900 dark:text-secondary-300'
          )}
          aria-hidden="true"
        >
          {project.isInternalLink ? '→' : '↗'}
        </span>
      </div>
    </div>
  </div>
);

export default Projects;
