"use client"

import { useState, useRef, useEffect } from "react"
import { Input } from "@/components/ui/input"
import Script from "next/script" // Importación necesaria para Next.js
import { User, CheckCircle, Heart, MessageCircle, Lock, AlertTriangle, Instagram, LockOpen } from "lucide-react"

// ==========================================================
// DATOS DE PERFILES E IMÁGENES
// ==========================================================
// Perfiles que interactúan con el objetivo
const FEMALE_PROFILES = [
  "@jessy_nutty",
  "@alexis_30",
  "@izes",
  "@maryjane434",
  "@emma.whistle32",
  "@celina_anderson467",
  "@letty.miriah99",
]
const FEMALE_IMAGES = [
  "/images/male/perfil/1.jpg",
  "/images/male/perfil/2.jpg",
  "/images/male/perfil/3.jpg",
  "/images/male/perfil/4.jpg",
  "/images/male/perfil/5.jpg",
  "/images/male/perfil/6.jpg",
  "/images/male/perfil/7.jpg",
  "/images/male/perfil/8.jpg",
  "/images/male/perfil/9.jpg",
]
const MALE_PROFILES = [
  "@john.doe92",
  "@mike_anderson",
  "@chris_williams",
  "@danny.smith",
  "@liam.baker",
  "@noah_carter",
  "@ryan_hills",
]
const MALE_IMAGES = [
  "/images/female/perfil/1.jpg",
  "/images/female/perfil/2.jpg",
  "/images/female/perfil/3.jpg",
  "/images/female/perfil/4.jpg",
  "/images/female/perfil/5.jpg",
  "/images/female/perfil/6.jpg",
  "/images/female/perfil/7.jpg",
  "/images/female/perfil/8.jpeg",
  "/images/female/perfil/9.jpg",
]

// Imágenes "interceptadas" (borrosas) que al objetivo le gustaron
const LIKED_BY_MALE_PHOTOS = [
  "/images/male/liked/male-liked-photo-1.jpg",
  "/images/male/liked/male-liked-photo-2.jpeg",
  "/images/male/liked/male-liked-photo-3.jpeg",
]
const LIKED_BY_MALE_STORIES = [
  "/images/male/liked/male-liked-story-1.jpg",
  "/images/male/liked/male-liked-story-2.jpg",
  "/images/male/liked/male-liked-story-3.jpg",
]
const LIKED_BY_FEMALE_PHOTOS = [
  "/images/female/liked/female-liked-photo-1.jpg",
  "/images/female/liked/female-liked-photo-2.jpg",
  "/images/female/liked/female-liked-photo-3.jpg",
]
const LIKED_BY_FEMALE_STORIES = [
  "/images/female/liked/female-liked-story-1.jpg",
  "/images/female/liked/female-liked-story-2.jpg",
  "/images/female/liked/female-liked-story3.jpg",
]

// Array de comentarios para la sección "INTERCEPTED" (Traducidos)
const INTERCEPTED_COMMENTS = ["Wow, te ves muy bien 🥰", "🫣😏", "Me estás calentando 🥵", "Me vuelves loco/a 😈"]
// ==========================================================

// --- Funciones auxiliares ---
const sanitizeUsername = (username: string): string => {
  let u = (username || "").trim()
  if (u.startsWith("@")) u = u.slice(1)
  u = u.toLowerCase()
  return u.replace(/[^a-z0-9._]/g, "")
}
const setProfileLocalCache = (user: string, profile: any) => {
  if (!user || !profile) return
  try {
    const key = "igProfileCacheV1"
    const cache = JSON.parse(localStorage.getItem(key) || "{}") || {}
    cache[user] = { profile, ts: Date.now() }
    localStorage.setItem(key, JSON.stringify(cache))
  } catch (e) {
    console.error("[v0] Error al guardar perfil en caché:", e)
  }
}
const getProfileFromCache = (user: string): any | null => {
  try {
    const key = "igProfileCacheV1"
    const cache = JSON.parse(localStorage.getItem(key) || "{}") || {}
    if (cache[user] && cache[user].profile) {
      return cache[user].profile
    }
  } catch (e) {
    console.error("[v0] Error al leer caché del perfil:", e)
  }
  return null
}

