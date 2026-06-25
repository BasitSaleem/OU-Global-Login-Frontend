import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";

interface NotFoundProps {
  title?: string;
  description?: string;
  className?: string;
}

const NotFound: React.FC<NotFoundProps> = ({
  title = "Not Found",
  description = "The resource you are looking for does not exist or may have been removed.",
  className = "",
}) => {
  return (
    <div
      className={`flex flex-col items-center justify-center min-h-[85vh] w-full px-6 text-center bg-background ${className}`}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="flex flex-col items-center gap-6"
      >
        <div className="relative w-64 h-64 md:w-80 md:h-80 transition-transform duration-700 hover:scale-105">
          <Image
            src="/error.gif"
            alt="Not Found Illustration"
            fill
            className="object-contain drop-shadow-[0_20px_50px_rgba(0,0,0,0.1)]"
            priority
            unoptimized
          />
        </div>

        <div className="space-y-4 max-w-md">
          <h2 className="text-4xl md:text-5xl font-black tracking-tight text-foreground transition-all">
            {title}
          </h2>
          <p className="text-text/70 text-base md:text-lg leading-relaxed font-medium">
            {description}
          </p>
        </div>
      </motion.div>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[120px] -z-10"></div>
    </div>
  );
};

export default NotFound;
