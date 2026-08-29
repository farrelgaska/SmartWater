export default function EmptyState({ title, description }) {
  return (
    <section className="feedback-card" aria-live="polite">
      <h2>{title}</h2>
      <p>{description}</p>
    </section>
  );
}

