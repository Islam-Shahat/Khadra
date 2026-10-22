export default function StudentCard({ student, index, onEdit, onDelete }) {
  // Generate initials
  const initials = student.name
    .trim()
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const formattedId = `STU-${String(index + 1).padStart(2, "0")}`;

  return (
    <div className="student-creative-card">
      {/* Top Banner with ID & Actions */}
      <div className="card-top-bar">
        <span className="card-id-badge">{formattedId}</span>
        <div className="card-quick-actions">
          <button
            type="button"
            className="card-action-btn edit"
            onClick={() => onEdit(student)}
            title="Edit student record"
          >
            Edit
          </button>
          <button
            type="button"
            className="card-action-btn delete"
            onClick={() => onDelete(student.id)}
            title="Delete student"
          >
            Delete
          </button>
        </div>
      </div>

      {/* Main Student Info */}
      <div className="card-identity-block">
        <div className="student-monogram">{initials}</div>
        <div className="student-details">
          <h3 className="student-full-name">{student.name}</h3>
          <span className="student-age-pill">{student.age} years old</span>
        </div>
      </div>

      {/* Email Link */}
      <div className="card-email-row">
        <svg
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
          <polyline points="22,6 12,13 2,6" />
        </svg>
        <a href={`mailto:${student.email}`} className="student-email-link">
          {student.email}
        </a>
      </div>
    </div>
  );
}
