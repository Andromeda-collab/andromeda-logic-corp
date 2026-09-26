import { useState, useRef, useEffect } from "react";
import { sendNovaMessage } from "../../services/novaService.js";

// NOVA slide-in panel — Section 10.7 (UI/UX Placement & States).
export default function NovaPanel({ onClose }) {
  const [messages, setMessages] = useState([
    { role: "assistant", text: "Ask about our Technology, Products, Solutions, or Mission Consultation.", citations: [] },
  ]);
  const [input, setInput] = useState("");
  const [status, setStatus] = useState("idle"); // idle | thinking
  const sessionIdRef = useRef(crypto.randomUUID());
  const bodyRef = useRef(null);

  useEffect(() => {
    if (bodyRef.current) {
      bodyRef.current.scrollTop = bodyRef.current.scrollHeight;
    }
  }, [messages, status]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const trimmed = input.trim();
    if (!trimmed || status === "thinking") return;

    setMessages((prev) => [...prev, { role: "user", text: trimmed, citations: [] }]);
    setInput("");
    setStatus("thinking");

    try {
      const res = await sendNovaMessage(trimmed, sessionIdRef.current);
      setMessages((prev) => [
        ...prev,
        { role: "assistant", text: res.data.reply, citations: res.data.citations || [] },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", text: "NOVA couldn't reach the server. Please try again.", citations: [] },
      ]);
    } finally {
      setStatus("idle");
    }
  };

  return (
    <div className="alc-nova-panel" role="dialog" aria-label="NOVA AI Mission Assistant">
      <div className="alc-nova-panel__header">
        <span>NOVA — AI Mission Assistant</span>
        <button onClick={onClose} aria-label="Close NOVA panel">
          &times;
        </button>
      </div>

      <div className="alc-nova-panel__body" ref={bodyRef}>
        {messages.map((m, i) => (
          <div key={i} className={`alc-nova-message alc-nova-message--${m.role}`}>
            <p>{m.text}</p>
            {m.citations.length > 0 && (
              <div className="alc-nova-citations">
                {m.citations.map((c, j) => (
                  <a key={j} href={c.source} className="alc-nova-citation">
                    {c.title || c.source}
                  </a>
                ))}
              </div>
            )}
          </div>
        ))}
        {status === "thinking" && (
          <div className="alc-nova-message alc-nova-message--assistant alc-nova-message--thinking">
            <p>Thinking…</p>
          </div>
        )}
      </div>

      <form className="alc-nova-panel__input" onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Ask NOVA..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          disabled={status === "thinking"}
        />
      </form>
    </div>
  );
}