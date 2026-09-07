import { defineConfig, loadEnv, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import type { IncomingMessage, ServerResponse } from 'node:http'
import { existsSync, statSync } from 'node:fs'
import { pathToFileURL } from 'node:url'
import path from 'path'

/** Обработчик из api/: та же сигнатура, что у функции Vercel. */
type ApiHandler = (req: IncomingMessage, res: ServerResponse) => void | Promise<void>

/** Тело запроса приходит потоком — serverless-обработчики ждут разобранный объект. */
function readBody(req: IncomingMessage): Promise<unknown> {
  return new Promise((resolve) => {
    const chunks: Buffer[] = []
    req.on('data', (chunk: Buffer) => chunks.push(chunk))
    req.on('end', () => {
      const raw = Buffer.concat(chunks).toString('utf8')
      if (!raw) return resolve({})
      try {
        resolve(JSON.parse(raw))
      } catch {
        resolve(raw)
      }
    })
  })
}

/**
 * Запускает функции из api/ прямо в dev-сервере Vite.
 *
 * На Vercel эти файлы обслуживает отдельная среда, локально её нет — без этого
 * моста ни форма заявки, ни CRM в `npm run dev` не работают. Плагин включается
 * только для dev-сервера и на сборку не влияет.
 */
function localApi(): Plugin {
  /* Переимпорт после правки: ключ кеша — время изменения файла */
  const loaded = new Map<string, { mtimeMs: number; handler: ApiHandler }>()

  return {
    name: 'tmk-local-api',
    apply: 'serve',
    configureServer(server) {
      /* Серверные функции читают секреты из process.env, а не из import.meta.env */
      Object.assign(process.env, loadEnv(server.config.mode, process.cwd(), ''))

      server.middlewares.use(async (req, res, next) => {
        const url = new URL(req.url ?? '/', 'http://localhost')
        if (!url.pathname.startsWith('/api/')) return next()

        const file = path.resolve(process.cwd(), `.${url.pathname}.js`)
        if (!existsSync(file)) return next()

        try {
          const { mtimeMs } = statSync(file)
          let cached = loaded.get(file)

          if (!cached || cached.mtimeMs !== mtimeMs) {
            const module = await import(`${pathToFileURL(file).href}?v=${mtimeMs}`)
            cached = { mtimeMs, handler: module.default }
            loaded.set(file, cached)
          }

          await cached.handler(
            Object.assign(req, {
              body: await readBody(req),
              query: Object.fromEntries(url.searchParams),
            }),
            withHelpers(res)
          )
        } catch (error) {
          server.config.logger.error(`Ошибка функции ${url.pathname}: ${String(error)}`)
          res.statusCode = 500
          res.setHeader('Content-Type', 'application/json')
          res.end(JSON.stringify({ error: 'Ошибка серверной функции' }))
        }
      })
    },
  }
}

/** Добавляет к ответу Node методы, которые есть у ответа Vercel. */
function withHelpers(res: ServerResponse) {
  return Object.assign(res, {
    status(code: number) {
      res.statusCode = code
      return this
    },
    json(payload: unknown) {
      res.setHeader('Content-Type', 'application/json; charset=utf-8')
      res.end(JSON.stringify(payload))
      return this
    },
    send(payload: string) {
      res.end(payload)
      return this
    },
  })
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react({
      jsxRuntime: 'automatic',
    }),
    localApi(),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@shared': path.resolve(__dirname, './shared'),
    },
    dedupe: ['react', 'react-dom'],
  },
  optimizeDeps: {
    include: ['react', 'react-dom'],
  },
  server: {
    port: Number(process.env.PORT) || 5173,
  },
})
