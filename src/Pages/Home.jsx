import { useState, useEffect } from 'react';
import Header from '../Components/Header';
import Footer from '../Components/Footer';
import Swal from 'sweetalert2';
import { getPackages, getSiteSettings, submitEnquiry } from '../services/api';
import './CSS/Home.css';

import { IoMdArrowRoundForward, IoMdLock } from "react-icons/io";
import { FaBookOpen, FaPhotoVideo, FaPaintBrush, FaUserGraduate } from "react-icons/fa";
import { SiMaterialdesignicons } from "react-icons/si";
import { TbTruckDelivery } from "react-icons/tb";
import { BiSupport } from "react-icons/bi";
import { GiOpenBook } from "react-icons/gi";
import { MdPhotoFilter, MdHighQuality } from "react-icons/md";
import { RiTeamFill } from "react-icons/ri";
import { PiMoneyWavyFill } from "react-icons/pi";
import { TiTick } from "react-icons/ti";

const Home = () => {
  const [packages, setPackages] = useState([]);
  const [settings, setSettings] = useState({ mobile: '9695774046' });
  const [formData, setFormData] = useState({
    fullName: '',
    mobile: '',
    email: '',
    service: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch dynamic packages and site settings
  useEffect(() => {
    let isMounted = true;

    getPackages().then((pkgList) => {
      if (isMounted && Array.isArray(pkgList)) {
        // Only keep active packages if status is defined
        const active = pkgList.filter((p) => p.status !== 'Inactive');
        setPackages(active);
      }
    });

    getSiteSettings().then((siteData) => {
      if (isMounted && siteData?.mobile) {
        setSettings({ mobile: siteData.mobile });
      }
    });

    return () => {
      isMounted = false;
    };
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'mobile' && !/^[0-9]*$/.test(value)) return;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const name = formData.fullName.trim();
    const mobile = formData.mobile.trim();
    const email = formData.email.trim();
    const service = formData.service.trim();
    const message = formData.message.trim();

    if (!name || !mobile) {
      Swal.fire({
        icon: 'warning',
        title: 'Required Fields',
        text: 'Please enter your Full Name and Mobile Number.',
        confirmButtonColor: '#1E3A8A'
      });
      return;
    }

    if (!/^[0-9]{10}$/.test(mobile)) {
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

    if (!service) {
      Swal.fire({
        icon: 'warning',
        title: 'Select Service',
        text: 'Please choose an album design service.',
        confirmButtonColor: '#1E3A8A'
      });
      return;
    }

    try {
      setIsSubmitting(true);
      const res = await submitEnquiry({
        name,
        phone: mobile,
        email,
        service,
        message: message || `Booking request for ${service} from Homepage.`
      });

      if (res.success) {
        Swal.fire({
          icon: 'success',
          title: 'Booking Request Received!',
          text: 'Thank you! Our studio team will call you shortly to discuss your album design.',
          confirmButtonColor: '#1E3A8A'
        });

        setFormData({
          fullName: '',
          mobile: '',
          email: '',
          service: '',
          message: ''
        });
      } else {
        throw new Error(res.message || 'Submission failed');
      }
    } catch (err) {
      console.error('Home Booking Submit Error:', err);
      Swal.fire({
        icon: 'error',
        title: 'Submission Failed',
        text: err.response?.data?.message || err.message || 'Something went wrong. Please try again.',
        confirmButtonColor: '#1E3A8A'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Header />

      <div className="home-outer">
        <div className="home-left">
          <img src="images/camera1.webp" alt="Singh Album Camera" />
        </div>

        <div className="home-middle">
          <h1><span>Singh</span></h1>
          <h2>Album Design</h2>
          <p className="home-tagline">Your Memories... Our Creativity...</p>

          <div className="home-service">
            <h3>Wedding Album Photos Finishing & Retouch</h3>
            <p>Advance Filter | Advance Techniques | Hidden Secret</p>
          </div>

          <div className="home-price">
            <h2>Low Price</h2>
          </div>
        </div>

        <div className="home-right">
          <div className="home-form-heading">
            <h3><FaBookOpen /> Book Your Album Design</h3>
          </div>

          <form className="home-form" onSubmit={handleSubmit}>
            <input
              type="text"
              name="fullName"
              placeholder="Full Name *"
              value={formData.fullName}
              onChange={handleChange}
              required
            />
            <input
              type="tel"
              name="mobile"
              placeholder="Mobile Number (10 digits) *"
              maxLength={10}
              value={formData.mobile}
              onChange={handleChange}
              required
            />
            <input
              type="email"
              name="email"
              placeholder="Gmail / Email ID"
              value={formData.email}
              onChange={handleChange}
            />

            <select
              name="service"
              value={formData.service}
              onChange={handleChange}
              required
            >
              <option value="">Select Service *</option>
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
                  <option value="Photo Creation & Retouch">Photo Creation & Retouch</option>
                  <option value="Photoshop Training">Photoshop Training</option>
                </>
              )}
            </select>

            <textarea
              name="message"
              placeholder="Your Message (Optional)"
              value={formData.message}
              onChange={handleChange}
            ></textarea>

            <button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Submitting...' : (
                <>Submit Booking Request <IoMdArrowRoundForward /></>
              )}
            </button>

            <p><IoMdLock /> Your Data is Safe & Secure</p>
          </form>
        </div>
      </div>

      <div className="home-bottom" id="about">
        <div className="home-bottom-box">
          <span><SiMaterialdesignicons /></span>
          <h3>Professional<br />Album Design</h3>
        </div>

        <div className="home-bottom-box">
          <span><FaPhotoVideo /></span>
          <h3>Wedding Photo<br />Retouching</h3>
        </div>

        <div className="home-bottom-box">
          <span><FaPaintBrush /></span>
          <h3>Creative Album<br />Layouts</h3>
        </div>

        <div className="home-bottom-box">
          <span><TbTruckDelivery /></span>
          <h3>Fast Delivery</h3>
        </div>

        <div className="home-bottom-box">
          <span><BiSupport /></span>
          <h3>24x7 Support</h3>
        </div>
      </div>

      <div className="home-album-section">
        <h1>Our Album Samples</h1>
        <div className="image-album-card">
          <div>
            <img src="images/w1.jpg" alt="wedding-album-1" />
          </div>
          <div>
            <img src="images/w2.jpg" alt="wedding-album-2" />
          </div>
          <div>
            <img src="images/w3.jpg" alt="wedding-album-3" />
          </div>
          <div>
            <img src="images/w4.jpg" alt="wedding-album-4" />
          </div>
          <div>
            <img src="images/w5.jpg" alt="wedding-album-5" />
          </div>
        </div>
      </div>

      <div className="service-home" id="service">
        <h1>Our Services</h1>
        <p>Beautiful designs, natural retouching and memorable wedding albums.</p>
        <div className="service-card-outer">
          <div className="service-card">
            <div className="service-icon"><GiOpenBook /></div>
            <h2>Wedding Album Design</h2>
            <p>Premium story-based album layouts for your special moments.</p>
          </div>
          <div className="service-card">
            <div className="service-icon"><MdPhotoFilter /></div>
            <h2>Photo Finishing & Retouch</h2>
            <p>Clean colour, detail enhancement and natural skin retouching.</p>
          </div>
          <div className="service-card">
            <div className="service-icon"><FaUserGraduate /></div>
            <h2>Photoshop Training</h2>
            <p>Practical guidance for album design and professional workflow.</p>
          </div>
        </div>
      </div>

      <div className="footer-upper">
        <div className="footer-box">
          <span><RiTeamFill /></span>
          <h3>Expert Team</h3>
        </div>

        <div className="footer-box">
          <span><MdHighQuality size={22} /></span>
          <h3>100% Quality</h3>
        </div>

        <div className="footer-box">
          <span><PiMoneyWavyFill /></span>
          <h3>Affordable Price</h3>
        </div>

        <div className="footer-box">
          <span><TiTick size={28} /></span>
          <h3>Customer Satisfaction</h3>
        </div>

        <div className="footer-call">
          <h2><a href={`tel:+91${settings.mobile}`}>Need Help? Call Now</a></h2>
        </div>
      </div>
      <hr className="footer-above-home-hr" />
      <Footer />
    </>
  );
};

export default Home;
