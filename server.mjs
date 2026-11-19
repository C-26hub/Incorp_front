import { createServer, request as requestHttp } from 'node:http'
import { request as requestHttps } from 'node:https'
import { readFile, stat } from 'node:fs/promises'
import { extname, resolve, sep } from 'node:path'
import { fileURLToPath } from 'node:url'

const distDirectory = resolve(fileURLToPath(new URL('.', import.meta.url)), 'dist')
const indexPath = resolve(distDirectory, 'index.html')
const port = Number(process.env.PORT ?? 10000)
const apiOrigin = new URL(process.env.API_UPSTREAM_URL || 'https://cmiap.onrender.com')
const apiRoutes = ['/auth', '/users', '/agents']
const requestHeaders = ['accept', 'content-type', 'content-length', 'cookie', 'origin', 'x-csrf-token']
const responseHeaders = ['content-type', 'content-length', 'content-encoding', 'set-cookie', 'www-authenticate', 'retry-after']
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
if (!['http:', 'https:'].includes(apiOrigin.protocol) || apiOrigin.username || apiOrigin.password
    || apiOrigin.pathname !== '/' || apiOrigin.search || apiOrigin.hash) {
  throw new Error('API_UPSTREAM_URL precisa ser uma origem HTTP ou HTTPS.')
}

function pickHeaders(headers, names) {
  return Object.fromEntries(names
    .filter((name) => headers[name] !== undefined)
    .map((name) => [name, headers[name]]))
}

function proxyApi(request, response, target) {
  const connect = apiOrigin.protocol === 'https:' ? requestHttps : requestHttp
  const upstream = connect(apiOrigin, {
    method: request.method,
    path: target.pathname + target.search,
    headers: pickHeaders(request.headers, requestHeaders),
  }, (result) => {
    response.writeHead(result.statusCode ?? 502, {
      ...pickHeaders(result.headers, responseHeaders),
      'Cache-Control': 'no-store',
    })
    result.on('error', (error) => response.destroy(error))
    result.pipe(response)
  })
  upstream.setTimeout(120_000, () => upstream.destroy(new Error('Tempo esgotado na API.')))
  upstream.on('error', () => {
    if (response.headersSent) {
      response.destroy()
      return
    }
    response.writeHead(502, { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' })
      .end(JSON.stringify({ message: 'Não foi possível conectar à API.' }))
  })
  response.on('close', () => {
    if (!response.writableEnded) upstream.destroy()
  })
  request.pipe(upstream)
}

const server = createServer(async (request, response) => {
  let target
  try {
    if (!request.url?.startsWith('/') || request.url.startsWith('//') || request.url.includes('\\')) {
      throw new Error('Caminho inválido.')
    }
    target = new URL(request.url, 'http://localhost')
  } catch {
    response.writeHead(400).end('Requisição inválida.')
    return
  }
  if (target.pathname === '/csrf' ||
    apiRoutes.some((prefix) => target.pathname === prefix || target.pathname.startsWith(prefix + '/'))) {
    proxyApi(request, response, target)
    return
  }

  if (request.method !== 'GET' && request.method !== 'HEAD') {
    response.writeHead(405, { Allow: 'GET, HEAD' }).end()
    return
  }

  let pathname
  try {
    pathname = decodeURIComponent(target.pathname)
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
