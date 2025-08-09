# Sistema de Configuração de Imagens

Este projeto agora possui um sistema centralizado para gerenciar todas as imagens do site.

## Como alterar as imagens

### 1. Abra o arquivo `config/images.ts`

### 2. Substitua os links das imagens:

\`\`\`typescript
export const imageConfig = {
  // Foto de perfil da Isabella
  profile: {
    avatar: "SEU_LINK_AQUI", // Cole o link da foto de perfil
    alt: "Isabella Lua"
  },
  
  // Imagens de preview do conteúdo (3 imagens)
  previews: [
    {
      url: "SEU_LINK_PREVIEW_1", // Cole o link da primeira preview
      alt: "Preview 1",
      type: "photo" // "photo" ou "video"
    },
    {
      url: "SEU_LINK_PREVIEW_2", // Cole o link da segunda preview
      alt: "Preview 2", 
      type: "photo"
    },
    {
      url: "SEU_LINK_PREVIEW_3", // Cole o link da terceira preview
      alt: "Preview 3",
      type: "video" // Este será mostrado como vídeo
    }
  ],

  // Badges das lojas de aplicativos (Instagram)
  appStores: {
    appStore: "LINK_BADGE_APP_STORE", // Badge da App Store
    googlePlay: "LINK_BADGE_GOOGLE_PLAY", // Badge do Google Play
  }
}
\`\`\`

### 3. Tipos de imagem suportados:
- **Foto de perfil**: Qualquer formato (JPG, PNG, WebP, etc.)
- **Previews**: 3 imagens que serão mostradas borradas
- **Badges das lojas**: Imagens dos badges da App Store e Google Play

### 4. Recomendações:
- Use serviços como Imgur, Cloudinary, ou qualquer CDN
- Mantenha as imagens em boa qualidade
- Para previews, use proporção 3:4 (vertical)
- Para foto de perfil, use imagem quadrada

### 5. Exemplo de links válidos:
\`\`\`
https://i.imgur.com/exemplo123.jpg
https://res.cloudinary.com/exemplo/image/upload/v123/foto.png
https://exemplo.com/imagens/foto.webp
\`\`\`

## Fallbacks automáticos
Se algum link estiver vazio ou inválido, o sistema automaticamente usará um placeholder.
