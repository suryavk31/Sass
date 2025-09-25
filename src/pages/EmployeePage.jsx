// src/pages/EmployeePage.jsx
import React, { useState } from 'react';
import { 
  Table, TableBody, TableCell, TableContainer, 
  TableHead, TableRow, Paper, Button as MuiButton 
} from '@mui/material';

const initialFormState = {
  name: '',
  email: '',
  position: '',
};

const EmployeePage = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [formData, setFormData] = useState(initialFormState);
  const [errors, setErrors] = useState({});
  const [employees, setEmployees] = useState([
    { id: 1, name: 'John Doe', email: 'john@example.com', position: 'Software Engineer' },
    // You can later replace this with data fetched from an API.
  ]);

  // Simple field validation function
  const validateField = (field, value) => {
    let error = "";
    switch (field) {
      case "name":
        if (!/^[A-Za-z\s]{2,}$/.test(value)) {
          error = "Please enter a valid name (letters only)";
        }
        break;
      case "email":
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
          error = "Please enter a valid email address";
        }
        break;
      case "position":
        if (value.trim().length < 2) {
          error = "Position must be at least 2 characters long";
        }
        break;
      default:
        break;
    }
    return error;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    const error = validateField(name, value);
    setErrors((prev) => ({ ...prev, [name]: error }));
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    let newErrors = {};
    let isValid = true;
    for (const field in formData) {
      const error = validateField(field, formData[field]);
      if (error) {
        isValid = false;
        newErrors[field] = error;
      }
    }
    setErrors(newErrors);
    if (isValid) {
      // Here you could call an API via Redux action.
      alert("Employee created successfully!");
      const newEmployee = { id: Date.now(), ...formData };
      setEmployees((prev) => [...prev, newEmployee]);
      setFormData(initialFormState);
      setModalOpen(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-gray-50 px-4 md:px-8 py-8">
      {/* Page Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold text-gray-800">Employees</h2>
        <button
          onClick={() => setModalOpen(true)}
          className="rounded-button bg-custom text-white py-2 px-4 hover:bg-violet-700 focus:ring-2 focus:ring-violet-200 transition-colors flex items-center gap-2"
        >
          <i className="fas fa-plus"></i>
          Create Employee
        </button>
      </div>

      {/* Employee Creation Modal */}
      {modalOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          onClick={(e) => {
            if (e.target === e.currentTarget) setModalOpen(false);
          }}
        >
          <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-gray-900">Create New Employee</h2>
              <button onClick={() => setModalOpen(false)} className="text-gray-400 hover:text-gray-500">
                <i className="fas fa-times"></i>
              </button>
            </div>
            <form onSubmit={handleFormSubmit} className="space-y-6">
              {/* Full Name */}
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                  Full Name
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400">
                    <i className="fas fa-user"></i>
                  </span>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Enter full name"
                    required
                    className="rounded-button w-full pl-10 pr-3 py-2 border border-gray-300 focus:border-custom focus:ring focus:ring-violet-200 transition-colors"
                  />
                </div>
                {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
              </div>
              {/* Email */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email Address
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400">
                    <i className="fas fa-envelope"></i>
                  </span>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="Enter email address"
                    required
                    className="rounded-button w-full pl-10 pr-3 py-2 border border-gray-300 focus:border-custom focus:ring focus:ring-violet-200 transition-colors"
                  />
                </div>
                {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
              </div>
              {/* Position */}
              <div>
                <label htmlFor="position" className="block text-sm font-medium text-gray-700 mb-1">
                  Position
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400">
                    <i className="fas fa-briefcase"></i>
                  </span>
                  <input
                    type="text"
                    id="position"
                    name="position"
                    value={formData.position}
                    onChange={handleInputChange}
                    placeholder="Enter position"
                    required
                    className="rounded-button w-full pl-10 pr-3 py-2 border border-gray-300 focus:border-custom focus:ring focus:ring-violet-200 transition-colors"
                  />
                </div>
                {errors.position && <p className="text-red-500 text-xs mt-1">{errors.position}</p>}
              </div>
              {/* Form Buttons */}
              <div className="flex space-x-4 pt-4">
                <button type="submit" className="rounded-button flex-1 bg-custom text-white py-2 px-4 hover:bg-violet-700 focus:ring-2 focus:ring-violet-200 transition-colors">
                  Create Employee
                </button>
                <button
                  type="reset"
                  onClick={() => setFormData(initialFormState)}
                  className="rounded-button flex-1 bg-gray-100 text-gray-700 py-2 px-4 hover:bg-gray-200 focus:ring-2 focus:ring-gray-200 transition-colors"
                >
                  Reset
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Material UI Employee Table */}
      <div className="mt-8">
        <TableContainer component={Paper}>
          <Table aria-label="employee table">
            <TableHead>
              <TableRow>
                <TableCell className="font-semibold">Name</TableCell>
                <TableCell className="font-semibold">Email</TableCell>
                <TableCell className="font-semibold">Position</TableCell>
                <TableCell className="font-semibold">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {employees.map((emp) => (
                <TableRow key={emp.id}>
                  <TableCell>{emp.name}</TableCell>
                  <TableCell>{emp.email}</TableCell>
                  <TableCell>{emp.position}</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <MuiButton variant="outlined" color="info" size="small">
                        <i className="fas fa-eye"></i>
                      </MuiButton>
                      <MuiButton variant="outlined" color="warning" size="small">
                        <i className="fas fa-edit"></i>
                      </MuiButton>
                      <MuiButton variant="outlined" color="error" size="small">
                        <i className="fas fa-trash"></i>
                      </MuiButton>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </div>
    </div>
  );
};

export default EmployeePage;
