"use client";

import React, { useState, useEffect } from 'react';
import { Music, Heart, Zap, Globe, Menu, X, Check, Star, MessageCircle, Trophy, Medal, ChevronLeft, ChevronRight } from 'lucide-react';

// --- DICCIONARIO DE TRADUCCIONES ---
const CONTENT = {
  es: {
    nav: {
      features: "Características",
      premium: "Premium",
      discord: "Unirse al Discord"
    },
    hero: {
      badge: "🎉 ¡Versión 2.0 ya disponible!",
      title_start: "Tu compañero musical",
      title_highlight: "Charlie Bot",
      title_end: "para Discord",
      subtitle: "Escucha música en alta calidad mientras cuidas de Charlie. Un bot con personalidad, sistema de mascota y sonido Hi-Fi.",
      cta_add: "Añadir a Discord",
      cta_premium: "Obtener Premium"
    },
    features: {
      title: "¿Qué hace especial a Charlie?",
      cards: [
        {
          title: "Sonido Cristalino",
          desc: "Disfruta de tus canciones favoritas sin lag. Soporte estable para música 24/7.",
          icon: <Music className="w-6 h-6 text-cyan-400" />
        },
        {
          title: "Cuida a Charlie",
          desc: "Charlie no es solo un bot. Aliméntalo para mantener su energía y sube en el ranking global.",
          icon: <Heart className="w-6 h-6 text-amber-300" />
        },
        {
          title: "Modo Fiesta 24/7",
          desc: "Charlie se queda en el canal poniendo música ambiental incluso si te desconectas.",
          icon: <Zap className="w-6 h-6 text-amber-500" />
        }
      ]
    },
    ranking: {
      title: "Salón de la Fama",
      subtitle: "Los usuarios que más han cuidado a Charlie.",
      feeds: "Comidas",
      loading: "Cargando ranking...",
      empty: "Aún no hay datos. ¡Sé el primero!"
    },
    pagination: {
      previous: "Anterior",
      next: "Siguiente",
      page: "Página"
    },
    pricing: {
      title: "Planes Simples",
      free: {
        title: "Gratis",
        price: "$0",
        features: ["Música ilimitada", "Calidad Estándar", "Sistema de Mascota", "Soporte Básico"]
      },
      vip: {
        title: "Charlie VIP",
        price: "$3",
        period: "/mes",
        features: ["Modo 24/7", "Control de Volumen", "Cola Ilimitada", "Recarga de Energía x6", "Insignia Dorada"],
        cta: "Ser VIP en Patreon"
      }
    },
    footer: {
      rights: "Todos los derechos reservados."
    }
  },
  en: {
    nav: {
      features: "Features",
      premium: "Premium",
      discord: "Join Discord"
    },
    hero: {
      badge: "🎉 Version 2.0 is live!",
      title_start: "Your music companion",
      title_highlight: "Charlie Bot",
      title_end: "for Discord",
      subtitle: "Listen to high-quality music while taking care of Charlie. A bot with personality, pet system, and Hi-Fi sound.",
      cta_add: "Add to Discord",
      cta_premium: "Get Premium"
    },
    features: {
      title: "What makes Charlie special?",
      cards: [
        {
          title: "Crystal Clear Sound",
          desc: "Enjoy your favorite tunes with zero lag. Stable support for 24/7 music.",
          icon: <Music className="w-6 h-6 text-cyan-300" />
        },
        {
          title: "Care for Charlie",
          desc: "Charlie is not just a bot. Feed him to keep his energy up and climb the global ranking.",
          icon: <Heart className="w-6 h-6 text-orange-400" />
        },
        {
          title: "24/7 Party Mode",
          desc: "Charlie stays in the channel playing background music even if you disconnect.",
          icon: <Zap className="w-6 h-6 text-yellow-400" />
        }
      ]
    },
    ranking: {
      title: "Hall of Fame",
      subtitle: "Users who have taken the best care of Charlie.",
      feeds: "Feeds",
      loading: "Loading leaderboard...",
      empty: "No data yet. Be the first!"
    },
    pagination: {
      previous: "Previous",
      next: "Next",
      page: "Page"
    },
    pricing: {
      title: "Simple Pricing",
      free: {
        title: "Free",
        price: "$0",
        features: ["Unlimited Music", "Standard Quality", "Pet System", "Basic Support"]
      },
      vip: {
        title: "Charlie VIP",
        price: "$3",
        period: "/mo",
        features: ["24/7 Mode", "Volume Control", "Unlimited Queue", "6x Energy Recharge", "Gold Badge"],
        cta: "Become a Patron"
      }
    },
    footer: {
      rights: "All rights reserved."
    }
  }
};

