import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaTimes } from "react-icons/fa";

interface ImageModalProps {
  isOpen: boolean;
  onClose: () => void;
  imageUrl: string;
  title: string;
}

const ImageModal: React.FC<ImageModalProps> = ({ isOpen, onClose, imageUrl, title }) => {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80"
        onClick={onClose}
        transition={{ duration: 0.2 }}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="relative w-full h-full max-w-4xl mx-auto"
          onClick={e => e.stopPropagation()}
          transition={{ duration: 0.2 }}
        >
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 text-white bg-black/40 hover:text-primary-400 hover:bg-black/60 transition-colors z-10 rounded-full focus:outline-none focus:ring-2 focus:ring-primary-400"
            aria-label="Close modal"
          >
            <FaTimes className="h-6 w-6" />
          </button>
          
          <div className="relative w-full h-full flex items-center justify-center">
            <div className="relative w-full h-full max-h-[80vh] flex items-center justify-center">
              <img
                src={imageUrl}
                alt={title}
                className="max-w-full max-h-[80vh] w-auto h-auto object-contain rounded-lg"
              />
              <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/60 to-transparent rounded-b-lg">
                <h3 className="text-white text-lg font-semibold">{title}</h3>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default ImageModal; 