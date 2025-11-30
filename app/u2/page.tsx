"use client"
import { useState, useEffect, useCallback, useMemo } from "react"
import Script from "next/script"
import useEmblaCarousel from "embla-carousel-react"
import Autoplay from "embla-carousel-autoplay"
import { Zap, AlertTriangle, Flame, Lock, Camera, ChevronLeft, ChevronRight, CheckCircle, Users, MapPin, X, Loader2, Search } from "lucide-react"

// --- DEFINICIÓN DE TIPO Y DATOS DE LOS MATCHES ---
interface Match { name: string; age: number; lastSeen: string; avatar: string; verified: boolean; identity: string; location: string; distance: string; bio: string; zodiac: string; mbti: string; passion: string; interests: string[]; }

// Datos por defecto (Nombres latinos variados)
const defaultMatchesData: Omit<Match, 'location'>[] = [
    { name: "Mila", age: 26, lastSeen: "hace 6h", avatar: "/images/male/tinder/5.jpg", verified: true, identity: "Bisexual", distance: "2 km", bio: "Mitad soñadora, mitad realista. Todo es cuestión de buena vibra. ¿Lista para crear recuerdos?", zodiac: "Virgo", mbti: "ENFJ", passion: "Café", interests: ["Senderismo", "Vida Eco", "Música en Vivo", "Cerámica"] },
    { name: "Juan", age: 25, lastSeen: "hace 4h", avatar: "/images/female/tinder/5.jpg", verified: true, identity: "Bisexual", distance: "2 km", bio: "Mitad adicto a la adrenalina, mitad amante de estar en casa. ¿Cuál es tu vibra?", zodiac: "Leo", mbti: "ESTP", passion: "Fitness", interests: ["Meditación", "Libros", "Vino", "Música"] },
    { name: "Sofía", age: 21, lastSeen: "hace 3h", avatar: "/images/male/tinder/3.jpg", verified: false, identity: "Mujer", distance: "5 km", bio: "Solo una chica que ama los atardeceres y caminar por la playa. Busco alguien con quien compartir aventuras.", zodiac: "Leo", mbti: "ISFP", passion: "Yoga", interests: ["Viajes", "Fotografía", "Podcasts"] },
    { name: "Mateo", age: 23, lastSeen: "hace 2h", avatar: "/images/female/tinder/3.jpg", verified: true, identity: "Hombre", distance: "8 km", bio: "Hablo fluido en sarcasmo y citas de películas. Busquemos la mejor pizza de la ciudad.", zodiac: "Géminis", mbti: "ENTP", passion: "Cocina", interests: ["Conciertos", "Netflix", "Perros"] },
];

// Perfiles Femeninos (Para búsqueda de Hombres) - Nombres Latinos
const femaleMatchesData: Omit<Match, 'location'>[] = [
    { name: "Valentina", age: 24, lastSeen: "hace 1h", avatar: "/images/male/tinder/1.jpg", verified: true, identity: "Mujer", distance: "3 km", bio: "Buscando nuevas aventuras y una buena taza de café. Exploremos la ciudad juntos.", zodiac: "Aries", mbti: "ENFP", passion: "Viajar", interests: ["Arte", "Historia", "Podcasts"] },
    { name: "Isabella", age: 27, lastSeen: "hace 5h", avatar: "/images/male/tinder/2.jpg", verified: false, identity: "Mujer", distance: "1 km", bio: "Ratón de biblioteca y chef aspirante. Cuéntame sobre el último buen libro que leíste.", zodiac: "Tauro", mbti: "ISFJ", passion: "Cocinar", interests: ["Lectura", "Yoga", "Documentales"] },
    { name: "Camila", age: 22, lastSeen: "En línea", avatar: "/images/male/tinder/3.jpg", verified: true, identity: "Mujer", distance: "6 km", bio: "Amante de la música en vivo y los viajes espontáneos. ¿Cuál es nuestro primer destino?", zodiac: "Sagitario", mbti: "ESFP", passion: "Música", interests: ["Conciertos", "Fotografía", "Senderismo"] },
    { name: "Lucía", age: 25, lastSeen: "hace 3h", avatar: "/images/male/tinder/4.jpg", verified: true, identity: "Mujer", distance: "4 km", bio: "Entusiasta del fitness que es igual de feliz en el sofá viendo una buena peli.", zodiac: "Virgo", mbti: "ISTJ", passion: "Fitness", interests: ["Cine", "Comida Sana", "Perros"] },
    { name: "Mariana", age: 28, lastSeen: "hace 8h", avatar: "/images/male/tinder/5.jpg", verified: false, identity: "Mujer", distance: "7 km", bio: "Alma creativa con amor por la pintura y la poesía. Busco conversaciones profundas.", zodiac: "Piscis", mbti: "INFP", passion: "Arte", interests: ["Museos", "Escribir", "Cafeterías"] },
    { name: "Gabriela", age: 23, lastSeen: "hace 2h", avatar: "/images/male/tinder/6.jpg", verified: true, identity: "Mujer", distance: "2 km", bio: "El sarcasmo es mi segundo idioma. Encontremos los mejores tacos de la zona.", zodiac: "Géminis", mbti: "ENTP", passion: "Comedia", interests: ["Foodie", "Viajes", "Stand-up"] },
];

