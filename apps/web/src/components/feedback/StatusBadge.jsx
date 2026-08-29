const labels = { normal: 'Normal', warning: 'Warning', critical: 'Critical', active: 'Active', unstable: 'Unstable', offline: 'Offline', new: 'New', acknowledged: 'Acknowledged', resolved: 'Resolved' };

export default function StatusBadge({ status }) {
  return <span className={`status-badge status-${status}`}>{labels[status] ?? status}</span>;
}

