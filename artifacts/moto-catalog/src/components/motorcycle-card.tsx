import React, { useRef, useState } from "react";
import { useLocation } from "wouter";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { SiWhatsapp } from "react-icons/si";
import { Gauge, Zap, ArrowRight } from "lucide-react";
import type { Motorcycle } from "@/data/motorcycles";

interface Props {
  motorcycle: Motorcycle;
}

export function MotorcycleCard({ motorcycle }: Props) {
  const [, setLocation] = useLocation();
  const ref = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springConfig = { damping: 22, stiffness: 110, mass: 1 };
  const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [10, -10]), springConfig);
  const rotateY = useSpring(useTransform(x, [-0.5, 0.5], [-10, 10]), springConfig);

  function handleMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    x.set((e.clientX - rect.left) / rect.width - 0.5);
    y.set((e.clientY - rect.top) / rect.height - 0.5);
  }

  function handleMouseLeave() {
    x.set(0);
    y.set(0);
    setIsHovered(false);
  }

  const wppText = encodeURIComponent(
    `Olá! Tenho interesse na moto *${motorcycle.name}* (${motorcycle.specs.cilindrada}). Gostaria de mais informações sobre preços, financiamento e consórcio.`
  );
  const wppLink = `https://wa.me/556199918978?text=${wppText}`;

  const consortiumText = encodeURIComponent(
    `Olá! Gostaria de informações sobre os *Planos de Consórcio* para a *${motorcycle.name}* (${motorcycle.specs.cilindrada}).`
  );
  const consortiumLink = `https://wa.me/556199918978?text=${consortiumText}`;

  const financingText = encodeURIComponent(
    `Olá! Gostaria de informações sobre o *Financiamento* da *${motorcycle.name}* (${motorcycle.specs.cilindrada}).`
  );
  const financingLink = `https://wa.me/556199918978?text=${financingText}`;

  function goToDetail(e: React.MouseEvent) {
    // Don't navigate if clicking a link/button inside the card
    if ((e.target as HTMLElement).closest("a, button")) return;
    setLocation(`/moto/${motorcycle.slug}`);
  }

  return (
    <div
      style={{ perspective: "900px" }}
      data-testid={`card-motorcycle-${motorcycle.id}`}
    >
      <motion.div
        ref={ref}
        className="relative w-full rounded-2xl bg-gradient-to-b from-[#1c1c1c] to-[#0e0e0e] border border-white/8 flex flex-col overflow-hidden shadow-2xl cursor-pointer group"
        style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={handleMouseLeave}
        onClick={goToDetail}
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-40px" }}
        transition={{ duration: 0.4 }}
      >
        {/* Red glow on hover */}
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-primary/20 rounded-full blur-[70px] opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

        {/* Badges */}
        <div className="absolute top-3 left-3 z-10 flex gap-2">
          <span className="px-2.5 py-1 text-[10px] font-bold tracking-widest uppercase bg-black/60 border border-white/10 rounded-full text-white/50 backdrop-blur-md">
            {motorcycle.subcategory}
          </span>
          {motorcycle.badge && (
            <span className="px-2.5 py-1 text-[10px] font-bold tracking-widest uppercase bg-primary/80 rounded-full text-white backdrop-blur-md">
              {motorcycle.badge}
            </span>
          )}
        </div>

        {/* Motorcycle image */}
        <div className="relative w-full flex items-center justify-center pt-10 px-4 pb-2" style={{ height: "200px" }}>
          <motion.img
            src={motorcycle.image}
            alt={motorcycle.name}
            className="w-full h-full object-contain drop-shadow-[0_15px_25px_rgba(0,0,0,0.9)] pointer-events-none"
            loading="lazy"
            animate={{ y: isHovered ? -10 : 0, scale: isHovered ? 1.05 : 1 }}
            transition={{ type: "spring", ...springConfig }}
            style={{ transformStyle: "preserve-3d", transform: "translateZ(50px)" }}
          />
        </div>

        {/* Content */}
        <div className="flex flex-col gap-3 px-4 pb-4 pt-1">
          {/* Name */}
          <h3 className="text-lg font-black text-white tracking-tight text-center leading-tight">
            {motorcycle.name}
          </h3>

          {/* Quick specs */}
          <div className="flex items-center justify-center gap-4 text-xs text-white/40">
            <span className="flex items-center gap-1">
              <Gauge className="w-3 h-3 text-primary/60" />
              {motorcycle.specs.cilindrada}
            </span>
            <span className="w-px h-3 bg-white/10" />
            <span className="flex items-center gap-1">
              <Zap className="w-3 h-3 text-primary/60" />
              {motorcycle.specs.potencia.split(" @")[0]}
            </span>
          </div>

          {/* Ver detalhes hint */}
          <div className="flex items-center justify-center gap-1 text-[11px] text-white/25 group-hover:text-white/50 transition-colors font-semibold">
            <span>Ver detalhes e experiência 360°</span>
            <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
          </div>

          {/* Divider */}
          <div className="w-full h-px bg-white/8" />

          {/* CTAs */}
          <div className="flex flex-col gap-2">
            <a
              href={wppLink}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-2.5 px-4 bg-primary hover:bg-primary/85 text-white rounded-xl font-bold flex items-center justify-center gap-2 transition-all text-sm shadow-[0_4px_15px_rgba(204,0,0,0.25)]"
              onClick={(e) => e.stopPropagation()}
              data-testid={`btn-wpp-${motorcycle.id}`}
            >
              <SiWhatsapp className="w-4 h-4 text-[#25D366]" />
              Falar com Especialista
            </a>
            <div className="grid grid-cols-2 gap-2">
              <a
                href={consortiumLink}
                target="_blank"
                rel="noopener noreferrer"
                className="py-2 px-2 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 text-white/70 hover:text-white rounded-xl font-semibold text-[11px] text-center transition-all"
                onClick={(e) => e.stopPropagation()}
                data-testid={`btn-consortium-${motorcycle.id}`}
              >
                Consórcio
              </a>
              <a
                href={financingLink}
                target="_blank"
                rel="noopener noreferrer"
                className="py-2 px-2 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 text-white/70 hover:text-white rounded-xl font-semibold text-[11px] text-center transition-all"
                onClick={(e) => e.stopPropagation()}
                data-testid={`btn-financing-${motorcycle.id}`}
              >
                Financiamento
              </a>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
