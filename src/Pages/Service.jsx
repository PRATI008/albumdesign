import { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import Header from '../Components/Header';
import Footer from '../Components/Footer';
import { getPackages, getDesigns } from '../services/api';
import { GiOpenBook } from 'react-icons/gi';
import { MdPhotoFilter, MdStars } from 'react-icons/md';
import { FaUserGraduate, FaPaintBrush, FaCheckCircle } from 'react-icons/fa';
import './CSS/SimplePages.css';

const Service = () => {
  const [packages, setPackages] = useState([]);
  const [designs, setDesigns] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    Promise.all([getPackages(), getDesigns()]).then(([pkgList, designList]) => {
      if (isMounted) {
        if (Array.isArray(pkgList)) {
          setPackages(pkgList.filter((p) => p.status !== 'Inactive'));
        }
        if (Array.isArray(designList)) {
          setDesigns(designList.filter((d) => d.status !== 'Inactive'));
        }
        setLoading(false);
      }
    });
    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <>
      <Header />
      <main className="page-container">
        {/* Main Header Card */}
        <div className="page-card">
          <h1 className="page-card__title">Our Services & Packages</h1>
          <p className="page-card__subtitle">
            High-end album design, photo finishing, masterclasses, and customizable packages for all your memorable occasions.
          </p>
        </div>

        {/* Core Services Grid */}
        <div className="service-grid">
          <div className="service-feature-card">
            <div className="service-feature-icon">
              <GiOpenBook />
            </div>
            <h3>Wedding Album Design</h3>
            <p>
              Premium story-based layouts tailored to celebrate your most cherished moments with cinematic flair.
            </p>
            <NavLink to="/album" className="contact-submit-btn" style={{ textDecoration: 'none', marginTop: '16px' }}>
              Book Wedding Album →
            </NavLink>
          </div>

          <div className="service-feature-card">
            <div className="service-feature-icon">
              <MdPhotoFilter />
            </div>
            <h3>Photo Finishing & Retouch</h3>
            <p>
              Clean color grading, detail enhancement, and natural, flawless skin retouching for studio photographers.
            </p>
            <NavLink to="/enquiry" className="contact-submit-btn" style={{ textDecoration: 'none', marginTop: '16px', background: '#334155' }}>
              Enquire Retouching →
            </NavLink>
          </div>

          <div className="service-feature-card">
            <div className="service-feature-icon">
              <FaUserGraduate />
            </div>
            <h3>Photoshop Training</h3>
            <p>
              Practical one-on-one masterclasses for album designers, creative editors, and photo studio owners.
            </p>
            <NavLink to="/training" className="contact-submit-btn" style={{ textDecoration: 'none', marginTop: '16px', background: '#0F766E' }}>
              View Training Course →
            </NavLink>
          </div>
        </div>

        {/* Dynamic Studio Packages Section (Loaded from Backend) */}
        {packages.length > 0 && (
          <div style={{ marginTop: '48px' }}>
            <div className="page-card" style={{ marginBottom: '24px' }}>
              <h2 className="page-card__title" style={{ fontSize: '1.6rem' }}>
                <MdStars style={{ color: '#F59E0B', verticalAlign: 'middle', marginRight: '6px' }} />
                Available Album Packages
              </h2>
              <p className="page-card__subtitle" style={{ marginBottom: 0 }}>
                Choose from our popular studio packages or customize your own specifications.
              </p>
            </div>

            <div className="service-grid">
              {packages.map((pkg) => (
                <div key={pkg._id} className="service-feature-card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                      <span style={{ fontSize: '0.8rem', background: '#DBEAFE', color: '#1E40AF', padding: '4px 10px', borderRadius: '20px', fontWeight: 'bold' }}>
                        {pkg.category || 'Featured'}
                      </span>
                      {pkg.price && (
                        <strong style={{ fontSize: '1.25rem', color: '#1E3A8A' }}>
                          ₹{Number(pkg.price).toLocaleString()}
                        </strong>
                      )}
                    </div>
                    <h3 style={{ fontSize: '1.3rem', color: '#0F172A', marginBottom: '8px' }}>{pkg.packageName}</h3>
                    <p style={{ color: '#475569', fontSize: '0.95rem' }}>
                      {pkg.description || 'Full professional layout design, premium printing, and custom cover options.'}
                    </p>
                    {(pkg.photos || pkg.duration) && (
                      <div style={{ marginTop: '12px', fontSize: '0.85rem', color: '#64748B', display: 'flex', gap: '12px' }}>
                        {pkg.photos && <span>📷 {pkg.photos} Photos</span>}
                        {pkg.duration && <span>⏱ {pkg.duration}</span>}
                      </div>
                    )}
                  </div>

                  <NavLink
                    to={`/album?package=${encodeURIComponent(pkg.packageName)}`}
                    className="contact-submit-btn"
                    style={{ textDecoration: 'none', marginTop: '20px', width: '100%' }}
                  >
                    Select & Book →
                  </NavLink>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Dynamic Design Styles Section (Loaded from Backend) */}
        {designs.length > 0 && (
          <div style={{ marginTop: '48px' }}>
            <div className="page-card" style={{ marginBottom: '24px' }}>
              <h2 className="page-card__title" style={{ fontSize: '1.6rem' }}>
                <FaPaintBrush style={{ color: '#3B82F6', verticalAlign: 'middle', marginRight: '8px' }} />
                Creative Design Styles
              </h2>
              <p className="page-card__subtitle" style={{ marginBottom: 0 }}>
                Explore the signature design styles curated by our master album designers.
              </p>
            </div>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', justifyContent: 'center' }}>
              {designs.map((d) => (
                <div
                  key={d._id}
                  style={{
                    background: '#FFFFFF',
                    padding: '16px 24px',
                    borderRadius: '12px',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.06)',
                    border: '1px solid #E2E8F0',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    fontWeight: '600',
                    color: '#1E3A8A'
                  }}
                >
                  <FaCheckCircle style={{ color: '#10B981' }} />
                  {d.designStyle || d.style}
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
      <Footer />
    </>
  );
};

export default Service;
