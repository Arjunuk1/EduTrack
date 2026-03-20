import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import Modal from '../Common/Modal';
import EmptyState from '../Common/EmptyState';

const CourseManagement = () => {
  const { courses, updateCourses, faculty } = useData();
  const [showModal, setShowModal] = useState(false);
  const [editingCourse, setEditingCourse] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [formData, setFormData] = useState({
    courseCode: '',
    courseName: '',
    credits: '',
    department: '',
    instructor: '',
    semester: '',
    description: ''
  });

  const filteredCourses = courses.filter(course => 
    course.courseName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    course.courseCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
    course.department.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddCourse = () => {
    setEditingCourse(null);
    setFormData({
      courseCode: '',
      courseName: '',
      credits: '',
      department: '',
      instructor: '',
      semester: '',
      description: ''
    });
    setShowModal(true);
  };

  const handleEditCourse = (course) => {
    setEditingCourse(course);
    setFormData(course);
    setShowModal(true);
  };

  const handleDeleteCourse = (courseId) => {
    if (window.confirm('Are you sure you want to delete this course?')) {
      const updatedCourses = courses.filter(course => course.id !== courseId);
      updateCourses(updatedCourses);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (editingCourse) {
      const updatedCourses = courses.map(course => 
        course.id === editingCourse.id ? { ...formData, id: editingCourse.id } : course
      );
      updateCourses(updatedCourses);
    } else {
      const newCourse = {
        ...formData,
        id: Date.now(),
        credits: parseInt(formData.credits)
      };
      updateCourses([...courses, newCourse]);
    }
    
    setShowModal(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="course-management">
      <div className="section-header">
        <h2>Course Management</h2>
        <div className="header-actions">
          <input
            type="text"
            placeholder="Search courses..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
          <button 
            onClick={handleAddCourse}
            className="btn btn-primary"
          >
            Add New Course
          </button>
        </div>
      </div>

      <div className="courses-grid">
        {filteredCourses.map(course => (
          <div key={course.id} className="course-card">
            <div className="course-header">
              <h3 className="course-title">{course.courseName}</h3>
              <span className="course-code">{course.courseCode}</span>
            </div>
            
            <div className="course-details">
              <div className="course-info">
                <span className="info-label">Department:</span>
                <span>{course.department}</span>
              </div>
              <div className="course-info">
                <span className="info-label">Instructor:</span>
                <span>{course.instructor}</span>
              </div>
              <div className="course-info">
                <span className="info-label">Credits:</span>
                <span>{course.credits}</span>
              </div>
              <div className="course-info">
                <span className="info-label">Semester:</span>
                <span>{course.semester}</span>
              </div>
            </div>
            
            {course.description && (
              <div className="course-description">
                <p>{course.description}</p>
              </div>
            )}
            
            <div className="course-actions">
              <button 
                onClick={() => handleEditCourse(course)}
                className="btn btn-secondary btn-small"
              >
                Edit
              </button>
              <button 
                onClick={() => handleDeleteCourse(course.id)}
                className="btn btn-danger btn-small"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {filteredCourses.length === 0 && (
        <EmptyState
          icon="📚"
          title="No courses found"
          message={courses.length === 0 ? "Start by adding your first course to the system." : "Try adjusting your search criteria or filters."}
          type={courses.length === 0 ? 'add' : 'search'}
          actionButton={courses.length === 0 ? (
            <button onClick={handleAddCourse} className="btn btn-primary">
              ➕ Add First Course
            </button>
          ) : null}
        />
      )}

      {showModal && (
        <Modal
          title={editingCourse ? 'Edit Course' : 'Add New Course'}
          onClose={() => setShowModal(false)}
        >
          <form onSubmit={handleSubmit}>
            <div className="form-grid">
              <div className="form-group">
                <label>Course Code *</label>
                <input
                  type="text"
                  name="courseCode"
                  value={formData.courseCode}
                  onChange={handleInputChange}
                  className="form-control"
                  required
                  placeholder="e.g., CS101"
                />
              </div>
              
              <div className="form-group">
                <label>Course Name *</label>
                <input
                  type="text"
                  name="courseName"
                  value={formData.courseName}
                  onChange={handleInputChange}
                  className="form-control"
                  required
                  placeholder="e.g., Data Structures"
                />
              </div>
              
              <div className="form-group">
                <label>Credits</label>
                <input
                  type="number"
                  name="credits"
                  value={formData.credits}
                  onChange={handleInputChange}
                  className="form-control"
                  min="1"
                  max="10"
                />
              </div>
              
              <div className="form-group">
                <label>Department</label>
                <select
                  name="department"
                  value={formData.department}
                  onChange={handleInputChange}
                  className="form-control"
                >
                  <option value="">Select Department</option>
                  <option value="Computer Science">Computer Science</option>
                  <option value="Mathematics">Mathematics</option>
                  <option value="Physics">Physics</option>
                  <option value="Chemistry">Chemistry</option>
                  <option value="Biology">Biology</option>
                  <option value="English">English</option>
                  <option value="History">History</option>
                </select>
              </div>
              
              <div className="form-group">
                <label>Instructor</label>
                <select
                  name="instructor"
                  value={formData.instructor}
                  onChange={handleInputChange}
                  className="form-control"
                >
                  <option value="">Select Instructor</option>
                  {faculty.map(member => (
                    <option key={member.id} value={member.name}>
                      {member.name} - {member.department}
                    </option>
                  ))}
                </select>
              </div>
              
              <div className="form-group">
                <label>Semester</label>
                <select
                  name="semester"
                  value={formData.semester}
                  onChange={handleInputChange}
                  className="form-control"
                >
                  <option value="">Select Semester</option>
                  <option value="1st">1st Semester</option>
                  <option value="2nd">2nd Semester</option>
                  <option value="3rd">3rd Semester</option>
                  <option value="4th">4th Semester</option>
                  <option value="5th">5th Semester</option>
                  <option value="6th">6th Semester</option>
                  <option value="7th">7th Semester</option>
                  <option value="8th">8th Semester</option>
                </select>
              </div>
              
              <div className="form-group full-width">
                <label>Description</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  className="form-control"
                  rows="3"
                  placeholder="Brief description of the course..."
                />
              </div>
            </div>
            
            <div className="form-actions">
              <button type="button" onClick={() => setShowModal(false)} className="btn btn-secondary">
                Cancel
              </button>
              <button type="submit" className="btn btn-primary">
                {editingCourse ? 'Update Course' : 'Add Course'}
              </button>
            </div>
          </form>
        </Modal>
      )}

      <style jsx>{`
        .courses-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
          gap: 20px;
          margin-top: 20px;
        }
        
        .course-card {
          background: white;
          border-radius: 10px;
          padding: 20px;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
          transition: transform 0.3s ease;
        }
        
        .course-card:hover {
          transform: translateY(-2px);
        }
        
        .course-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 15px;
        }
        
        .course-title {
          font-size: 18px;
          font-weight: 600;
          color: #333;
          margin: 0;
          flex: 1;
        }
        
        .course-code {
          background: #667eea;
          color: white;
          padding: 4px 8px;
          border-radius: 5px;
          font-size: 12px;
          font-weight: 500;
        }
        
        .course-details {
          margin-bottom: 15px;
        }
        
        .course-info {
          display: flex;
          justify-content: space-between;
          margin-bottom: 8px;
          padding-bottom: 5px;
          border-bottom: 1px solid #f0f0f0;
        }
        
        .info-label {
          font-weight: 500;
          color: #666;
        }
        
        .course-description {
          margin-bottom: 15px;
          padding: 10px;
          background: #f8f9fa;
          border-radius: 5px;
        }
        
        .course-description p {
          margin: 0;
          color: #666;
          font-size: 14px;
          line-height: 1.4;
        }
        
        .course-actions {
          display: flex;
          gap: 10px;
          justify-content: flex-end;
        }
        
        .empty-state {
          text-align: center;
          padding: 60px 20px;
          color: #666;
        }
        
        .section-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
          flex-wrap: wrap;
          gap: 15px;
        }
        
        .header-actions {
          display: flex;
          gap: 15px;
          align-items: center;
        }
        
        .search-input {
          padding: 8px 12px;
          border: 1px solid #ddd;
          border-radius: 5px;
          width: 250px;
        }
        
        .form-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 15px;
        }
        
        .full-width {
          grid-column: 1 / -1;
        }
        
        .form-actions {
          display: flex;
          justify-content: flex-end;
          gap: 10px;
          margin-top: 20px;
          padding-top: 20px;
          border-top: 1px solid #eee;
        }
        
        .btn-small {
          padding: 5px 10px;
          font-size: 12px;
        }
        
        @media (max-width: 768px) {
          .courses-grid {
            grid-template-columns: 1fr;
          }
          
          .section-header {
            flex-direction: column;
            align-items: stretch;
          }
          
          .header-actions {
            flex-direction: column;
          }
          
          .search-input {
            width: 100%;
          }
          
          .course-header {
            flex-direction: column;
            gap: 10px;
          }
          
          .course-actions {
            justify-content: center;
          }
        }
      `}</style>
    </div>
  );
};

export default CourseManagement;
