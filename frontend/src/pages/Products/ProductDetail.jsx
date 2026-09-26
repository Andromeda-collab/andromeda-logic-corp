import { useParams } from "react-router-dom";
// Product detail page — /products/{platformSlug} — Section 9.3.
export default function ProductDetail() {
  const { platformSlug } = useParams();
  return (
    <section className="alc-container">
      <h1>Product: {platformSlug}</h1>
      {/* TODO: Status badge, Capability Blocks, gated spec-sheet download,
          related missions, licensing CTA */}
    </section>
  );
}
