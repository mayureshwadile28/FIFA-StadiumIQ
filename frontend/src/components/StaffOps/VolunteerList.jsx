/**
 * StaffOps/VolunteerList.jsx — Volunteer and staff assignment display
 */
export default function VolunteerList({ staff }) {
  if (!staff) {
    return (
      <div className="card">
        <h2 className="card-title">👥 Volunteer Assignments</h2>
        <p className="text-muted">Loading staff data...</p>
      </div>
    )
  }

  const roleIcons = {
    'crowd guide': '🧭',
    'steward': '🦺',
    'info desk': 'ℹ️',
    'first aid': '🏥',
  }

  return (
    <div className="card">
      <h2 className="card-title">👥 Volunteer Assignments</h2>

      <div className="volunteer-grid" role="list">
        {staff.volunteers.map(vol => (
          <div
            key={vol.id}
            className={`volunteer-card ${vol.status === 'standby' ? 'volunteer-standby' : ''}`}
            role="listitem"
          >
            <div className="volunteer-header">
              <span className="volunteer-icon">{roleIcons[vol.role] || '👤'}</span>
              <div>
                <span className="volunteer-name">{vol.name}</span>
                <span className="volunteer-role">{vol.role}</span>
              </div>
              <span className={`volunteer-status ${vol.status}`}>
                {vol.status}
              </span>
            </div>
            <div className="volunteer-zone">
              <span className="zone-icon">📍</span>
              {vol.zone}
            </div>
          </div>
        ))}
      </div>

      {/* Medical posts */}
      <h3 className="section-list-title" style={{ marginTop: '1.5rem' }}>🏥 Medical Posts</h3>
      <div className="medical-grid">
        {staff.medicalPosts.map(post => (
          <div key={post.id} className="medical-card">
            <div className="medical-header">
              <span className="medical-id">{post.id}</span>
              <span className={`medical-status ${post.staffed ? 'staffed' : 'unstaffed'}`}>
                {post.staffed ? '✅ Staffed' : '⚠️ Unstaffed'}
              </span>
            </div>
            <p className="medical-location">📍 {post.location}</p>
            <p className="medical-incidents">
              Incidents today: <strong>{post.incidents}</strong>
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}
