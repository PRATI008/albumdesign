import { useState, useEffect } from 'react';
import Header from '../Components/Header';
import Footer from '../Components/Footer';
import Swal from 'sweetalert2';
import { getSiteSettings, getPackages, submitEnquiry } from '../services/api';
import { FaPhoneAlt, FaEnvelope, FaMapMarkerAlt, FaGlobe, FaPaperPlane, FaFacebook, FaInstagram, FaLinkedin } from 'react-icons/fa';
import './CSS/SimplePages.css';

const Contact = () => {
  const [settings, setSettings] = useState({
    mobile: '9695774046',
    email: 'rapidalbumcreation@gmail.com',
    address: 'Raebareli Uttar Pradesh India',
    facebook: 'https://facebook.com',
    instagram: 'https://instagram.com',
    linkedin: ''
  });

  const [packages, setPackages] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    service: '',
    message: ''
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let isMounted = true;

    getSiteSettings().then((data) => {
      if (isMounted && data) {
        setSettings((prev) => ({
          ...prev,
          mobile: data.mobile || prev.mobile,
          email: data.email || prev.email,
          address: data.address || prev.address,
          facebook: data.facebook || prev.facebook,
          instagram: data.instagram || prev.instagram,
          linkedin: data.linkedin || prev.linkedin
        }));
      }
    });

    getPackages().then((list) => {
      if (isMounted && Array.isArray(list)) {
        setPackages(list.filter((p) => p.status !== 'Inactive'));
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

  const handleSubmit = async (e) => {
    e.preventDefault();

    const name = formData.name.trim();
    const phone = formData.phone.trim();
    const email = formData.email.trim();
    const service = formData.service.trim();
    const message = formData.message.trim();

    if (!name || !phone || !message) {
      Swal.fire({
        icon: 'warning',
        title: 'Required Fields',
        text: 'Please enter your Name, Phone Number, and Message.',
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

    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      Swal.fire({
        icon: 'warning',
        title: 'Invalid Email',
        text: 'Please enter a valid email address.',
        confirmButtonColor: '#1E3A8A'
      });
      return;
    }

    try {
      setLoading(true);
      const res = await submitEnquiry({
        name,
        phone,
        email,
        service: service || 'General Contact Enquiry',
        message
      });

      if (res.success) {
        Swal.fire({
          icon: 'success',
          title: 'Message Sent! ✉️',
          text: 'Thank you for contacting Singh Album Design. We will get back to you shortly.',
          confirmButtonColor: '#1E3A8A'
        });

        setFormData({
          name: '',
          phone: '',
          email: '',
          service: '',
          message: ''
        });
      } else {
        throw new Error(res.message || 'Submission failed');
      }
    } catch (err) {
      console.error('Contact Form Error:', err);
      Swal.fire({
        icon: 'error',
        title: 'Submission Failed',
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
      <main className="page-container page-container--narrow">
        <div className="page-card">
          <h1 className="page-card__title">Contact Us</h1>
          <p className="page-card__subtitle">
            We'd love to hear from you. Reach out to discuss your wedding album design, printing, or retouching requirements.
          </p>

          <div className="contact-info-list">
            <div className="contact-info-item">
              <FaPhoneAlt className="contact-info-icon" />
              <div>
                <strong>Phone: </strong>
                <a href={`tel:${settings.mobile}`} className="contact-info-link">
                  +91 {settings.mobile}
                </a>
              </div>
            </div>

            <div className="contact-info-item">
              <FaEnvelope className="contact-info-icon" />
              <div>
                <strong>Email: </strong>
                <a href={`mailto:${settings.email}`} className="contact-info-link">
                  {settings.email}
                </a>
              </div>
            </div>

            <div className="contact-info-item">
              <FaMapMarkerAlt className="contact-info-icon" />
              <div>
                <strong>Address: </strong>
                <span>{settings.address}</span>
              </div>
            </div>

            <div className="contact-info-item">
              <FaGlobe className="contact-info-icon" />
              <div>
                <strong>Website: </strong>
                <a href="https://rapidalbumcreation.com/" target="_blank" rel="noreferrer" className="contact-info-link">
                  https://rapidalbumcreation.com/
                </a>
              </div>
            </div>

            {(settings.facebook || settings.instagram || settings.linkedin) && (
              <div className="contact-info-item" style={{ marginTop: '4px' }}>
                <strong>Social: </strong>
                <div style={{ display: 'flex', gap: '12px', marginLeft: '6px' }}>
                  {settings.facebook && (
                    <a href={settings.facebook} target="_blank" rel="noreferrer" style={{ color: '#1877F2', fontSize: '1.2rem' }}>
                      <FaFacebook />
                    </a>
                  )}
                  {settings.instagram && (
                    <a href={settings.instagram} target="_blank" rel="noreferrer" style={{ color: '#E1306C', fontSize: '1.2rem' }}>
                      <FaInstagram />
                    </a>
                  )}
                  {settings.linkedin && (
                    <a href={settings.linkedin} target="_blank" rel="noreferrer" style={{ color: '#0A66C2', fontSize: '1.2rem' }}>
                      <FaLinkedin />
                    </a>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Interactive Contact Form */}
          <div className="contact-form-wrapper">
            <h3 className="contact-form-title">Send a Direct Message</h3>
            <p className="contact-form-subtitle">Fill out the quick form below and our studio team will respond promptly.</p>

            <form onSubmit={handleSubmit} noValidate>
              <div className="contact-form-grid">
                <div>
                  <input
                    type="text"
                    name="name"
                    placeholder="Your Name *"
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

                <div>
                  <input
                    type="email"
                    name="email"
                    placeholder="Email Address (Optional)"
                    className="contact-input"
                    value={formData.email}
                    onChange={handleChange}
                  />
                </div>

                <div>
                  <select
                    name="service"
                    className="contact-select"
                    value={formData.service}
                    onChange={handleChange}
                  >
                    <option value="">Subject / Service Interested</option>
                    {packages.length > 0 ? (
                      packages.map((pkg) => (
                        <option key={pkg._id} value={pkg.packageName}>
                          {pkg.packageName}
                        </option>
                      ))
                    ) : (
                      <>
                        <option value="Wedding Album Design">Wedding Album Design</option>
                        <option value="Pre-Wedding Album">Pre-Wedding Album</option>
                        <option value="Photo Finishing & Retouch">Photo Finishing & Retouch</option>
                        <option value="Photoshop Training">Photoshop Training</option>
                        <option value="General Query">General Query</option>
                      </>
                    )}
                  </select>
                </div>

                <div className="full-span">
                  <textarea
                    name="message"
                    rows={4}
                    placeholder="How can we help you? Describe your album or photoshoot requirements... *"
                    className="contact-textarea"
                    value={formData.message}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <button type="submit" className="contact-submit-btn" disabled={loading}>
                {loading ? 'Sending Message...' : (
                  <>
                    <FaPaperPlane /> Send Message
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

export default Contact;
