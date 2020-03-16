class ElementHandler {
  constructor(username) {
    this.image = null
    this.username = username
  }

  element(element) {
    const imageSrc = element.getAttribute('src')
    if (imageSrc && imageSrc.includes('400x400')) {
      this.image = imageSrc
    }
  }
}

addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request))
})

const networks = ['twitter']

async function handleRequest(request) {
  if (!networks.some(n => request.url.includes(n))) {
    return new Response('GET /twitter/signalnerve')
  }

  const username = request.url.match(/twitter\/(\w*)/)[1]
  if (!username) {
    return new Response("Couldn't find a username", { status: 500 })
  }

  const url = new URL(request.url)
  if (url.pathname.includes('/twitter')) {
    const handler = new ElementHandler(username)
    const rewriter = new HTMLRewriter().on('img', handler)
    const response = await fetch(`https://twitter.com/${username}`)
    await rewriter.transform(response).arrayBuffer()
    return fetch(handler.image)
  }

  return new Response('GET /twitter/signalnerve')
}
