import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Header from '../Components/Header';
import Footer from '../Components/Footer';
import Swal from 'sweetalert2';
import { registerUser } from '../services/api';
import './CSS/Signup.css';

const Signup = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'phone' && !/^[0-9]*$/.test(value)) return;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const name = formData.name.trim();
    const email = formData.email.trim();
    const phone = formData.phone.trim();
    const password = formData.password;

    if (!name || !email || !phone || !password) {
      Swal.fire({
        icon: 'warning',
        title: 'Required Fields',
        text: 'Please fill in all the required fields.',
        confirmButtonColor: '#1E3A8A'
      });
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      Swal.fire({
        icon: 'warning',
        title: 'Invalid Email',
        text: 'Please enter a valid email address.',
        confirmButtonColor: '#1E3A8A'
      });
      return;
    }

    if (!/^[0-9]{10}$/.test(phone)) {
      Swal.fire({
        icon: 'warning',
        title: 'Invalid Phone Number',
        text: 'Please enter a valid 10-digit mobile number.',
        confirmButtonColor: '#1E3A8A'
      });
      return;
    }

    if (password.length < 6) {
      Swal.fire({
        icon: 'warning',
        title: 'Weak Password',
        text: 'Password must be at least 6 characters long.',
        confirmButtonColor: '#1E3A8A'
      });
      return;
    }

    try {
      setLoading(true);
      const res = await registerUser({ name, email, phone, password });

      if (res.success) {
        await Swal.fire({
          icon: 'success',
          title: 'Account Created! 🎉',
          text: 'Registration successful! You can now log in to your account.',
          confirmButtonColor: '#1E3A8A'
        });

        navigate('/login');
      } else {
        throw new Error(res.message || 'Registration failed');
      }
    } catch (err) {
      console.error('Registration Error:', err);
      Swal.fire({
        icon: 'error',
        title: 'Registration Failed',
        text: err.response?.data?.message || err.message || 'Something went wrong. Please try again.',
        confirmButtonColor: '#1E3A8A'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Header />

      <div className="signup-outer">
        <div className="signup-box">
          <h1>Create Account</h1>
          <p>Join Singh Album Design</p>

          <form onSubmit={handleSubmit} noValidate>
            <div>
              <label htmlFor="signup-name">Full Name *</label>
              <input
                id="signup-name"
                type="text"
                name="name"
                placeholder="Enter your full name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>

            <div>
              <label htmlFor="signup-email">Email Address *</label>
              <input
                id="signup-email"
                type="email"
                name="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>

            <div>
              <label htmlFor="signup-phone">Phone Number (10 digits) *</label>
              <input
                id="signup-phone"
                type="tel"
                name="phone"
                placeholder="Enter 10-digit phone number"
                maxLength={10}
                value={formData.phone}
                onChange={handleChange}
                required
              />
            </div>

            <div>
              <label htmlFor="signup-password">Password (min 6 characters) *</label>
              <input
                id="signup-password"
                type="password"
                name="password"
                placeholder="Create a strong password"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>

            <button type="submit" disabled={loading}>
              {loading ? 'Creating Account...' : 'Create Account'}
            </button>
          </form>

          <p className="signup-link">
            Already have an account? <Link to="/login">Login</Link>
          </p>
        </div>
      </div>

      <Footer />
    </>
  );
};

export default Signup;
