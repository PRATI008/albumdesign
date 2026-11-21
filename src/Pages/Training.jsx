import { useState, useEffect } from 'react';
import Header from '../Components/Header';
import Footer from '../Components/Footer';
import Swal from 'sweetalert2';
import { getSiteSettings, submitEnquiry } from '../services/api';
import { FaUserGraduate, FaCheckCircle, FaPaperPlane, FaPhoneAlt, FaEnvelope } from 'react-icons/fa';
import './CSS/SimplePages.css';

const Training = () => {
  const [settings, setSettings] = useState({
    mobile: '9695774046',
    email: 'rapidalbumcreation@gmail.com'
  });

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    message: ''
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    let isMounted = true;
    getSiteSettings().then((site) => {
      if (isMounted && site) {
        setSettings({
          mobile: site.mobile || '9695774046',
          email: site.email || 'rapidalbumcreation@gmail.com'
        });
      }
    });
    return () => {
      isMounted = false;
    };
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'phone' && !/^[0-9]*$/.test(value)) return;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleEnrollSubmit = async (e) => {
    e.preventDefault();

    const name = formData.name.trim();
    const phone = formData.phone.trim();
    const email = formData.email.trim();
    const message = formData.message.trim();

    if (!name || !phone) {
      Swal.fire({
        icon: 'warning',
        title: 'Required Fields',
        text: 'Please enter your Full Name and Mobile Number.',
        confirmButtonColor: '#1E3A8A'
      });
      return;
    }

    if (!/^[0-9]{10}$/.test(phone)) {
      Swal.fire({
        icon: 'warning',
        title: 'Invalid Mobile Number',
        text: 'Please enter a valid 10-digit mobile number.',
        confirmButtonColor: '#1E3A8A'
      });
      return;
    }

    try {
      setSubmitting(true);
      const res = await submitEnquiry({
        name,
        phone,
        email,
        service: 'Photoshop & Album Design Training',
        message: message || 'Interested in enrolling for the upcoming Photoshop & Album Design Training Batch.'
      });

      if (res.success) {
        Swal.fire({
          icon: 'success',
          title: 'Enrollment Enquiry Sent! 🎓',
          text: 'Thank you for your interest! Our master trainer will contact you regarding batch timings and curriculum details.',
          confirmButtonColor: '#1E3A8A'
        });

        setFormData({
          name: '',
          phone: '',
          email: '',
          message: ''
        });
      } else {
        throw new Error(res.message || 'Submission failed');
      }
    } catch (err) {
      console.error('Training Submit Error:', err);
      Swal.fire({
        icon: 'error',
        title: 'Submission Failed',
        text: err.response?.data?.message || err.message || 'Something went wrong. Please try again.',
        confirmButtonColor: '#1E3A8A'
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <Header />
      <main className="page-container page-container--narrow">
        <div className="page-card">
          <div className="training-icon">
            <FaUserGraduate />
          </div>
          <h1 className="page-card__title">Photoshop & Album Design Masterclass</h1>
          <p className="page-card__subtitle">
            Master the art of professional wedding album layout design, color grading, high-end skin retouching, and printing preparation under expert mentorship.
          </p>

          {/* Key Training Modules */}
          <div style={{ textAlign: 'left', margin: '24px auto', maxWidth: '520px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#1E3A8A', fontWeight: '500' }}>
              <FaCheckCircle color="#10B981" /> Practical Photoshop Shortcuts & High-Speed Workflow
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#1E3A8A', fontWeight: '500' }}>
              <FaCheckCircle color="#10B981" /> Modern & Royal Traditional Album Layouts
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#1E3A8A', fontWeight: '500' }}>
              <FaCheckCircle color="#10B981" /> Advance Skin Retouching, Frequency Separation & Dodge-Burn
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#1E3A8A', fontWeight: '500' }}>
              <FaCheckCircle color="#10B981" /> Color Grading & Camera Raw Presets
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#1E3A8A', fontWeight: '500' }}>
              <FaCheckCircle color="#10B981" /> Lab Printing File Preparation & Margin Standards
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', flexWrap: 'wrap', margin: '16px 0' }}>
            <a href={`tel:${settings.mobile}`} style={{ color: '#1E3A8A', display: 'inline-flex', alignItems: 'center', gap: '6px', fontWeight: '600', textDecoration: 'none' }}>
              <FaPhoneAlt /> Call Trainer: +91 {settings.mobile}
            </a>
            <a href={`mailto:${settings.email}`} style={{ color: '#1E3A8A', display: 'inline-flex', alignItems: 'center', gap: '6px', fontWeight: '600', textDecoration: 'none' }}>
              <FaEnvelope /> {settings.email}
            </a>
          </div>

          {/* Interactive Batch Enrollment Form */}
          <div className="contact-form-wrapper" style={{ marginTop: '28px' }}>
            <h3 className="contact-form-title">Join Upcoming Training Batch</h3>
            <p className="contact-form-subtitle">Fill in your details below to receive batch schedule and fee structure.</p>

            <form onSubmit={handleEnrollSubmit} noValidate>
              <div className="contact-form-grid">
                <div>
                  <input
                    type="text"
                    name="name"
                    placeholder="Your Full Name *"
                    className="contact-input"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div>
                  <input
                    type="tel"
                    name="phone"
                    placeholder="Mobile Number (10 digits) *"
                    maxLength={10}
                    className="contact-input"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="full-span">
                  <input
                    type="email"
                    name="email"
                    placeholder="Email Address (Optional)"
                    className="contact-input"
                    value={formData.email}
                    onChange={handleChange}
                  />
                </div>

                <div className="full-span">
                  <textarea
                    name="message"
                    rows={3}
                    placeholder="Any prior experience or questions regarding batch timing? (Optional)"
                    className="contact-textarea"
                    value={formData.message}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <button type="submit" className="contact-submit-btn" disabled={submitting}>
                {submitting ? 'Submitting Enquiry...' : (
                  <>
                    <FaPaperPlane /> Enquire For Next Batch
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default Training;
