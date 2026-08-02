import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FaMapMarkedAlt, FaSpinner, FaImage, FaGithub } from 'react-icons/fa';
import { cn } from '../utils/cn';
import ImageModal from '../components/ImageModal';

const maps = [
    {
        title: "Mapping Bike Accessibility in Amsterdam",
        description: "Visualized Amsterdam's bike rental reach using isochrones, highlighting walkable access zones within 5, 10, and 15 minutes. A clear view of urban mobility.",
        image: "/images/maps/amsterdam-bike-accessibility.jpeg",
        tags: ["Python", "OpenStreetMap", "OSMnx"]
      },
  {
    title: "3D Population Density of New Zealand (2023)",
    description: "Rendered high-resolution population density using H3 hexagons in QGIS and Blender to reveal New Zealand's urban-rural distribution patterns.",
    image: "/images/maps/nz-population-density.jpeg",
    tags: ["Python", "Blender", "QGIS", "H3"]
  },
  {
    title: "Tehran's Urban Heat Island Visualization",
    description: "Mapped Tehran's Urban Heat Island effect using LandSat8 data and QGIS, highlighting temperature variations across the city's landscape.",
    image: "/images/maps/tehran-uhi.jpeg",
    tags: ["LandSat8", "QGIS"]
  },
  {
    title: "How Far Can you bike in Amsterdam for 15 minutes, after visiting Van Gogh Museum?",
    description: "Visualized Amsterdam's bike network to show areas reachable within 15 minutes from Van Gogh Museum, highlighting urban mobility and accessibility.",
    image: "/images/maps/van-gogh.jpeg",
    tags: ["Python", "OpenStreetMap", "OSMnx"]
  },
  {
    title: "Chicago Crime Hotspots Mapped with Hexagons",
    description: "Analyzed and visualized Chicago's crime density using H3 hexagons, revealing spatial patterns from 2001 to present with a clear heatmap.",
    image: "/images/maps/chicago-crime-patterns.jpeg",
    tags: ["Python", "Folium", "H3"]
  },
  {
    title: "POI Heatmap Around Tajrish Square, Tehran",
    description: "Created a heatmap of Points of Interest around Tajrish Square using OSM data, Google Satellite imagery, and QGIS for urban insight.",
    image: "/images/maps/tajrish.jpeg",
    tags: ["Python", "OpenStreetMap", "OSMnx", "QGIS"]
  },
  {
    title: "Auckland Urban Rail Accessibility: 15-Minute Walk Zones",
    description: "Mapped 15-minute walking accessibility around Auckland's 41 rail stations, highlighting connectivity and sustainable urban mobility.",
    image: "/images/maps/auckland-rail.jpeg",
    tags: ["Python", "OpenStreetMap", "OSMnx"]
  },
  {
    title: "Taxi Trip Flow to Downtown Chicago",
    description: "Visualized 2023 taxi trip flows from Chicago's 77 community areas to downtown, revealing commuting patterns using Kepler and pandas.",
    image: "/images/maps/chicago-taxi.jpeg",
    tags: ["Python", "Pandas", "Kepler"]
  },
  {
    title: "Cost of Living Index Across North American Cities",
    description: "3D visualized cost of living and rent indices in major North American cities, highlighting affordability variations with Kepler heatmaps.",
    image: "/images/maps/cost-of-living.jpeg",
    tags: ["Python", "GeoPandas", "Kepler"]
  },
  {
    title: "Manhattan Street Network Analysis",
    description: "Mapped Manhattan's street connectivity and centrality using OSMnx, highlighting key thoroughfares with a focus on urban network hierarchy.",
    image: "/images/maps/manhattan-street-network.jpeg",
    tags: ["Python", "OpenStreetMap", "OSMnx", "NetworkX"]
  },
  {
    title: "Berkeley Street Network Betweenness Analysis",
    description: "Minimalist visualization of Berkeley's street network betweenness centrality, revealing key routes shaping urban connectivity with OSMnx and NetworkX.",
    image: "/images/maps/berkeley-street-network.jpeg",
    tags: ["Python", "OpenStreetMap", "OSMnx", "NetworkX"]
  },
  {
    title: "Berkeley Nodes Betweenness Weighted by Travel Time",
    description: "Analyzed Berkeley's street nodes betweenness centrality weighted by travel time, highlighting critical intersections using OSMnx and NetworkX.",
    image: "/images/maps/berkeley-nodes-betweenness.jpeg",
    tags: ["Python", "OpenStreetMap", "OSMnx", "NetworkX"]
  },
  {
    title: "Urbanization Heatmap of African Cities",
    description: "Visualized population density of African urban centers (10,000+ inhabitants) using Folium, highlighting rapid urban growth across the continent.",
    image: "/images/maps/africa-urbanization.jpeg",
    tags: ["Python", "Folium", "GeoPandas"]
  },
  {
    title: "Street Network Orientation of Australian Cities",
    description: "Visualized street network orientation of Australian cities using OSMnx, revealing dominant cardinal directions and their impact on urban structure.",
    image: "/images/maps/australia-street-network.jpeg",
    tags: ["Python", "OpenStreetMap", "OSMnx", "Blender"]
  },
  {
    title: "Antarctic Surface Lithology and Elevation",
    description: "3D visualization of Antarctica's surface lithology and elevation using GeoMAP data and DEM in Blender and QGIS.",
    image: "/images/maps/antarctica-surface.jpeg",
    tags: ["Python", "Blender", "QGIS"]
  }
];

const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
const getMotionProps = (baseDuration = 0.8, baseDelay = 0.1) => {
  return { duration: 0.1, delay: 0 };
};

