type TextNode = {
  type: 'text'
  text: string
  format?: number
  version: number
}

type ElementNode = {
  type: string
  children?: LexicalNode[]
  format?: string | number
  version: number
  tag?: string
  listType?: 'bullet' | 'number'
  url?: string
  target?: string
}

type LexicalNode = TextNode | ElementNode

function esc(str: string): string {
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
}

function serializeText(node: TextNode): string {
  let text = esc(node.text)
  const f = node.format ?? 0
  if (f & 1) text = `<strong>${text}</strong>`
  if (f & 2) text = `<em>${text}</em>`
  if (f & 4) text = `<s>${text}</s>`
  if (f & 8) text = `<u>${text}</u>`
  if (f & 16) text = `<code>${text}</code>`
  return text
}

function serializeNode(node: LexicalNode): string {
  if (node.type === 'text') return serializeText(node as TextNode)
  if (node.type === 'linebreak') return '<br>'

  const el = node as ElementNode
  const children = (el.children ?? []).map(serializeNode).join('')

  switch (el.type) {
    case 'root':
    case 'paragraph':
      return children ? `<p>${children}</p>` : ''
    case 'heading':
      return `<${el.tag ?? 'h2'}>${children}</${el.tag ?? 'h2'}>`
    case 'list':
      return el.listType === 'number' ? `<ol>${children}</ol>` : `<ul>${children}</ul>`
    case 'listitem':
      return `<li>${children}</li>`
    case 'link':
      return `<a href="${el.url ?? ''}"${el.target ? ` target="${el.target}"` : ''}>${children}</a>`
    case 'quote':
      return `<blockquote>${children}</blockquote>`
    default:
      return children
  }
}

export function lexicalToHtml(content: { root: { children?: LexicalNode[] } }): string {
  return (content.root.children ?? []).map(serializeNode).join('')
}
