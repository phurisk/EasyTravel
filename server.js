const http = require('http')
const fs = require('fs')
const path = require('path')

const publicRoot = path.join(__dirname, 'public')
const port = Number(process.env.PORT) || 3000
const mimeTypes = {
  '.css': 'text/css; charset=utf-8',
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png': 'image/png',
  '.svg': 'image/svg+xml',
  '.webp': 'image/webp',
}

const server = http.createServer((request, response) => {
  const requestedPath = decodeURIComponent(request.url.split('?')[0])
  const relativePath = requestedPath === '/' ? '/index.html' : requestedPath
  const filePath = path.resolve(publicRoot, `.${relativePath}`)

  if (!filePath.startsWith(`${publicRoot}${path.sep}`)) {
    response.writeHead(403)
    response.end('Forbidden')
    return
  }

  fs.stat(filePath, (error, stats) => {
    if (!error && stats.isDirectory()) {
      serveFile(path.join(filePath, 'index.html'), response)
      return
    }
    serveFile(filePath, response)
  })
})

function serveFile(filePath, response) {
  fs.readFile(filePath, (error, content) => {
    if (error) {
      response.writeHead(error.code === 'ENOENT' ? 404 : 500)
      response.end(error.code === 'ENOENT' ? 'Not found' : 'Server error')
      return
    }

    response.writeHead(200, {
      'Content-Type': mimeTypes[path.extname(filePath).toLowerCase()] || 'application/octet-stream',
      'Cache-Control': 'no-cache',
    })
    response.end(content)
  })
}

server.listen(port, '0.0.0.0', () => {
  console.log(`EasyTravel preview server listening on port ${port}`)
})

process.on('SIGTERM', () => server.close(() => process.exit(0)))
process.on('SIGINT', () => server.close(() => process.exit(0)))
EOF

// This intentionally uses Node's built-in modules so the static preview works without adding runtime dependencies.