// Perfiles Masculinos (Para búsqueda de Mujeres) - Nombres Latinos
const maleMatchesData: Omit<Match, 'location'>[] = [
    { name: "Sebastián", age: 26, lastSeen: "En línea", avatar: "/images/female/tinder/1.jpg", verified: true, identity: "Hombre", distance: "2 km", bio: "Ingeniero de día, músico de noche. Hablemos de tecnología y buenas canciones.", zodiac: "Capricornio", mbti: "INTJ", passion: "Guitarra", interests: ["Tecnología", "Música en Vivo", "Cerveza Artesanal"] },
    { name: "Diego", age: 29, lastSeen: "hace 4h", avatar: "/images/female/tinder/2.jpg", verified: true, identity: "Hombre", distance: "5 km", bio: "Entusiasta del aire libre buscando alguien para hacer senderismo. A mi perro seguro le caerás bien.", zodiac: "Leo", mbti: "ESTP", passion: "Senderismo", interests: ["Camping", "Perros", "Fogatas"] },
    { name: "Alejandro", age: 25, lastSeen: "hace 1h", avatar: "/images/female/tinder/3.jpg", verified: false, identity: "Hombre", distance: "3 km", bio: "Cinéfilo y nerd de la historia. Puedo recomendarte una película para cualquier estado de ánimo.", zodiac: "Cáncer", mbti: "INFJ", passion: "Cine", interests: ["Historia", "Lectura", "Ajedrez"] },
    { name: "Nicolás", age: 27, lastSeen: "hace 6h", avatar: "/images/female/tinder/4.jpg", verified: true, identity: "Hombre", distance: "8 km", bio: "Solo un chico que disfruta de la buena comida, buena compañía y explorar lugares nuevos.", zodiac: "Libra", mbti: "ESFJ", passion: "Foodie", interests: ["Viajes", "Cocina", "Deportes"] },
    { name: "Javier", age: 30, lastSeen: "hace 2h", avatar: "/images/female/tinder/5.jpg", verified: true, identity: "Hombre", distance: "4 km", bio: "Tratando de encontrar a alguien que no me robe las papas fritas. Broma... o no.", zodiac: "Escorpio", mbti: "ISTP", passion: "Viajar", interests: ["Fotografía", "Motos", "Gimnasio"] },
    { name: "Eduardo", age: 24, lastSeen: "hace 7h", avatar: "/images/female/tinder/6.jpg", verified: false, identity: "Hombre", distance: "6 km", bio: "Fluido en sarcasmo y chistes malos. Buscando una cómplice.", zodiac: "Acuario", mbti: "ENTP", passion: "Gaming", interests: ["Comedia", "Sci-Fi", "Conciertos"] },
];

const defaultCensoredPhotos = ["/images/censored/photo1.jpg", "/images/censored/photo2.jpg", "/images/censored/photo3.jpg", "/images/censored/photo4.jpg"];
const femaleCensoredPhotos = ["/images/male/tinder/censored/censored-f-1.jpg", "/images/male/tinder/censored/censored-f-2.jpg", "/images/male/tinder/censored/censored-f-3.jpg", "/images/male/tinder/censored/censored-f-4.jpg"];
const maleCensoredPhotos = ["/images/female/tinder/censored/censored-h-1.jpg", "/images/female/tinder/censored/censored-h-2.jpg", "/images/female/tinder/censored/censored-h-3.jpg", "/images/female/tinder/censored/censored-h-4.jpg"];

