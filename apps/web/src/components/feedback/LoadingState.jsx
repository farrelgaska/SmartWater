export default function LoadingState({ label = 'Loading' }) {
  return <p role="status" className="feedback feedback-muted">{label}…</p>;
}