// --- TUS RANGOS DEFINIDOS (Colores y Traducción) ---
// Las claves (ej: "👑 Dios del Atún") deben coincidir EXACTAMENTE con lo que guardas en la DB.
const RANK_STYLES: Record<string, { es: string, en: string, style: string }> = {
  
  "👑 Dios del Atún": { 
    es: "👑 Dios del Atún",     
    en: "👑 God of Tuna",      
    style: "bg-yellow-500/20 text-yellow-300 border-yellow-500 shadow-[0_0_15px_rgba(234,179,8,0.4)]" 
  },
  
  "🍣 Sushi Master": { 
    es: "🍣 Sushi Master",      
    en: "🍣 Sushi Master",    
    style: "bg-rose-500/20 text-rose-300 border-rose-500" 
  },
  
  "👨‍🍳 Chef Ejecutivo": { 
    es: "👨‍🍳 Chef Ejecutivo",   
    en: "👨‍🍳 Executive Chef",   
    style: "bg-slate-200/20 text-white border-slate-300" 
  },
  
  "🐟 Pescadero Leal": { 
    es: "🐟 Pescadero Leal",    
    en: "🐟 Loyal Fishmonger", 
    style: "bg-cyan-600/30 text-cyan-200 border-cyan-500" 
  },
  
  "🥫 Abrelatas": { 
    es: "🥫 Abrelatas",         
    en: "🥫 Can Opener",       
    style: "bg-orange-800/40 text-orange-200 border-orange-700" 
  },
  
  "👻 Fantasma": { 
    es: "👻 Fantasma",          
    en: "👻 Ghost",            
    style: "bg-white/5 text-gray-500 border-white/10 italic" 
  },

  // Fallback por si aparece alguno nuevo
  "default": { 
    es: "Novato", 
    en: "Rookie", 
    style: "bg-white/5 text-gray-400 border-white/10" 
  }
};

interface RankingUser {
  position: number;
  username: string;
  feeds: number;
  rank: string;
  avatarUrl?: string | null;
}

