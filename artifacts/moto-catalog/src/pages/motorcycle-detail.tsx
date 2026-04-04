import React, { useRef, useState } from "react";
import { useParams, useLocation } from "wouter";
import { motion } from "framer-motion";
import { SiWhatsapp } from "react-icons/si";
import {
  ArrowLeft,
  Gauge,
  Zap,
  Fuel,
  Weight,
  Settings,
  RotateCcw,
  Shield,
  Play,
  Pause,
  Volume2,
  VolumeX,
} from "lucide-react";
import { motorcycles } from "@/data/motorcycles";

export default function MotorcycleDetail() {
  const { slug } = useParams<{ slug: string }>();
  const [, setLocation] = useLocation();

  const motorcycle = motorcycles.find((m) => m.slug === slug);

  // Video state
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const [progress, setProgress] = useState(0);

  function togglePlay() {
    if (!videoRef.current) return;
    if (videoRef.current.paused) {
      videoRef.current.play();
      setIsPlaying(true);
    } else {
      videoRef.current.pause();
      setIsPlaying(false);
    }
  }

  function toggleMute() {
    if (!videoRef.current) return;
    videoRef.current.muted = !videoRef.current.muted;
    setIsMuted(videoRef.current.muted);
  }

  function onTimeUpdate() {
    if (!videoRef.current) return;
    const pct = (videoRef.current.currentTime / videoRef.current.duration) * 100;
    setProgress(isNaN(pct) ? 0 : pct);
  }

  function seekTo(e: React.MouseEvent<HTMLDivElement>) {
    if (!videoRef.current) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const pct = (e.clientX - rect.left) / rect.width;
    videoRef.current.currentTime = pct * videoRef.current.duration;
  }

  if (!motorcycle) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <p className="text-white/60 text-xl mb-4">Moto não encontrada.</p>
          <button
            onClick={() => setLocation("/")}
            className="px-6 py-3 bg-primary text-white rounded-xl font-bold"
          >
            Voltar ao catálogo
          </button>
        </div>
      </div>
    );
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
    `Olá! Gostaria de informações sobre os *Planos de Consórcio* para a *${motorcycle.name}* (${motorcycle.specs.cilindrada}).`
  );
  const consortiumLink = `https://wa.me/556199918978?text=${consortiumText}`;

  const financingText = encodeURIComponent(
    `Olá! Gostaria de informações sobre o *Financiamento* da *${motorcycle.name}* (${motorcycle.specs.cilindrada}). Quais são as condições disponíveis?`
  );
  const financingLink = `https://wa.me/556199918978?text=${financingText}`;

  const specItems = [
    { icon: Settings, label: "Motor", value: motorcycle.specs.motor },
    { icon: Gauge, label: "Cilindrada", value: motorcycle.specs.cilindrada },
    { icon: Zap, label: "Potência", value: motorcycle.specs.potencia },
    { icon: RotateCcw, label: "Torque", value: motorcycle.specs.torque },
    { icon: Shield, label: "Freios", value: motorcycle.specs.freios },
    { icon: Settings, label: "Câmbio", value: motorcycle.specs.cambio },
    { icon: Weight, label: "Peso", value: motorcycle.specs.peso },
    { icon: Fuel, label: "Tanque", value: motorcycle.specs.tanque },
  ];

  // Get base URL for assets served from the moto-catalog artifact
  const baseUrl = import.meta.env.BASE_URL.replace(/\/$/, "");

  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">

      {/* ── NAV ─────────────────────────────────────────────────────────── */}
      <nav className="sticky top-0 z-40 w-full flex items-center justify-between px-6 py-4 bg-background/80 backdrop-blur-xl border-b border-white/8">
        <button
          onClick={() => setLocation("/")}
          className="flex items-center gap-2 text-white/60 hover:text-white transition-colors font-semibold text-sm group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Catálogo
        </button>

        <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center shadow-[0_0_20px_rgba(204,0,0,0.4)]">
          <span className="text-lg font-black text-white italic leading-none">H</span>
        </div>

        <a
          href={wppLink}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 bg-primary hover:bg-primary/85 text-white px-4 py-2 rounded-xl text-sm font-bold transition-all shadow-[0_4px_15px_rgba(204,0,0,0.3)]"
        >
          <SiWhatsapp className="w-4 h-4 text-[#25D366]" />
          <span className="hidden sm:inline">Tenho interesse</span>
        </a>
      </nav>

      {/* ── HERO ────────────────────────────────────────────────────────── */}
      <section className="relative w-full pt-12 pb-6 px-6">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/10 via-transparent to-transparent pointer-events-none" />
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {motorcycle.badge && (
              <span className="inline-block mb-2 px-3 py-1 bg-primary text-white text-xs font-bold tracking-widest uppercase rounded-full">
                {motorcycle.badge}
              </span>
            )}
            <p className="text-sm font-semibold tracking-widest text-white/40 uppercase mb-1">
              {motorcycle.category} · {motorcycle.subcategory}
            </p>
            <h1 className="text-4xl md:text-6xl font-black text-white tracking-tight leading-none">
              {motorcycle.name}
            </h1>
          </motion.div>
        </div>
      </section>

      {/* ── VISUAL (VIDEO or STATIC IMAGE) ──────────────────────────────── */}
      <section className="w-full py-8 px-6">
        <div className="max-w-6xl mx-auto flex flex-col items-center">

          {motorcycle.video ? (
            /* ── VIDEO PLAYER ─────────────────────────────────────────── */
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="w-full max-w-3xl"
            >
              <p className="text-sm font-bold tracking-widest text-white/30 uppercase mb-4 text-center">
                Veja <span className="text-white/70">todos os ângulos</span>
              </p>

              <div className="relative rounded-2xl overflow-hidden bg-black border border-white/8 shadow-[0_30px_80px_rgba(0,0,0,0.8)] group">
                {/* Video */}
                <video
                  ref={videoRef}
                  src={`${baseUrl}${motorcycle.video}`}
                  poster={motorcycle.image}
                  autoPlay
                  loop
                  muted
                  playsInline
                  onTimeUpdate={onTimeUpdate}
                  className="w-full aspect-video object-cover"
                  data-testid="video-360"
                />

                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />

                {/* Controls */}
                <div className="absolute bottom-0 left-0 right-0 px-5 pb-5 flex flex-col gap-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  {/* Progress bar */}
                  <div
                    className="w-full h-1 bg-white/20 rounded-full cursor-pointer hover:h-1.5 transition-all"
                    onClick={seekTo}
                    data-testid="video-progress"
                  >
                    <div
                      className="h-full bg-white rounded-full transition-none pointer-events-none"
                      style={{ width: `${progress}%` }}
                    />
                  </div>

                  {/* Buttons */}
                  <div className="flex items-center gap-3">
                    <button
                      onClick={togglePlay}
                      className="flex items-center justify-center w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/15 text-white transition-colors"
                      data-testid="btn-play-pause"
                    >
                      {isPlaying
                        ? <Pause className="w-4 h-4" />
                        : <Play className="w-4 h-4 ml-0.5" />
                      }
                    </button>

                    <button
                      onClick={toggleMute}
                      className="flex items-center justify-center w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/15 text-white transition-colors"
                      data-testid="btn-mute"
                    >
                      {isMuted
                        ? <VolumeX className="w-4 h-4" />
                        : <Volume2 className="w-4 h-4" />
                      }
                    </button>

                    <div className="ml-auto flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/60 border border-white/15 backdrop-blur-md">
                      <span className="text-xs font-bold tracking-widest text-white/80">Experiência 360°</span>
                    </div>
                  </div>
                </div>

                {/* Static hint badge */}
                <div className="absolute top-4 right-4 flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/60 border border-white/10 backdrop-blur-md pointer-events-none group-hover:opacity-0 transition-opacity">
                  <span className="text-xs font-bold tracking-widest text-white/60">360°</span>
                </div>
              </div>

              <p className="text-xs text-white/25 text-center mt-3 tracking-wider">
                Passe o mouse para controlar o vídeo
              </p>
            </motion.div>

          ) : (
            /* ── STATIC IMAGE (no fake 360°) ──────────────────────────── */
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="w-full max-w-2xl"
            >
              <div className="relative flex items-center justify-center py-8">
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="w-96 h-48 bg-primary/15 rounded-full blur-[80px]" />
                </div>
                <img
                  src={motorcycle.image}
                  alt={motorcycle.name}
                  className="w-full max-h-80 object-contain drop-shadow-[0_30px_60px_rgba(0,0,0,0.9)] pointer-events-none"
                  data-testid="img-static"
                />
                <div className="absolute bottom-2 w-2/3 h-4 bg-black/60 rounded-full blur-md" />
              </div>
            </motion.div>
          )}
        </div>
      </section>

      {/* ── SPECS + CTAs ────────────────────────────────────────────────── */}
      <section className="w-full py-12 px-6">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">

          {/* Specs table */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-2xl font-black text-white tracking-tight mb-6">
              Características Técnicas
            </h2>
            <div className="rounded-2xl border border-white/8 overflow-hidden bg-[#111]">
              {specItems.map(({ icon: Icon, label, value }, i) => (
                <div
                  key={label}
                  className={`flex items-center justify-between px-5 py-4 ${
                    i < specItems.length - 1 ? "border-b border-white/6" : ""
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className="w-4 h-4 text-primary/70 shrink-0" />
                    <span className="text-sm font-semibold text-white/40">{label}</span>
                  </div>
                  <span className="text-sm font-bold text-white/85 text-right max-w-[60%]">{value}</span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="flex flex-col gap-4"
          >
            <h2 className="text-2xl font-black text-white tracking-tight mb-2">
              Quero essa moto
            </h2>
            <p className="text-white/50 text-sm leading-relaxed mb-4">
              Fale com um de nossos especialistas e descubra as melhores condições para você sair com sua Honda hoje.
            </p>

            <a
              href={wppLink}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-4 px-6 bg-primary hover:bg-primary/85 text-white rounded-2xl font-bold flex items-center justify-center gap-3 transition-all duration-200 shadow-[0_8px_30px_rgba(204,0,0,0.35)] hover:shadow-[0_8px_40px_rgba(204,0,0,0.5)] text-base"
            >
              <SiWhatsapp className="w-5 h-5 text-[#25D366]" />
              Falar com Especialista
            </a>

            <div className="grid grid-cols-2 gap-3">
              <a
                href={consortiumLink}
                target="_blank"
                rel="noopener noreferrer"
                className="py-4 px-4 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/25 text-white/80 hover:text-white rounded-2xl font-semibold text-sm text-center transition-all duration-200 flex flex-col items-center gap-1"
              >
                <span className="text-xs text-white/40 font-normal">Honda</span>
                Planos de Consórcio
              </a>
              <a
                href={financingLink}
                target="_blank"
                rel="noopener noreferrer"
                className="py-4 px-4 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/25 text-white/80 hover:text-white rounded-2xl font-semibold text-sm text-center transition-all duration-200 flex flex-col items-center gap-1"
              >
                <span className="text-xs text-white/40 font-normal">Honda</span>
                Financiamento
              </a>
            </div>

            <div className="flex flex-wrap gap-2 mt-2">
              {["Entrega rápida", "Melhores condições", "Suporte especializado", "Garantia Honda"].map((tag) => (
                <span
                  key={tag}
                  className="px-3 py-1.5 bg-white/5 border border-white/8 rounded-full text-xs font-semibold text-white/50"
                >
                  {tag}
                </span>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Back */}
      <section className="w-full py-12 px-6 text-center">
        <button
          onClick={() => setLocation("/")}
          className="inline-flex items-center gap-2 text-white/40 hover:text-white/80 transition-colors text-sm font-semibold group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Ver todos os modelos Honda
        </button>
      </section>

      {/* Floating WhatsApp */}
      <a
        href={wppLink}
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-8 right-8 z-50 bg-[#25D366] hover:bg-[#20bd5a] text-white p-4 rounded-full shadow-[0_10px_30px_rgba(37,211,102,0.4)] hover:shadow-[0_10px_40px_rgba(37,211,102,0.6)] transition-all duration-300 hover:scale-110 flex items-center justify-center group"
      >
        <SiWhatsapp className="w-7 h-7" />
        <span className="absolute right-full mr-4 bg-black/80 text-white px-4 py-2 rounded-lg text-sm font-bold whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none backdrop-blur-sm border border-white/10">
          Tenho interesse!
        </span>
      </a>
    </div>
  );
}
