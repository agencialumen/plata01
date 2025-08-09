// Configuração centralizada de todas as imagens do site
export const imageConfig = {
  // Foto de perfil da Isabella
  profile: {
    avatar: "https://i.imgur.com/placeholder-avatar.jpg", // Substitua pelo link da foto de perfil
    alt: "Isabella Lua",
  },

  // Imagens de preview do conteúdo (3 imagens)
  previews: [
    {
      url: "https://i.imgur.com/preview1.jpg", // Substitua pelo link da primeira preview
      alt: "Preview 1",
      type: "photo", // "photo" ou "video"
    },
    {
      url: "https://i.imgur.com/preview2.jpg", // Substitua pelo link da segunda preview
      alt: "Preview 2",
      type: "photo",
    },
    {
      url: "https://i.imgur.com/preview3.jpg", // Substitua pelo link da terceira preview
      alt: "Preview 3",
      type: "video", // Este será mostrado como vídeo
    },
  ],

  // Logos das redes sociais (caso queira customizar)
  social: {
    facebook: "https://i.imgur.com/facebook-logo.png", // Opcional: logo customizado do Facebook
    instagram: "https://i.imgur.com/instagram-logo.png", // Opcional: logo customizado do Instagram
  },

  // Imagens para as lojas de aplicativos (Instagram)
  appStores: {
    appStore: "https://i.imgur.com/app-store-badge.png", // Badge da App Store
    googlePlay: "https://i.imgur.com/google-play-badge.png", // Badge do Google Play
  },

  // Imagens de background/decorativas (opcionais)
  backgrounds: {
    mainGradient: "", // Deixe vazio para usar o gradiente padrão
    pattern: "", // Deixe vazio para usar o padrão padrão
  },
}

// Função helper para verificar se uma URL de imagem é válida
export const getImageUrl = (url: string, fallback = "/placeholder.svg?height=400&width=400") => {
  return url && url.trim() !== "" ? url : fallback
}

// Função para gerar placeholder com dimensões específicas
export const getPlaceholder = (width: number, height: number, text?: string) => {
  const query = text ? `&text=${encodeURIComponent(text)}` : ""
  return `/placeholder.svg?height=${height}&width=${width}${query}`
}