export default function LandingPage() {
  const [lang, setLang] = useState<'es' | 'en'>('es');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [rankingData, setRankingData] = useState<RankingUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(1);
  
  
  const t = CONTENT[lang];

  const INVITE_URL = "https://discord.com/oauth2/authorize?client_id=1441879572952907847&permissions=8&integration_type=0&scope=bot+applications.commands"; 
  const PATREON_URL = "https://patreon.com/DJCharlie903?utm_medium=unknown&utm_source=join_link&utm_campaign=creatorshare_creator&utm_content=copyLink"; 
  const SUPPORT_URL = "https://discord.gg/C3455Qrh"; 

  useEffect(() => {
    async function fetchRanking() {
      setIsLoading(true);
      try {
        const res = await fetch(`/api/ranking?page=${page}`);
        if (res.ok) {
          const data = await res.json();
          setRankingData(data);
        }
      } catch (error) {
        console.error("Error cargando ranking", error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchRanking();
  }, [page]);

  // Función para obtener el estilo y texto del rango
  const getRankInfo = (dbRankName: string) => {
    // Intentamos buscar exacto, si no, usamos default
    const info = RANK_STYLES[dbRankName] || RANK_STYLES["default"];
    return {
      label: lang === 'es' ? info.es : info.en,
      className: info.style
    };
  };

  return (
    // Se añade overflow-x-hidden y scroll-smooth
    <div className="min-h-screen bg-slate-950 text-white font-sans selection:bg-orange-500/30 overflow-x-hidden scroll-smooth">
      
      {/* NAVBAR */}
      <nav className="fixed container z-50 bg-slate-950/80 backdrop-blur-md border-b border-white/5">
        <div className="w-full mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-22">
            {/* Logo Area */}
            <div className="flex items-center gap-3">
              {/* Logo Circular simulando los colores del gato (Naranja y Cian) */}
              <div className="relative w-16 h-16 rounded-full bg-cyan-300 overflow-hidden border-2 border-white/20 shadow-lg shadow-cyan-500/20">
                <img 
                  src="/logo sin fondo.png" 
                  alt="Charlie Bot Logo" 
                  className="w-full h-full object-contain" 
                />
              </div>
              <span className="font-bold text-xl tracking-tight text-white">Charlie<span className="text-amber-300">Bot</span></span>
            </div>
            
            {/* Desktop Menu */}
            <div className="hidden md:flex items-center space-x-6">
              {/* Enlaces con scroll suave */}
              <a href="#features" className="text-gray-300 hover:text-amber-300 transition-colors text-sm font-medium scroll-smooth">{t.nav.features}</a>
              <a href="#pricing" className="text-gray-300 hover:text-cyan-300 transition-colors text-sm font-medium scroll-smooth">{t.nav.premium}</a>
              
              {/* Botón Unirse al Discord */}
              <a 
                href={SUPPORT_URL} 
                target="_blank" 
                className="flex items-center gap-2 bg-indigo-600/20 hover:bg-indigo-600/40 text-indigo-300 px-4 py-1.5 rounded-full text-xs font-bold transition-all border border-indigo-500/30 hover:scale-105"
              >
                <MessageCircle className="w-3 h-3" />
                {t.nav.discord}
              </a>

              {/* Language Switcher */}
              <button 
                onClick={() => setLang(lang === 'es' ? 'en' : 'es')}
                className="flex items-center gap-1 bg-white/5 hover:bg-white/10 px-3 py-1.5 rounded-full text-xs font-medium transition-colors border border-white/10 ml-2 hover:border-orange-400/50"
              >
                <Globe className="w-3 h-3 text-cyan-400" />
                {lang === 'es' ? 'ES' : 'EN'}
              </button>
            </div>

            {/* Mobile Button */}
            <div className="md:hidden flex items-center">
              <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="text-gray-300 hover:text-white p-2">
                {mobileMenuOpen ? <X /> : <Menu />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu Dropdown */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-slate-950 border-b border-white/5 absolute w-full left-0 top-22 shadow-xl z-50">
            <div className="px-4 pt-2 pb-4 space-y-2">
              <a href="#features" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-2 rounded-md hover:bg-white/5 text-gray-300 hover:text-orange-400 scroll-smooth">{t.nav.features}</a>
              <a href="#pricing" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-2 rounded-md hover:bg-white/5 text-gray-300 hover:text-cyan-400 scroll-smooth">{t.nav.premium}</a>
              <a href={SUPPORT_URL} target="_blank" className="block px-3 py-2 rounded-md bg-indigo-600/10 text-indigo-300 font-bold border border-indigo-500/20">
                 <MessageCircle className="w-4 h-4 inline-block mr-2"/> {t.nav.discord}
              </a>
              <button onClick={() => { setLang(lang === 'es' ? 'en' : 'es'); setMobileMenuOpen(false); }} className="w-full text-left px-3 py-2 text-cyan-400 font-bold border-t border-white/5 mt-2 pt-4">
                {lang === 'es' ? '🇺🇸' : '🇪🇸'}
              </button>
            </div>
          </div>
        )}
      </nav>

      {/* HERO SECTION */}
      <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 px-4 overflow-hidden">
        {/* Background Gradients (Colores actualizados: Naranja y Cian) */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full z-0 pointer-events-none opacity-40">
          <div className="absolute top-10 left-1/4 w-96 h-96 bg-amber-300/30 rounded-full blur-[120px]" />
          <div className="absolute bottom-20 right-1/4 w-80 h-80 bg-cyan-300/20 rounded-full blur-[100px]" />
        </div>

        <div className="relative z-10 max-w-5xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-300/10 border border-cyan-300/20 text-cyan-300 text-sm font-medium mb-8 animate-fade-in shadow-[0_0_15px_rgba(34,211,238,0.3)]">
            <Star className="w-3 h-3 fill-current" /> {t.hero.badge}
          </div>
          
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-8 text-white leading-tight">
            {t.hero.title_start} <br className="hidden md:block"/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 to-cyan-300 drop-shadow-sm">
              {t.hero.title_highlight}
            </span> 
            {" " + t.hero.title_end}
          </h1>
          
          <p className="max-w-2xl mx-auto text-lg md:text-xl text-gray-400 mb-10 leading-relaxed">
            {t.hero.subtitle}
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full sm:w-auto">
            {/* Botón Naranja Principal */}
            <a 
              href={INVITE_URL}
              target="_blank"
              className="w-full sm:w-auto px-8 py-4 bg-amber-300 hover:bg-amber-500 text-white rounded-xl font-bold text-lg shadow-lg shadow-orange-500/20 transition-all hover:-translate-y-1 hover:scale-105"
            >
              {t.hero.cta_add}
            </a>
            {/* Botón Cian Secundario */}
            <a 
              href="#pricing"
              className="w-full sm:w-auto px-8 py-4 bg-cyan-300 hover:bg-cyan-600 text-white rounded-xl font-bold text-lg shadow-lg shadow-cyan-500/20 transition-all hover:-translate-y-1 hover:scale-105 scroll-smooth"
            >
              {t.hero.cta_premium}
            </a>
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section id="features" className="py-24 bg-slate-900/50 border-y border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-16 text-white">{t.features.title}</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {t.features.cards.map((f, i) => (
              <div key={i} className="p-8 rounded-2xl bg-slate-950 border border-white/10 hover:border-amber-300/50 transition-all group hover:-translate-y-1 shadow-lg shadow-black/20 hover:shadow-amber-300/10">
                <div className="w-14 h-14 bg-slate-900 rounded-xl flex items-center justify-center mb-6 group-hover:bg-white/5 transition-colors">
                  {f.icon}
                </div>
                <h3 className="text-xl font-bold mb-3 text-white">{f.title}</h3>
                <p className="text-gray-400 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PRICING */}
      <section id="pricing" className="py-24 relative overflow-hidden">
        {/* Glow Cian */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-cyan-300/10 rounded-full blur-[100px] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <h2 className="text-3xl font-bold text-center mb-16 text-white">{t.pricing.title}</h2>
          
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Free Plan */}
            <div className="p-8 rounded-3xl bg-slate-900 border border-white/10 flex flex-col hover:border-white/20 transition-colors">
              <h3 className="text-2xl font-bold mb-2 text-gray-300">{t.pricing.free.title}</h3>
              <div className="text-4xl font-bold mb-6 text-white">{t.pricing.free.price}</div>
              <ul className="space-y-4 mb-8 flex-1">
                {t.pricing.free.features.map((item, i) => (
                  <li key={i} className="flex items-center gap-3 text-gray-400">
                    <Check className="w-5 h-5 text-gray-600" /> {item}
                  </li>
                ))}
              </ul>
              <a href={INVITE_URL} target="_blank" className="block text-center w-full py-3 rounded-xl bg-white/5 border border-white/10 font-bold hover:bg-white/10 transition-colors text-white hover:scale-105">
                {t.hero.cta_add}
              </a>
            </div>

            {/* Premium Plan (Colores: Gradiente Cian) */}
            <div className="relative p-8 rounded-3xl bg-slate-900 border border-cyan-500/50 shadow-2xl shadow-cyan-500/10 flex flex-col hover:-translate-y-1 transition-transform">
              <div className="absolute top-0 right-0 bg-cyan-300 text-gray-700 text-xs font-bold px-4 py-1.5 rounded-bl-xl rounded-tr-xl shadow-md">
                RECOMENDADO
              </div>
              <h3 className="text-2xl font-bold mb-2 text-cyan-300 flex items-center gap-2">
                 {t.pricing.vip.title} <Star className="w-5 h-5 fill-current" />
              </h3>
              <div className="text-4xl font-bold mb-6 text-white">
                {t.pricing.vip.price} <span className="text-lg text-gray-500 font-normal">{t.pricing.vip.period}</span>
              </div>
              <ul className="space-y-4 mb-8 flex-1">
                {t.pricing.vip.features.map((item, i) => (
                  <li key={i} className="flex items-center gap-3 text-gray-300">
                    <Check className="w-5 h-5 text-cyan-300" /> {item}
                  </li>
                ))}
              </ul>
              <a href={PATREON_URL} target="_blank" className="block text-center w-full py-3 rounded-xl bg-gradient-to-r from-cyan-300 to-blue-300 font-bold hover:shadow-lg hover:shadow-cyan-500/25 transition-all text-gray-700 hover:scale-105">
                {t.pricing.vip.cta}
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="py-8 border-t border-white/5 bg-black/40">
        <div className="max-w-7xl mx-auto px-4 text-center text-gray-600 text-sm">
          <p>© 2025 Charlie Music Bot. {t.footer.rights}</p>
        </div>
      </footer>
    </div>
  );
}