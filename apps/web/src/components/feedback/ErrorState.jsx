export default function ErrorState({ message = 'Something went wrong.' }) {
  return <p role="alert" className="feedback feedback-critical">{message}</p>;
}

