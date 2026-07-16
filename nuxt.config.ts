export default defineNuxtConfig({
  compatibilityDate: "2024-04-03",
  devtools: { enabled: true },

  future: {
    compatibilityVersion: 4,
  },

  modules: ["@nuxtjs/tailwindcss", "@pinia/nuxt", "@vite-pwa/nuxt"],

  css: ["~/assets/scss/main.scss"],

  pwa: {
    registerType: "autoUpdate",
    manifest: {
      id: "/",
      name: "Susi Air Ops - Pilot Companion",
      short_name: "Susi Air Ops",
      description:
        "Mobile-first pilot operations companion for schedules, flight hour limits, and operational documents.",
      theme_color: "#0E2138",
      background_color: "#F5F6F8",
      display: "standalone",
      scope: "/",
      start_url: "/",
      lang: "en",
      icons: [
        {
          src: "/pwa-192.png",
          sizes: "192x192",
          type: "image/png",
        },
        {
          src: "/pwa-512.png",
          sizes: "512x512",
          type: "image/png",
        },
      ],
    },
    workbox: {
      globPatterns: ["**/*.{js,css,html,ico,png,svg,json,txt}"],
      navigateFallback: "/",
    },
    client: {
      installPrompt: true,
    },
  },

  app: {
    pageTransition: { name: "page", mode: "out-in" },

    head: {
      title: "Susi Air Ops - Pilot Companion",
      meta: [
        { charset: "utf-8" },
        {
          name: "viewport",
          content:
            "width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0",
        },
        {
          name: "theme-color",
          content: "#0E2138",
        },
        {
          name: "apple-mobile-web-app-capable",
          content: "yes",
        },
        {
          name: "apple-mobile-web-app-status-bar-style",
          content: "default",
        },
      ],
      link: [
        {
          rel: "stylesheet",
          href: "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap",
        },
        {
          rel: "icon",
          type: "image/x-icon",
          href: "/susiair-pilot-ops-favicon.png",
        },
        {
          rel: "apple-touch-icon",
          href: "/apple-touch-icon.png",
        },
      ],
    },
  },
});
