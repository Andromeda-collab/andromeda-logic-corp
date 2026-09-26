import { useState } from "react";

// Accordion — used in Procurement FAQ (9.4) and Product spec blocks (9.3).
export default function Accordion({ items = [] }) {
  const [openIndex, setOpenIndex] = useState(null);

  return (
    <div className="alc-accordion">
      {items.map((item, i) => (
        <div key={i} className="alc-accordion__item">
          <button onClick={() => setOpenIndex(openIndex === i ? null : i)}>
            {item.question}
          </button>
          {openIndex === i && <div className="alc-accordion__answer">{item.answer}</div>}
        </div>
      ))}
    </div>
  );
}