// --- COMPONENTES AUXILIARES ---
const PrevButton = (props: any) => { const { enabled, onClick } = props; return ( <button className="absolute top-1/2 left-2 -translate-y-1/2 bg-black/50 text-white p-2 rounded-full disabled:opacity-30 transition-opacity z-10" onClick={onClick} disabled={!enabled}> <ChevronLeft size={20} /> </button> ) }
const NextButton = (props: any) => { const { enabled, onClick } = props; return ( <button className="absolute top-1/2 right-2 -translate-y-1/2 bg-black/50 text-white p-2 rounded-full disabled:opacity-30 transition-opacity z-10" onClick={onClick} disabled={!enabled}> <ChevronRight size={20} /> </button> ) }

function MatchDetailModal({ match, onClose }: { match: Match; onClose: () => void }) { 
    useEffect(() => { document.body.style.overflow = 'hidden'; return () => { document.body.style.overflow = 'unset'; }; }, []); 
    return ( 
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4 animate-fade-in" onClick={onClose}> 
            <div className="bg-white rounded-2xl w-full max-w-sm max-h-[90vh] overflow-y-auto relative" onClick={(e) => e.stopPropagation()}> 
                <button onClick={onClose} className="absolute top-3 right-3 bg-black/40 hover:bg-black/60 text-white rounded-full p-1.5 z-10"> <X size={20} /> </button> 
                <img src={match.avatar} alt={match.name} className="w-full h-80 object-cover rounded-t-2xl" /> 
                <div className="p-5"> 
                    <div className="flex items-center gap-2"> 
                        <h1 className="text-3xl font-bold text-gray-800">{match.name}</h1> {match.verified && <CheckCircle className="text-blue-500" fill="white" size={28} />} 
                    </div> 
                    <div className="flex flex-col gap-1 text-gray-600 mt-2 text-sm"> 
                        <div className="flex items-center gap-1.5"><Users size={16} /><p>{match.identity}</p></div> 
                        <div className="flex items-center gap-1.5"><MapPin size={16} /><p>{match.location}</p></div> 
                        <div className="flex items-center gap-1.5"><p>📍 A {match.distance} de distancia</p></div> 
                    </div> 
                    <div className="mt-6"> 
                        <h2 className="font-bold text-gray-800">Sobre mí</h2> 
                        <p className="text-gray-600 mt-1">{match.bio}</p> 
                    </div> 
                    <div className="flex flex-wrap gap-2 mt-4 text-sm"> 
                        <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full">{match.zodiac}</span> 
                        <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full">{match.mbti}</span> 
                        <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full">{match.passion}</span> 
                    </div> 
                    <div className="mt-6"> 
                        <h2 className="font-bold text-gray-800">Mis Intereses</h2> 
                        <div className="flex flex-wrap gap-2 mt-2 text-sm"> {match.interests.map(interest => ( <span key={interest} className="border border-gray-300 text-gray-700 px-3 py-1 rounded-full">{interest}</span> ))} </div> 
                    </div> 
                </div> 
                <div className="sticky bottom-0 grid grid-cols-2 gap-4 bg-white p-4 border-t border-gray-200"> 
                    <button className="bg-gray-200 text-gray-800 font-bold py-3 rounded-full hover:bg-gray-300 transition-colors">Rechazar</button> 
                    <button className="bg-gradient-to-r from-pink-500 to-red-500 text-white font-bold py-3 rounded-full hover:opacity-90 transition-opacity">Me gusta</button> 
                </div> 
            </div> 
        </div> 
    ) 
}

