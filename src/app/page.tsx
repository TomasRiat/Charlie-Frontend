"use client";

import React, { useState, useEffect } from 'react';
import { Music, Heart, Zap, Globe, Menu, X, Check, Star, MessageCircle, CreditCard } from 'lucide-react';
import { useSession, signIn, signOut } from "next-auth/react";

// --- TIPO DE USUARIO ---
interface DiscordUser {
  id: string;
  username?: string;
  email?: string;
}

// --- COMPONENTE BOTÓN DE COMPRA (MERCADO PAGO) ---
function BuyButton({ user, text }: { user: DiscordUser | null; text: string }) {
  const [loading, setLoading] = useState<boolean>(false);

  const handleBuy = async () => {
    // AQUÍ DEBES INTEGRAR TU LÓGICA DE LOGIN REAL
    if (!user || !user.id) {
      alert("⚠️ Por favor inicia sesión con Discord arriba a la derecha para poder procesar tu pago.");
      return;
    }
    
    setLoading(true);
    try {
      const response = await fetch('/api/create_preference', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ discordUserId: user.id }), 
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Error en el servidor');
      }

      if (data.init_point) {
        window.location.href = data.init_point;
      }
    } catch (error) {
      console.error(error);
      alert("Error al generar el pago. Intenta nuevamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <button 
      onClick={handleBuy} 
      disabled={loading} 
      className="flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-cyan-500 hover:bg-cyan-700 text-white font-bold hover:shadow-lg hover:shadow-blue-500/25 transition-all hover:scale-105 disabled:opacity-70 disabled:cursor-not-allowed"
    >
      {loading ? "Procesando..." : text}
    </button>
  );
}

// --- DICCIONARIO DE TRADUCCIONES ---
const CONTENT = {
  es: {
    nav: { features: "Características", premium: "Premium", discord: "Discord" },
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
        { title: "Sonido Cristalino", desc: "Disfruta de tus canciones favoritas sin lag.", icon: <Music className="w-6 h-6 text-cyan-400" /> },
        { title: "Cuida a Charlie", desc: "Aliméntalo para mantener su energía y sube en el ranking.", icon: <Heart className="w-6 h-6 text-amber-300" /> },
        { title: "Modo Fiesta 24/7", desc: "Charlie se queda en el canal incluso si te desconectas.", icon: <Zap className="w-6 h-6 text-amber-500" /> }
      ]
    },
    pricing: {
      title: "Planes Simples",
      methods: { mp: "🇦🇷 Argentina (MP)", patreon: "🌎 Internacional (Patreon)" },
      free: { title: "Gratis", price: "$0", features: ["Música ilimitada", "Calidad Estándar", "Sistema de Mascota"] },
      vip: { 
        title: "Charlie VIP", 
        price_ars: "$3500 ARS", 
        price_usd: "$3 USD",
        period: "/mes", 
        features: ["Modo 24/7", "Control de Volumen", "Cola Ilimitada", "Recarga Energía x6", "Insignia Dorada"],
        cta_mp: "Pagar con Mercado Pago",
        cta_patreon: "Suscribirse en Patreon",
        note_mp: "Pago seguro vía Mercado Pago (Sin suscripción automática)",
        note_patreon: "Suscripción gestionada por Patreon (Renovación auto)"
      }
    },
    footer: { rights: "Todos los derechos reservados." }
  },
  en: {
    nav: { features: "Features", premium: "Premium", discord: "Discord" },
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
        { title: "Crystal Clear Sound", desc: "Enjoy your favorite tunes with zero lag.", icon: <Music className="w-6 h-6 text-cyan-300" /> },
        { title: "Care for Charlie", desc: "Feed him to keep his energy up and climb the ranking.", icon: <Heart className="w-6 h-6 text-orange-400" /> },
        { title: "24/7 Party Mode", desc: "Charlie stays in the channel even if you disconnect.", icon: <Zap className="w-6 h-6 text-yellow-400" /> }
      ]
    },
    pricing: {
      title: "Simple Pricing",
      methods: { mp: "🇦🇷 Argentina (MP)", patreon: "🌎 Global (Patreon)" },
      free: { title: "Free", price: "$0", features: ["Unlimited Music", "Standard Quality", "Pet System"] },
      vip: { 
        title: "Charlie VIP", 
        price_ars: "$3500 ARS", 
        price_usd: "$3 USD",
        period: "/mo", 
        features: ["24/7 Mode", "Volume Control", "Unlimited Queue", "6x Energy Recharge", "Gold Badge"],
        cta_mp: "Pay with Mercado Pago",
        cta_patreon: "Subscribe on Patreon",
        note_mp: "Secure payment via Mercado Pago (No auto-renewal)",
        note_patreon: "Subscription managed by Patreon (Auto-renewal)"
      }
    },
    footer: { rights: "All rights reserved." }
  }
};

