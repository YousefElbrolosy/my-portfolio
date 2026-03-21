const config = require('./developer.json')
const siteTitle = `${config.name} | ${config.role}`


/*
 * Nuxt 3 Config File
 Usage: https://nuxt.com/docs/api/configuration/nuxt-config
 */
export default defineNuxtConfig({
  compatibilityDate: '2025-02-28',
  nitro: {
    preset: 'netlify',
    bundledStorage: [],
    externals: {
      inline: ['@vue/devtools-api'],
    },
  },
  vite: {
    ssr: {
      noExternal: ['@vue/devtools-api'],
    },
  },
  /**
   * * App Config
   * app config: https://nuxt.com/docs/api/configuration/nuxt-config#app
   * head config: https://nuxt.com/docs/api/configuration/nuxt-config#head
   * meta config: https://nuxt.com/docs/getting-started/seo-meta
   * pageTransition config: https://nuxt.com/docs/getting-started/transitions#transitions
   * TODO: Add more meta tags for SEO
   * TODO: Add tags for social media sharing
   * TODO: Migrate apple-touch-icon config to manifest.json
   */
  app: {
    head: {
      htmlAttrs: {
        lang: 'en', // App language
      },
      title: siteTitle, // App window nav title
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { hid: 'description', name: 'description', content: 'A awesome developer portfolio design.' },
        { hid: 'og:title', property: 'og:title', content: siteTitle },
        { hid: 'og:description', property: 'og:description', content: 'A awesome developer portfolio design.' },
        { hid: 'og:image', property: 'og:image', content: 'demo-share.jpg' },
        { hid: 'og:url', property: 'og:url', content: 'https://developer-portfolio-v1.netlify.app/' },
        { name: 'theme-color', content: '#010C15' },
        // ...
      ],
      link: [
        { rel: 'manifest', href: 'pwa/manifest.json' },
        { rel: 'apple-touch-icon', href: 'pwa/icons/apple-touch-icon.png' },
      ],
    },
  },

  /**
   * * Nuxt 3 Modules
   * Official modules: https://nuxt.com/modules
   */
  modules: [
    '@nuxtjs/tailwindcss',
    [
      'nuxt-mail',
      {
        message: {
          to: process.env.NUXT_MAIL_TO,
        },
        smtp: {
          host: process.env.NUXT_MAIL_SMTP_HOST,
          port: Number(process.env.NUXT_MAIL_SMTP_PORT || 587),
          secure: process.env.NUXT_MAIL_SMTP_SECURE === 'true',
          auth: {
            user: process.env.NUXT_MAIL_SMTP_USER,
            pass: process.env.NUXT_MAIL_SMTP_PASS,
          },
        },
      },
    ],
  ],

  components: {
    dirs: [
      '~/components',
    ],
  },

  /**
   * * Tailwind CSS Config
   * Options: https://tailwindcss.nuxt.dev/getting-started/options/
   * Docs: https://tailwindcss.nuxt.dev
   */
  tailwindcss: {
    cssPath: '~/assets/tailwind.css',
    configPath: 'tailwind.config',
    exposeConfig: true, // true to resolve the tailwind config in runtime. https://tailwindcss.nuxt.dev/getting-started/options/#exposeconfig
    viewer: false,
  },

  /**
   * * Runtime Config (Environment Variables)
   * Usage: https://nuxt.com/docs/guide/going-further/runtime-config
   */
  runtimeConfig: {
    // The private keys which are only available server-side
    apiSecret: '123',
    // Keys within public are also exposed client-side
    public: {
      apiBase: '/api',

    }
  }
})