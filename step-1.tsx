"use client"

import { Search, Camera, MessageSquare, Check, CheckCircle, Star, Users } from "lucide-react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { FaWhatsapp } from "react-icons/fa"; // Importando do FontAwesome


const StarRating = ({ rating = 5 }) => (
  <div className="flex text-yellow-400">
    {Array.from({ length: rating }).map((_, index) => (
      <Star key={index} className="w-5 h-5 fill-current" />
    ))}
  </div>
)

export default function Step1() {
  const router = useRouter()

  const handleNavigate = () => {
    router.push("/step-2")
  }

  return (
    <div className="bg-white text-gray-800 font-sans">
      {/* =================================== */}
      {/* 1. Hero Section                     */}
      {/* =================================== */}
      <section className="bg-gradient-to-br from-[#1d1d3a] via-[#2a2a4b] to-[#3a2c6b] text-white py-16 px-4 overflow-hidden">
        <div className="container mx-auto max-w-3xl text-center flex flex-col items-center">
          <div className="bg-gradient-to-br from-green-500 to-darkgreen-500 p-4 rounded-2xl mb-8 shadow-lg">
   <FaWhatsapp className="h-8 w-8 text-white" />
</div>

          <h1 className="text-4xl md:text-6xl font-bold mb-4 leading-tight">
            ¿Sientes que algo <span className="text-red-500">no está bien</span> en tu relación?
            <br />
          </h1>

          <p className="text-lg text-gray-300 mb-8 max-w-xl">
            Con cada mensaje que pasa, los puntos ruedos pueden estar escondiéndose en WhatsApp.
          </p>

          <p className="text-lg text-white font-bold mb-8 max-w-xl">Descubre la verdad en menos de 5 minutos.</p>

          <div className="inline-flex items-center bg-green-900/50 text-green-300 border border-green-700 rounded-full px-4 py-1.5 text-sm mb-8">
            <CheckCircle className="h-4 w-4 mr-2 flex-shrink-0" />
            <span>Sistema de Monitoreo WhatsApp - Actualizado Noviembre 2025</span>
          </div>

          <div className="w-full max-w-lg space-y-4 text-left mb-8">
            {/* Item 1 */}
            <div className="bg-white/10 p-4 rounded-lg flex items-start gap-4 border-l-[6px] border-pink-500 shadow-md">
              <div className="text-3xl mt-1">📱</div>
              <div className="text-sm text-gray-200 leading-relaxed">
                <span className="font-bold text-white text-base block mb-1">
                  ¿Mensajes que 'desaparecen' o conversas borradas?
                </span>
                Descubre contenido que fue ocultado intencionalmente de ti.
              </div>
            </div>

            {/* Item 2 */}
            <div className="bg-white/10 p-4 rounded-lg flex items-start gap-4 border-l-[6px] border-pink-500 shadow-md">
              <div className="text-3xl mt-1">📸</div>
              <div className="text-sm text-gray-200 leading-relaxed">
                <span className="font-bold text-white text-base block mb-1">Fotos y videos compartidos en chats privados</span>
                Ve qué tipo de contenido está compartiendo. Cada foto cuenta una historia.
              </div>
            </div>

            {/* Item 3 */}
            <div className="bg-white/10 p-4 rounded-lg flex items-start gap-4 border-l-[6px] border-pink-500 shadow-md">
              <div className="text-3xl mt-1">🔒</div>
              <div className="text-sm text-gray-200 leading-relaxed">
                <span className="font-bold text-white text-base block mb-1">
                  Conversaciones archivadas y contactos ocultos
                </span>
                Descubre con quién habla realmente cuando tú no estás presente.
              </div>
            </div>

            {/* Item 4 */}
            <div className="bg-white/10 p-4 rounded-lg flex items-start gap-4 border-l-[6px] border-pink-500 shadow-md">
              <div className="text-3xl mt-1">💬</div>
              <div className="text-sm text-gray-200 leading-relaxed">
                <span className="font-bold text-white text-base block mb-1">Mensajes 'eliminados' recuperables.</span>
                La tecnología no olvida. Descubre las conversaciones que intentaron borrar.
              </div>
            </div>
          </div>

          <button
            onClick={handleNavigate}
            className="w-full max-w-lg bg-gradient-to-r from-red-500 to-pink-600 hover:opacity-90 text-white font-bold py-4 px-6 rounded-full text-lg shadow-lg transition-transform transform hover:scale-105"
          >
            🔍 DESCUBRE LA VERDAD AHORA
          </button>
          <p className="text-xs text-gray-400 mt-2">Investigación 100% anónima. Resultados en minutos</p>
        </div>
      </section>

      {/* =================================== */}
      {/* 2. "You're Not Paranoid" Section    */}
      {/* =================================== */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-2">No Estás Paranoico -</h2>
          <h3 className="text-3xl md:text-4xl font-bold text-red-500 mb-6">Te Estás Protegiendo</h3>
          <p className="text-gray-500 max-w-2xl mx-auto mb-12">
            Confiar en tus instintos no es una debilidad. Es inteligencia emocional.
          </p>
          <p className="text-lg text-black font-bold mb-8 max-w-xl mx-auto">
            Mereces claridad para tomar las decisiones correctas.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white p-6 rounded-xl shadow-lg text-center">
              <div className="inline-block bg-pink-100 p-4 rounded-xl mb-4">
                <Search className="h-8 w-8 text-pink-500" />
              </div>
              <h4 className="font-bold text-lg mb-2">ACTIVIDAD RECIENTE</h4>
              <p className="text-gray-500 text-sm">
                Ve con qué contactos chatea más frecuentemente y a qué horas está más activo en WhatsApp.
              </p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-lg text-center">
              <div className="inline-block bg-purple-100 p-4 rounded-xl mb-4">
                <Users className="h-8 w-8 text-purple-500" />
              </div>
              <h4 className="font-bold text-lg mb-2">CONTACTOS FRECUENTES</h4>
              <p className="text-gray-500 text-sm">
                Descubre quiénes son sus contactos más activos y qué tipo de relación mantienen en WhatsApp.
              </p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-lg text-center">
              <div className="inline-block bg-red-100 p-4 rounded-xl mb-4">
                <Camera className="h-8 w-8 text-red-500" />
              </div>
              <h4 className="font-bold text-lg mb-2">FOTOS Y MULTIMEDIA</h4>
              <p className="text-gray-500 text-sm">
                Todas las fotos y videos que han compartido — descubriendo lo que prefieren ocultar.
              </p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-lg text-center">
              <div className="inline-block bg-orange-100 p-4 rounded-xl mb-4">
                <MessageSquare className="h-8 w-8 text-orange-500" />
              </div>
              <h4 className="font-bold text-lg mb-2">CONVERSACIONES PRIVADAS</h4>
              <p className="text-gray-500 text-sm">
                Ve con quién están hablando constantemente y lee lo que realmente dicen.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* =================================== */}
      {/* 3. Testimonials Section             */}
      {/* =================================== */}
      <section className="bg-gray-50 py-20 px-4">
        <div className="container mx-auto max-w-3xl text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-12">
            Más de <span className="text-red-500">127,000 personas</span> ya han descubierto la verdad.
          </h2>
          <div className="space-y-8">
            {/* Testimonial 1 - Sarah → Sofía */}
            <div className="bg-white p-6 rounded-xl shadow-lg text-left">
              <div className="flex items-center mb-4">
                <Image src="/images/83.jpg" alt="Sofía" width={48} height={48} className="rounded-full mr-4" />
                <div>
                  <p className="font-bold">Sofía, 42</p>
                  <p className="text-sm text-green-600 flex items-center">
                    <Check className="h-4 w-4 mr-1" />
                    Usuario Verificado
                  </p>
                </div>
              </div>
              <blockquote className="text-gray-600 italic mb-4">
                Llevaba meses con esa sensación rara. Si lo mejillas todo. Lo herramienta mostró conversaciones con su 'mejor amiga' que me hicieron llorar por días, pero me dio la libertad para seguir adelante y dejar de vivir en una mentira.
              </blockquote>
              <StarRating />
            </div>

            {/* Testimonial 2 - Jennifer → Valentina */}
            <div className="bg-white p-6 rounded-xl shadow-lg text-left">
              <div className="flex items-center mb-4">
                <Image src="/images/86.jpg" alt="Valentina" width={48} height={48} className="rounded-full mr-4" />
                <div>
                  <p className="font-bold">Valentina, 33</p>
                  <p className="text-sm text-gray-500">Investigación completada Noviembre 2025</p>
                </div>
              </div>
              <blockquote className="text-gray-600 italic mb-4">
                Descubrí en menos de 20 MIN que mi prometido intercambiaba mensajes íntimos con 3 mujeres diferentes en WhatsApp. Conversé lo hecho 7 semanas antes. Dolió mucho, pero me salvó de un error que habría arruinado mi vida.
              </blockquote>
              <StarRating />
            </div>

            {/* Testimonial 3 - Michelle → Camila */}
            <div className="bg-white p-6 rounded-xl shadow-lg text-left">
              <div className="flex items-center mb-4">
                <Image src="/images/87.jpg" alt="Camila" width={48} height={48} className="rounded-full mr-4" />
                <div>
                  <p className="font-bold">Camila, 35</p>
                  <p className="text-sm text-green-600 flex items-center">
                    <Check className="h-4 w-4 mr-1" />
                    Usuario Verificado
                  </p>
                </div>
              </div>
              <blockquote className="text-gray-600 italic mb-4">
                Mi esposo juraba que yo estaba loca, que sólo eran amigas del trabajo. Los perfiles privados estaban llenos de... fotos provocativas y las que había visto a las 2 AM. Ahora estoy siguiendo adelante sin ninguna duda.
              </blockquote>
              <StarRating />
            </div>
          </div>
        </div>
      </section>

      {/* =================================== */}
      {/* 4. Final CTA Section (Dark Theme)   */}
      {/* =================================== */}
      <section className="bg-[#1d1d3a] py-16 px-4">
        <div className="container mx-auto max-w-2xl text-center">
          <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-8 leading-tight drop-shadow-md">
            No Vivirás Otro Día Más <br className="hidden md:block" />
            Con Esta Angustia en Tu Pecho
          </h2>

          {/* Botón */}
          <button
            onClick={handleNavigate}
            className="w-full max-w-lg bg-[#FF4081] hover:bg-[#f53677] text-white font-extrabold py-5 px-6 rounded-full text-lg md:text-xl shadow-[0_10px_40px_-10px_rgba(255,64,129,0.6)] transition-all transform hover:scale-105 flex items-center justify-center gap-3 mx-auto"
          >
            <span className="text-2xl">🔒</span> INICIAR INVESTIGACIÓN ANÓNIMA AHORA
          </button>

          {/* Textos de Rodapé */}
          <div className="mt-6 space-y-2">
            <p className="text-sm text-gray-300">100% anónimo. Tu investigación permanecerá completamente privada.</p>
            <p className="text-sm text-gray-400">Más de 127,000 personas ya han descubierto la verdad.</p>
          </div>
        </div>
      </section>
    </div>
  )
}
