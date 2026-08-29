import PageContainer from '../../components/common/PageContainer.jsx';
import EmptyState from '../../components/feedback/EmptyState.jsx';

export default function DLHSectionPage({ title, description }) {
  return <PageContainer><p className="eyebrow">DLH · DEVELOPMENT SHELL</p><h1>{title}</h1><p className="page-description">{description}</p><EmptyState title="MVP section shell" description="This navigation destination is reserved for the next documented DLH module. No live data or controls are connected." /></PageContainer>;
}

