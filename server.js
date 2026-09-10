/**
 * Продакшен-сервер для деплоя вне Vercel (VPS): оборачивает serverless-хендлеры
 * из api/ в Express, чтобы отдавать их одним долгоживущим процессом за nginx.
 */
import "dotenv/config"
import express from "express"

import leadHandler from "./api/lead.js"
import crmSession from "./api/crm/session.js"
import crmLeads from "./api/crm/leads.js"
import crmExport from "./api/crm/export.js"

const app = express()
app.disable("x-powered-by")
app.set("trust proxy", 1)
app.use(express.json())

const wrap = (handler) => (req, res) => {
  Promise.resolve(handler(req, res)).catch((error) => {
    console.error("Необработанная ошибка API", error)
    if (!res.headersSent) res.status(500).json({ error: "Внутренняя ошибка сервера" })
  })
}

app.all("/api/lead", wrap(leadHandler))
app.all("/api/crm/session", wrap(crmSession))
app.all("/api/crm/leads", wrap(crmLeads))
app.all("/api/crm/export", wrap(crmExport))

const port = process.env.PORT || 3001
app.listen(port, "127.0.0.1", () => console.log(`API слушает 127.0.0.1:${port}`))
