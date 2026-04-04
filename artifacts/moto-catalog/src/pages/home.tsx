import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { motorcycles } from '@/data/motorcycles';
import { MotorcycleCard } from '@/components/motorcycle-card';
import { SiWhatsapp } from 'react-icons/si';

const CATEGORIES = ["Todos", "Street", "Adventure", "Off-Road", "Big Trail"];

export default function Home() {
  const [activeCategory, setActiveCategory] = useState("Todos");

  const filteredMotorcycles = activeCategory === "Todos" 
    ? motorcycles 
    : motorcycles.filter(m => m.category === activeCategory);

  return (
    <div className="min-h-screen w-full bg-background text-foreground overflow-x-hidden selection:bg-primary/30">
      {/* Header / Hero */}
      <header className="relative w-full py-24 px-6 md:px-12 lg:px-24 flex flex-col items-center justify-center text-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-b from-black via-background/80 to-background" />
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-[300px] bg-primary/20 blur-[120px] rounded-full opacity-50" />
        </div>
        
        <div className="relative z-10 flex flex-col items-center gap-6 max-w-4xl">
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex items-center gap-4"
          >
            {/* Simple CSS Honda Logo representation */}
            <div className="w-16 h-16 flex items-center justify-center bg-primary rounded-xl shadow-[0_0_30px_rgba(204,0,0,0.5)]">
              <span className="text-4xl font-black text-white italic tracking-tighter">H</span>
            </div>
            <h2 className="text-2xl font-bold tracking-widest text-white/80 uppercase">Motors</h2>
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-5xl md:text-7xl lg:text-8xl font-black uppercase tracking-tighter text-white drop-shadow-2xl"
          >
            Catálogo <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-red-500">Honda</span>
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg md:text-xl text-muted-foreground max-w-2xl font-medium"
          >
            Acelere seus sonhos. Encontre a motocicleta perfeita para o seu estilo de vida com as melhores condições do mercado.
          </motion.p>
        </div>
      </header>

      <main className="w-full max-w-7xl mx-auto px-6 pb-32">
        {/* Filter Tabs */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="flex flex-wrap items-center justify-center gap-2 md:gap-4 mb-16"
        >
          {CATEGORIES.map((category) => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`relative px-6 py-3 rounded-full text-sm md:text-base font-bold uppercase tracking-wider transition-colors duration-300 ${
                activeCategory === category 
                  ? "text-white" 
                  : "text-muted-foreground hover:text-white hover:bg-white/5"
              }`}
              data-testid={`filter-${category}`}
            >
              {activeCategory === category && (
                <motion.div
                  layoutId="activeFilter"
                  className="absolute inset-0 bg-primary rounded-full -z-10 shadow-[0_0_20px_rgba(204,0,0,0.4)]"
                  transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                />
              )}
              {category}
            </button>
          ))}
        </motion.div>

        {/* Grid */}
        <motion.div 
          layout
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8"
        >
          <AnimatePresence mode="popLayout">
            {filteredMotorcycles.map((motorcycle) => (
              <motion.div
                key={motorcycle.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.4 }}
              >
                <MotorcycleCard motorcycle={motorcycle} />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
        
        {filteredMotorcycles.length === 0 && (
          <div className="w-full py-20 flex flex-col items-center justify-center text-muted-foreground">
            <p className="text-xl font-bold">Nenhuma motocicleta encontrada nesta categoria.</p>
          </div>
        )}
      </main>

      {/* Floating WhatsApp Button */}
      <a
        href="https://wa.me/556199918978?text=Olá! Gostaria de mais informações sobre o consórcio e financiamento Honda."
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-8 right-8 z-50 bg-[#25D366] hover:bg-[#20bd5a] text-white p-4 rounded-full shadow-[0_10px_30px_rgba(37,211,102,0.4)] hover:shadow-[0_10px_40px_rgba(37,211,102,0.6)] transition-all duration-300 hover:scale-110 flex items-center justify-center group"
        data-testid="btn-floating-wpp"
      >
        <SiWhatsapp className="w-8 h-8" />
        <span className="absolute right-full mr-4 bg-black/80 text-white px-4 py-2 rounded-lg text-sm font-bold whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none backdrop-blur-sm border border-white/10">
          Fale com a gente!
        </span>
      </a>
    </div>
  );
}