const PageHeader = () => (
  <header className="w-full max-w-md mx-auto text-center px-4 pt-12 pb-8">
    <div className="inline-block bg-white p-4 rounded-2xl shadow-lg mb-6">
      <Instagram className="h-10 w-10 text-pink-600" />
    </div>
    <h1 className="text-3xl md:text-4xl font-bold text-white mb-3">
      <span role="img" aria-label="magnifying glass">
        🔍
      </span>{" "}
      Ayúdanos a Encontrar lo que Ocultan
    </h1>
    <p className="text-white">Cuantos más detalles proporciones, más profundo podremos investigar. Todo es 100% anónimo.</p>
  </header>
)

// --- Componente de la Página ---
export default function Step2() {
  const [step, setStep] = useState(1)
  const [instagramHandle, setInstagramHandle] = useState("")
  const [selectedGender, setSelectedGender] = useState<string | null>(null)
  const [profileData, setProfileData] = useState<any>(null)
  const [profileImageUrl, setProfileImageUrl] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [loadingProgress, setLoadingProgress] = useState(0)
  const debounceTimer = useRef<NodeJS.Timeout | null>(null)
  const [timeLeft, setTimeLeft] = useState(5 * 60)

  // Estados para almacenar los resultados aleatorios
  const [randomizedResults, setRandomizedResults] = useState<
    Array<{ username: string; image: string; type: "like" | "message" }>
  >([])
  const [interceptedImages, setInterceptedImages] = useState<Array<{ image: string; comment: string }>>([])

  // State for Instagram posts grid
  const [instagramPosts, setInstagramPosts] = useState<any[]>([])
  const [visiblePosts, setVisiblePosts] = useState<number>(0)

  // Función para barajar y tomar N elementos de un array
  const shuffleAndPick = (arr: any[], num: number) => {
    return [...arr].sort(() => 0.5 - Math.random()).slice(0, num)
  }

  // Lógica para sortear perfiles e imágenes en el paso 3
  useEffect(() => {
    if (step === 3) {
      // 1. Sortea perfiles de interacción
      let profilesToUse = FEMALE_PROFILES
      let imagesToUse = FEMALE_IMAGES
      if (selectedGender === "female") {
        profilesToUse = MALE_PROFILES
        imagesToUse = MALE_IMAGES
      }
      const randomUsernames = shuffleAndPick(profilesToUse, 3)
      const randomImages = shuffleAndPick(imagesToUse, 3)
      const results = randomUsernames.map((username, index) => ({
        username,
        image: randomImages[index % randomImages.length],
        type: Math.random() > 0.5 ? "like" : "message",
      }))
      setRandomizedResults(results)

      // 2. Sortea 4 imágenes "interceptadas" y 4 comentarios
      let allLikedImages = LIKED_BY_MALE_PHOTOS.concat(LIKED_BY_MALE_STORIES)
      if (selectedGender === "female") {
        allLikedImages = LIKED_BY_FEMALE_PHOTOS.concat(LIKED_BY_FEMALE_STORIES)
      }

      const randomLikedImages = shuffleAndPick(allLikedImages, 4)
      const randomComments = shuffleAndPick(INTERCEPTED_COMMENTS, 4)

      const newInterceptedData = randomLikedImages.map((img, index) => ({
        image: img,
        comment: randomComments[index % randomComments.length],
      }))

      setInterceptedImages(newInterceptedData)
    }
  }, [step, selectedGender])

  // Temporizador
  useEffect(() => {
    if (step === 3 && timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft((prevTime) => prevTime - 1)
      }, 1000)
      return () => clearInterval(timer)
    }
  }, [step, timeLeft])

  // Lógica para inicializar el Widget de Hotmart cuando se llega al paso 3
  useEffect(() => {
    if (step === 3) {
      const initHotmartWidget = () => {
        // Verificar si el script de Hotmart ya cargó
        if (typeof (window as any).checkoutElements !== "undefined") {
          try {
            (window as any).checkoutElements.init('salesFunnel').mount('#hotmart-sales-funnel')
            console.log("Hotmart Widget Mounted")
          } catch (e) {
            console.error("Error mounting Hotmart widget:", e)
          }
        } else {
          // Si no ha cargado, intentar de nuevo en 500ms
          setTimeout(initHotmartWidget, 500)
        }
      }
      
      // Pequeño delay para asegurar que el div exista en el DOM
      setTimeout(initHotmartWidget, 200)
    }
  }, [step])

  const formatTime = (seconds: number) => {
    if (seconds <= 0) return "00:00"
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes.toString().padStart(2, "0")}:${remainingSeconds.toString().padStart(2, "0")}`
  }

  const handleInstagramChange = (value: string) => {
    setInstagramHandle(value)
    const sanitizedUser = sanitizeUsername(value)
    if (debounceTimer.current) clearTimeout(debounceTimer.current)
    setError("")
    setProfileData(null)
    setProfileImageUrl(null)

    if (sanitizedUser.length < 3) {
      setIsLoading(false)
      return
    }

    setIsLoading(true)
    debounceTimer.current = setTimeout(async () => {
      // 1. Chequea Caché
      const cachedProfile = getProfileFromCache(sanitizedUser)
      if (cachedProfile) {
        setProfileData(cachedProfile)
        setProfileImageUrl(cachedProfile.profile_pic_url)
        setIsLoading(false)
        return
      }

      // 2. Busca API
      try {
        const response = await fetch("/api/instagram/profile", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ username: sanitizedUser }),
        })
        const result = await response.json()

        if (!response.ok || !result.success) {
          throw new Error(result.error || "Perfil no encontrado o privado.")
        }

        const profile = result.profile
        setProfileData(profile)
        setProfileLocalCache(sanitizedUser, profile)
        setProfileImageUrl(profile.profile_pic_url)
      } catch (err: any) {
        setError(err.message)
        setProfileData(null)
      } finally {
        setIsLoading(false)
      }
    }, 1200)
  }

  const handleContinueClick = () => {
    console.log("[v0] Continue button clicked, fetching posts...")

    const fetchPosts = async () => {
      try {
        const cleanUsername = sanitizeUsername(instagramHandle)
        console.log("[v0] Fetching posts for username:", cleanUsername)

        const response = await fetch("/api/instagram/posts", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ username: cleanUsername }),
        })

        console.log("[v0] Posts fetch response status:", response.status)

        if (response.ok) {
          const data = await response.json()
          console.log("[v0] Posts data received:", data)

          if (data.success && data.posts && data.posts.length > 0) {
            const postsToShow = data.posts.slice(0, 9)
            console.log("[v0] Setting", postsToShow.length, "posts to display")
            setInstagramPosts(postsToShow)
          } else {
            console.log("[v0] No posts found in response")
          }
        } else {
          console.error("[v0] Failed to fetch posts, status:", response.status)
        }
      } catch (error) {
        console.error("[v0] Error fetching Instagram posts:", error)
      }
    }

    fetchPosts()

    setStep(2)
    setLoadingProgress(0)
    setVisiblePosts(0)

    const interval = setInterval(() => {
      setLoadingProgress((prev) => {
        if (prev >= 90) {
          clearInterval(interval)
          return prev
        }
        return prev + Math.random() * 20
      })
    }, 400)

    const postsInterval = setInterval(() => {
      setVisiblePosts((prev) => {
        if (prev >= 9) {
          clearInterval(postsInterval)
          return 9
        }
        console.log("[v0] Showing post number:", prev + 1)
        return prev + 1
      })
    }, 2800) 

    setTimeout(() => {
      setLoadingProgress(100)
      setTimeout(() => {
        setStep(3)
      }, 1000)
    }, 25000) 
  }

  useEffect(
    () => () => {
      if (debounceTimer.current) clearTimeout(debounceTimer.current)
    },
    [],
  )

  const renderProfileCard = (profile: any) => (
    <div
      className="p-4 rounded-lg border-2 border-green-500/50 text-white animate-fade-in relative overflow-hidden"
      style={{
        backgroundColor: "rgba(26, 44, 36, 0.9)",
        backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.03) 1px, transparent 1px)",
        backgroundSize: "15px 15px",
      }}
    >
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-4 text-left">
          {profileImageUrl ? (
            <img
              src={profileImageUrl || "/placeholder.svg"}
              alt="profile"
              className="w-14 h-14 rounded-full object-cover filter grayscale"
            />
          ) : (
            <div className="w-14 h-14 rounded-full bg-gray-700 animate-pulse"></div>
          )}
          <div>
            <p className="text-green-400 font-bold text-sm">Perfil de Instagram Detectado</p>
            <p className="font-bold text-lg text-white">@{profile.username}</p>
            <p className="text-gray-400 text-sm">
              {profile.media_count} publicaciones • {profile.follower_count} seguidores
            </p>
          </div>
        </div>
        <div className="w-7 h-7 rounded-full border-2 border-green-400 flex items-center justify-center flex-shrink-0">
          <svg className="w-4 h-4 text-green-400" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
              clipRule="evenodd"
            />
          </svg>
        </div>
      </div>
      {profile.biography && (
        <div className="border-t border-green-500/20 mt-3 pt-3 text-left">
          <p className="text-gray-300 text-sm">{profile.biography}</p>
        </div>
      )}
    </div>
  )

  const renderInitialStep = () => (
    <>
      <div className="w-full text-left space-y-3">
        <h3 className="text-lg font-semibold text-gray-800">¿De quién es este número? (género)</h3>
        <div className="grid grid-cols-3 gap-3">
          <button
            onClick={() => setSelectedGender("male")}
            className={`p-3 rounded-xl border-2 flex flex-col items-center justify-center space-y-2 transition-all duration-200 transform hover:scale-105 ${selectedGender === "male" ? "border-indigo-500 bg-indigo-50 shadow-md" : "border-gray-200 bg-white hover:border-gray-300"}`}
          >
            <span className="text-3xl">👱‍♂️</span>
            <span className="font-medium text-sm text-gray-700">Hombre</span>
          </button>
          <button
            onClick={() => setSelectedGender("female")}
            className={`p-3 rounded-xl border-2 flex flex-col items-center justify-center space-y-2 transition-all duration-200 transform hover:scale-105 ${selectedGender === "female" ? "border-indigo-500 bg-indigo-50 shadow-md" : "border-gray-200 bg-white hover:border-gray-300"}`}
          >
            <span className="text-3xl">👱‍♀️</span>
            <span className="font-medium text-sm text-gray-700">Mujer</span>
          </button>
          <button
            onClick={() => setSelectedGender("non-binary")}
            className={`p-3 rounded-xl border-2 flex flex-col items-center justify-center space-y-2 transition-all duration-200 transform hover:scale-105 ${selectedGender === "non-binary" ? "border-indigo-500 bg-indigo-50 shadow-md" : "border-gray-200 bg-white hover:border-gray-300"}`}
          >
            <span className="text-3xl">👱</span>
            <span className="font-medium text-sm text-gray-700">No binario</span>
          </button>
        </div>
      </div>
      <div className="flex items-center justify-center gap-3">
        <svg
          width="28"
          height="28"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="text-pink-500"
        >
          <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.5" />
          <circle cx="12" cy="12" r="6" stroke="currentColor" strokeWidth="1.5" />
          <circle cx="12" cy="12" r="2" fill="currentColor" />
        </svg>
        <h1 className="text-2xl font-bold text-black tracking-wide">IDENTIFICACIÓN DEL OBJETIVO</h1>
      </div>
      <p className="text-gray-600 !-mt-4 pt-6">Introduce el usuario de @Instagram abajo y realiza una búsqueda rápida.</p>
      <div className="relative w-full">
        <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
        <Input
          type="text"
          placeholder="usuario"
          autoComplete="off"
          className="w-full bg-white border-2 border-black/20 text-black pl-12 h-14 text-base rounded-lg focus:border-pink-500 focus:ring-pink-500/50 shadow-inner"
          value={instagramHandle}
          onChange={(e) => handleInstagramChange(e.target.value)}
        />
      </div>

      <div className="w-full min-h-[140px] bg-muted">
        {isLoading && (
          <div className="p-4 bg-pink-50 rounded-lg border-2 border-pink-400 animate-pulse">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-full bg-pink-200"></div>
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-pink-200 rounded w-3/4"></div>
                <div className="h-3 bg-pink-200 rounded w-1/2"></div>
              </div>
            </div>
          </div>
        )}
        {!isLoading && error && <p className="text-red-600 font-semibold">{error}</p>}
        {!isLoading && profileData && renderProfileCard(profileData)}
      </div>
      <button
        onClick={() => {
          handleContinueClick()
        }}
        disabled={!profileData || isLoading}
        className="w-full py-4 text-lg font-bold text-white bg-gradient-to-r from-green-500 to-emerald-600 rounded-lg shadow-lg transition-all hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:scale-100"
      >
        🔍 Continuar Análisis
      </button>
    </>
  )

  const renderLoadingStep = () => (
    <div className="space-y-6 animate-fade-in">
      <h2 className="text-2xl font-bold text-black">Analizando Perfil...</h2>
      {profileData && renderProfileCard(profileData)}
      <div className="w-full space-y-3">
        <p className="font-mono text-sm text-gray-700">
          [ESCANEANDO] Cruzando bases de datos... ({Math.floor(loadingProgress)}%)
        </p>
        <div className="w-full bg-gray-200 rounded-full h-2.5">
          <div
            className="bg-gradient-to-r from-pink-500 to-purple-600 h-2.5 rounded-full"
            style={{ width: `${loadingProgress}%` }}
          ></div>
        </div>
      </div>

      {instagramPosts.length > 0 && visiblePosts > 0 && (
        <div className="w-full space-y-3 animate-fade-in">
          <p className="font-mono text-xs text-yellow-600 text-center">[ESTADO] Buscando cuentas conectadas...</p>
          <div className="grid grid-cols-3 gap-2">
            {instagramPosts.slice(0, visiblePosts).map((post, index) => {
              const imageUrl = post.imageUrl || "/placeholder.svg?height=200&width=200"
              console.log("[v0] Rendering post", index, "with image:", imageUrl)

              return (
                <div
                  key={post.id || post.pk || index}
                  className="aspect-square rounded-lg overflow-hidden bg-gray-200 animate-fade-in"
                  style={{
                    animationDelay: `${index * 100}ms`,
                  }}
                >
                  <img
                    src={imageUrl || "/placeholder.svg"}
                    alt={`Post ${index + 1}`}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      console.error("[v0] Failed to load image for post", index, "URL:", imageUrl)
                      e.currentTarget.src = "/instagram-post-lifestyle.png"
                    }}
                  />
                </div>
              )
            })}
            {/* Placeholder boxes for posts not yet revealed */}
            {Array.from({ length: 9 - visiblePosts }).map((_, index) => (
              <div key={`placeholder-${index}`} className="aspect-square rounded-lg bg-gray-300 animate-pulse" />
            ))}
          </div>
        </div>
      )}
      {/* Show a message if no posts were fetched */}
      {instagramPosts.length === 0 && visiblePosts > 0 && (
        <div className="w-full text-center">
          <p className="font-mono text-xs text-gray-500">[INFO] Cargando publicaciones de Instagram...</p>
        </div>
      )}
    </div>
  )

  const renderResultsStep = () => (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-center gap-2 text-green-600 font-bold text-xl">
        <CheckCircle size={24} /> Análisis Completo
      </div>
      {profileData && renderProfileCard(profileData)}
      {randomizedResults.length > 0 && (
        <div className="p-3 bg-gray-100 border border-gray-300 rounded-lg font-mono text-sm text-left">
          <p>
            <span className="text-green-600 font-bold">[REGISTRO_SISTEMA]</span> Nueva actividad detectada:
          </p>
          <p className="ml-4">
            <span className="text-blue-600">[INSTAGRAM]</span> A {randomizedResults[0].username} le gustó tu foto.
          </p>
          <p className="ml-4">
            <span className="text-blue-600">[INSTAGRAM]</span> Nuevo mensaje de{" "}
            {randomizedResults[1]?.username || randomizedResults[0].username}.
          </p>
        </div>
      )}
      <div className="space-y-3 text-left">
        {randomizedResults.length >= 3 && (
          <>
            {[0, 1, 2].map((i) => (
              <div key={i} className="flex items-center gap-3 p-3 bg-white border border-gray-200 rounded-lg shadow-sm">
                <img
                  src={randomizedResults[i].image || "/placeholder.svg"}
                  alt="User Avatar"
                  className="w-10 h-10 rounded-full object-cover"
                />
                <div className="flex-1 text-sm">
                  <p className="text-gray-800">
                    <span className="font-semibold">{randomizedResults[i].username}</span>{" "}
                    {i < 2 ? "le gustó tu foto" : "te envió un mensaje"}
                  </p>
                  <p className="text-gray-500 text-xs">Hace {[1, 2, 5][i]} minutos</p>
                </div>
                {i < 2 ? (
                  <Heart className="text-pink-500" size={20} />
                ) : (
                  <MessageCircle className="text-blue-500" size={20} />
                )}
              </div>
            ))}
          </>
        )}
        <div className="flex items-center gap-3 p-3 bg-white border border-gray-200 rounded-lg shadow-sm">
          <img src={profileImageUrl || ""} alt="Target Avatar" className="w-10 h-10 rounded-full object-cover" />
          <div className="flex-1 text-sm">
            <p className="text-gray-800">
              <span className="font-semibold">{instagramHandle}</span> está escribiendo...
            </p>
            <p className="text-gray-500 text-xs">Justo ahora</p>
          </div>
          <span className="w-2.5 h-2.5 bg-green-500 rounded-full animate-pulse ml-auto"></span>
        </div>
        <div className="flex items-center gap-3 p-3 bg-white border border-gray-200 rounded-lg shadow-sm">
          <img src={profileImageUrl || ""} alt="Target Avatar" className="w-10 h-10 rounded-full object-cover" />
          <div className="flex-1 text-sm">
            <p className="text-gray-800">
              <span className="font-semibold">{instagramHandle}</span> envió un mensaje nuevo.
            </p>
            <p className="text-gray-500 text-xs">Hace 1 minuto</p>
          </div>
          <MessageCircle className="text-blue-500 ml-auto" size={20} />
        </div>
      </div>
      <div className="space-y-5 text-left">
        <h2 className="text-xl font-bold text-black text-center">
          <span className="text-red-600">INTERCEPTADO:</span> 'Me gusta' sospechosos de {instagramHandle}
        </h2>
        {interceptedImages.map((item, index) => (
          <div key={index} className="p-3 bg-white border border-gray-200 rounded-lg shadow-sm">
            <div className="relative w-full h-56 rounded-md overflow-hidden">
              <img
                src={item.image || "/placeholder.svg"}
                alt={`Liked content ${index + 1}`}
                className="w-full h-full object-cover filter blur-sm"
              />
              <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                <Lock size={40} className="text-white" />
              </div>
            </div>
            <div className="flex items-center gap-2 mt-2">
              <Heart size={16} className="text-pink-500" />
              <span className="text-sm text-gray-600">{index % 2 === 0 ? "1.2K" : "876"} me gusta</span>
            </div>
            <div className="flex items-center gap-3 mt-2">
              <img src={profileImageUrl || ""} alt="User" className="w-8 h-8 rounded-full object-cover" />
              <p className="text-sm text-gray-800">
                <b>{instagramHandle}</b> {item.comment}
              </p>
            </div>
          </div>
        ))}
      </div>
      <div className="bg-white p-5 rounded-lg shadow-xl text-center mt-8">
        <div className="mx-auto w-16 h-16 rounded-2xl bg-gradient-to-br from-green-400 to-cyan-500 flex items-center justify-center mb-4">
          <LockOpen className="text-white" size={40} />
        </div>
        <h2 className="text-xl font-bold text-gray-800">
          <span className="text-yellow-600">🔓</span> DESBLOQUEAR REPORTE COMPLETO
        </h2>
        <p className="text-gray-600 mt-1 mb-6">
          Obtén acceso instantáneo al reporte completo con fotos sin censura y el historial de conversación completo.
        </p>
        <div className="bg-red-100 border-2 border-red-500 text-red-800 p-4 rounded-lg mt-5">
          <div className="flex items-center justify-center gap-2">
            <AlertTriangle className="text-red-600" />
            <h3 className="font-bold">EL REPORTE SE ELIMINARÁ EN:</h3>
          </div>
          <p className="text-4xl font-mono font-bold my-1 text-red-600">{formatTime(timeLeft)}</p>
          <p className="text-xs text-red-700">
            Cuando el tiempo expire, este reporte se eliminará permanentemente por razones de privacidad. Esta oferta no se podrá recuperar más tarde.
          </p>
        </div>

        {/* --- HOTMART WIDGET REPLACEMENT --- */}
        <div id="hotmart-sales-funnel" className="w-full mt-6"></div>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen flex flex-col items-center bg-[rgba(156,79,165,1)]">
      
      {/* SCRIPT HOTMART */}
      <Script src="https://checkout.hotmart.com/lib/hotmart-checkout-elements.js" strategy="afterInteractive" />

      {/* === HEADER ROJO === */}
      <div className="w-full bg-[#dc2626] text-white text-center py-3 px-4 font-bold text-sm md:text-base shadow-sm z-20">
        Atención: no cierres esta página, <span className="text-yellow-300">Tu pago aún se está procesando.</span>
      </div>

      {/* === SECCIÓN DE AVISO (GRIS) === */}
      <div className="w-full bg-gray-100 text-center py-10 px-6 border-b-4 border-gray-200 z-10">
        <p className="text-gray-800 text-lg md:text-xl font-medium max-w-3xl mx-auto leading-relaxed">
          <span className="text-[#dc2626] font-bold uppercase">¡ATENCIÓN!</span> Nuestro sistema ha identificado que muchos contactos nuevos de WhatsApp provienen de conversaciones de Instagram.
        </p>
      </div>

      {/* === CONTENIDO PRINCIPAL === */}
      <div className="w-full flex flex-col items-center p-4">
        <PageHeader />
        <main className="w-full max-w-md bg-white p-6 md:p-8 rounded-2xl shadow-xl">
          <div className="text-center space-y-8">
            {step === 1 && renderInitialStep()}
            {step === 2 && renderLoadingStep()}
            {step === 3 && renderResultsStep()}
          </div>
        </main>
        <footer className="py-4 mt-4">
          <p className="text-xs text-white">© 2024. Todos los derechos reservados.</p>
        </footer>
      </div>
    </div>
  )
}
