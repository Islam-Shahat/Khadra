// import { useState, useEffect } from "react";
// import { initialStudents } from "./data/studentsData";
// import StudentForm from "./components/StudentForm";
// import StudentCard from "./components/StudentCard";
// import "./App.css";

import Effects from "./components/pages/Effects";
import ProductsList from "./components/products/ProductsList";

// export default function App() {
//   // 1. Initial Students State (from localStorage or initialStudents from data folder)
//   const [students, setStudents] = useState(() => {
//     const saved = localStorage.getItem("students_data");
//     if (saved) {
//       try {
//         const parsed = JSON.parse(saved);
//         if (Array.isArray(parsed) && parsed.length > 0) {
//           return parsed;
//         }
//       } catch {
//         // fallback to initial mock data
//       }
//     }
//     return initialStudents;
//   });

//   // 2. Form Input States
//   const [name, setName] = useState("");
//   const [age, setAge] = useState("");
//   const [email, setEmail] = useState("");

//   // 3. Edit Mode State (holds student ID when editing, otherwise null)
//   const [editingId, setEditingId] = useState(null);

//   // 4. Validation Error Message State
//   const [error, setError] = useState("");

//   // 5. Search Query State
//   const [searchQuery, setSearchQuery] = useState("");

//   // 6. useEffect: Save to localStorage and update document title whenever students change
//   useEffect(() => {
//     localStorage.setItem("students_data", JSON.stringify(students));
//     document.title = `(${students.length}) Students — Registry Studio`;
//   }, [students]);

//   // Handle Form Submission (Add or Update)
//   function handleSubmit(e) {
//     e.preventDefault();

//     // Form Validation (Simple and beginner-friendly)
//     if (!name.trim() || !age || !email.trim()) {
//       setError("Please fill in all required fields (Name, Age, and Email).");
//       return;
//     }

//     if (Number(age) <= 0 || isNaN(Number(age))) {
//       setError("Please enter a valid age (greater than 0).");
//       return;
//     }

//     if (!email.includes("@")) {
//       setError("Please enter a valid email address containing an '@'.");
//       return;
//     }

//     // Check if in Edit Mode or Add Mode
//     if (editingId !== null) {
//       // Update existing student
//       const updatedList = students.map((student) => {
//         if (student.id === editingId) {
//           return {
//             ...student,
//             name: name.trim(),
//             age: Number(age),
//             email: email.trim(),
//           };
//         }
//         return student;
//       });

//       setStudents(updatedList);
//       setEditingId(null);
//     } else {
//       // Add new student
//       const newStudent = {
//         id: Date.now(),
//         name: name.trim(),
//         age: Number(age),
//         email: email.trim(),
//       };

//       setStudents([...students, newStudent]);
//     }

//     // Reset form fields & clear errors
//     setName("");
//     setAge("");
//     setEmail("");
//     setError("");
//   }

//   // Handle Deleting a Student
//   function handleDelete(id) {
//     const remainingStudents = students.filter((student) => student.id !== id);
//     setStudents(remainingStudents);

//     // If currently editing the deleted student, cancel edit mode
//     if (editingId === id) {
//       handleCancelEdit();
//     }
//   }

//   // Handle Initiating Edit Mode
//   function handleEdit(student) {
//     setEditingId(student.id);
//     setName(student.name);
//     setAge(student.age);
//     setEmail(student.email);
//     setError("");

//     // Smooth scroll to top on mobile
//     window.scrollTo({ top: 0, behavior: "smooth" });
//   }

//   // Handle Cancelling Edit Mode
//   function handleCancelEdit() {
//     setEditingId(null);
//     setName("");
//     setAge("");
//     setEmail("");
//     setError("");
//   }

//   // Reset to original demo data from src/data/studentsData.js
//   function handleResetDemo() {
//     setStudents(initialStudents);
//     setEditingId(null);
//     setName("");
//     setAge("");
//     setEmail("");
//     setError("");
//     setSearchQuery("");
//   }

//   // Filter students based on search query
//   const filteredStudents = students.filter((student) => {
//     const query = searchQuery.toLowerCase().trim();
//     if (!query) return true;
//     return (
//       student.name.toLowerCase().includes(query) ||
//       student.email.toLowerCase().includes(query)
//     );
//   });

//   // Calculate simple stats
//   const totalStudents = students.length;
//   const averageAge =
//     totalStudents > 0
//       ? (
//           students.reduce((acc, curr) => acc + Number(curr.age || 0), 0) /
//           totalStudents
//         ).toFixed(1)
//       : 0;

