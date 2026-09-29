// Turns URLs and email addresses inside free text from the sheet into links.
const TOKEN = /(https?:\/\/[^\s]+|[\w.+-]+@[\w-]+\.[\w.-]+)/g

export default function Linkify({ text = '' }) {
  const parts = text.split(TOKEN)
  return parts.map((part, i) => {
    if (!part) return null
    if (/^https?:\/\//.test(part)) {
      let label = part
      try {
        label = new URL(part).hostname.replace(/^www\./, '')
      } catch {}
      return (
        <a key={i} href={part} target='_blank' rel='noopener noreferrer' className='link break-all'>
          {label}
        </a>
      )
    }
    if (/^[\w.+-]+@/.test(part)) {
      return (
        <a key={i} href={`mailto:${part}`} className='link break-all'>
          {part}
        </a>
      )
    }
    // Calm down all-caps notes typed into the sheet
    const shouting = /[A-Z]{3,}/.test(part) && part === part.toUpperCase()
    return <span key={i}>{shouting ? part.charAt(0) + part.slice(1).toLowerCase() : part}</span>
  })
}
