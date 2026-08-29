import PageContainer from '../components/common/PageContainer.jsx';
import EmptyState from '../components/feedback/EmptyState.jsx';

export default function FoundationPage({ eyebrow, title, description }) {
  return <PageContainer><p className="eyebrow">{eyebrow}</p><h1>{title}</h1><p className="page-description">{description}</p><EmptyState title="Phase 1 foundation" description="Final mockup content is intentionally deferred to the next implementation phase." /></PageContainer>;
}

