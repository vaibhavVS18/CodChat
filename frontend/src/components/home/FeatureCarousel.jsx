import React from "react";
import { motion, AnimatePresence } from "framer-motion";

const features = [
  {
    title: "Team Collaboration",
    description:
      "Invite collaborators and work together in real-time on your projects.",
    image: "/feature1.png",
  },
  {
    title: "Integrated Chat",
    description:
      "Chat with your team members directly within the platform while coding.",
    image: "/feature2.png",
  },
  {
    title: "AI Assistant",
    description:
      "Write @ai before your message and get instant AI help for your queries.",
    image: "/feature3.png",
  },
];

export default function FeatureCarousel() {
  const [index, setIndex] = React.useState(0);

  React.useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % features.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="w-full aspect-video relative rounded-xl overflow-hidden bg-gray-900 border border-gray-400 shadow-lg">
      <AnimatePresence mode="wait">
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -30 }}
          transition={{ duration: 0.6 }}
          className="absolute inset-0 flex flex-col justify-end"
        >
          {/* Background image */}
          <img
            src={features[index].image}
            alt={features[index].title}
            className="absolute inset-0 w-full h-full object-cover"
          />

          {/* Responsive blur overlay at bottom */}
          <div className="absolute bottom-0 left-0 right-0 sm:h-1/3 h-1/3 bg-black/50 backdrop-blur-md flex flex-col items-center justify-center text-center p-4 sm:p-6 text-gray-100">
            <h2 className="text-lg sm:text-2xl md:text-3xl mt-2 font-bold bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
              {features[index].title}
            </h2>
            <p className="text-xs sm:text-sm md:text-lg mb-3 max-w-full sm:max-w-md leading-relaxed opacity-90">
              {features[index].description}
            </p>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