//   return (
//     <div className="studio-app">
//       {/* Studio Header */}
//       <header className="studio-header">
//         <div className="header-brand-group">
//           <div className="header-logo-mark">AR</div>
//           <div>
//             <h1 className="studio-main-title">Academic Registry Studio</h1>
//             <p className="studio-sub-title">
//               Student Management & Enrollment System
//             </p>
//           </div>
//         </div>

//         <div className="header-actions">
//           <button
//             type="button"
//             className="btn-restore-demo"
//             onClick={handleResetDemo}
//             title="Restore original demo students"
//           >
//             ↻ Restore Demo Data
//           </button>
//           <div className="header-meta-pill">
//             <span className="dot-indicator"></span>
//             <span>Active Session 2026</span>
//           </div>
//         </div>
//       </header>

//       {/* Main Studio Workspace: Creative Split Layout */}
//       <main className="studio-workspace">
//         {/* Left Column: Form Docket + Quick Metric Widget */}
//         <aside className="workspace-sidebar">
//           <StudentForm
//             name={name}
//             setName={setName}
//             age={age}
//             setAge={setAge}
//             email={email}
//             setEmail={setEmail}
//             error={error}
//             isEditing={editingId !== null}
//             onSubmit={handleSubmit}
//             onCancel={handleCancelEdit}
//           />

//           {/* Creative Mini Stats Widget */}
//           <div className="sidebar-stats-widget">
//             <div className="mini-stat-card">
//               <span className="mini-stat-label">Total Enrolled</span>
//               <span className="mini-stat-value">{totalStudents}</span>
//             </div>
//             <div className="mini-stat-divider"></div>
//             <div className="mini-stat-card">
//               <span className="mini-stat-label">Average Age</span>
//               <span className="mini-stat-value">
//                 {averageAge} <small>yrs</small>
//               </span>
//             </div>
//           </div>
//         </aside>

//         {/* Right Column: Student Directory Showcase */}
//         <section className="workspace-main-panel">
//           {/* Top Bar with Title and Search Input */}
//           <div className="panel-top-bar">
//             <div>
//               <h2 className="panel-title">Student Directory</h2>
//               <p className="panel-caption">
//                 Showing {filteredStudents.length} of {totalStudents} registered students
//               </p>
//             </div>

//             {/* Creative Search Bar */}
//             <div className="search-bar-wrapper">
//               <svg
//                 className="search-icon"
//                 width="16"
//                 height="16"
//                 viewBox="0 0 24 24"
//                 fill="none"
//                 stroke="currentColor"
//                 strokeWidth="2.5"
//               >
//                 <circle cx="11" cy="11" r="8" />
//                 <line x1="21" y1="21" x2="16.65" y2="16.65" />
//               </svg>
//               <input
//                 type="text"
//                 className="search-input"
//                 placeholder="Search by name or email..."
//                 value={searchQuery}
//                 onChange={(e) => setSearchQuery(e.target.value)}
//               />
//               {searchQuery && (
//                 <button
//                   type="button"
//                   className="search-clear-btn"
//                   onClick={() => setSearchQuery("")}
//                   title="Clear search"
//                 >
//                   ×
//                 </button>
//               )}
//             </div>
//           </div>

//           {/* Conditional Rendering: Empty State vs Cards Grid */}
//           {students.length === 0 ? (
//             <div className="empty-catalog-state">
//               <div className="empty-catalog-icon">∅</div>
//               <h3>No Students Enrolled</h3>
//               <p>
//                 The directory is currently empty. Use the registration docket on
//                 the left to enroll your first student, or click "Restore Demo Data".
//               </p>
//               <button
//                 type="button"
//                 className="btn btn-primary-submit"
//                 style={{ marginTop: 16 }}
//                 onClick={handleResetDemo}
//               >
//                 Restore Demo Students
//               </button>
//             </div>
//           ) : filteredStudents.length === 0 ? (
//             <div className="empty-catalog-state">
//               <div className="empty-catalog-icon">🔍</div>
//               <h3>No Matching Students</h3>
//               <p>
//                 No students match your search query: <strong>"{searchQuery}"</strong>.
//               </p>
//               <button
//                 type="button"
//                 className="btn btn-secondary-cancel"
//                 style={{ marginTop: 14 }}
//                 onClick={() => setSearchQuery("")}
//               >
//                 Clear Search Filter
//               </button>
//             </div>
//           ) : (
//             <div className="creative-cards-grid">
//               {filteredStudents.map((student, index) => (
//                 <StudentCard
//                   key={student.id}
//                   student={student}
//                   index={index}
//                   onEdit={handleEdit}
//                   onDelete={handleDelete}
//                 />
//               ))}
//             </div>
//           )}
//         </section>
//       </main>
//     </div>
//   );
// }




export default function App() {
  return (
    <div>
      <ProductsList />
    </div>
  );
}

