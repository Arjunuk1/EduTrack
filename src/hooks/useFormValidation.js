import { useState, useCallback } from 'react';

const validators = {
  name: (value) => {
    if (!value || value.trim().length < 2) {
      return 'Name must be at least 2 characters';
    }
    if (!/^[a-zA-Z\s]+$/.test(value)) {
      return 'Name should only contain letters and spaces';
    }
    return null;
  },
  
  email: (value) => {
    if (!value) return 'Email is required';
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(value)) {
      return 'Please enter a valid email address';
    }
    return null;
  },
  
  phone: (value) => {
    if (!value) return 'Phone number is required';
    if (!/^\d{10}$/.test(value.replace(/\D/g, ''))) {
      return 'Phone number must be 10 digits';
    }
    return null;
  },
  
  rollNumber: (value) => {
    if (!value) return 'Roll number is required';
    if (!/^[A-Z0-9]+$/.test(value)) {
      return 'Roll number should contain only letters and numbers';
    }
    return null;
  },
  
  class: (value) => {
    if (!value) return 'Class is required';
    return null;
  },
  
  section: (value) => {
    if (!value) return 'Section is required';
    return null;
  },
  
  dateOfBirth: (value) => {
    if (!value) return 'Date of birth is required';
    const age = new Date().getFullYear() - new Date(value).getFullYear();
    if (age < 5) return 'Student must be at least 5 years old';
    if (age > 40) return 'Invalid date of birth';
    return null;
  },
  
  admissionDate: (value) => {
    if (!value) return 'Admission date is required';
    return null;
  },
  
  experience: (value) => {
    if (!value) return 'Experience is required';
    const exp = parseInt(value);
    if (isNaN(exp) || exp < 0 || exp > 70) {
      return 'Experience must be a valid number between 0-70';
    }
    return null;
  },
  
  department: (value) => {
    if (!value) return 'Department is required';
    return null;
  },
  
  qualification: (value) => {
    if (!value) return 'Qualification is required';
    return null;
  },
  
  courseName: (value) => {
    if (!value || value.trim().length < 3) {
      return 'Course name must be at least 3 characters';
    }
    return null;
  },
  
  courseCode: (value) => {
    if (!value || value.trim().length < 2) {
      return 'Course code is required';
    }
    return null;
  },
  
  credits: (value) => {
    const credits = parseInt(value);
    if (isNaN(credits) || credits < 1 || credits > 10) {
      return 'Credits must be between 1-10';
    }
    return null;
  }
};

export const useFormValidation = (initialData, validationRules = {}) => {
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  const validateField = useCallback((fieldName, value) => {
    // Use custom rule if provided, otherwise use built-in validators
    const validationFn = validationRules[fieldName] || validators[fieldName];
    
    if (validationFn) {
      const error = validationFn(value);
      return error;
    }
    return null;
  }, [validationRules]);

  const validateForm = useCallback((formData) => {
    const newErrors = {};
    
    Object.keys(formData).forEach(fieldName => {
      const error = validateField(fieldName, formData[fieldName]);
      if (error) {
        newErrors[fieldName] = error;
      }
    });
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [validateField]);

  const handleFieldChange = useCallback((fieldName, value) => {
    // Clear error when user starts typing
    if (errors[fieldName]) {
      const error = validateField(fieldName, value);
      setErrors(prev => ({
        ...prev,
        [fieldName]: error
      }));
    }
  }, [errors, validateField]);

  const handleFieldBlur = useCallback((fieldName) => {
    setTouched(prev => ({
      ...prev,
      [fieldName]: true
    }));
  }, []);

  const clearErrors = useCallback(() => {
    setErrors({});
    setTouched({});
  }, []);

  return {
    errors,
    touched,
    validateForm,
    handleFieldChange,
    handleFieldBlur,
    clearErrors,
    validateField
  };
};
