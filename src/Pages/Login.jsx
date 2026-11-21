import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Header from '../Components/Header';
import Footer from '../Components/Footer';
import Swal from 'sweetalert2';
import { loginUser } from '../services/api';
import './CSS/Login.css';

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    emailOrPhone: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const emailOrPhone = formData.emailOrPhone.trim();
    const password = formData.password;

    if (!emailOrPhone || !password) {
      Swal.fire({
        icon: 'warning',
        title: 'Missing Fields',
        text: 'Please enter both your Email / Phone and Password.',
        confirmButtonColor: '#1E3A8A'
      });
      return;
    }

    try {
      setLoading(true);
      const res = await loginUser({ email: emailOrPhone, password });

      if (res.success) {
        window.dispatchEvent(new Event('authChange'));

        await Swal.fire({
          icon: 'success',
          title: 'Login Successful! 🎉',
          text: res.message || `Welcome back, ${res.user?.name || 'User'}!`,
          timer: 1800,
          showConfirmButton: false
        });

        navigate('/');
      } else {
        throw new Error(res.message || 'Login failed');
      }
    } catch (err) {
      console.error('Login error:', err);
      Swal.fire({
        icon: 'error',
        title: 'Login Failed',
        text: err.response?.data?.message || err.message || 'Invalid credentials. Please try again.',
        confirmButtonColor: '#1E3A8A'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Header />

      <div className="login-outer">
        <div className="login-box">
          <h1>Welcome Back</h1>
          <p>Login to Singh Album Design</p>

          <form onSubmit={handleSubmit}>
            <div>
              <label htmlFor="login-email">Email or Phone Number *</label>
              <input
                id="login-email"
                type="text"
                name="emailOrPhone"
                placeholder="Enter registered email or phone"
                value={formData.emailOrPhone}
                onChange={handleChange}
                required
                autoFocus
              />
            </div>

            <div>
              <label htmlFor="login-password">Password *</label>
              <input
                id="login-password"
                type="password"
                name="password"
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>

            <button type="submit" disabled={loading}>
              {loading ? 'Logging in...' : 'Login'}
            </button>
          </form>

          <p className="login-link">
            Don't have an account? <Link to="/signup">Sign Up</Link>
          </p>
        </div>
      </div>

      <Footer />
    </>
  );
};

export default Login;
