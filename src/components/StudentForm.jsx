export default function StudentForm({
  name,
  setName,
  age,
  setAge,
  email,
  setEmail,
  error,
  isEditing,
  onSubmit,
  onCancel,
}) {
  return (
    <div className={`form-docket ${isEditing ? "is-editing-mode" : ""}`}>
      {/* Creative Header with Status Pill */}
      <div className="docket-header">
        <div className="docket-badge">
          <span className="pulse-dot"></span>
          <span>{isEditing ? "Editing Record" : "Registration Desk"}</span>
        </div>
        <h2 className="docket-title">
          {isEditing ? "Update Student" : "Enroll New Student"}
        </h2>
        <p className="docket-subtitle">
          {isEditing
            ? "Modify student information and save changes."
            : "Complete the fields below to register a student."}
        </p>
      </div>

      {/* Validation Error Banner */}
      {error && (
        <div className="form-error-banner" role="alert">
          <span className="error-icon">!</span>
          <span>{error}</span>
        </div>
      )}

      {/* Form Fields with Creative Numbering */}
      <form onSubmit={onSubmit} className="creative-form">
        <div className="field-block">
          <div className="field-label-row">
            <span className="field-num">01</span>
            <label htmlFor="student-name">Full Name</label>
          </div>
          <input
            id="student-name"
            type="text"
            placeholder="e.g. Youssef Ibrahim"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        <div className="field-row-split">
          <div className="field-block">
            <div className="field-label-row">
              <span className="field-num">02</span>
              <label htmlFor="student-age">Age</label>
            </div>
            <input
              id="student-age"
              type="number"
              placeholder="e.g. 21"
              value={age}
              onChange={(e) => setAge(e.target.value)}
            />
          </div>

          <div className="field-block field-email">
            <div className="field-label-row">
              <span className="field-num">03</span>
              <label htmlFor="student-email">Email Address</label>
            </div>
            <input
              id="student-email"
              type="email"
              placeholder="name@campus.edu"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="form-actions-row">
          <button type="submit" className="btn btn-primary-submit">
            {isEditing ? "✓ Save Changes" : "+ Enroll Student"}
          </button>

          {isEditing && (
            <button
              type="button"
              className="btn btn-secondary-cancel"
              onClick={onCancel}
            >
              Cancel
            </button>
          )}
        </div>
      </form>
    </div>
  );
}
