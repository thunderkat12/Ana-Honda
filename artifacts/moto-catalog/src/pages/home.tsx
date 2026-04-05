import React, { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { motorcycles } from "@/data/motorcycles";
import { MotorcycleCard } from "@/components/motorcycle-card";
import { SiWhatsapp } from "react-icons/si";
import { Search, X } from "lucide-react";

const CATEGORIES = ["Todos", "Street", "Adventure", "Off-Road", "Big Trail"];
const profilePhoto = `${import.meta.env.BASE_URL}ana-honda.jpg`;
const whatsappNumber = "556191897810";

export default function Home() {
  const [activeCategory, setActiveCategory] = useState("Todos");
  const [searchQuery, setSearchQuery] = useState("");

  const filtered = useMemo(() => {
    let result = activeCategory === "Todos"
      ? motorcycles
      : motorcycles.filter((m) => m.category === activeCategory);

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (m) =>
          m.name.toLowerCase().includes(q) ||
          m.subcategory.toLowerCase().includes(q) ||
          m.specs.cilindrada.toLowerCase().includes(q)
      );
    }

    return result;
  }, [activeCategory, searchQuery]);

  return (
    <div className="min-h-screen w-full bg-background text-foreground overflow-x-hidden selection:bg-primary/30">

      {/* ── HEADER ────────────────────────────────────────────────────── */}
      <header className="relative w-full py-20 px-6 md:px-12 flex flex-col items-center justify-center text-center overflow-hidden">
        <div className="absolute inset-0 z-0 pointer-events-none">
          <div className="absolute inset-0 bg-gradient-to-b from-black via-background/80 to-background" />
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-3xl h-64 bg-primary/20 blur-[120px] rounded-full opacity-60" />
        </div>

        <div className="relative z-10 flex flex-col items-center gap-5 max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col items-center gap-3"
          >
            <div className="relative">
              <div className="w-24 h-24 rounded-full border-[3px] border-primary shadow-[0_0_30px_rgba(204,0,0,0.5)] overflow-hidden bg-[#1a1a1a]">
                <img
                  src={profilePhoto}
                  alt="Foto de perfil da Ana Honda"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            {/* Name */}
            <span className="text-xl font-black tracking-widest text-white/90" style={{ fontStyle: "italic" }}>
              Anaa_Honda
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-5xl md:text-7xl font-black uppercase tracking-tighter text-white drop-shadow-2xl leading-none"
          >
            Catálogo <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-red-400">Oficial</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-base md:text-lg text-white/50 max-w-xl font-medium"
          >
            Encontre sua Honda ideal. {motorcycles.length} modelos com especificações completas.
          </motion.p>
        </div>
      </header>

      <main className="w-full max-w-7xl mx-auto px-4 sm:px-6 pb-32">

        {/* ── SEARCH ────────────────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.25 }}
          className="relative max-w-lg mx-auto mb-8"
        >
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30 pointer-events-none" />
          <input
            type="search"
            placeholder="Buscar moto por nome, tipo ou cilindrada..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white/5 border border-white/10 focus:border-primary/50 focus:bg-white/8 rounded-2xl pl-11 pr-11 py-3.5 text-sm text-white placeholder:text-white/30 outline-none transition-all duration-200"
            data-testid="input-search"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/70 transition-colors"
              data-testid="btn-clear-search"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </motion.div>

        {/* ── CATEGORY FILTERS ──────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="flex flex-wrap items-center justify-center gap-2 md:gap-3 mb-12"
        >
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`relative px-5 py-2.5 rounded-full text-sm font-bold uppercase tracking-wider transition-colors duration-300 ${
                activeCategory === cat
                  ? "text-white"
                  : "text-white/40 hover:text-white/80 hover:bg-white/5"
              }`}
              data-testid={`filter-${cat}`}
            >
              {activeCategory === cat && (
                <motion.div
                  layoutId="activeFilter"
                  className="absolute inset-0 bg-primary rounded-full -z-10 shadow-[0_0_20px_rgba(204,0,0,0.35)]"
                  transition={{ type: "spring", bounce: 0.2, duration: 0.5 }}
                />
              )}
              {cat}
            </button>
          ))}
        </motion.div>

        {/* ── RESULTS COUNT ─────────────────────────────────────────────── */}
        <div className="mb-6 text-center">
          <p className="text-xs text-white/30 font-semibold tracking-widest uppercase">
            {filtered.length} {filtered.length === 1 ? "modelo encontrado" : "modelos encontrados"}
          </p>
        </div>

        {/* ── GRID ──────────────────────────────────────────────────────── */}
        <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          <AnimatePresence mode="popLayout">
            {filtered.map((motorcycle) => (
              <motion.div
                key={motorcycle.id}
                layout
                initial={{ opacity: 0, scale: 0.92 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.92 }}
                transition={{ duration: 0.35 }}
              >
                <MotorcycleCard motorcycle={motorcycle} />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {/* ── EMPTY STATE ───────────────────────────────────────────────── */}
        {filtered.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="w-full py-24 flex flex-col items-center justify-center gap-4 text-white/30"
          >
            <Search className="w-12 h-12 opacity-30" />
            <p className="text-xl font-bold">Nenhuma moto encontrada.</p>
            <p className="text-sm">Tente outro nome ou categoria.</p>
            <button
              onClick={() => { setSearchQuery(""); setActiveCategory("Todos"); }}
              className="mt-2 px-5 py-2 bg-white/8 border border-white/10 rounded-xl text-white/60 hover:text-white text-sm font-semibold transition-colors"
            >
              Limpar filtros
            </button>
          </motion.div>
        )}
      </main>

      {/* Floating WhatsApp */}
      <a
        href={`https://wa.me/${whatsappNumber}?text=Olá! Gostaria de mais informações sobre o catálogo Honda.`}
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-8 right-8 z-50 bg-[#25D366] hover:bg-[#20bd5a] text-white p-4 rounded-full shadow-[0_10px_30px_rgba(37,211,102,0.4)] hover:shadow-[0_10px_40px_rgba(37,211,102,0.6)] transition-all duration-300 hover:scale-110 flex items-center justify-center group"
        data-testid="btn-floating-wpp"
      >
        <SiWhatsapp className="w-7 h-7" />
        <span className="absolute right-full mr-4 bg-black/80 text-white px-4 py-2 rounded-lg text-sm font-bold whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none backdrop-blur-sm border border-white/10">
          Fale conosco!
        </span>
      </a>
    </div>
  );
}
