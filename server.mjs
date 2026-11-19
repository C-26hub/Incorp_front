import { createServer } from 'node:http'
import { readFile, stat } from 'node:fs/promises'
import { extname, resolve, sep } from 'node:path'
import { fileURLToPath } from 'node:url'

const distDirectory = resolve(fileURLToPath(new URL('.', import.meta.url)), 'dist')
const indexPath = resolve(distDirectory, 'index.html')
const port = Number(process.env.PORT ?? 10000)
const contentTypes = {
  '.css': 'text/css; charset=utf-8',
  '.html': 'text/html; charset=utf-8',
  '.ico': 'image/x-icon',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.svg': 'image/svg+xml',
  '.webmanifest': 'application/manifest+json',
  '.webp': 'image/webp',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
}

if (!Number.isInteger(port) || port < 1 || port > 65535) {
  throw new Error(`PORT inválida: ${process.env.PORT}`)
}

const server = createServer(async (request, response) => {
  if (request.method !== 'GET' && request.method !== 'HEAD') {
    response.writeHead(405, { Allow: 'GET, HEAD' }).end()
    return
  }

  let pathname
  try {
    pathname = decodeURIComponent(new URL(request.url ?? '/', 'http://localhost').pathname)
  } catch {
    response.writeHead(400).end('Requisição inválida.')
    return
  }

  const requestedPath = resolve(distDirectory, `.${pathname}`)
  if (requestedPath !== distDirectory && !requestedPath.startsWith(`${distDirectory}${sep}`)) {
    response.writeHead(403).end('Acesso negado.')
    return
  }

  let filePath = requestedPath
  try {
    const fileInfo = await stat(filePath)
    if (!fileInfo.isFile()) filePath = ''
  } catch (error) {
    if (error.code !== 'ENOENT' && error.code !== 'ENOTDIR') throw error
    filePath = ''
  }

  if (!filePath) {
    if (extname(pathname)) {
      response.writeHead(404).end('Arquivo não encontrado.')
      return
    }
    filePath = indexPath
  }

  try {
    const file = await readFile(filePath)
    response.writeHead(200, {
      'Cache-Control': 'no-cache',
      'Content-Length': file.length,
      'Content-Type': contentTypes[extname(filePath)] ?? 'application/octet-stream',
      'X-Content-Type-Options': 'nosniff',
    })
    response.end(request.method === 'HEAD' ? undefined : file)
  } catch (error) {
    console.error('Falha ao servir o frontend compilado:', error)
    if (!response.headersSent) response.writeHead(500).end('Não foi possível carregar a aplicação.')
    else response.destroy(error)
  }
})

server.listen(port, '0.0.0.0', () => {
  console.log(`Frontend disponível na porta ${port}.`)
})
