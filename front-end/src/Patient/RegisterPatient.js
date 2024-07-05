import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../Css/Register.css';
import RegistrationLinks from '../RegistrationLinks';
import LoginForm from '../LoginForm';
import MessageComponent from '../Messages/MessageComponent';

const RegisterPatient = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    UserName: '',
    Name: '',
    Surname: '',
    Role: 'Patient',
    PersonalNumber: '',
    Email: '',
    Password: '',
    Address: '',
    PhoneNumber: '',
    Gender: '',
    DateOfBirth: '',
  });

  const [errorMessage, setErrorMessage] = useState(null); // State for error message
  // State for form errors
  const [formErrors, setFormErrors] = useState({
    userName: '',
    name: '',
    surname: '',
    email: '',
    password: '',
    address: '',
    personalNumber: '',
    phoneNumber: '',
    gender: '',
    dateOfBirth: '',
    PhotoData: '', // Add this field
    PhotoFormat: '' // Add this field
  });

  // Handle form field changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });

    // Validate each field as it's being typed
    validateField(name, value);
  };

  // Validate individual form field
  const validateField = (fieldName, value) => {
    setFormErrors((prevErrors) => {
      let newErrors = { ...prevErrors };
  
      switch (fieldName) {
        case 'userName':
        case 'name':
        case 'surname':
        case 'address':
          newErrors[fieldName] = value ? '' : 'This field is required';
          break;
        case 'email':
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          newErrors.email = emailRegex.test(value)
            ? ''
            : 'Please enter a valid email address (e.g., example@example.com)';
          break;
        case 'password':
          const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/;
          newErrors.password = passwordRegex.test(value)
            ? ''
            : 'Password must contain one uppercase letter, one lowercase letter, one digit, one symbol, and must be at least 8 characters long';
          break;
        case 'personalNumber':
          if (!value) {
            newErrors.personalNumber = 'Personal number is required';
          } else {
            const isValidPersonalNumber = /^\d+$/.test(value);
            newErrors.personalNumber = isValidPersonalNumber
              ? ''
              : 'Please enter a valid personal number containing only numbers';
          }
          break;
        case 'gender':
          newErrors[fieldName] = value ? '' : 'This field is required';
          break;
        case 'phoneNumber':
          if (!value) {
            newErrors.phoneNumber = 'Phone number is required';
          } else {
            const isValidPhoneNumber = /^\d+$/.test(value);
            newErrors.phoneNumber = isValidPhoneNumber
              ? ''
              : 'Please enter a valid phone number containing only numbers';
          }
          break;
        case 'dateOfBirth':
          if (!value) {
            newErrors.dateOfBirth = 'Date of birth is required';
          } else {
            const dob = new Date(value);
            const today = new Date();
            let age = today.getFullYear() - dob.getFullYear();
            const monthDiff = today.getMonth() - dob.getMonth();
            if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dob.getDate())) {
              age--;
            }
            newErrors.dateOfBirth = age < 18 ? 'You must be at least 18 years old' : '';
          }
          break;
        default:
          break;
      }
  
      return newErrors;
    });
  };
  

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
  
    // Validate all fields before submission
    for (const key in formData) {
      validateField(key, formData[key]);
    }
  
    // Check if any error exists
    for (const key in formErrors) {
      if (formErrors[key]) {
        return; // Stop submission if any error exists
      }
    }
  
    try {
      const convertKeysToPascalCase = (data) => {
        const convertedData = {};
        for (const key in data) {
          const pascalCaseKey = key.charAt(0).toUpperCase() + key.slice(1);
          convertedData[pascalCaseKey] = data[key];
        }
        return convertedData;
      };
  
      // Usage
      const response = await fetch(
        'https://localhost:7207/api/Patient/CreatePatient',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(convertKeysToPascalCase(formData)),
        }
      );
  
      if (response.ok) {
        const responseData = await response.json();
        if (responseData.succeeded === true) {
          console.log('Operation succeeded: true');
          setErrorMessage(responseData);
          console.log(responseData);
          navigate('/login');
        } else {
          console.log('Operation succeeded: false');
          setErrorMessage(responseData);
          console.log(responseData);
        }
      } else {
        console.error('Registration failed:', response.statusText);
      }
    } catch (error) {
      console.error('Error during registration:', error);
    }
  };

  return (
    <div className="container">
      <div className="card mt-4 bg-light p-4 rounded">
        <RegistrationLinks />
        <div className="card-body " style={{ marginTop: '10%' }}>
        {errorMessage && <MessageComponent message={errorMessage} />}
          <form onSubmit={handleSubmit}>
            <label htmlFor="userName" className="form-label">
              User Name
            </label>
            <input
              type="text"
              className="form-input"
              id="userName"
              name="userName"
              value={formData.userName}
              onChange={handleInputChange}
              required
            />
            {formErrors.userName && (
              <p className="error-message">{formErrors.userName}</p>
            )}
  
            <label htmlFor="name" className="form-label">
              Name
            </label>
            <input
              type="text"
              className="form-input"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              required
            />
            {formErrors.name && (
              <p className="error-message">{formErrors.name}</p>
            )}
  
            <label htmlFor="surname" className="form-label">
              Surname
            </label>
            <input
              type="text"
              className="form-input"
              id="surname"
              name="surname"
              value={formData.surname}
              onChange={handleInputChange}
              required
            />
            {formErrors.surname && (
              <p className="error-message">{formErrors.surname}</p>
            )}
  
            <label htmlFor="email" className="form-label">
              Email
            </label>
            <input
              type="email"
              className="form-input"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              required
            />
            {formErrors.email && (
              <p className="error-message">{formErrors.email}</p>
            )}
  
            <label htmlFor="password" className="form-label">
              Password
            </label>
            <input
              type="password"
              className="form-input"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              required
            />
            {formErrors.password && (
              <p className="error-message">{formErrors.password}</p>
            )}
  
            <label htmlFor="address" className="form-label">
              Address
            </label>
            <input
              type="text"
              className="form-input"
              id="address"
              name="address"
              value={formData.address}
              onChange={handleInputChange}
              required
            />
            {formErrors.address && (
              <p className="error-message">{formErrors.address}</p>
            )}
  
            <label htmlFor="personalNumber" className="form-label">
              Personal Number
            </label>
            <input
              type="text"
              className="form-input"
              id="personalNumber"
              name="personalNumber"
              value={formData.personalNumber}
              onChange={handleInputChange}
              required
            />
            {formErrors.personalNumber && (
              <p className="error-message">{formErrors.personalNumber}</p>
            )}
  
            <label htmlFor="phoneNumber" className="form-label">
              Phone Number
            </label>
            <input
              type="text"
              className="form-input"
              id="phoneNumber"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleInputChange}
              required
            />
            {formErrors.phoneNumber && (
              <p className="error-message">{formErrors.phoneNumber}</p>
            )}
  
            <label className="form-label">Gender</label><br></br>
            <div className="btn-group" role="group">
              <input
                type="radio"
                id="male"
                name="gender"
                value="male"
                onChange={handleInputChange}
                checked={formData.gender === 'male'}
                className="btn-check"
                required
              />
              <label htmlFor="male" className="btn btn-outline-primary">
                Male
              </label>
  
              <input
                type="radio"
                id="female"
                name="gender"
                value="female"
                onChange={handleInputChange}
                checked={formData.gender === 'female'}
                className="btn-check"
                required
              />
              <label htmlFor="female" className="btn btn-outline-primary">
                Female
              </label>
            </div>
            <br/>
            {formErrors.gender && (
              <p className="error-message">{formErrors.gender}</p>
            )}
  
            <label htmlFor="dateOfBirth" className="form-label">Date of Birth</label>
            <input type="date" className="form-input" id="dateOfBirth" name="dateOfBirth" value={formData.dateOfBirth} onChange={handleInputChange} required />
            {formErrors.dateOfBirth && (
              <p className="error-message">{formErrors.dateOfBirth}</p>
            )}
  
            <div className="d-flex justify-content-end mt-3">
              <button type="submit" className="btn btn-primary w-100">
                Submit
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
  
};

export default RegisterPatient;