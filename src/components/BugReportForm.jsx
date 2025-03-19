import React, { useEffect, useState } from 'react';
import axios from 'axios';

const BugReportForm = () => {

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    document.body.style.zoom = "90%"; // Set zoom level to 80%
    return () => {
      document.body.style.zoom = "100%"; // Reset on component unmount
    };
  }, []);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    bugType: '',
    description: '',
  });
  const [status, setStatus] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name || !formData.description || !validateEmail(formData.email) || !formData.bugType) {
      setStatus('Please fill in all fields with valid information.');
      return;
    }

    setStatus('Submitting...');
    setIsSubmitting(true);

    try {
      const response = await axios.post(
        'https://backend-05of.onrender.com/api/report-bug', // Update to your backend URL
        formData
      );
      if (response.data.status === 'success') {
        setStatus('Bug reported successfully!');
        setFormData({ name: '', email: '', bugType: '', description: '' });
      } else {
        setStatus('Failed to report the bug.');
      }
    } catch (error) {
      console.error('Error:', error);
      if (error.response) {
        // Server responded with a status other than 2xx
        setStatus(`Error: ${error.response.data.message || 'Failed to report the bug.'}`);
      } else if (error.request) {
        // Request was made but no response was received
        setStatus('No response from server. Please try again later.');
      } else {
        // Something happened in setting up the request
        setStatus('Error submitting the form. Please try again later.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // Custom UI styling for your webpage aesthetics
  const containerStyle = {
    padding: '50px',
    maxWidth: '450px',
    marginTop: '-250px',    
    backgroundColor: '#f9f9f9',
    borderRadius: '12px',
    boxShadow: '0 8px 16px rgba(0.2, 0.2, 0.2, 0.2)',
    fontFamily: "'Poppins', sans-serif",
    textAlign: 'center',
  };

  const inputStyle = {
  width: '100%',
  padding: '10px 15px',
  margin: '10px 0',
  borderRadius: '8px',
  borderColor: '#21005D',
  outline: 'none',
  fontSize: '14px',
  color: '#21005D', // Ensures text is visible when typing
  backgroundColor: '#fff',
  boxSizing: 'border-box',
};


  const buttonStyle = {
    width: '100%',
    padding: '12px',
    backgroundColor: '#21005D',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    fontSize: '16px',
    fontWeight: 'bold',
    cursor: isSubmitting ? 'not-allowed' : 'pointer',
    transition: 'background-color 0.3s',
  };

  const labelStyle = {
    textAlign: 'left',
    fontWeight: 'bold',
    color: '#21005D',
    marginBottom: '5px',
    display: 'block',
  };

  const bugTypes = [
    'UI Bug',
    'Submission Bug',
    'Validation Issue',
    'Data Not Displaying',
    'Performance Lag',
  ];

  return (
    <div style={containerStyle}>
      <b><h2 style={{ marginBottom: '40px', color: '#21005D' }}>Report a Bug</h2></b>
      <form onSubmit={handleSubmit}>
        <div>
          <label style={labelStyle}>Name:</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            style={inputStyle}
            disabled={isSubmitting}
          />
        </div>
        <div>
          <label style={labelStyle}>Email:</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            style={inputStyle}
            disabled={isSubmitting}
          />
        </div>
        <div>
          <label style={labelStyle}>Bug Type:</label>
          <select
            name="bugType"
            value={formData.bugType}
            onChange={handleChange}
            required
            style={inputStyle}
            disabled={isSubmitting}
          >
            <option value="">Select Bug Type</option>
            {bugTypes.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label style={labelStyle}>Description:</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
            style={{ ...inputStyle, height: '120px', resize: 'none' }}
            disabled={isSubmitting}
          />
        </div>
        <button
          type="submit"
          style={buttonStyle}
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Submitting...' : 'Submit'}
        </button>
      </form>
      {status && <p style={{ marginTop: '15px', color: 'green' }}>{status}</p>}
    </div>
  );
};

export default BugReportForm;
