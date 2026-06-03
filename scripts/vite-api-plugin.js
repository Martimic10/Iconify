import { loadEnv } from 'vite'

const ROUTES = {
  'POST /api/create-checkout-session': () => import('../api/create-checkout-session.js'),
  'GET /api/verify-session': () => import('../api/verify-session.js'),
  'POST /api/send-icons-email': () => import('../api/send-icons-email.js'),
  'POST /api/stripe-webhook': () => import('../api/stripe-webhook.js'),
  'POST /api/noun-icons': () => import('../api/noun-icons.js'),
}

function applyEnv(mode) {
  const env = loadEnv(mode, process.cwd(), '')
  for (const [key, value] of Object.entries(env)) {
    if (process.env[key] === undefined) process.env[key] = value
  }
}

export function viteApiPlugin(mode = 'development') {
  applyEnv(mode)

  return {
    name: 'iconify-api-dev',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        const pathname = req.url?.split('?')[0] || ''
        if (!pathname.startsWith('/api/')) return next()

        const routeKey = `${req.method} ${pathname}`
        const loadHandler = ROUTES[routeKey]
        if (!loadHandler) {
          res.statusCode = 404
          res.setHeader('Content-Type', 'application/json')
          res.end(JSON.stringify({ error: 'API route not found' }))
          return
        }

        try {
          applyEnv(mode)
          const mod = await loadHandler()
          await mod.default(req, res)
        } catch (err) {
          console.error(`[api] ${routeKey}:`, err)
          if (!res.headersSent) {
            res.statusCode = 500
            res.setHeader('Content-Type', 'application/json')
            res.end(JSON.stringify({ error: err.message || 'Internal server error' }))
          }
        }
      })
    },
  }
}