export default function LandingPage() {
  const [lang, setLang] = useState<'es' | 'en'>('es');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  // ESTADO PARA ALTERNAR MÉTODO DE PAGO
  const [paymentMethod, setPaymentMethod] = useState<'mp' | 'patreon'>('mp');

  const { data: session } = useSession();
  
  // Adaptamos el usuario de sesión a nuestra interfaz
  const user = session?.user ? {
    id: (session.user as any).id,
    username: session.user.name || "Usuario",
    email: session.user.email || ""
  } : null;

  const t = CONTENT[lang];
  const INVITE_URL = "https://discord.com/oauth2/authorize?client_id=1441879572952907847&permissions=8&integration_type=0&scope=bot+applications.commands"; 
  const PATREON_URL = "https://patreon.com/DJCharlie903"; 
  const SUPPORT_URL = "https://discord.gg/C3455Qrh";
  return (
    <div className="min-h-screen bg-slate-950 text-white font-sans selection:bg-orange-500/30 overflow-x-hidden scroll-smooth">
      
      {/* NAVBAR */}
      <nav className="fixed container z-50 bg-slate-950/80 backdrop-blur-md border-b border-white/5">
        <div className="w-full mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-22">
            <div className="flex items-center gap-3">
              <div className="relative w-16 h-16 rounded-full bg-cyan-300 overflow-hidden border-2 border-white/20 shadow-lg shadow-cyan-500/20">
                <img src="/logo sin fondo.png" alt="Charlie Bot Logo" className="w-full h-full object-contain" />
              </div>
              <span className="font-bold text-xl tracking-tight text-white">Charlie<span className="text-amber-300">Bot</span></span>
            </div>
            
            <div className="hidden md:flex items-center space-x-6">
              <a href="#features" className="text-gray-300 hover:text-amber-300 transition-colors text-sm font-medium scroll-smooth">{t.nav.features}</a>
              <a href="#pricing" className="text-gray-300 hover:text-cyan-300 transition-colors text-sm font-medium scroll-smooth">{t.nav.premium}</a>
              
              <a href={SUPPORT_URL} target="_blank" className="flex items-center gap-2 bg-indigo-600/20 hover:bg-indigo-600/40 text-indigo-300 px-4 py-1.5 rounded-full text-xs font-bold transition-all border border-indigo-500/30 hover:scale-105">
                <MessageCircle className="w-3 h-3" />
                {t.nav.discord}
              </a>


              {user && (
                 <span className="text-xs text-cyan-400 border border-cyan-700/30 px-2 py-1 rounded-full">Hola, {user.username}</span>
              )}

              {/* Botón de Login REAL */}
              {!user ? (
                <button 
                  onClick={() => signIn('discord')} 
                  className="text-sm font-medium border border-white/20 px-3 py-1 rounded-md hover:bg-white/10 transition-colors"
                >
                  Login
                </button>
              ) : (
                <div className="flex items-center gap-2">
                  <button 
                    onClick={() => signOut()} 
                    className="text-xs text-amber-300 hover:text-amber-300"
                  >
                    (Salir)
                  </button>
                </div>
              )}
              
              

              <button onClick={() => setLang(lang === 'es' ? 'en' : 'es')} className="flex items-center gap-1 bg-white/5 hover:bg-white/10 px-3 py-1.5 rounded-full text-xs font-medium transition-colors border border-white/10 ml-2 hover:border-orange-400/50">
                <Globe className="w-3 h-3 text-cyan-400" />
                {lang === 'es' ? 'ES' : 'EN'}
              </button>
            </div>

            <div className="md:hidden flex items-center">
              <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="text-gray-300 hover:text-white p-2">
                {mobileMenuOpen ? <X /> : <Menu />}
              </button>
            </div>
          </div>
        </div>

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
            <a href={INVITE_URL} target="_blank" className="w-full sm:w-auto px-8 py-4 bg-amber-300 hover:bg-amber-500 text-white rounded-xl font-bold text-lg shadow-lg shadow-orange-500/20 transition-all hover:-translate-y-1 hover:scale-105">
              {t.hero.cta_add}
            </a>
            <a href="#pricing" className="w-full sm:w-auto px-8 py-4 bg-cyan-300 hover:bg-cyan-600 text-white rounded-xl font-bold text-lg shadow-lg shadow-cyan-500/20 transition-all hover:-translate-y-1 hover:scale-105 scroll-smooth">
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

      {/* PRICING SECTION - AQUÍ ESTÁ LA LÓGICA IMPORTANTE */}
      <section id="pricing" className="py-16 relative">
        <div className="max-w-7xl mx-auto px-4 relative z-10">
          <h2 className="text-3xl font-bold text-center mb-8 text-white">{t.pricing.title}</h2>
          
          {/* SELECTOR DE REGIÓN / MÉTODO DE PAGO */}
          <div className="flex justify-center mb-10">
            <div className="bg-slate-900 p-1 rounded-xl border border-white/10 flex">
              <button 
                onClick={() => setPaymentMethod('mp')}
                className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${paymentMethod === 'mp' ? 'bg-cyan-500 text-white shadow-lg' : 'text-gray-400 hover:text-white'}`}
              >
                {t.pricing.methods.mp}
              </button>
              <button 
                onClick={() => setPaymentMethod('patreon')}
                className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${paymentMethod === 'patreon' ? 'bg-amber-300 text-white shadow-lg' : 'text-gray-400 hover:text-white'}`}
              >
                {t.pricing.methods.patreon}
              </button>
            </div>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Free Plan */}
            <div className="p-8 rounded-3xl bg-slate-900 border border-white/10 flex flex-col">
              <h3 className="text-2xl font-bold mb-2 text-gray-300">{t.pricing.free.title}</h3>
              <div className="text-4xl font-bold mb-6 text-white">{t.pricing.free.price}</div>
              <ul className="space-y-4 mb-8 flex-1">
                {t.pricing.free.features.map((item, i) => (
                  <li key={i} className="flex items-center gap-3 text-gray-400"><Check className="w-5 h-5 text-gray-600" /> {item}</li>
                ))}
              </ul>
              <a href={INVITE_URL} target="_blank" className="block text-center w-full py-3 mb-6 rounded-xl bg-white/5 border border-white/10 font-bold hover:bg-white/10 transition-colors text-white">
                {t.hero.cta_add}
              </a>
            </div>

            {/* Premium Plan DYNAMIC */}
            <div className="relative p-8 rounded-3xl bg-slate-900 border border-cyan-500/50 shadow-2xl shadow-cyan-500/10 flex flex-col transition-all">
              <div className="absolute top-0 right-0 bg-cyan-300 text-gray-700 text-xs font-bold px-4 py-1.5 rounded-bl-xl rounded-tr-xl shadow-md">
                RECOMENDADO
              </div>
              <h3 className="text-2xl font-bold mb-2 text-cyan-300 flex items-center gap-2">
                 {t.pricing.vip.title} <Star className="w-5 h-5 fill-current" />
              </h3>
              
              {/* PRECIO DINÁMICO SEGÚN SELECCIÓN */}
              <div className="text-4xl font-bold mb-6 text-white">
                {paymentMethod === 'mp' ? t.pricing.vip.price_ars : t.pricing.vip.price_usd} 
                <span className="text-lg text-gray-500 font-normal">{t.pricing.vip.period}</span>
              </div>

              <ul className="space-y-4 mb-8 flex-1">
                {t.pricing.vip.features.map((item, i) => (
                  <li key={i} className="flex items-center gap-3 text-gray-300"><Check className="w-5 h-5 text-cyan-300" /> {item}</li>
                ))}
              </ul>
              
              {/* BOTÓN DINÁMICO */}
              {paymentMethod === 'mp' ? (
                <BuyButton user={user} text={t.pricing.vip.cta_mp} />
              ) : (
                <a href={PATREON_URL} target="_blank" className="flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-amber-300 hover:bg-amber-600 text-white font-bold transition-all hover:scale-105 shadow-lg shadow-orange-500/20">
                  <Heart className="w-4 h-4 fill-white" /> {t.pricing.vip.cta_patreon}
                </a>
              )}
              
              <p className="text-xs text-center text-gray-500 mt-3">
                {paymentMethod === 'mp' ? t.pricing.vip.note_mp : t.pricing.vip.note_patreon}
              </p>
            </div>
          </div>
        </div>
      </section>

      <footer className="py-8 border-t border-white/5 bg-black/40 text-center text-gray-600 text-sm">
        <p>© 2025 Charlie Music Bot. {t.footer.rights}</p>
      </footer>
    </div>
  );
}