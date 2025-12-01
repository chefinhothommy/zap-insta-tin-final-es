"use client"

import { useState, useEffect } from "react"
import Script from "next/script"
import { Zap, AlertTriangle, Flame, Lock, Camera, MapPin, EyeOff, Clock } from "lucide-react"

// --- DATOS ESTÁTICOS DE LOS MATCHES (CENSURADOS) ---
// Traducidos al español
const blockedMatchesData = [
    { id: 1, distance: "2 km", lastSeen: "En línea", bio: "Mitad soñadora, mitad realista. ¿Listo para crear recuerdos? 🍷", status: "Chat Activo" },
    { id: 2, distance: "5 km", lastSeen: "Hace 12m", bio: "Hablo con sarcasmo y citas de películas. Busquemos la mejor pizza.", status: "Me gusta reciente" },
    { id: 3, distance: "1.5 km", lastSeen: "Hace 1h", bio: "Busco a alguien con quien compartir aventuras. ✈️📷", status: "Match" },
    { id: 4, distance: "8 km", lastSeen: "Hace 3h", bio: "Entusiasta del fitness. Salgamos a correr o a relajarnos.", status: "Perfil Visto" },
];

export default function Downsell2Page() {
  const [timeLeft, setTimeLeft] = useState(4 * 60 + 59); // Comienza en 5 minutos
  
  // Temporizador Regresivo
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prevTime) => (prevTime > 0 ? prevTime - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, "0")}:${remainingSeconds.toString().padStart(2, "0")}`;
  }

  // Inicializar Widget Hotmart
  useEffect(() => {
    if (typeof (window as any).checkoutElements !== "undefined") {
      try { 
        (window as any).checkoutElements.init("salesFunnel").mount("#hotmart-sales-funnel"); 
      } catch (e) { 
        console.error("Failed to mount Hotmart widget:", e); 
      }
    }
  }, []);

  return (
    <>
      <Script src="https://checkout.hotmart.com/lib/hotmart-checkout-elements.js" strategy="afterInteractive" />

      {/* Franja de Aviso Superior */}
      <div className="fixed top-0 w-full z-50 bg-red-600 text-white p-3 text-center shadow-lg">
        <p className="text-sm md:text-base font-bold animate-pulse">
          ⚠️ ¡ESPERA! TENEMOS UN 50% DE DESCUENTO PARA TI
        </p>
      </div>

      <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4 pt-20">
        <main className="w-full max-w-md mx-auto space-y-5">

          {/* Encabezado de la Oferta */}
          <div className="text-center space-y-2 mb-6">
            <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900 leading-tight">
              ¡No pierdas la evidencia!
            </h1>
            <p className="text-gray-600 text-sm md:text-base">
              El escaneo ya está hecho. No queremos eliminar este reporte.
              <br />
              <span className="font-bold text-green-600">Desbloquea todo a mitad de precio.</span>
            </p>
          </div>

          {/* Tarjeta de Alerta Principal */}
          <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-red-100">
            <div className="bg-red-600 text-white p-4 flex items-center gap-3">
               <Zap className="fill-yellow-400 text-yellow-400" size={24} />
               <div>
                 <h2 className="font-bold text-sm uppercase">Investigación Completa</h2>
                 <p className="text-xs text-red-100 opacity-90">Actividad de Tinder Detectada</p>
               </div>
            </div>
            
            <div className="p-4 bg-red-50 border-b border-red-100">
                <div className="flex items-start gap-3">
                    <AlertTriangle className="text-red-600 shrink-0" size={20} />
                    <p className="text-sm text-red-800 font-medium">
                        Encontramos conversaciones activas y matches. Ya que te vas, te ofrecemos una última oportunidad para ver estos datos.
                    </p>
                </div>
            </div>
            
            {/* Grid de Estadísticas */}
            <div className="grid grid-cols-4 divide-x divide-gray-100 bg-white p-4">
                <div className="text-center">
                    <p className="text-xl font-bold text-red-600">6</p>
                    <p className="text-[10px] text-gray-400 font-bold uppercase">Matches</p>
                </div>
                <div className="text-center">
                    <p className="text-xl font-bold text-orange-500">30</p>
                    <p className="text-[10px] text-gray-400 font-bold uppercase">Likes</p>
                </div>
                <div className="text-center">
                    <p className="text-xl font-bold text-purple-600">4</p>
                    <p className="text-[10px] text-gray-400 font-bold uppercase">Chats</p>
                </div>
                <div className="text-center">
                    <p className="text-xl font-bold text-gray-800">Ahora</p>
                    <p className="text-[10px] text-gray-400 font-bold uppercase">Activo</p>
                </div>
            </div>
          </div>

          {/* Lista de Matches Bloqueados */}
          <div className="bg-slate-900 rounded-xl shadow-2xl overflow-hidden">
            <div className="p-4 border-b border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <Flame className="text-pink-500 fill-pink-500" size={20} />
                    <h3 className="text-white font-bold">Matches Encontrados</h3>
                </div>
                <span className="bg-pink-600 text-white text-xs px-2 py-0.5 rounded font-bold">EN VIVO</span>
            </div>

            <div className="p-4 space-y-3">
                {blockedMatchesData.map((match) => (
                    <div key={match.id} className="bg-slate-800/80 p-3 rounded-lg flex items-center gap-3 border border-slate-700 relative overflow-hidden group">
                        
                        {/* Avatar Bloqueado */}
                        <div className="relative w-12 h-12 shrink-0">
                            <div className="w-full h-full rounded-full bg-slate-600 flex items-center justify-center">
                                <Lock size={16} className="text-slate-400" />
                            </div>
                            <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-slate-800 rounded-full"></div>
                        </div>

                        {/* Infos del Match */}
                        <div className="flex-grow min-w-0">
                            <div className="flex items-center gap-2 mb-0.5">
                                <span className="bg-slate-700 text-slate-300 text-[10px] px-1.5 rounded font-mono">USUARIO OCULTO 🔒</span>
                                <span className="text-xs text-green-400 font-semibold flex items-center gap-1">
                                   <Clock size={10} /> {match.lastSeen}
                                </span>
                            </div>
                            {/* Bio visible para prueba social */}
                            <p className="text-xs text-slate-300 italic truncate pr-2">"{match.bio}"</p>
                            <div className="flex items-center gap-2 mt-1">
                                <div className="flex items-center gap-1 text-[10px] text-slate-400">
                                    <MapPin size={10} /> a {match.distance}
                                </div>
                            </div>
                        </div>

                        {/* Overlay de Bloqueo */}
                        <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>
                    </div>
                ))}
                
                <div className="text-center pt-2">
                    <p className="text-xs text-slate-500">+ 12 otros perfiles ocultos</p>
                </div>
            </div>
          </div>

          {/* Fotos Censuradas (Grid Simple) */}
          <div className="bg-white rounded-xl shadow-lg p-5 border border-gray-200">
             <div className="flex items-center gap-2 mb-4">
                <Camera className="text-gray-700" size={20} />
                <h3 className="font-bold text-gray-800">Galería Privada</h3>
             </div>
             
             <div className="grid grid-cols-2 gap-2">
                {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="aspect-square bg-gray-900 rounded-lg relative overflow-hidden">
                        {/* Imagen Fake Borrosa vía CSS */}
                        <div className="absolute inset-0 bg-gradient-to-br from-gray-700 to-gray-800 filter blur-xl opacity-50"></div>
                        
                        <div className="absolute inset-0 flex flex-col items-center justify-center text-white/80 z-10">
                            <EyeOff size={24} className="mb-1" />
                            <span className="text-[10px] font-bold tracking-widest border border-white/30 px-2 py-1 rounded">CENSURADO</span>
                        </div>
                    </div>
                ))}
             </div>
          </div>

          {/* Sección de Pago / Desbloqueo */}
          <div className="bg-white p-5 rounded-xl shadow-2xl text-center border-2 border-green-500 relative overflow-hidden">
            <div className="absolute top-0 right-0 bg-green-500 text-white text-xs font-bold px-3 py-1 rounded-bl-lg">
                50% DESC. APLICADO
            </div>

            <div className="mx-auto w-14 h-14 rounded-full bg-green-100 flex items-center justify-center mb-3">
              <Lock className="text-green-600" size={24} />
            </div>
            
            <h2 className="text-xl font-bold text-gray-900 uppercase">Desbloquear Reporte Completo</h2>
            <p className="text-sm text-gray-500 mt-1 mb-4">
              Revela nombres, fotos e historial de chat completo.
            </p>

            <div className="bg-red-50 border border-red-100 rounded-lg p-3 mb-4">
              <div className="flex items-center justify-center gap-2 text-red-700 mb-1">
                 <Clock size={16} />
                 <span className="text-xs font-bold uppercase">La oferta expira en:</span>
              </div>
              <p className="text-3xl font-mono font-bold text-red-600">{formatTime(timeLeft)}</p>
            </div>

            {/* Contenedor de Hotmart */}
            <div id="hotmart-sales-funnel" className="w-full min-h-[100px] bg-gray-50 rounded border border-dashed border-gray-300 flex items-center justify-center">
                {/* El widget se montará aquí */}
            </div>
            
            <p className="text-[10px] text-gray-400 mt-4">
                Pago Seguro SSL • Facturación Anónima
            </p>
          </div>

        </main>
      </div>
    </>
  )
}