// --- COMPONENTE PRINCIPAL DE LA PÁGINA ---
export default function Upsell2Page() {
  const [pageState, setPageState] = useState<'input' | 'loading' | 'results'>('input');
  const [selectedGender, setSelectedGender] = useState<string | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true }, [Autoplay({ delay: 6000, stopOnInteraction: true })]); 
  const [prevBtnEnabled, setPrevBtnEnabled] = useState(false); 
  const [nextBtnEnabled, setNextBtnEnabled] = useState(false); 
  const [selectedIndex, setSelectedIndex] = useState(0); 
  const [scrollSnaps, setScrollSnaps] = useState<number[]>([]); 
  
  const scrollPrev = useCallback(() => emblaApi && emblaApi.scrollPrev(), [emblaApi]); 
  const scrollNext = useCallback(() => emblaApi && emblaApi.scrollNext(), [emblaApi]); 
  const scrollTo = useCallback((index: number) => emblaApi && emblaApi.scrollTo(index), [emblaApi]); 
  
  const onSelect = useCallback(() => { if (!emblaApi) return; setSelectedIndex(emblaApi.selectedScrollSnap()); setPrevBtnEnabled(emblaApi.canScrollPrev()); setNextBtnEnabled(emblaApi.canScrollNext()); }, [emblaApi, setSelectedIndex]); 
  
  useEffect(() => { if (!emblaApi) return; onSelect(); setScrollSnaps(emblaApi.scrollSnapList()); emblaApi.on("select", onSelect); emblaApi.on("reInit", onSelect); }, [emblaApi, setScrollSnaps, onSelect]); 
  
  const [timeLeft, setTimeLeft] = useState(5 * 60); 
  useEffect(() => { if (timeLeft === 0) return; const timer = setInterval(() => { setTimeLeft((prevTime) => (prevTime > 0 ? prevTime - 1 : 0)); }, 1000); return () => clearInterval(timer); }, [timeLeft]); 
  
  const formatTime = (seconds: number) => { const minutes = Math.floor(seconds / 60); const remainingSeconds = seconds % 60; return `${minutes.toString().padStart(2, "0")}:${remainingSeconds.toString().padStart(2, "0")}`; }

  const [selectedMatch, setSelectedMatch] = useState<Match | null>(null);
  const [userLocation, setUserLocation] = useState<string>("tu ciudad");

  useEffect(() => {
    if (pageState === 'results') {
      const fetchLocation = async () => {
        try {
          const response = await fetch('/api/location');
          if (!response.ok) throw new Error('API response not OK');
          const data = await response.json();
          if (data.city) { setUserLocation(data.city); }
        } catch (error) { console.error("No se pudo obtener la ubicación, usando valor por defecto."); }
      };
      fetchLocation();
    }
  }, [pageState]);

  const fakeMatches: Match[] = useMemo(() => {
    let baseMatches: Omit<Match, 'location'>[];
    if (selectedGender === 'Male') { baseMatches = femaleMatchesData; } 
    else if (selectedGender === 'Female') { baseMatches = maleMatchesData; } 
    else { baseMatches = defaultMatchesData; }
    return baseMatches.map(match => ({ ...match, location: `Vive en ${userLocation}` }));
  }, [userLocation, selectedGender]);
  
  const censoredPhotos = useMemo(() => {
    if (selectedGender === 'Male') { return femaleCensoredPhotos; }
    if (selectedGender === 'Female') { return maleCensoredPhotos; }
    return defaultCensoredPhotos;
  }, [selectedGender]);

  useEffect(() => {
    if (pageState === 'results' && typeof (window as any).checkoutElements !== "undefined") {
      try { (window as any).checkoutElements.init("salesFunnel").mount("#hotmart-sales-funnel"); }
      catch (e) { console.error("Error al montar widget de Hotmart:", e); }
    }
  }, [pageState]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImagePreview(URL.createObjectURL(e.target.files[0]));
    }
  };

  const handleStartInvestigation = () => {
    setPageState('loading');
    setTimeout(() => { setPageState('results'); }, 3000);
  };

  const genderEmojis: { [key: string]: string } = {
    'Male': '👨🏻',
    'Female': '👩🏻',
    'Non-binary': '🧑🏻'
  };

  // Mapeo para traducir los géneros en la UI pero mantener la lógica interna
  const genderLabels: { [key: string]: string } = {
    'Male': 'Hombre',
    'Female': 'Mujer',
    'Non-binary': 'No binario'
  };
  
  return (
    <>
      <div className="fixed top-0 w-full z-50 bg-red-600 text-white p-2 text-center text-sm font-semibold">
        <span className="font-bold text-yellow-400">Atención:</span> no cierre esta página, su pago aún se está procesando.
      </div>
    
      <Script src="https://checkout.hotmart.com/lib/hotmart-checkout-elements.js" strategy="afterInteractive" />
      {selectedMatch && <MatchDetailModal match={selectedMatch} onClose={() => setSelectedMatch(null)} />}

      <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4 pt-12">
        <main className="w-full max-w-md mx-auto">
          
          {pageState === 'input' && (
            <div className="space-y-6 animate-fade-in">
              <p className="text-lg text-center text-gray-800 pt-5">
                <span className="font-bold text-red-600">¡ATENCIÓN!</span> Nuestro sistema ha identificado que este usuario está registrado en aplicaciones de citas. Use nuestro escáner de imagen para verificar.
              </p>
              
              <div className="bg-white rounded-2xl shadow-lg p-6 text-center">
                <h2 className="text-xl font-bold text-gray-800 mb-4">Sube su foto para reconocimiento facial</h2>
                <label htmlFor="photo-upload" className="w-40 h-40 mx-auto flex items-center justify-center border-2 border-dashed border-blue-400 rounded-xl cursor-pointer hover:bg-blue-50 transition-colors">
                  <input id="photo-upload" type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
                  {imagePreview ? (
                    <img src={imagePreview} alt="Vista previa" className="w-full h-full object-cover rounded-xl"/>
                  ) : (
                    <Camera className="w-12 h-12 text-gray-400" />
                  )}
                </label>
                <p className="text-sm text-gray-500 mt-4">Escanearemos todas las plataformas de citas para encontrar perfiles coincidentes, incluso aquellos que creen que están ocultos.</p>
              </div>
              
              <div className="bg-white rounded-2xl shadow-lg p-6 text-center">
                <h2 className="text-xl font-bold text-gray-800 mb-4">¿Cuál es su género?</h2>
                <div className="grid grid-cols-3 gap-4">
                  {['Male', 'Female', 'Non-binary'].map((gender) => (
                    <button key={gender} onClick={() => setSelectedGender(gender)} className={`p-4 border rounded-xl transition-all duration-200 ${selectedGender === gender ? 'border-blue-500 bg-blue-100 ring-2 ring-blue-300' : 'border-gray-200 hover:border-gray-400'}`}>
                      <span className="text-4xl mb-2 block" role="img" aria-label={genderLabels[gender]}>
                        {genderEmojis[gender]}
                      </span>
                      <span className="font-semibold text-gray-700">{genderLabels[gender]}</span>
                    </button>
                  ))}
                </div>
                <p className="text-sm text-gray-500 mt-4">
                  Esto nos ayuda a rastrear la actividad de su dispositivo y cruzar datos con patrones de uso de apps de citas.
                </p>
              </div>

              <button 
                onClick={handleStartInvestigation} 
                disabled={!imagePreview || !selectedGender}
                className="w-full text-white font-bold py-4 px-6 rounded-xl shadow-lg flex items-center justify-center gap-3 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed bg-red-600 hover:bg-red-700"
              >
                <Search size={20}/>
                <span>INICIAR INVESTIGACIÓN - ENCONTRAR LA VERDAD</span>
              </button>
            </div>
          )}

          {pageState === 'loading' && (
            <div className="text-center animate-fade-in space-y-4 py-10">
              <Loader2 className="w-16 h-16 text-blue-600 mx-auto animate-spin" />
              <h2 className="text-2xl font-bold text-gray-800">Buscando...</h2>
              <p className="text-gray-600">Cruzando imagen con millones de perfiles.<br/>Esto puede tomar un momento.</p>
            </div>
          )}

          {pageState === 'results' && (
            <div className="space-y-4 animate-fade-in">
              <div className="bg-red-600 text-white p-3 rounded-lg shadow-lg flex items-center gap-3"><Zap size={24} /><div><h1 className="font-bold text-base">PERFIL ENCONTRADO - ESTÁN ACTIVOS EN TINDER</h1><p className="text-xs text-red-200">Visto por última vez: <span className="font-semibold">En línea ahora</span></p></div></div>
              <div className="bg-orange-500 text-white p-3 rounded-lg shadow-lg flex items-center gap-3"><AlertTriangle size={24} /><p className="text-sm font-semibold"><span className="font-bold">ATENCIÓN: ¡PERFIL ACTIVO ENCONTRADO!</span> Confirmamos que este número está vinculado a un perfil ACTIVO de Tinder. Últimos registros de uso detectados en {userLocation}.</p></div>
              <div className="grid grid-cols-4 gap-3 text-center"><div className="bg-white p-3 rounded-lg shadow-md"><p className="text-2xl font-bold text-red-600">6</p><p className="text-xs text-gray-500 font-semibold">MATCHES (7 DÍAS)</p></div><div className="bg-white p-3 rounded-lg shadow-md"><p className="text-2xl font-bold text-orange-500">30</p><p className="text-xs text-gray-500 font-semibold">ME GUSTA (7 DÍAS)</p></div><div className="bg-white p-3 rounded-lg shadow-md"><p className="text-2xl font-bold text-purple-600">4</p><p className="text-xs text-gray-500 font-semibold">CHATS ACTIVOS</p></div><div className="bg-white p-3 rounded-lg shadow-md"><p className="text-2xl font-bold text-gray-800">18h</p><p className="text-xs text-gray-500 font-semibold">ÚLTIMA VEZ ACTIVO</p></div></div>
              <div className="bg-gradient-to-b from-slate-800 to-slate-900 text-white p-5 rounded-lg shadow-2xl"><div className="flex items-center gap-2 mb-2"><Flame className="text-orange-400" size={20} /><h2 className="text-lg font-bold">MATCHES RECIENTES ENCONTRADOS</h2></div><p className="text-sm text-gray-400 mb-5">Toca un match para ver más información</p><div className="space-y-4">{fakeMatches.map((match, index) => (<div key={index} onClick={() => setSelectedMatch(match)} className="flex items-center gap-4 bg-slate-700/50 p-3 rounded-lg cursor-pointer hover:bg-slate-600 transition-colors"><img src={match.avatar} alt={match.name} className="w-12 h-12 rounded-full object-cover border-2 border-slate-600" /><div className="flex-grow"><p className="font-bold">{match.name}, {match.age}</p><p className="text-xs text-gray-400">Visto por última vez: {match.lastSeen}</p><p className="text-xs font-semibold text-green-400">Chat activo: frecuentemente en línea</p></div><div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div></div>))}</div></div>
              <div className="bg-gradient-to-b from-slate-800 to-slate-900 text-white p-5 rounded-lg shadow-2xl"><div className="flex items-center gap-2"><Camera className="text-slate-300" size={20} /><h2 className="text-lg font-bold">FOTOS CENSURADAS</h2></div><p className="text-sm text-gray-400 mb-4">Ver todas las fotos de perfil (incluidas las que nunca has visto)</p><div className="overflow-hidden relative" ref={emblaRef}><div className="flex">{censoredPhotos.map((src, index) => (<div className="relative flex-[0_0_100%] aspect-video bg-gray-700 rounded-lg overflow-hidden" key={index}><img src={src} className="w-full h-full object-cover filter blur-md" alt="Contenido censurado"/><div className="absolute inset-0 bg-black/30 flex flex-col items-center justify-center text-white"><Lock size={32} /><span className="font-bold mt-1 text-sm tracking-widest">BLOQUEADO</span></div></div>))}</div><PrevButton onClick={scrollPrev} enabled={prevBtnEnabled} /><NextButton onClick={scrollNext} enabled={nextBtnEnabled} /></div><div className="flex justify-center items-center mt-4 gap-2">{scrollSnaps.map((_, index) => (<button key={index} onClick={() => scrollTo(index)} className={`w-2 h-2 rounded-full transition-colors ${index === selectedIndex ? 'bg-white' : 'bg-slate-600'}`}/>))}</div></div>
              <div className="bg-white p-5 rounded-lg shadow-xl text-center"><div className="mx-auto w-16 h-16 rounded-2xl bg-gradient-to-br from-green-400 to-cyan-500 flex items-center justify-center mb-4"><Lock className="text-white" size={32} /></div><h2 className="text-xl font-bold text-gray-800"><span className="text-yellow-600">🔓</span> DESBLOQUEAR INFORME COMPLETO</h2><p className="text-gray-600 mt-1">Obtén acceso instantáneo al informe completo con todos los matches y fotos intercambiadas</p><div className="bg-red-100 border-2 border-red-500 text-red-800 p-4 rounded-lg mt-5"><div className="flex items-center justify-center gap-2"><AlertTriangle className="text-red-600" /><h3 className="font-bold">EL INFORME SE ELIMINARÁ EN:</h3></div><p className="text-4xl font-mono font-bold my-1">{formatTime(timeLeft)}</p><p className="text-xs text-red-700">Cuando expire el tiempo, este informe se eliminará permanentemente por razones de privacidad. Esta oferta no se podrá recuperar más tarde.</p></div><div id="hotmart-sales-funnel" className="w-full pt-4"></div></div>
            </div>
          )}
        </main>
      </div>
    </>
  )
}
