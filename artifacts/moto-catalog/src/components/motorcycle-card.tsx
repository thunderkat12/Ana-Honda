import React, { useRef } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { SiWhatsapp } from 'react-icons/si';

interface Motorcycle {
  id: number;
  name: string;
  category: string;
  image: string;
}

interface Props {
  motorcycle: Motorcycle;
}

export function MotorcycleCard({ motorcycle }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  
  // Mouse position values
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  
  // Smooth springs for the rotation
  const springConfig = { damping: 20, stiffness: 100, mass: 1 };
  const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [15, -15]), springConfig);
  const rotateY = useSpring(useTransform(x, [-0.5, 0.5], [-15, 15]), springConfig);
  
  // Hover state for lifting the image
  const [isHovered, setIsHovered] = React.useState(false);

  function handleMouseMove(event: React.MouseEvent<HTMLDivElement>) {
    if (!ref.current) return;
    
    const rect = ref.current.getBoundingClientRect();
    
    // Calculate normalized mouse position (-0.5 to 0.5)
    const mouseX = (event.clientX - rect.left) / rect.width - 0.5;
    const mouseY = (event.clientY - rect.top) / rect.height - 0.5;
    
    x.set(mouseX);
    y.set(mouseY);
  }

  function handleMouseLeave() {
    x.set(0);
    y.set(0);
    setIsHovered(false);
  }

  const wppText = encodeURIComponent(`Olá! Tenho interesse na moto ${motorcycle.name}. Gostaria de mais informações sobre preços, financiamento e consórcio.`);
  const wppLink = `https://wa.me/556199918978?text=${wppText}`;

  return (
    <div 
      className="perspective-1000 w-full h-full"
      data-testid={`card-motorcycle-${motorcycle.id}`}
    >
      <motion.div
        ref={ref}
        className="relative w-full h-full rounded-2xl bg-gradient-to-b from-card/80 to-background border border-card-border p-6 flex flex-col items-center justify-between overflow-hidden shadow-2xl transform-style-3d cursor-pointer group"
        style={{
          rotateX,
          rotateY,
        }}
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={handleMouseLeave}
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-50px" }}
        transition={{ duration: 0.5 }}
      >
        {/* Ambient glow behind the bike */}
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-primary/20 rounded-full blur-[60px] opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        
        {/* Category Badge */}
        <div 
          className="absolute top-4 left-4 px-3 py-1 text-xs font-bold tracking-wider uppercase bg-black/50 border border-white/10 rounded-full text-muted-foreground backdrop-blur-md z-10 transform-style-3d"
          style={{ transform: "translateZ(30px)" }}
        >
          {motorcycle.category}
        </div>

        {/* Motorcycle Image Container */}
        <motion.div 
          className="w-full h-48 sm:h-56 mt-4 mb-6 flex items-center justify-center transform-style-3d z-10"
          animate={{ 
            translateZ: isHovered ? 80 : 0,
            y: isHovered ? -10 : 0,
            scale: isHovered ? 1.05 : 1
          }}
          transition={{ type: "spring", ...springConfig }}
        >
          <img 
            src={motorcycle.image} 
            alt={motorcycle.name}
            className="w-full h-full object-contain drop-shadow-[0_20px_20px_rgba(0,0,0,0.8)]"
            loading="lazy"
          />
        </motion.div>

        {/* Content */}
        <div 
          className="w-full flex flex-col gap-4 transform-style-3d z-10"
          style={{ transform: "translateZ(40px)" }}
        >
          <h3 className="text-2xl font-black text-foreground tracking-tight text-center">
            {motorcycle.name}
          </h3>
          
          <div className="flex flex-col gap-2 w-full mt-2">
            <a 
              href={wppLink}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-3 px-4 bg-primary hover:bg-primary/90 text-white rounded-lg font-bold flex items-center justify-center gap-2 transition-colors duration-200"
              onClick={(e) => e.stopPropagation()}
              data-testid={`btn-wpp-${motorcycle.id}`}
            >
              <SiWhatsapp className="w-5 h-5" />
              <span>Falar com Especialista</span>
            </a>
            <button 
              className="w-full py-3 px-4 bg-white/5 hover:bg-white/10 text-white border border-white/10 rounded-lg font-bold transition-colors duration-200"
              data-testid={`btn-details-${motorcycle.id}`}
            >
              Detalhes
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
