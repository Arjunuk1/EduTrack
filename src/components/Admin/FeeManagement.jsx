import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import Modal from '../Common/Modal';
import EmptyState from '../Common/EmptyState';

const FeeManagement = () => {
  const { fees, students, updateFees } = useData();
  const [showModal, setShowModal] = useState(false);
  const [editingFee, setEditingFee] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [formData, setFormData] = useState({
    studentId: '',
    studentName: '',
    semester: '',
    tuitionFee: '',
    labFee: '',
    libraryFee: '',
    totalAmount: '',
    paidAmount: '',
    pendingAmount: '',
    status: 'Pending',
    dueDate: '',
    paidDate: ''
  });

  const filteredFees = fees.filter(fee => {
    const matchesSearch = fee.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         fee.studentId.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'All' || fee.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const calculateTotals = () => {
    const totalAmount = filteredFees.reduce((sum, fee) => sum + fee.totalAmount, 0);
    const paidAmount = filteredFees.reduce((sum, fee) => sum + fee.paidAmount, 0);
    const pendingAmount = filteredFees.reduce((sum, fee) => sum + fee.pendingAmount, 0);
    
    return { totalAmount, paidAmount, pendingAmount };
  };

  const totals = calculateTotals();

  const handleAddFee = () => {
    setEditingFee(null);
    setFormData({
      studentId: '',
      studentName: '',
      semester: '',
      tuitionFee: '',
      labFee: '',
      libraryFee: '',
      totalAmount: '',
      paidAmount: '',
      pendingAmount: '',
      status: 'Pending',
      dueDate: '',
      paidDate: ''
    });
    setShowModal(true);
  };

  const handleEditFee = (fee) => {
    setEditingFee(fee);
    setFormData(fee);
    setShowModal(true);
  };

  const handleDeleteFee = (feeId) => {
    if (window.confirm('Are you sure you want to delete this fee record?')) {
      const updatedFees = fees.filter(fee => fee.id !== feeId);
      updateFees(updatedFees);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const tuitionFee = parseFloat(formData.tuitionFee) || 0;
    const labFee = parseFloat(formData.labFee) || 0;
    const libraryFee = parseFloat(formData.libraryFee) || 0;
    const paidAmount = parseFloat(formData.paidAmount) || 0;
    
    const totalAmount = tuitionFee + labFee + libraryFee;
    const pendingAmount = totalAmount - paidAmount;
    
    let status = 'Pending';
    if (paidAmount >= totalAmount) {
      status = 'Paid';
    } else if (paidAmount > 0) {
      status = 'Partial';
    }
    
    const feeData = {
      ...formData,
      tuitionFee,
      labFee,
      libraryFee,
      totalAmount,
      paidAmount,
      pendingAmount,
      status
    };
    
    if (editingFee) {
      const updatedFees = fees.map(fee => 
        fee.id === editingFee.id ? { ...feeData, id: editingFee.id } : fee
      );
      updateFees(updatedFees);
    } else {
      const newFee = {
        ...feeData,
        id: Date.now()
      };
      updateFees([...fees, newFee]);
    }
    
    setShowModal(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Auto-fill student name when student ID is selected
    if (name === 'studentId') {
      const student = students.find(s => s.studentId === value);
      if (student) {
        setFormData(prev => ({ ...prev, studentName: student.name }));
      }
    }
  };

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'Paid': return 'badge-success';
      case 'Partial': return 'badge-warning';
      case 'Pending': return 'badge-danger';
      default: return 'badge-secondary';
    }
  };

  return (
    <div className="fee-management">
      <div className="section-header">
        <h2>Fee Management</h2>
        <div className="header-actions">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="status-filter"
          >
            <option value="All">All Status</option>
            <option value="Paid">Paid</option>
            <option value="Partial">Partial</option>
            <option value="Pending">Pending</option>
          </select>
          <input
            type="text"
            placeholder="Search by student name or ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
          <button 
            onClick={handleAddFee}
            className="btn btn-primary"
          >
            Add Fee Record
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="fee-summary">
        <div className="summary-card">
          <div className="summary-title">Total Fees</div>
          <div className="summary-amount">₹{totals.totalAmount.toLocaleString()}</div>
        </div>
        <div className="summary-card paid">
          <div className="summary-title">Amount Collected</div>
          <div className="summary-amount">₹{totals.paidAmount.toLocaleString()}</div>
        </div>
        <div className="summary-card pending">
          <div className="summary-title">Pending Amount</div>
          <div className="summary-amount">₹{totals.pendingAmount.toLocaleString()}</div>
        </div>
      </div>

      <div className="fees-table-container">
        <table className="table">
          <thead>
            <tr>
              <th>Student ID</th>
              <th>Student Name</th>
              <th>Semester</th>
              <th>Total Amount</th>
              <th>Paid Amount</th>
              <th>Pending</th>
              <th>Status</th>
              <th>Due Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredFees.map(fee => (
              <tr key={fee.id}>
                <td>{fee.studentId}</td>
                <td>{fee.studentName}</td>
                <td>{fee.semester}</td>
                <td>₹{fee.totalAmount.toLocaleString()}</td>
                <td>₹{fee.paidAmount.toLocaleString()}</td>
                <td>₹{fee.pendingAmount.toLocaleString()}</td>
                <td>
                  <span className={`badge ${getStatusBadgeClass(fee.status)}`}>
                    {fee.status}
                  </span>
                </td>
                <td>{fee.dueDate ? new Date(fee.dueDate).toLocaleDateString() : '-'}</td>
                <td>
                  <div className="action-buttons">
                    <button 
                      onClick={() => handleEditFee(fee)}
                      className="btn btn-secondary btn-small"
                    >
                      Edit
                    </button>
                    <button 
                      onClick={() => handleDeleteFee(fee.id)}
                      className="btn btn-danger btn-small"
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {filteredFees.length === 0 && (
        <EmptyState
          icon="💰"
          title="No fee records found"
          message={fees.length === 0 ? "Start by adding fee records for students." : "Try adjusting your search criteria or filters."}
          type={fees.length === 0 ? 'add' : 'search'}
          actionButton={fees.length === 0 ? (
            <button onClick={handleAddFee} className="btn btn-primary">
              ➕ Add First Fee Record
            </button>
          ) : null}
        />
      )}

      {showModal && (
        <Modal
          title={editingFee ? 'Edit Fee Record' : 'Add New Fee Record'}
          onClose={() => setShowModal(false)}
        >
          <form onSubmit={handleSubmit}>
            <div className="form-grid">
              <div className="form-group">
                <label>Student *</label>
                <select
                  name="studentId"
                  value={formData.studentId}
                  onChange={handleInputChange}
                  className="form-control"
                  required
                >
                  <option value="">Select Student</option>
                  {students.map(student => (
                    <option key={student.id} value={student.studentId}>
                      {student.studentId} - {student.name}
                    </option>
                  ))}
                </select>
              </div>
              
              <div className="form-group">
                <label>Semester</label>
                <input
                  type="text"
                  name="semester"
                  value={formData.semester}
                  onChange={handleInputChange}
                  className="form-control"
                  placeholder="e.g., 1st Semester 2024"
                />
              </div>
              
              <div className="form-group">
                <label>Tuition Fee</label>
                <input
                  type="number"
                  name="tuitionFee"
                  value={formData.tuitionFee}
                  onChange={handleInputChange}
                  className="form-control"
                  min="0"
                  step="0.01"
                />
              </div>
              
              <div className="form-group">
                <label>Lab Fee</label>
                <input
                  type="number"
                  name="labFee"
                  value={formData.labFee}
                  onChange={handleInputChange}
                  className="form-control"
                  min="0"
                  step="0.01"
                />
              </div>
              
              <div className="form-group">
                <label>Library Fee</label>
                <input
                  type="number"
                  name="libraryFee"
                  value={formData.libraryFee}
                  onChange={handleInputChange}
                  className="form-control"
                  min="0"
                  step="0.01"
                />
              </div>
              
              <div className="form-group">
                <label>Paid Amount</label>
                <input
                  type="number"
                  name="paidAmount"
                  value={formData.paidAmount}
                  onChange={handleInputChange}
                  className="form-control"
                  min="0"
                  step="0.01"
                />
              </div>
              
              <div className="form-group">
                <label>Due Date</label>
                <input
                  type="date"
                  name="dueDate"
                  value={formData.dueDate}
                  onChange={handleInputChange}
                  className="form-control"
                />
              </div>
              
              <div className="form-group">
                <label>Paid Date</label>
                <input
                  type="date"
                  name="paidDate"
                  value={formData.paidDate}
                  onChange={handleInputChange}
                  className="form-control"
                />
              </div>
            </div>
            
            <div className="form-actions">
              <button type="button" onClick={() => setShowModal(false)} className="btn btn-secondary">
                Cancel
              </button>
              <button type="submit" className="btn btn-primary">
                {editingFee ? 'Update Fee Record' : 'Add Fee Record'}
              </button>
            </div>
          </form>
        </Modal>
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
        
        .header-actions {
          display: flex;
          gap: 15px;
          align-items: center;
          flex-wrap: wrap;
        }
        
        .search-input {
          padding: 8px 12px;
          border: 1px solid #ddd;
          border-radius: 5px;
          width: 250px;
        }
        
        .status-filter {
          padding: 8px 12px;
          border: 1px solid #ddd;
          border-radius: 5px;
        }
        
        .fee-summary {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 20px;
          margin-bottom: 30px;
        }
        
        .summary-card {
          background: white;
          border-radius: 10px;
          padding: 25px;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
          border-left: 4px solid #667eea;
        }
        
        .summary-card.paid {
          border-left-color: #28a745;
        }
        
        .summary-card.pending {
          border-left-color: #dc3545;
        }
        
        .summary-title {
          font-size: 14px;
          color: #666;
          margin-bottom: 10px;
        }
        
        .summary-amount {
          font-size: 24px;
          font-weight: bold;
          color: #333;
        }
        
        .action-buttons {
          display: flex;
          gap: 5px;
        }
        
        .btn-small {
          padding: 5px 10px;
          font-size: 12px;
        }
        
        .empty-state {
          text-align: center;
          padding: 60px 20px;
          color: #666;
        }
        
        .form-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 15px;
        }
        
        .form-actions {
          display: flex;
          justify-content: flex-end;
          gap: 10px;
          margin-top: 20px;
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
          
          .search-input {
            width: 100%;
          }
          
          .table {
            font-size: 12px;
          }
          
          .summary-amount {
            font-size: 20px;
          }
        }
      `}</style>
    </div>
  );
};

export default FeeManagement;
