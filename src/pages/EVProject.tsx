import React from 'react';
import { motion } from 'framer-motion';
import { FaGithub, FaExternalLinkAlt, FaDatabase, FaCalendarAlt, FaBolt, FaClock, FaPlug, FaChartLine } from 'react-icons/fa';
import { cn } from '../utils/cn';
import EVChargingMap from '../components/EVChargingMap';
import EVStatsCard from '../components/EVStatsCard';

const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
const getMotionProps = (baseDuration = 0.3, baseDelay = 0) => {
  return { duration: 0.1, delay: 0 };
};

const papers = [
  {
    title: 'A multi-output deep learning model for energy demand and port availability forecasting in EV charging infrastructure',
    journal: 'Energy (2025)',
    doi: '10.1016/j.energy.2025.134582',
    description: 'Develops a multi-output deep learning model for simultaneous prediction of energy demand and port availability.'
  },
  {
    title: 'Policy interventions and urban characteristics in modeling electric vehicle charging infrastructure utilization',
    journal: 'Case Studies on Transport Policy (2024)',
    doi: '10.1016/j.cstp.2024.101309',
    description: 'Analyzes the impact of policy interventions and urban characteristics on EV charging infrastructure utililization rate.'
  }
];

const keyFindings = [
  {
    category: 'Exploratory Data Analysis',
    points: [
      'Analyzed high-usage stations and identified key spatial and technical drivers of demand',
      'Uncovered distinct charging behaviors and station preferences across different user segments',
      'Used origin-destination patterns to reveal clustered routes and strategic charging hotspots',
      'Detected long-term trends and quantified the impact of external factors like policy shifts and major events.',
      'Captured temporal variations in charging behavior across daily, weekly, and seasonal timeframes.'
    ]
  },
  {
    category: 'Policy Impact Analysis',
    points: [
      'Identified policy interventions—especially pricing—as major drivers of station utilization',
      'Applied machine learning to uncover key factors influencing charging behavior',
      'Found that stations in commercial areas were more resilient to fee-based policies',
      'Revealed that socioeconomic and station behavioral factors have meaningful impact on station utilization',
      'Highlighted the importance of flexible policy interventions to accommodate diverse economic and demographic groups'
    ]
  },
  {
    category: 'Multi-output Deep Learning Model',
    points: [
      'Developed a multi-output deep learning model forecasting EV energy demand and port availability.',
      'The proposed model outperformed single-output deep learning and transformer models',
      'Evaluated model interpretability, adaptability on unforeseen events (COVID-19), and generalizability across spatial and operational contexts',
      'Demonstrated the model\'s potential to support grid stability, planning transparency, and policy-driven EV infrastructure deployment',
      'Introduced a conceptual framework linking EV infrastructure with urban energy systems'
    ]
  }
];

