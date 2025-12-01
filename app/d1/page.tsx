"use client"

import { useState, useEffect } from "react"
import Script from "next/script"
import { CheckCircle, Heart, MessageCircle, Lock, AlertTriangle, LockOpen, Instagram, ShieldAlert } from "lucide-react"

// ==========================================================
// DATOS FICTICIOS CENSURADOS (Para simular hallazgos)
// ==========================================================
const BLOCKED_INTERACTIONS = [
  { type: "like", text: "A user_****", time: "Hace 2 min" },
  { type: "message", text: "Mensaje de anony****", time: "Hace 5 min" },
  { type: "like", text: "A ****.private", time: "Hace 12 min" },
]

const BLOCKED_IMAGES = [
  "/images/male/liked/male-liked-photo-1.jpg", // Usa rutas existentes o placeholders
  "/images/male/liked/male-liked-story-1.jpg",
  "/images/female/liked/female-liked-photo-1.jpg",
  "/images/female/liked/female-liked-story-1.jpg",
]

// ==========================================================

export default function DownsellPage() {
  const [timeLeft, setTimeLeft] = useState(3 * 60) // 3 minutos para mayor urgencia

  // Temporizador
  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft((prevTime) => prevTime - 1)
      }, 1000)
      return () => clearInterval(timer)
    }
  }, [timeLeft])

  // Inicializar Widget de Hotmart
  useEffect(() => {
    const initHotmartWidget = () => {
      if (typeof (window as any).checkoutElements !== "undefined") {
        try {
          // NOTA: Asegúrate de configurar este ID en Hotmart para que sea el producto con 50% OFF
          (window as any).checkoutElements.init('salesFunnel').mount('#hotmart-sales-funnel')
          console.log("Hotmart Downsell Widget Mounted")
        } catch (e) {
          console.error("Error mounting Hotmart widget:", e)
        }
      } else {
        setTimeout(initHotmartWidget, 500)
      }
    }
    setTimeout(initHotmartWidget, 200)
  }, [])

  const formatTime = (seconds: number) => {
    if (seconds <= 0) return "00:00"
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes.toString().padStart(2, "0")}:${remainingSeconds.toString().padStart(2, "0")}`
  }

  const PageHeader = () => (
    <header className="w-full max-w-md mx-auto text-center px-4 pt-8 pb-4">
      <div className="inline-block bg-white p-4 rounded-2xl shadow-lg mb-4">
        <ShieldAlert className="h-10 w-10 text-red-600" />
      </div>
      <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">
        ⚠️ ESPERA! NO CIERRES AÚN
      </h1>
      <p className="text-gray-200">
        Hemos guardado temporalmente los archivos encontrados, pero se eliminarán en breve.
      </p>
    </header>
  )

  return (
    <div className="min-h-screen flex flex-col items-center bg-[rgba(156,79,165,1)]">
      
      {/* SCRIPT HOTMART */}
      <Script src="https://checkout.hotmart.com/lib/hotmart-checkout-elements.js" strategy="afterInteractive" />

      {/* === HEADER DE URGENCIA === */}
      <div className="w-full bg-[#dc2626] text-white text-center py-3 px-4 font-bold text-sm md:text-base shadow-sm z-20 animate-pulse">
        🛑 ÚLTIMA OPORTUNIDAD: ACCESO CON 50% DE DESCUENTO
      </div>

      {/* === SECCIÓN DE AVISO (GRIS) === */}
      <div className="w-full bg-gray-100 text-center py-6 px-6 border-b-4 border-gray-200 z-10">
        <p className="text-gray-800 text-base md:text-lg font-medium max-w-3xl mx-auto leading-relaxed">
          Entendemos que el precio anterior pudo ser un obstáculo. <br/>
          <span className="text-[#dc2626] font-bold">No queremos que te quedes con la duda.</span>
        </p>
      </div>

      {/* === CONTENIDO PRINCIPAL === */}
      <div className="w-full flex flex-col items-center p-4">
        <PageHeader />
        
        <main className="w-full max-w-md bg-white p-6 md:p-8 rounded-2xl shadow-xl space-y-6">
          
          {/* Título de Sección */}
          <div className="flex items-center justify-center gap-2 text-gray-800 font-bold text-xl border-b pb-4">
            <Lock size={24} className="text-gray-500" /> Archivos Recuperados
          </div>

          {/* LISTA DE ACTIVIDAD CENSURADA */}
          <div className="space-y-3 text-left">
            <p className="text-sm text-gray-500 mb-2 font-mono">[ESTADO]: Contenido Bloqueado por el Servidor</p>
            
            {BLOCKED_INTERACTIONS.map((item, i) => (
              <div key={i} className="flex items-center gap-3 p-3 bg-gray-50 border border-gray-200 rounded-lg shadow-sm opacity-80">
                <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center">
                    <Lock size={16} className="text-gray-500"/>
                </div>
                <div className="flex-1 text-sm">
                  <p className="text-gray-800 filter blur-[2px] select-none">
                    <span className="font-semibold">@{item.text}</span>
                  </p>
                  <p className="text-red-500 text-xs font-bold mt-1">
                    🔒 Nombre Oculto
                  </p>
                </div>
                {item.type === "like" ? (
                  <Heart className="text-gray-400" size={20} />
                ) : (
                  <MessageCircle className="text-gray-400" size={20} />
                )}
              </div>
            ))}
          </div>

          {/* GALERÍA DE IMÁGENES CENSURADAS */}
          <div className="space-y-2">
             <h3 className="font-bold text-gray-700 flex items-center gap-2">
                <Instagram size={18} /> Fotos Sospechosas (4)
             </h3>
             <div className="grid grid-cols-2 gap-2">
                {BLOCKED_IMAGES.map((src, index) => (
                    <div key={index} className="relative aspect-square bg-gray-200 rounded-lg overflow-hidden border border-gray-300">
                        {/* Imagen con Blur fuerte */}
                        <img 
                            src={src} 
                            onError={(e) => e.currentTarget.src = "https://placehold.co/200x200/png?text=Blocked"}
                            alt="Censored" 
                            className="w-full h-full object-cover filter blur-[8px] scale-110"
                        />
                        {/* Icono de Candado encima */}
                        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/20">
                            <Lock className="text-white drop-shadow-md" size={32} />
                            <span className="text-white text-xs font-bold mt-1 shadow-black drop-shadow-md">CENSURADO</span>
                        </div>
                    </div>
                ))}
             </div>
          </div>

          {/* CAJA DE OFERTA / WIDGET */}
          <div className="bg-gradient-to-br from-red-50 to-pink-50 border-2 border-red-100 p-5 rounded-xl shadow-inner text-center mt-6">
            <div className="mx-auto w-14 h-14 rounded-full bg-green-500 flex items-center justify-center mb-3 shadow-lg animate-bounce">
              <LockOpen className="text-white" size={28} />
            </div>
            
            <h2 className="text-2xl font-black text-gray-800 leading-tight">
              DESBLOQUEAR AHORA
            </h2>
            
            <p className="text-gray-600 text-sm mb-4">
              Obtén acceso inmediato al reporte sin censura. <br/> 
              <span className="font-bold text-red-500">Oferta válida solo en esta página.</span>
            </p>

            {/* CONTADOR */}
            <div className="bg-white border border-red-200 text-red-800 py-2 px-4 rounded-lg mb-4 inline-block">
              <div className="flex items-center justify-center gap-2">
                <AlertTriangle size={16} className="text-red-600" />
                <span className="font-mono font-bold text-xl text-red-600">{formatTime(timeLeft)}</span>
              </div>
            </div>

            {/* --- HOTMART WIDGET --- */}
            {/* Asegúrate de que este widget apunte al producto con descuento */}
            <div id="hotmart-sales-funnel" className="w-full min-h-[100px]"></div>
          </div>

        </main>
        
        <footer className="py-6 mt-2 text-center">
          <p className="text-xs text-white/80">
            Seguridad garantizada. El cobro aparecerá como "IG-Secure" en tu estado de cuenta.
          </p>
          <p className="text-xs text-white/60 mt-2">© 2024. Todos los derechos reservados.</p>
        </footer>
      </div>
    </div>
  )
}
