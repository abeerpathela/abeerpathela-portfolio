import emailjs from '@emailjs/browser'
import gsap from 'gsap'
import { useRef, useState, type FormEvent } from 'react'
import './TerminalForm.css'

type TerminalFormProps = {
  visible: boolean
}

type FormState = {
  name: string
  email: string
  message: string
}

const INITIAL: FormState = { name: '', email: '', message: '' }

export function TerminalForm({ visible }: TerminalFormProps) {
  const [form, setForm] = useState<FormState>(INITIAL)
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle')
  const formRef = useRef<HTMLFormElement>(null)
  const windowRef = useRef<HTMLDivElement>(null)
  const particlesRef = useRef<HTMLDivElement>(null)

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault()

    const serviceId = import.meta.env.VITE_EMAILJS_SERVICE_ID
    const templateId = import.meta.env.VITE_EMAILJS_TEMPLATE_ID
    const publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY

    if (!serviceId || !templateId || !publicKey) {
      setStatus('error')
      return
    }

    setStatus('sending')

    try {
      await emailjs.send(
        serviceId,
        templateId,
        {
          from_name: form.name,
          reply_to: form.email,
          message: form.message,
          to_email: 'pathelaabeer@gmail.com',
        },
        publicKey,
      )
      setStatus('sent')
      setForm(INITIAL)

      // Particle dissolution effect
      if (windowRef.current && particlesRef.current) {
        // Create light particles
        const container = particlesRef.current
        container.innerHTML = ''
        for (let i = 0; i < 30; i++) {
          const particle = document.createElement('div')
          particle.className = 'terminal-particle'
          particle.style.left = `${Math.random() * 100}%`
          particle.style.top = `${Math.random() * 100}%`
          container.appendChild(particle)

          gsap.to(particle, {
            x: (Math.random() - 0.5) * 200,
            y: (Math.random() - 0.5) * 200,
            opacity: 0,
            scale: 0,
            duration: 1.5 + Math.random(),
            ease: 'power2.out',
            delay: Math.random() * 0.3,
          })
        }

        // Fade the form
        gsap.to(windowRef.current, {
          opacity: 0,
          scale: 0.95,
          duration: 1,
          ease: 'power2.out',
          delay: 0.2,
          onComplete: () => {
            // Restore after 3 seconds
            setTimeout(() => {
              if (windowRef.current) {
                gsap.to(windowRef.current, {
                  opacity: 1,
                  scale: 1,
                  duration: 0.6,
                  ease: 'power2.out',
                })
              }
              setStatus('idle')
            }, 3000)
          },
        })
      }
    } catch {
      setStatus('error')
    }
  }

  return (
    <div className={`terminal-form ${visible ? 'terminal-form--visible' : ''}`}>
      <div ref={windowRef} className="terminal-form__window">
        <div className="terminal-form__header">
          <span className="terminal-form__dot terminal-form__dot--red" />
          <span className="terminal-form__dot terminal-form__dot--yellow" />
          <span className="terminal-form__dot terminal-form__dot--green" />
          <span className="terminal-form__title">contact.sh — pathelaabeer@gmail.com</span>
        </div>

        {status === 'sent' ? (
          <div className="terminal-form__success">
            <div className="terminal-form__success-icon">✦</div>
            <p className="terminal-form__success-text">Signal received!</p>
            <p className="terminal-form__success-sub">Transmission successful — message delivered.</p>
          </div>
        ) : (
          <form ref={formRef} className="terminal-form__body" onSubmit={handleSubmit}>
            <label className="terminal-form__line">
              <span className="terminal-form__prompt">$ name:</span>
              <input
                type="text"
                required
                value={form.name}
                onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                placeholder="your name"
                autoComplete="name"
              />
            </label>

            <label className="terminal-form__line">
              <span className="terminal-form__prompt">$ email:</span>
              <input
                type="email"
                required
                value={form.email}
                onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                placeholder="you@domain.com"
                autoComplete="email"
              />
            </label>

            <label className="terminal-form__line terminal-form__line--message">
              <span className="terminal-form__prompt">$ message:</span>
              <textarea
                required
                rows={4}
                value={form.message}
                onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))}
                placeholder="transmit your message..."
              />
            </label>

            <div className="terminal-form__actions">
              <button type="submit" disabled={status === 'sending'}>
                {status === 'sending' ? '> transmitting...' : '> send_transmission'}
              </button>
              {status === 'error' && (
                <span className="terminal-form__status terminal-form__status--err">
                  ✗ transmission failed — check .env keys
                </span>
              )}
            </div>
          </form>
        )}
      </div>

      {/* Particle dissolution container */}
      <div ref={particlesRef} className="terminal-form__particles" />
    </div>
  )
}
