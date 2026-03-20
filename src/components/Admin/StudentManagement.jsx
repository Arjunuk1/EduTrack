import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import Modal from '../Common/Modal';
import AdvancedSearch from '../Common/AdvancedSearch';
import StudentProfile from '../Common/StudentProfile';
import { useNotifications } from '../Common/NotificationSystem';
import { useFormValidation } from '../../hooks/useFormValidation';

const StudentManagement = () => {
  const { students, updateStudents } = useData();
  const { addNotification } = useNotifications();
  const [showModal, setShowModal] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [editingStudent, setEditingStudent] = useState(null);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [filteredStudents, setFilteredStudents] = useState(students);
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'table'
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    dateOfBirth: '',
    class: '',
    section: '',
    rollNumber: '',
    parentName: '',
    parentPhone: '',
    admissionDate: '',
    status: 'Active',
    gender: '',
    bloodGroup: '',
    guardianName: '',
    guardianPhone: '',
    guardianEmail: '',
    guardianRelation: '',
    guardianAddress: ''
  });

  // Validation hook initialization
  const { errors, touched, validateForm, handleFieldChange, handleFieldBlur, clearErrors } = useFormValidation(formData);

  const searchFields = ['name', 'studentId', 'email', 'phone', 'class', 'section'];
  const searchFilters = {
    status: ['Active', 'Inactive', 'Graduated'],
    class: ['Class 1', 'Class 2', 'Class 3', 'Class 4', 'Class 5'],
    section: ['A', 'B', 'C', 'D']
  };

  const handleSearchResults = (results) => {
    setFilteredStudents(results);
  };

  const handleAddStudent = () => {
    setEditingStudent(null);
    clearErrors();
    setFormData({
      name: '',
      email: '',
      phone: '',
      address: '',
      dateOfBirth: '',
      class: '',
      section: '',
      rollNumber: '',
      parentName: '',
      parentPhone: '',
      admissionDate: '',
      status: 'Active',
      gender: '',
      bloodGroup: '',
      guardianName: '',
      guardianPhone: '',
      guardianEmail: '',
      guardianRelation: '',
      guardianAddress: ''
    });
    setShowModal(true);
  };

  const handleEditStudent = (student) => {
    setEditingStudent(student);
    clearErrors();
    setFormData(student);
    setShowModal(true);
  };

  const handleViewProfile = (student) => {
    setSelectedStudent(student);
    setShowProfile(true);
  };

  const handleUpdateProfile = (updatedStudent) => {
    const updatedStudents = students.map(student => 
      student.id === updatedStudent.id ? updatedStudent : student
    );
    updateStudents(updatedStudents);
    addNotification({
      type: 'success',
      title: 'Profile Updated',
      message: `${updatedStudent.name}'s profile has been updated successfully.`
    });
  };

  const handleDeleteStudent = (studentId) => {
    if (window.confirm('Are you sure you want to delete this student?')) {
      const updatedStudents = students.filter(student => student.id !== studentId);
      updateStudents(updatedStudents);
      addNotification({
        type: 'warning',
        title: 'Student Deleted',
        message: 'Student record has been permanently deleted.'
      });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validate form before submitting
    if (!validateForm(formData)) {
      addNotification({
        type: 'error',
        title: 'Validation Error',
        message: 'Please fix the errors in the form before submitting.'
      });
      return;
    }

    // data comes from react-hook-form
    if (editingStudent) {
      // Update existing student
      const updatedStudents = students.map(student => 
        student.id === editingStudent.id ? { ...formData, id: editingStudent.id } : student
      );
      updateStudents(updatedStudents);
      addNotification({
        type: 'success',
        title: 'Student Updated',
        message: `${formData.name}'s information has been updated.`
      });
    } else {
      // Add new student
      const newStudent = {
        ...formData,
        id: Date.now(),
        studentId: `STU${String(students.length + 1).padStart(3, '0')}`
      };
      updateStudents([...students, newStudent]);
      addNotification({
        type: 'success',
        title: 'Student Added',
        message: `${formData.name} has been successfully enrolled.`
      });
    }
    
    setShowModal(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Validate field as user types
    handleFieldChange(name, value);
  };

  const getStudentStats = () => {
    const total = students.length;
    const active = students.filter(s => s.status === 'Active').length;
    const inactive = students.filter(s => s.status === 'Inactive').length;
    const graduated = students.filter(s => s.status === 'Graduated').length;
    
    return { total, active, inactive, graduated };
  };

  const stats = getStudentStats();

  return (
    <div className="student-management">
      <div className="section-header">
        <h2>Student Management</h2>
        <div className="header-actions">
          <div className="view-toggle">
            <button 
              onClick={() => setViewMode('grid')}
              className={`btn btn-sm ${viewMode === 'grid' ? 'btn-primary' : 'btn-secondary'}`}
            >
              📱 Grid
            </button>
            <button 
              onClick={() => setViewMode('table')}
              className={`btn btn-sm ${viewMode === 'table' ? 'btn-primary' : 'btn-secondary'}`}
            >
              📋 Table
            </button>
          </div>
          <button 
            onClick={handleAddStudent}
            className="btn btn-primary"
          >
            ➕ Add New Student
          </button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="stats-grid">
        <div className="stat-card total">
          <div className="stat-icon">👥</div>
          <div className="stat-content">
            <div className="stat-number">{stats.total}</div>
            <div className="stat-label">Total Students</div>
          </div>
        </div>
        <div className="stat-card active">
          <div className="stat-icon">✅</div>
          <div className="stat-content">
            <div className="stat-number">{stats.active}</div>
            <div className="stat-label">Active Students</div>
          </div>
        </div>
        <div className="stat-card inactive">
          <div className="stat-icon">⏸️</div>
          <div className="stat-content">
            <div className="stat-number">{stats.inactive}</div>
            <div className="stat-label">Inactive Students</div>
          </div>
        </div>
        <div className="stat-card graduated">
          <div className="stat-icon">🎓</div>
          <div className="stat-content">
            <div className="stat-number">{stats.graduated}</div>
            <div className="stat-label">Graduated</div>
          </div>
        </div>
      </div>

      {/* Advanced Search */}
      <AdvancedSearch
        data={students}
        searchFields={searchFields}
        filters={searchFilters}
        onResults={handleSearchResults}
        placeholder="Search students by name, ID, email, phone..."
      />

      {/* Student Display */}
      {viewMode === 'grid' ? (
        <div className="students-grid">
          {filteredStudents.map(student => (
            <div key={student.id} className="student-card">
              <div className="card-header">
                <img 
                  src={student.avatar || `https://ui-avatars.com/api/?name=${student.name}&size=60&background=667eea&color=fff`}
                  alt={student.name}
                  className="student-avatar"
                />
                <div className="student-info">
                  <h4>{student.name}</h4>
                  <p className="student-id">{student.studentId}</p>
                  <span className={`status-badge ${student.status?.toLowerCase()}`}>
                    {student.status || 'Active'}
                  </span>
                </div>
              </div>
              
              <div className="card-body">
                <div className="info-row">
                  <span className="label">📧 Email:</span>
                  <span className="value">{student.email}</span>
                </div>
                <div className="info-row">
                  <span className="label">📚 Class:</span>
                  <span className="value">{student.class} - {student.section}</span>
                </div>
                <div className="info-row">
                  <span className="label">📞 Phone:</span>
                  <span className="value">{student.phone || 'N/A'}</span>
                </div>
              </div>
              
              <div className="card-actions">
                <button 
                  onClick={() => handleViewProfile(student)}
                  className="btn btn-info btn-small"
                >
                  👁️ View
                </button>
                <button 
                  onClick={() => handleEditStudent(student)}
                  className="btn btn-secondary btn-small"
                >
                  ✏️ Edit
                </button>
                <button 
                  onClick={() => handleDeleteStudent(student.id)}
                  className="btn btn-danger btn-small"
                >
                  🗑️ Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="students-table-container">
          <table className="table">
            <thead>
              <tr>
                <th>Student ID</th>
                <th>Name</th>
                <th>Email</th>
                <th>Class</th>
                <th>Section</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredStudents.map(student => (
                <tr key={student.id}>
                  <td>{student.studentId}</td>
                  <td>{student.name}</td>
                  <td>{student.email}</td>
                  <td>{student.class}</td>
                  <td>{student.section}</td>
                  <td>
                    <span className={`badge ${student.status === 'Active' ? 'badge-success' : 'badge-danger'}`}>
                      {student.status}
                    </span>
                  </td>
                  <td>
                    <div className="action-buttons">
                      <button 
                        onClick={() => handleViewProfile(student)}
                        className="btn btn-info btn-small"
                      >
                        👁️ View
                      </button>
                      <button 
                        onClick={() => handleEditStudent(student)}
                        className="btn btn-secondary btn-small"
                      >
                        ✏️ Edit
                      </button>
                      <button 
                        onClick={() => handleDeleteStudent(student.id)}
                        className="btn btn-danger btn-small"
                      >
                        🗑️ Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {filteredStudents.length === 0 && (
        <div className="empty-state">
          <div className="empty-icon">🔍</div>
          <h3>No students found</h3>
          <p>Try adjusting your search criteria or add a new student.</p>
        </div>
      )}

      {showModal && (
        <Modal
          title={editingStudent ? 'Edit Student' : 'Add New Student'}
          onClose={() => setShowModal(false)}
        >
          <form onSubmit={handleSubmit}>
            <div className="form-grid">
              <div className="form-group">
                <label>Name *</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  onBlur={() => handleFieldBlur('name')}
                  className={`form-control ${errors.name && touched.name ? 'error' : ''}`}
                  required
                />
                {errors.name && touched.name && <span className="error-message">{errors.name}</span>}
              </div>
              
              <div className="form-group">
                <label>Email *</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  onBlur={() => handleFieldBlur('email')}
                  className={`form-control ${errors.email && touched.email ? 'error' : ''}`}
                  required
                />
                {errors.email && touched.email && <span className="error-message">{errors.email}</span>}
              </div>
              
              <div className="form-group">
                <label>Phone</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  onBlur={() => handleFieldBlur('phone')}
                  className={`form-control ${errors.phone && touched.phone ? 'error' : ''}`}
                />
                {errors.phone && touched.phone && <span className="error-message">{errors.phone}</span>}
              </div>
              
              <div className="form-group">
                <label>Date of Birth</label>
                <input
                  type="date"
                  name="dateOfBirth"
                  value={formData.dateOfBirth}
                  onChange={handleInputChange}
                  onBlur={() => handleFieldBlur('dateOfBirth')}
                  className={`form-control ${errors.dateOfBirth && touched.dateOfBirth ? 'error' : ''}`}
                />
              </div>
              
              <div className="form-group">
                <label>Class</label>
                <input
                  type="text"
                  name="class"
                  value={formData.class}
                  onChange={handleInputChange}
                  className="form-control"
                />
              </div>
              
              <div className="form-group">
                <label>Section</label>
                <input
                  type="text"
                  name="section"
                  value={formData.section}
                  onChange={handleInputChange}
                  className="form-control"
                />
              </div>
              
              <div className="form-group">
                <label>Roll Number</label>
                <input
                  type="text"
                  name="rollNumber"
                  value={formData.rollNumber}
                  onChange={handleInputChange}
                  className="form-control"
                />
              </div>
              
              <div className="form-group">
                <label>Parent Name</label>
                <input
                  type="text"
                  name="parentName"
                  value={formData.parentName}
                  onChange={handleInputChange}
                  className="form-control"
                />
              </div>
              
              <div className="form-group">
                <label>Parent Phone</label>
                <input
                  type="tel"
                  name="parentPhone"
                  value={formData.parentPhone}
                  onChange={handleInputChange}
                  className="form-control"
                />
              </div>
              
              <div className="form-group">
                <label>Admission Date</label>
                <input
                  type="date"
                  name="admissionDate"
                  value={formData.admissionDate}
                  onChange={handleInputChange}
                  className="form-control"
                />
              </div>
              
              <div className="form-group full-width">
                <label>Address</label>
                <textarea
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  className="form-control"
                  rows="3"
                />
              </div>
              
              <div className="form-group">
                <label>Status</label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleInputChange}
                  className="form-control"
                >
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                  <option value="Graduated">Graduated</option>
                </select>
              </div>
            </div>
            
            <div className="form-actions">
              <button type="button" onClick={() => setShowModal(false)} className="btn btn-secondary">
                Cancel
              </button>
              <button type="submit" className="btn btn-primary">
                {editingStudent ? 'Update Student' : 'Add Student'}
              </button>
            </div>
          </form>
        </Modal>
      )}

      {showProfile && selectedStudent && (
        <StudentProfile
          student={selectedStudent}
          onUpdate={handleUpdateProfile}
          onClose={() => setShowProfile(false)}
        />
      )}

      <style jsx>{`
        .section-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 30px;
          flex-wrap: wrap;
          gap: 15px;
        }

        .section-header h2 {
          margin: 0;
          color: #333;
          font-size: 28px;
          font-weight: 700;
        }

        .header-actions {
          display: flex;
          gap: 15px;
          align-items: center;
          flex-wrap: wrap;
        }

        .view-toggle {
          display: flex;
          gap: 5px;
          background: #f0f0f0;
          border-radius: 8px;
          padding: 4px;
        }

        .btn-sm {
          padding: 6px 12px;
          font-size: 12px;
          border-radius: 6px;
        }

        .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 20px;
          margin-bottom: 30px;
        }

        .stat-card {
          background: white;
          border-radius: 12px;
          padding: 25px;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
          border-left: 4px solid;
          display: flex;
          align-items: center;
          gap: 20px;
          transition: all 0.3s ease;
        }

        .stat-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 30px rgba(0, 0, 0, 0.12);
        }

        .stat-card.total {
          border-left-color: #667eea;
        }

        .stat-card.active {
          border-left-color: #28a745;
        }

        .stat-card.inactive {
          border-left-color: #ffc107;
        }

        .stat-card.graduated {
          border-left-color: #17a2b8;
        }

        .stat-icon {
          font-size: 32px;
          opacity: 0.8;
        }

        .stat-content {
          flex: 1;
        }

        .stat-number {
          font-size: 28px;
          font-weight: bold;
          color: #333;
          margin-bottom: 5px;
        }

        .stat-label {
          font-size: 14px;
          color: #666;
          font-weight: 500;
        }

        .students-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
          gap: 25px;
          margin-bottom: 30px;
        }

        .student-card {
          background: white;
          border-radius: 16px;
          padding: 25px;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
          border: 1px solid #f0f0f0;
          transition: all 0.3s ease;
        }

        .student-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 12px 40px rgba(0, 0, 0, 0.15);
          border-color: #667eea;
        }

        .card-header {
          display: flex;
          align-items: center;
          gap: 15px;
          margin-bottom: 20px;
          padding-bottom: 15px;
          border-bottom: 1px solid #f0f0f0;
        }

        .student-avatar {
          width: 60px;
          height: 60px;
          border-radius: 50%;
          border: 3px solid #f0f0f0;
        }

        .student-info h4 {
          margin: 0 0 5px 0;
          color: #333;
          font-size: 18px;
          font-weight: 600;
        }

        .student-id {
          margin: 0 0 8px 0;
          color: #666;
          font-size: 14px;
        }

        .status-badge {
          padding: 4px 12px;
          border-radius: 20px;
          font-size: 11px;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .status-badge.active {
          background: #d4edda;
          color: #155724;
        }

        .status-badge.inactive {
          background: #f8d7da;
          color: #721c24;
        }

        .status-badge.graduated {
          background: #d1ecf1;
          color: #0c5460;
        }

        .card-body {
          margin-bottom: 20px;
        }

        .info-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 12px;
          padding: 8px 0;
        }

        .info-row .label {
          font-weight: 500;
          color: #666;
          font-size: 13px;
        }

        .info-row .value {
          color: #333;
          font-size: 13px;
          text-align: right;
          max-width: 60%;
          word-break: break-word;
        }

        .card-actions {
          display: flex;
          gap: 8px;
          justify-content: space-between;
        }

        .btn-small {
          padding: 6px 12px;
          font-size: 11px;
          border-radius: 6px;
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 4px;
        }

        .students-table-container {
          background: white;
          border-radius: 12px;
          overflow: hidden;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
          margin-bottom: 30px;
        }

        .table {
          width: 100%;
          border-collapse: collapse;
          margin: 0;
        }

        .table th,
        .table td {
          padding: 15px;
          text-align: left;
          border-bottom: 1px solid #f0f0f0;
        }

        .table th {
          background: #f8f9fa;
          font-weight: 600;
          color: #333;
          font-size: 14px;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .table tbody tr:hover {
          background: #f8f9fa;
        }

        .action-buttons {
          display: flex;
          gap: 5px;
        }

        .empty-state {
          text-align: center;
          padding: 60px 20px;
          background: white;
          border-radius: 12px;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
        }

        .empty-icon {
          font-size: 64px;
          margin-bottom: 20px;
          opacity: 0.5;
        }

        .empty-state h3 {
          margin: 0 0 10px 0;
          color: #333;
          font-size: 24px;
        }

        .empty-state p {
          margin: 0;
          color: #666;
          font-size: 16px;
        }

        .form-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 20px;
        }

        .form-group.full-width {
          grid-column: 1 / -1;
        }

        .form-group label {
          display: block;
          margin-bottom: 8px;
          font-weight: 500;
          color: #333;
        }

        .form-control {
          width: 100%;
          padding: 12px;
          border: 2px solid #e0e0e0;
          border-radius: 8px;
          font-size: 14px;
          transition: border-color 0.3s ease;
        }

        .form-control:focus {
          outline: none;
          border-color: #667eea;
          box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
        }

        .form-actions {
          display: flex;
          justify-content: flex-end;
          gap: 15px;
          margin-top: 25px;
          padding-top: 20px;
          border-top: 1px solid #eee;
        }

        @media (max-width: 768px) {
          .section-header {
            flex-direction: column;
            align-items: stretch;
          }

          .header-actions {
            flex-direction: column;
          }

          .stats-grid {
            grid-template-columns: repeat(2, 1fr);
            gap: 15px;
          }

          .students-grid {
            grid-template-columns: 1fr;
            gap: 20px;
          }

          .student-card {
            padding: 20px;
          }

          .form-grid {
            grid-template-columns: 1fr;
            gap: 15px;
          }

          .table {
            font-size: 12px;
          }

          .table th,
          .table td {
            padding: 10px 8px;
          }

          .action-buttons {
            flex-direction: column;
            gap: 5px;
          }

          .btn-small {
            font-size: 10px;
            padding: 4px 8px;
          }
        }
      `}</style>
    </div>
  );
};

export default StudentManagement;
