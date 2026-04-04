import React, { useRef, useState } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { SiWhatsapp } from 'react-icons/si';
import { Zap, Weight, Fuel, Gauge, ChevronDown, ChevronUp } from 'lucide-react';
import type { Motorcycle } from '@/data/motorcycles';

interface Props {
  motorcycle: Motorcycle;
}

export function MotorcycleCard({ motorcycle }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [showSpecs, setShowSpecs] = useState(false);

  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const springConfig = { damping: 20, stiffness: 100, mass: 1 };
  const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [12, -12]), springConfig);
  const rotateY = useSpring(useTransform(x, [-0.5, 0.5], [-12, 12]), springConfig);

  function handleMouseMove(event: React.MouseEvent<HTMLDivElement>) {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    x.set((event.clientX - rect.left) / rect.width - 0.5);
    y.set((event.clientY - rect.top) / rect.height - 0.5);
  }

  function handleMouseLeave() {
    x.set(0);
    y.set(0);
    setIsHovered(false);
  }

  const wppText = encodeURIComponent(
    `Olá! Tenho interesse na moto *${motorcycle.name}*.\n\n` +
    `*Especificações:*\n` +
    `• Motor: ${motorcycle.specs.motor}\n` +
    `• Cilindrada: ${motorcycle.specs.cilindrada}\n` +
    `• Potência: ${motorcycle.specs.potencia}\n` +
    `• Torque: ${motorcycle.specs.torque}\n` +
    `• Freios: ${motorcycle.specs.freios}\n\n` +
    `Gostaria de mais informações sobre preços, financiamento e consórcio.`
  );
  const wppLink = `https://wa.me/556199918978?text=${wppText}`;

  const consortiumText = encodeURIComponent(
    `Olá! Gostaria de informações sobre os *Planos de Consórcio* para a moto *${motorcycle.name}* (${motorcycle.specs.cilindrada}).`
  );
  const consortiumLink = `https://wa.me/556199918978?text=${consortiumText}`;

  const financingText = encodeURIComponent(
    `Olá! Gostaria de informações sobre o *Financiamento* da moto *${motorcycle.name}* (${motorcycle.specs.cilindrada}). Quais são as condições disponíveis?`
  );
  const financingLink = `https://wa.me/556199918978?text=${financingText}`;

  return (
    <div
      className="w-full h-full"
      style={{ perspective: "1000px" }}
      data-testid={`card-motorcycle-${motorcycle.id}`}
    >
      <motion.div
        ref={ref}
        className="relative w-full rounded-2xl bg-gradient-to-b from-[#1a1a1a] to-[#0d0d0d] border border-white/8 flex flex-col overflow-hidden shadow-2xl cursor-pointer group"
        style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={handleMouseLeave}
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-40px" }}
        transition={{ duration: 0.5 }}
      >
        {/* Glow on hover */}
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-52 h-52 bg-primary/25 rounded-full blur-[80px] opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

        {/* Category badge */}
        <div
          className="absolute top-4 left-4 z-10 px-3 py-1 text-[10px] font-bold tracking-widest uppercase bg-black/60 border border-white/10 rounded-full text-white/60 backdrop-blur-md"
          style={{ transform: "translateZ(20px)" }}
        >
          {motorcycle.category}
        </div>

        {/* Motorcycle image */}
        <div className="relative w-full pt-10 px-4 pb-2 flex items-center justify-center" style={{ height: "220px" }}>
          <motion.img
            src={motorcycle.image}
            alt={motorcycle.name}
            className="w-full h-full object-contain drop-shadow-[0_20px_30px_rgba(0,0,0,0.9)]"
            loading="lazy"
            animate={{
              y: isHovered ? -12 : 0,
              scale: isHovered ? 1.06 : 1,
            }}
            transition={{ type: "spring", ...springConfig }}
            style={{ transformStyle: "preserve-3d", transform: "translateZ(60px)" }}
          />
        </div>

        {/* Content */}
        <div className="flex flex-col gap-3 px-5 pb-5 pt-2" style={{ transform: "translateZ(30px)", transformStyle: "preserve-3d" }}>
          {/* Model name */}
          <h3 className="text-xl font-black text-white tracking-tight leading-tight text-center">
            {motorcycle.name}
          </h3>

          {/* Quick specs strip */}
          <div className="grid grid-cols-2 gap-2 text-[11px]">
            <div className="flex items-center gap-1.5 text-white/50">
              <Gauge className="w-3.5 h-3.5 text-primary/70 shrink-0" />
              <span className="truncate">{motorcycle.specs.cilindrada}</span>
            </div>
            <div className="flex items-center gap-1.5 text-white/50">
              <Zap className="w-3.5 h-3.5 text-primary/70 shrink-0" />
              <span className="truncate">{motorcycle.specs.potencia.split(" @ ")[0]}</span>
            </div>
            <div className="flex items-center gap-1.5 text-white/50">
              <Fuel className="w-3.5 h-3.5 text-primary/70 shrink-0" />
              <span className="truncate">{motorcycle.specs.tanque}</span>
            </div>
            <div className="flex items-center gap-1.5 text-white/50">
              <Weight className="w-3.5 h-3.5 text-primary/70 shrink-0" />
              <span className="truncate">{motorcycle.specs.peso}</span>
            </div>
          </div>

          {/* Expandable full specs */}
          <button
            onClick={() => setShowSpecs(!showSpecs)}
            className="w-full flex items-center justify-center gap-1.5 text-[11px] font-semibold text-white/40 hover:text-white/70 transition-colors py-1"
            data-testid={`btn-specs-toggle-${motorcycle.id}`}
          >
            {showSpecs ? (
              <>Ver menos <ChevronUp className="w-3.5 h-3.5" /></>
            ) : (
              <>Ver especificações completas <ChevronDown className="w-3.5 h-3.5" /></>
            )}
          </button>

          {showSpecs && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="border border-white/8 rounded-xl p-3 bg-white/3 text-[11px] space-y-2"
              data-testid={`specs-panel-${motorcycle.id}`}
            >
              {[
                ["Motor", motorcycle.specs.motor],
                ["Cilindrada", motorcycle.specs.cilindrada],
                ["Potência", motorcycle.specs.potencia],
                ["Torque", motorcycle.specs.torque],
                ["Freios", motorcycle.specs.freios],
                ["Câmbio", motorcycle.specs.cambio],
                ["Peso", motorcycle.specs.peso],
                ["Tanque", motorcycle.specs.tanque],
              ].map(([label, value]) => (
                <div key={label} className="flex justify-between gap-2">
                  <span className="text-white/40 font-medium shrink-0">{label}</span>
                  <span className="text-white/75 text-right">{value}</span>
                </div>
              ))}
            </motion.div>
          )}

          {/* Divider */}
          <div className="w-full h-px bg-white/8 my-1" />

          {/* CTAs */}
          <div className="flex flex-col gap-2">
            {/* Primary: Falar com Especialista */}
            <a
              href={wppLink}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-3 px-4 bg-primary hover:bg-primary/85 text-white rounded-xl font-bold flex items-center justify-center gap-2 transition-all duration-200 shadow-[0_4px_20px_rgba(204,0,0,0.3)] hover:shadow-[0_4px_30px_rgba(204,0,0,0.5)] text-sm"
              onClick={(e) => e.stopPropagation()}
              data-testid={`btn-wpp-${motorcycle.id}`}
            >
              <SiWhatsapp className="w-4 h-4 text-[#25D366]" />
              Falar com Especialista
            </a>

            {/* Secondary row: Consórcio + Financiamento */}
            <div className="grid grid-cols-2 gap-2">
              <a
                href={consortiumLink}
                target="_blank"
                rel="noopener noreferrer"
                className="py-2.5 px-2 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 text-white/80 hover:text-white rounded-xl font-semibold text-xs text-center transition-all duration-200 flex items-center justify-center leading-tight"
                onClick={(e) => e.stopPropagation()}
                data-testid={`btn-consortium-${motorcycle.id}`}
              >
                Planos de Consórcio
              </a>
              <a
                href={financingLink}
                target="_blank"
                rel="noopener noreferrer"
                className="py-2.5 px-2 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 text-white/80 hover:text-white rounded-xl font-semibold text-xs text-center transition-all duration-200 flex items-center justify-center leading-tight"
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