const EVProject: React.FC = () => {
  return (
    <div className="min-h-screen bg-white dark:bg-secondary-900 pt-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-16">
        {/* Introduction & GitHub Link */}
        <motion.section
          initial={false}
          animate={{ opacity: 1, y: 0 }}
          transition={getMotionProps()}
          className="text-center"
        >
          <h1 className="section-title">SmartCharge PA</h1>
          <p className="text-xl text-secondary-600 dark:text-secondary-400 max-w-3xl mx-auto mb-8">
            This project analyzes Palo Alto's public EV charging infrastructure through data exploration, policy evaluation, and deep learning-based forecasting. Featuring two published studies, it offers insights for optimizing urban energy systems and guiding policy decisions using multi-output neural networks and real-world charging behavior data.          </p>
          <div className="flex justify-center items-center space-x-4 mb-8">
            <a
              href="https://data.cityofpaloalto.org/dataviews/257812/electric-vehicle-charging-station-usage-july-2011-dec-2020/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center text-secondary-600 dark:text-secondary-400 hover:underline"
            >
              <div className="p-2 rounded-lg bg-primary-50 dark:bg-primary-900/20">
                <FaDatabase className="h-5 w-5 text-primary-600 dark:text-primary-400" />
              </div>
              <span className="ml-2">City of Palo Alto Open Data Portal</span>
            </a>
            <div className="flex items-center text-secondary-600 dark:text-secondary-400">
              <div className="p-2 rounded-lg bg-primary-50 dark:bg-primary-900/20">
                <FaCalendarAlt className="h-5 w-5 text-primary-600 dark:text-primary-400" />
              </div>
              <span className="ml-2">July 2011 - December 2020</span>
            </div>
          </div>
          <a
            href="https://github.com/saeedmakaremi/ev-charging-analysis"
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-primary inline-flex items-center"
          >
            <FaGithub className="mr-2" />
            View Project on GitHub
          </a>
        </motion.section>

        {/* Interactive Dashboard */}
        <motion.section
          initial={false}
          animate={{ opacity: 1, y: 0 }}
          transition={getMotionProps(0.1, 0)}
          className="space-y-8"
        >
          <h2 className="section-title text-center">Interactive Dashboard</h2>
          
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <EVStatsCard
              title="Total Energy Consumption"
              value="2.22M kWh"
              description="Energy dispensed across 259,410 EV charging sessions analyzed"
              icon={FaBolt}
            />
            <EVStatsCard
              title="Average Charging Duration"
              value="149 min"
              description="Typical session length based on station data"
              icon={FaClock}
            />
            <EVStatsCard
              title="Daily Charging Activity"
              value="12"
              description="Average number of sessions per day across all stations"
              icon={FaPlug}
            />
            <EVStatsCard
              title="Annual Usage Growth"
              value="70%"
              description="Average year-over-year growth in charging activity"
              icon={FaChartLine}
            />
          </div>

          {/* Interactive Map */}
          <div className="card p-6">
            <h3 className="text-xl font-semibold text-secondary-900 dark:text-white mb-4">
              Explore Daily EV Charging Patterns by Station
            </h3>
            <div className="w-full max-w-5xl mx-auto overflow-x-auto">
              <EVChargingMap className="w-full min-w-[900px] h-[60vw] max-h-[400px] md:h-[700px] md:max-h-[700px] rounded-lg" popupResponsive={true} />
              <div className="text-xs text-secondary-500 mt-2 md:hidden">Scroll horizontally to view full popup content if needed.</div>
            </div>
          </div>
        </motion.section>

        {/* Published Research */}
        <motion.section
          initial={false}
          animate={{ opacity: 1, y: 0 }}
          transition={getMotionProps(0.1, 0)}
        >
          <h2 className="section-title text-center">Published Research</h2>
          <div className="grid grid-cols-1 gap-6">
            {papers.map((paper, idx) => (
              <div key={idx} className={cn(
                "card p-6",
                "hover:scale-[1.01] transition-all duration-300"
              )}>
                <h3 className="font-display font-semibold text-lg mb-2 text-secondary-900 dark:text-white">
                  {paper.title}
                </h3>
                <p className="text-secondary-600 dark:text-secondary-400 mb-2">{paper.journal}</p>
                <p className="text-secondary-600 dark:text-secondary-400 mb-4">{paper.description}</p>
                <a
                  href={`https://doi.org/${paper.doi}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300"
                >
                  <FaExternalLinkAlt className="mr-1" />
                  DOI: {paper.doi}
                </a>
              </div>
            ))}
          </div>
        </motion.section>

        {/* Key Findings */}
        <motion.section
          initial={false}
          animate={{ opacity: 1, y: 0 }}
          transition={getMotionProps(0.1, 0)}
        >
          <h2 className="section-title text-center">Project Highlights</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {keyFindings.map((finding, idx) => (
              <div key={idx} className={cn(
                "card p-6",
                "hover:scale-[1.01] transition-all duration-300"
              )}>
                <h3 className="font-display font-semibold text-lg mb-4 text-secondary-900 dark:text-white">
                  {finding.category}
                </h3>
                <ul className="list-disc list-inside space-y-2">
                  {finding.points.map((point, pointIdx) => (
                    <li key={pointIdx} className="text-secondary-600 dark:text-secondary-400 text-sm">{point}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </motion.section>

        {/* Methodology */}
        <motion.section
          initial={false}
          animate={{ opacity: 1, y: 0 }}
          transition={getMotionProps(0.1, 0)}
          className="card p-6"
        >
          <h2 className="section-title text-center">Project Methodology</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-display font-semibold text-lg mb-3 text-secondary-900 dark:text-white">
                Stage 1: Data Preparation
              </h3>
              <ul className="list-disc list-inside space-y-2 text-secondary-600 dark:text-secondary-400 text-sm">
                <li>Data acquisition from EV charging station records</li>
                <li>Data cleaning and handling missing values</li>
                <li>Feature engineering and temporal data processing</li>
                <li>Spatial data preprocessing and validation</li>
              </ul>
            </div>
            <div>
              <h3 className="font-display font-semibold text-lg mb-3 text-secondary-900 dark:text-white">
                Stage 2: Exploratory Data Analysis
              </h3>
              <ul className="list-disc list-inside space-y-2 text-secondary-600 dark:text-secondary-400 text-sm">
                <li>Station-level and user-level statistical analysis</li>
                <li>Origin-destination mapping and spatial distribution analysis</li>
                <li>Long-term trend identification and seasonal decomposition</li>
                <li>Temporal and behavioral charging pattern analysis</li>
              </ul>
            </div>
            <div>
              <h3 className="font-display font-semibold text-lg mb-3 text-secondary-900 dark:text-white">
                Stage 3: Policy Impact Analysis
              </h3>
              <ul className="list-disc list-inside space-y-2 text-secondary-600 dark:text-secondary-400 text-sm">
                <li>Pre–post policy impact comparison</li>
                <li>Feature engineering from land use, socio-economic, and station behavior data</li>
                <li>Regression modeling with Random Forest & XGBoost</li>
                <li>Model interpretation using SHAP & ALE</li>
              </ul>
            </div>
            <div>
              <h3 className="font-display font-semibold text-lg mb-3 text-secondary-900 dark:text-white">
                Stage 4: Multi-output Deep Learning Model
              </h3>
              <ul className="list-disc list-inside space-y-2 text-secondary-600 dark:text-secondary-400 text-sm">
                <li>Minute-level time-series preprocessing from EV charge events</li>
                <li>Feature engineering with temporal & statistical attributes</li>
                <li>Forecasting via LSTM, GRU, Informer, and proposed Multi-output models</li>
                <li>Hyperparameter tuning and multi-metric evaluation</li>
              </ul>
            </div>
          </div>
        </motion.section>

        {/* Technologies Used */}
        <motion.section
          initial={false}
          animate={{ opacity: 1, y: 0 }}
          transition={getMotionProps(0.1, 0)}
          className="text-center"
        >
          <h2 className="section-title">Technologies Used</h2>
          <div className="flex flex-wrap justify-center gap-4">
          <h3 className="w-full text-lg font-display font-medium text-secondary-900 dark:text-white mb-2">
            Core Technologies
          </h3>
          <img src="https://img.shields.io/badge/Python-3.x-3776AB?logo=python&logoColor=white" alt="Python" className="dark:opacity-90" loading="lazy" />
          <img src="https://img.shields.io/badge/Jupyter-Notebook-F37626?logo=jupyter&logoColor=white" alt="Jupyter Notebook" className="dark:opacity-90" loading="lazy" />
          <img src="https://img.shields.io/badge/Pandas-Data_Processing-150458?logo=pandas&logoColor=white" alt="Pandas" className="dark:opacity-90" loading="lazy" />
          <img src="https://img.shields.io/badge/NumPy-Scientific_Computing-013243?logo=numpy&logoColor=white" alt="NumPy" className="dark:opacity-90" loading="lazy" />

          <h3 className="w-full text-lg font-display font-medium text-secondary-900 dark:text-white mt-4 mb-2">
            Data Visualization
          </h3>
          <img src="https://img.shields.io/badge/Matplotlib-Plotting-11557C?logo=matplotlib&logoColor=white" alt="Matplotlib" className="dark:opacity-90" loading="lazy" />
          <img src="https://img.shields.io/badge/Plotly-Interactive_Visualization-3F4F75?logo=plotly&logoColor=white" alt="Plotly" className="dark:opacity-90" loading="lazy" />
          <img src="https://img.shields.io/badge/Seaborn-Statistical_Charts-4EABD5?logo=seaborn&logoColor=white" alt="Seaborn" className="dark:opacity-90" loading="lazy" />
          <img src="https://img.shields.io/badge/Folium-Interactive_Maps-77B829?logo=leaflet&logoColor=white" alt="Folium" className="dark:opacity-90" loading="lazy" />
          <img src="https://img.shields.io/badge/Kepler.gl-Geospatial_Viz-00B4FF?logo=kepler.gl&logoColor=white" alt="Kepler.gl" className="dark:opacity-90" loading="lazy" />

          <h3 className="w-full text-lg font-display font-medium text-secondary-900 dark:text-white mt-4 mb-2">
            Model Building and Interpretation
          </h3>
          <img src="https://img.shields.io/badge/Scikit--learn-Machine_Learning-F7931E?logo=scikitlearn&logoColor=white" alt="Scikit-learn" className="dark:opacity-90" loading="lazy" />
          <img src="https://img.shields.io/badge/PyTorch-Deep_Learning-EE4C2C?logo=pytorch&logoColor=white" alt="PyTorch" className="dark:opacity-90" loading="lazy" />
          <img src="https://img.shields.io/badge/Informer-Transformer_Model-CC2927" alt="Informer" className="dark:opacity-90" loading="lazy" />
          <img src="https://img.shields.io/badge/XGBoost-Gradient_Boosting-003153?logo=xgboost&logoColor=white" alt="XGBoost" className="dark:opacity-90" loading="lazy" />
          <img src="https://img.shields.io/badge/Prophet-Time_Series_Model-00A4EF?logo=facebook&logoColor=white" alt="Prophet" className="dark:opacity-90" loading="lazy" />
          <img src="https://img.shields.io/badge/Optuna-Hyperparameter_Tuning-2F6792?logo=optuna&logoColor=white" alt="Optuna" className="dark:opacity-90" loading="lazy" />
          <img src="https://img.shields.io/badge/SHAP-Explainability-FF6F61?logo=shap&logoColor=white" alt="SHAP" className="dark:opacity-90" loading="lazy" />
          <img src="https://img.shields.io/badge/ALE-Partial_Effect-5A9BD4" alt="ALE Plot" className="dark:opacity-90" loading="lazy" />
            </div>
        </motion.section>

      </div>
    </div>
  );
};

export default EVProject; 