import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import Header from '../Components/Header';
import Footer from '../Components/Footer';
import { getPackages, submitEnquiry } from '../services/api';
import './CSS/Login.css';

const Enquiry = () => {
    const [packages, setPackages] = useState([]);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        service: '',
        message: ''
    });

    const [loading, setLoading] = useState(false);

    useEffect(() => {
        let isMounted = true;
        getPackages().then((list) => {
            if (isMounted && Array.isArray(list)) {
                setPackages(list.filter((p) => p.status !== 'Inactive'));
            }
        });
        return () => {
            isMounted = false;
        };
    }, []);

    // Input Change
    const handleChange = (e) => {
        const { name, value } = e.target;

        if (name === 'phone' && !/^[0-9]*$/.test(value)) {
            return;
        }

        setFormData((prev) => ({
            ...prev,
            [name]: value
        }));
    };

    // Form Submit
    const handleSubmit = async (e) => {
        e.preventDefault();
        e.stopPropagation();

        if (loading) return;

        // Validation
        const name = formData.name.trim();
        const email = formData.email.trim();
        const phone = formData.phone.trim();
        const service = formData.service.trim();
        const message = formData.message.trim();

        if (!name || !phone || !message) {
            Swal.fire({
                icon: 'warning',
                title: 'Required Fields',
                text: 'Please fill Name, Phone and Enquiry Message.',
                confirmButtonColor: '#1E3A8A'
            });
            return;
        }

        if (!/^[0-9]{10}$/.test(phone)) {
            Swal.fire({
                icon: 'warning',
                title: 'Invalid Mobile Number',
                text: 'Please enter a valid 10 digit mobile number.',
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

            const enquiryData = {
                name,
                email,
                phone,
                service: service || 'General Album Enquiry',
                message
            };

            const response = await submitEnquiry(enquiryData);

            if (response.success) {
                setFormData({
                    name: '',
                    email: '',
                    phone: '',
                    service: '',
                    message: ''
                });

                await Swal.fire({
                    icon: 'success',
                    title: 'Thank You!',
                    text: 'Your enquiry has been submitted successfully. Our team will contact you soon.',
                    confirmButtonText: 'OK',
                    confirmButtonColor: '#1E3A8A'
                });
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Submission Failed',
                    text: response.message || 'Please try again.',
                    confirmButtonColor: '#1E3A8A'
                });
            }
        } catch (error) {
            console.error('Enquiry Submission Error:', error);
            const errorMessage =
                error.response?.data?.message ||
                (error.code === 'ECONNABORTED'
                    ? 'Server response timed out. Please try again.'
                    : 'Backend server is not responding. Please check your connection.');

            Swal.fire({
                icon: 'error',
                title: 'Submission Failed',
                text: errorMessage,
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
                    <h1>Enquire Now</h1>
                    <p>
                        Get in touch with our studio for bespoke album design packages.
                    </p>

                    <form onSubmit={handleSubmit} noValidate>
                        {/* Full Name */}
                        <div className="form-group mb-3">
                            <label htmlFor="enquiry-name">Full Name *</label>
                            <input
                                id="enquiry-name"
                                type="text"
                                name="name"
                                placeholder="Enter your full name"
                                value={formData.name}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        {/* Phone */}
                        <div className="form-group mb-3">
                            <label htmlFor="enquiry-phone">Phone Number (10 digits) *</label>
                            <input
                                id="enquiry-phone"
                                type="tel"
                                name="phone"
                                placeholder="Enter 10 digit phone number"
                                value={formData.phone}
                                onChange={handleChange}
                                maxLength={10}
                                required
                            />
                        </div>

                        {/* Email */}
                        <div className="form-group mb-3">
                            <label htmlFor="enquiry-email">Email Address</label>
                            <input
                                id="enquiry-email"
                                type="email"
                                name="email"
                                placeholder="Enter your email"
                                value={formData.email}
                                onChange={handleChange}
                            />
                        </div>

                        {/* Service Interested */}
                        <div className="form-group mb-3">
                            <label htmlFor="enquiry-service">Service Interested</label>
                            <select
                                id="enquiry-service"
                                name="service"
                                value={formData.service}
                                onChange={handleChange}
                                style={{
                                    width: '100%',
                                    padding: '10px 14px',
                                    borderRadius: '8px',
                                    border: '1px solid #ccc',
                                    fontSize: '1rem',
                                    backgroundColor: '#fff'
                                }}
                            >
                                <option value="">Select Service / Package</option>
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
                                    </>
                                )}
                            </select>
                        </div>

                        {/* Message */}
                        <div className="form-group mb-3">
                            <label htmlFor="enquiry-message">Enquiry Message *</label>
                            <textarea
                                id="enquiry-message"
                                name="message"
                                placeholder="Enter your enquiry details or requirements..."
                                value={formData.message}
                                onChange={handleChange}
                                rows={4}
                                required
                            />
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="submit-btn"
                        >
                            {loading ? 'Submitting...' : 'Submit Enquiry'}
                        </button>
                    </form>
                </div>
            </div>

            <Footer />
        </>
    );
};

export default Enquiry;
