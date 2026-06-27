import { useCallback, useEffect, useState } from "react";
import emailjs from "@emailjs/browser";
import { SiGithub, SiInstagram } from "react-icons/si";
import { TbBrandLinkedin } from "react-icons/tb";
import { PORTFOLIO_DATA } from "../../data";
import { forwardWheelToScroll } from "../../lib/scroll-bridge";

interface ContactOverlayProps {
  visible: boolean;
}

export function ContactOverlay({ visible }: ContactOverlayProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [msg, setMsg] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");

  const submit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      setStatus("sending");
      try {
        const serviceId = import.meta.env.VITE_EMAILJS_SERVICE_ID;
        const templateId = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
        const publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;
        if (!serviceId || !templateId || !publicKey) {
          throw new Error("EmailJS environment variables are not configured");
        }
        await emailjs.send(
          serviceId,
          templateId,
          {
            from_name: name,
            from_email: email,
            reply_to: email,
            subject: subject || `[Portfolio] Message from ${name}`,
            message: msg,
            to_email: PORTFOLIO_DATA.contact.email,
          },
          publicKey,
        );
        setStatus("sent");
        setName("");
        setEmail("");
        setSubject("");
        setMsg("");
      } catch {
        setStatus("error");
      }
    },
    [name, email, subject, msg],
  );

  useEffect(() => {
    if (!visible) return;
    const onWheel = (e: WheelEvent) => forwardWheelToScroll(e.deltaY);
    window.addEventListener("wheel", onWheel, { passive: true, capture: true });
    return () => window.removeEventListener("wheel", onWheel, { capture: true });
  }, [visible]);

  if (!visible) return null;

  const socialClass =
    "flex h-11 w-11 items-center justify-center rounded-lg border border-primary/40 bg-background/70 backdrop-blur-md transition-all duration-200 hover:-translate-y-0.5 hover:border-primary hover:bg-primary/15 hover:shadow-[0_0_20px_oklch(0.85_0.18_85/0.45)]";

  return (
    <div
      className="pointer-events-none fixed inset-0 z-40 flex items-center justify-center px-4 pb-24 pt-20"
      onWheel={(e) => forwardWheelToScroll(e.deltaY)}
    >
      <div className="pointer-events-auto flex w-full max-w-4xl flex-col gap-8 md:flex-row md:items-start md:justify-center">
        {/* Contact */}
        <section className="premium-panel flex-1 p-6 md:max-w-md">
          <h2 className="section-heading mb-1">Contact</h2>
          <p className="mb-5 text-sm text-foreground/60">{PORTFOLIO_DATA.contact.availability}</p>
          <form onSubmit={submit} className="space-y-4">
            <div>
              <label className="field-label">Name</label>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="field-input"
                placeholder="Your name"
              />
            </div>
            <div>
              <label className="field-label">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="field-input"
                placeholder="you@email.com"
              />
            </div>
            <div>
              <label className="field-label">Subject</label>
              <input
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="field-input"
                placeholder="What's this about?"
              />
            </div>
            <div>
              <label className="field-label">Message</label>
              <textarea
                value={msg}
                onChange={(e) => setMsg(e.target.value)}
                required
                rows={4}
                className="field-input resize-none"
                placeholder="Tell me about your project or opportunity..."
              />
            </div>
            <button type="submit" disabled={status === "sending"} className="btn-primary w-full">
              {status === "sending" ? "Sending..." : "Send Message"}
            </button>
            {status === "sent" && (
              <p className="text-center text-sm text-emerald-400">Message sent successfully!</p>
            )}
            {status === "error" && (
              <p className="text-center text-sm text-red-400">Failed to send. Please try again.</p>
            )}
          </form>
          <p className="mt-4 text-center text-xs text-foreground/45">{PORTFOLIO_DATA.contact.email}</p>
        </section>

        {/* Connect */}
        <section className="premium-panel flex-1 p-6 md:max-w-sm">
          <h2 className="section-heading mb-1">Connect</h2>
          <p className="mb-6 text-sm text-foreground/60">
            Find me on social platforms — open to collaborations, internships, and full-time roles.
          </p>
          <div className="grid grid-cols-2 gap-3">
            <a href={PORTFOLIO_DATA.socials.github} target="_blank" rel="noreferrer" className="connect-tile">
              <SiGithub size={22} />
              <span>GitHub</span>
            </a>
            <a href={PORTFOLIO_DATA.socials.linkedin} target="_blank" rel="noreferrer" className="connect-tile">
              <TbBrandLinkedin size={22} />
              <span>LinkedIn</span>
            </a>
            <a href={PORTFOLIO_DATA.socials.leetcode} target="_blank" rel="noreferrer" className="connect-tile">
              <span className="text-base font-bold">LC</span>
              <span>LeetCode</span>
            </a>
            <a href={PORTFOLIO_DATA.socials.instagram} target="_blank" rel="noreferrer" className="connect-tile">
              <SiInstagram size={22} />
              <span>Instagram</span>
            </a>
          </div>
          <a
            href={`mailto:${PORTFOLIO_DATA.socials.email}`}
            className="connect-tile mt-3 flex w-full flex-row items-center justify-center gap-2"
          >
            <span className="text-base font-bold">@</span>
            <span>Email Me Directly</span>
          </a>
          <p className="mt-5 text-xs text-foreground/40">{PORTFOLIO_DATA.contact.location}</p>
        </section>
      </div>
    </div>
  );
}
