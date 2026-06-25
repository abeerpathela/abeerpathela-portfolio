import emailjs from '@emailjs/browser'
import { useState, type FormEvent } from 'react'
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
    } catch {
      setStatus('error')
    }
  }

  return (
    <div className={`terminal-form ${visible ? 'terminal-form--visible' : ''}`}>
      <div className="terminal-form__window">
        <div className="terminal-form__header">
          <span className="terminal-form__dot terminal-form__dot--red" />
          <span className="terminal-form__dot terminal-form__dot--yellow" />
          <span className="terminal-form__dot terminal-form__dot--green" />
          <span className="terminal-form__title">contact.sh — pathelaabeer@gmail.com</span>
        </div>

        <form className="terminal-form__body" onSubmit={handleSubmit}>
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
            {status === 'sent' && (
              <span className="terminal-form__status terminal-form__status--ok">
                ✓ signal received
              </span>
            )}
            {status === 'error' && (
              <span className="terminal-form__status terminal-form__status--err">
                ✗ transmission failed — check .env keys
              </span>
            )}
          </div>
        </form>
      </div>
    </div>
  )
}
