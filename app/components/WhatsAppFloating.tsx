import { MessageCircle } from 'lucide-react'

export default function WhatsAppFloating() {
  return (
    <a
      href="https://wa.me/919413419163"
      className="whatsapp-float"
      aria-label="Chat with us on WhatsApp"
      title="Chat with us on WhatsApp"
      target="_blank"
      rel="noopener noreferrer"
    >
      <MessageCircle size={24} />
    </a>
  )
}