const DataVizProject: React.FC = () => {
  const [loadedImages, setLoadedImages] = useState<{ [key: string]: boolean }>({});
  const [imageErrors, setImageErrors] = useState<{ [key: string]: boolean }>({});
  const [selectedImage, setSelectedImage] = useState<{ url: string; title: string } | null>(null);

  const handleImageLoad = (imagePath: string) => {
    setLoadedImages(prev => ({ ...prev, [imagePath]: true }));
  };

  const handleImageError = (imagePath: string) => {
    setImageErrors(prev => ({ ...prev, [imagePath]: true }));
  };

  return (
    <div className="min-h-screen bg-white dark:bg-secondary-900 pt-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-16">
        {/* Introduction */}
        <motion.section
          initial={false}
          animate={{ opacity: 1, y: 0 }}
          transition={getMotionProps()}
          className="text-center"
        >
          <h1 className="section-title">Geospatial DataViz</h1>
          <p className="text-xl text-secondary-600 dark:text-secondary-400 max-w-3xl mx-auto mb-8">
          A collection of spatial data visualizations showcasing urban analytics and mapping techniques, built with open-source tools and datasets.
          </p>
          <div className="flex justify-center items-center space-x-4 mb-8">
            <div className="flex items-center text-secondary-600 dark:text-secondary-400">
              <div className="p-2 rounded-lg bg-primary-50 dark:bg-primary-900/20">
                <FaMapMarkedAlt className="h-5 w-5 text-primary-600 dark:text-primary-400" />
              </div>
              <span className="ml-2">Geospatial Data Visualizations</span>
            </div>
            <a
              href="https://github.com/saeedmakaremi/30daymapchallenge_highlights"
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-primary inline-flex items-center"
            >
              <FaGithub className="mr-2" />
              View Project on GitHub
            </a>
          </div>
        </motion.section>

        {/* Maps Grid */}
        <motion.section
          initial={false}
          animate={{ opacity: 1, y: 0 }}
          transition={getMotionProps(0.1, 0)}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {maps.map((map, index) => (
            <motion.div
              key={map.title}
              initial={false}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.1 }}
              viewport={{ once: true }}
              className={cn(
                "card overflow-hidden group",
                "hover:scale-[1.01] transition-all duration-200"
              )}
            >
              <div 
                className="relative w-full pt-[56.25%] bg-secondary-100 dark:bg-secondary-800 cursor-pointer"
                onClick={() => setSelectedImage({ url: map.image, title: map.title })}
              >
                {!loadedImages[map.image] && !imageErrors[map.image] && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <FaSpinner className="h-8 w-8 text-primary-600 dark:text-primary-400 animate-spin" />
                  </div>
                )}
                {imageErrors[map.image] ? (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <FaImage className="h-12 w-12 text-secondary-400 dark:text-secondary-600 mx-auto mb-2" />
                      <p className="text-sm text-secondary-500 dark:text-secondary-400">Image not available</p>
                    </div>
                  </div>
                ) : (
                  <img
                    src={map.image}
                    alt={map.title}
                    className={cn(
                      "absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-300",
                      !loadedImages[map.image] && "opacity-0"
                    )}
                    onLoad={() => handleImageLoad(map.image)}
                    onError={() => handleImageError(map.image)}
                    loading="lazy"
                  />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
              </div>
              
              <div className="p-6">
                <h3 className="text-xl font-display font-semibold mb-2 text-secondary-900 dark:text-white">
                  {map.title}
                </h3>
                <p className="text-secondary-600 dark:text-secondary-400 mb-4">
                  {map.description}
                </p>
                
                <div className="flex flex-wrap gap-2">
                  {map.tags.map(tag => (
                    <span 
                      key={tag}
                      className="px-2 py-1 text-xs font-medium bg-primary-50 text-primary-700 dark:bg-primary-900/20 dark:text-primary-400 rounded-full"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
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
            <img src="https://img.shields.io/badge/Python-3.x-blue" alt="Python" className="dark:opacity-90" />
            <img src="https://img.shields.io/badge/QGIS-3.x-green" alt="QGIS" className="dark:opacity-90" />
            <img src="https://img.shields.io/badge/GeoPandas-Spatial_Data-150458" alt="GeoPandas" className="dark:opacity-90" />
            <img src="https://img.shields.io/badge/OSMnx-Network_Analysis-00B4FF" alt="OSMnx" className="dark:opacity-90" />
            <img src="https://img.shields.io/badge/NetworkX-Graph_Analysis-FFB13B" alt="NetworkX" className="dark:opacity-90" />
            <img src="https://img.shields.io/badge/Folium-Interactive_Maps-77B829" alt="Folium" className="dark:opacity-90" />
            <img src="https://img.shields.io/badge/OpenStreetMap-Data_Source-7EBC6F" alt="OpenStreetMap" className="dark:opacity-90" />
            <img src="https://img.shields.io/badge/Blender-3D_Visualization-FF6B6B" alt="Blender" className="dark:opacity-90" />
            <img src="https://img.shields.io/badge/Kepler-Interactive_3D-00B4FF" alt="Kepler" className="dark:opacity-90" />
            <img src="https://img.shields.io/badge/H3-Hexagonal_Grid-FF6B6B" alt="H3" className="dark:opacity-90" />
          </div>
        </motion.section>
      </div>

      {/* Image Modal */}
      <ImageModal
        isOpen={!!selectedImage}
        onClose={() => setSelectedImage(null)}
        imageUrl={selectedImage?.url || ""}
        title={selectedImage?.title || ""}
      />
    </div>
  );
};

export default DataVizProject; 