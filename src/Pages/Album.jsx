import "./CSS/Album1.css";
import Header from "../Components/Header";
import Footer from "../Components/Footer";
import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import Swal from "sweetalert2";
import { getPackages, getDesigns, submitBooking } from "../services/api";

const Album = () => {
  const location = useLocation();
  const [step, setStep] = useState(1);
  const [availablePackages, setAvailablePackages] = useState([]);
  const [availableDesigns, setAvailableDesigns] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form State containing all fields from the specification
  const [formData, setFormData] = useState({
    // Step 1: Album Details
    package: "Wedding Album",
    size: "12 x 18 inch",
    pages: "30 Pages",
    copies: "1",
    cover: "Leather Cover",
    paper: "Matte",
    style: "Premium / Luxury",

    // Step 2: Customer & Event Details
    name: "",
    mobile: "",
    email: "",
    event: "Wedding",
    date: "",
    city: "",
    address: "",
    notes: "",
  });

  const [validationError, setValidationError] = useState("");

  // Fetch dynamic packages and designs
  useEffect(() => {
    let isMounted = true;

    // Read query param if package preselected
    const params = new URLSearchParams(location.search);
    const preselectedPkg = params.get('package');

    getPackages().then((list) => {
      if (isMounted && Array.isArray(list)) {
        const activeList = list.filter((p) => p.status !== 'Inactive');
        setAvailablePackages(activeList);
        if (preselectedPkg) {
          setFormData((prev) => ({ ...prev, package: preselectedPkg }));
        } else if (activeList.length > 0 && !formData.package) {
          setFormData((prev) => ({ ...prev, package: activeList[0].packageName }));
        }
      }
    });

    getDesigns().then((list) => {
      if (isMounted && Array.isArray(list)) {
        const activeDesigns = list.filter((d) => d.status !== 'Inactive');
        setAvailableDesigns(activeDesigns);
      }
    });

    return () => {
      isMounted = false;
    };
  }, [location.search]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (validationError) setValidationError("");
  };

  const handleNextFromStep1 = () => {
    if (!formData.package) {
      setValidationError("Please select an Album Package.");
      return;
    }
    setValidationError("");
    setStep(2);
  };

  const handleNextFromStep2 = () => {
    if (!formData.name.trim()) {
      setValidationError("Please enter Customer Name.");
      return;
    }
    if (!formData.mobile.trim()) {
      setValidationError("Please enter Mobile Number.");
      return;
    }
    if (!formData.event) {
      setValidationError("Please select an Event Type.");
      return;
    }
    if (!formData.date) {
      setValidationError("Please select an Event Date.");
      return;
    }
    if (!formData.city.trim()) {
      setValidationError("Please enter City / Village.");
      return;
    }

    setValidationError("");
    setStep(3);
  };

  const previousStep = () => {
    setValidationError("");
    setStep((prev) => Math.max(1, prev - 1));
  };

  // Backend Booking Submission
  const handleConfirmBooking = async () => {
    try {
      setIsSubmitting(true);
      const parsedPages = parseInt(formData.pages) || 30;
      const parsedCopies = parseInt(formData.copies) || 1;

      const payload = {
        albumPackage: formData.package,
        albumSize: formData.size,
        albumPages: parsedPages,
        numberOfCopies: parsedCopies,
        albumCover: formData.cover,
        paperQuality: formData.paper,
        designStyle: formData.style,
        customerName: formData.name.trim(),
        mobile: formData.mobile.trim(),
        email: formData.email.trim(),
        eventType: formData.event,
        eventDate: formData.date,
        city: formData.city.trim(),
        fullAddress: formData.address.trim(),
        specialInstructions: formData.notes.trim()
      };

      const res = await submitBooking(payload);

      if (res.success) {
        const result = await Swal.fire({
          icon: 'success',
          title: 'Booking Confirmed! 🎉',
          html: `
            <p>Your album booking has been submitted directly to our studio.</p>
            <p style="margin-top:8px; font-weight:600; color:#1E3A8A">Booking Reference: ${res.booking?._id || 'Saved'}</p>
            <p style="font-size:0.9rem; color:#64748B;">Our team will contact you on <strong>${formData.mobile}</strong> shortly.</p>
          `,
          showCancelButton: true,
          confirmButtonColor: '#1E3A8A',
          cancelButtonColor: '#475569',
          confirmButtonText: 'Done',
          cancelButtonText: 'Also Send via Gmail ↗'
        });

        if (result.dismiss === Swal.DismissReason.cancel) {
          sendBookingViaGmail();
        }

        // Reset form
        setStep(1);
        setFormData({
          package: availablePackages[0]?.packageName || "Wedding Album",
          size: "12 x 18 inch",
          pages: "30 Pages",
          copies: "1",
          cover: "Leather Cover",
          paper: "Matte",
          style: availableDesigns[0]?.designStyle || "Premium / Luxury",
          name: "",
          mobile: "",
          email: "",
          event: "Wedding",
          date: "",
          city: "",
          address: "",
          notes: "",
        });
      } else {
        throw new Error(res.message || 'Booking submission failed');
      }
    } catch (err) {
      console.error('Booking Submission Error:', err);
      Swal.fire({
        icon: 'error',
        title: 'Booking Failed',
        text: err.response?.data?.message || err.message || 'Could not connect to server. Please try again.',
        confirmButtonColor: '#1E3A8A'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Gmail Compose URL Generator
  const sendBookingViaGmail = () => {
    const studioEmail = "rapidalbumcreation@gmail.com";
    const subject = `Album Booking Request — ${formData.name} (${formData.event})`;

    const emailBody = [
      "New Album Booking Request — Singh Album Design",
      "==============================================",
      "",
      "ALBUM SPECIFICATIONS:",
      `• Package: ${formData.package}`,
      `• Album Size: ${formData.size}`,
      `• Approx. Pages: ${formData.pages}`,
      `• Number of Copies: ${formData.copies}`,
      `• Cover Type: ${formData.cover}`,
      `• Paper Quality: ${formData.paper}`,
      `• Design Style: ${formData.style}`,
      "",
      "CUSTOMER & EVENT DETAILS:",
      `• Customer Name: ${formData.name}`,
      `• Mobile Number: ${formData.mobile}`,
      `• Email Address: ${formData.email || "Not provided"}`,
      `• Event Type: ${formData.event}`,
      `• Event Date: ${formData.date}`,
      `• City / Village: ${formData.city}`,
      `• Full Address: ${formData.address || "Not provided"}`,
      `• Special Instructions: ${formData.notes || "None"}`,
      "",
      "==============================================",
      "Sent via Singh Album Design Online Booking Portal.",
      "Please contact the customer to confirm this order."
    ].join("\n");

    const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(
      studioEmail
    )}&su=${encodeURIComponent(subject)}&body=${encodeURIComponent(emailBody)}`;

    window.open(gmailUrl, "_blank");
  };

  return (
    <>
      <Header />

      <div className="album-header">
        <div className="album-hero">
          <div className="album-hero-left">
            <h5>YOUR MEMORIES, BEAUTIFULLY DESIGNED</h5>

            <h1>Make Your Special Moments</h1>
            <h1>Memorable With Beautiful Albums</h1>

            <p>
              Book beautifully designed wedding, pre-wedding and special
              occasion albums. Choose your package, provide your details and
              send your booking request directly to our studio through Gmail.
            </p>

            <button>
              <a href="#booking">Start Your Booking →</a>
            </button>

            <div className="btn-album-hero">
              <button>1. Choose Package</button>
              <button>2. Enter Details</button>
              <button>3. Send Through Gmail</button>
            </div>
          </div>

          <div className="album-hero-right">
            <div>
              <div>ONLINE BOOKING</div>

              <h2>Simple and Easy Booking Process</h2>

              <p>
                Select your album package and event date. Provide your personal
                details and send your booking request to our studio.
              </p>

              <div>
                ✓ Easy Form &nbsp; ✓ Booking Summary &nbsp; ✓ Gmail Link
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="album-samples" id="samples">
        <h2>Album Design Samples</h2>

        <p>Explore some of our beautiful album design styles.</p>

        <div className="album-sample-card-outer">
          <div className="album-card">
            <div className="card-top-1">
              <div className="frame-1">
                <div className="frame-inner"></div>
              </div>

              <div className="frame-1">
                <div className="frame-inner"></div>
              </div>
            </div>

            <div className="card-bottom">
              <span className="badge">CLASSIC</span>

              <h3 className="title">Traditional Wedding</h3>

              <p className="desc">
                A beautiful wedding album with traditional colours and elegant
                layouts.
              </p>
            </div>
          </div>

          <div className="album-card">
            <div className="card-top card-top-2">
              <div className="frame-1">
                <div className="frame-inner"></div>
              </div>

              <div className="frame-1">
                <div className="frame-inner"></div>
              </div>
            </div>

            <div className="card-bottom">
              <span className="badge">PREMIUM</span>

              <h3 className="title">Luxury Wedding</h3>

              <p className="desc">
                Elegant colours, creative frames and a premium album appearance.
              </p>
            </div>
          </div>

          <div className="album-card">
            <div className="card-top card-top-3">
              <div className="frame-1">
                <div className="frame-inner"></div>
              </div>

              <div className="frame-1">
                <div className="frame-inner"></div>
              </div>
            </div>

            <div className="card-bottom">
              <span className="badge">MODERN</span>

              <h3 className="title">Cinematic Album</h3>

              <p className="desc">
                Modern layouts and cinematic colour tones for your special
                memories.
              </p>
            </div>
          </div>

          <div className="album-card">
            <div className="card-top card-top-4">
              <div className="frame-1">
                <div className="frame-inner"></div>
              </div>

              <div className="frame-1">
                <div className="frame-inner"></div>
              </div>
            </div>

            <div className="card-bottom">
              <span className="badge">VINTAGE</span>

              <h3 className="title">Vintage Theme Album</h3>

              <p className="desc">
                Beautiful layouts and vintage colour tones for your precious
                moments.
              </p>
            </div>
          </div>
        </div>

        <p className="note-para">
          Note: These are illustrative sample layouts displayed on the website.
          They can be replaced with actual album photographs and designs.
        </p>
      </div>

      {/* Online Booking Form Section */}
      <div className="album-samples" id="booking">
        <h2>Online Album Booking</h2>

        <p>Complete the following steps to book your album.</p>

        <div className="online-book-outer">
          <div className="online-book-left">
            <h6>SINGH ALBUM DESIGN</h6>

            <h1>Booking Process</h1>

            <p>
              Just like providing travel details while booking a train ticket,
              enter your album and event information here.
            </p>

            <div>
              <ol type="1">
                <li>Choose your album package</li>
                <li>Enter customer & event information</li>
                <li>Review your booking details</li>
                <li>Send your request through Gmail</li>
              </ol>
              <br />

              <hr />
              <br />

              <p className="notes-para">
                After submitting your booking request, our studio will contact
                you to confirm your order.
              </p>
            </div>
          </div>

          <div className="online-book-right">
            <h1>Book Your Album</h1>

            <div className="form-steps">
              <div className="step-item">
                <span className={step >= 1 ? "active-step" : ""}>1</span>
                <p className={step >= 1 ? "active-text" : ""}>Album Details</p>
              </div>

              <div className={`step-line ${step >= 2 ? "completed" : ""}`}>
                <span></span>
              </div>

              <div className="step-item">
                <span className={step >= 2 ? "active-step" : ""}>2</span>
                <p className={step >= 2 ? "active-text" : ""}>Customer Details</p>
              </div>

              <div className={`step-line ${step >= 3 ? "completed" : ""}`}>
                <span></span>
              </div>

              <div className="step-item">
                <span className={step >= 3 ? "active-step" : ""}>3</span>
                <p className={step >= 3 ? "active-text" : ""}>
                  Booking Summary
                </p>
              </div>
            </div>

            {validationError && (
              <div className="form-validation-alert">
                ⚠️ {validationError}
              </div>
            )}

            {/* STEP 1: Album Details & Specifications */}
            {step === 1 && (
              <div className="booking-step-content">
                <h2>Step 1 — Album Details</h2>

                <div className="form-grid">
                  <div className="field">
                    <label htmlFor="package">
                      Album Package <span className="required">*</span>
                    </label>
                    <select
                      id="package"
                      name="package"
                      value={formData.package}
                      onChange={handleChange}
                      required
                    >
                      <option value="">Select Package</option>
                      {availablePackages.length > 0 ? (
                        availablePackages.map((p) => (
                          <option key={p._id} value={p.packageName}>
                            {p.packageName}
                          </option>
                        ))
                      ) : (
                        <>
                          <option value="Wedding Album">Wedding Album</option>
                          <option value="Pre-Wedding Album">Pre-Wedding Album</option>
                          <option value="Engagement Album">Engagement Album</option>
                          <option value="Birthday / Event Album">Birthday / Event Album</option>
                          <option value="Custom Album">Custom Album</option>
                        </>
                      )}
                    </select>
                  </div>

                  <div className="field">
                    <label htmlFor="size">Album Size</label>
                    <select
                      id="size"
                      name="size"
                      value={formData.size}
                      onChange={handleChange}
                    >
                      <option value="12 x 18 inch">12 x 18 inch</option>
                      <option value="12 x 24 inch">12 x 24 inch</option>
                      <option value="10 x 15 inch">10 x 15 inch</option>
                      <option value="18 x 24 inch">18 x 24 inch</option>
                      <option value="Custom Size">Custom Size</option>
                    </select>
                  </div>

                  <div className="field">
                    <label htmlFor="pages">Approx. Pages</label>
                    <select
                      id="pages"
                      name="pages"
                      value={formData.pages}
                      onChange={handleChange}
                    >
                      <option value="20 Pages">20 Pages</option>
                      <option value="30 Pages">30 Pages</option>
                      <option value="40 Pages">40 Pages</option>
                      <option value="50 Pages">50 Pages</option>
                      <option value="As discussed">As discussed</option>
                    </select>
                  </div>

                  <div className="field">
                    <label htmlFor="copies">Number of Copies</label>
                    <select
                      id="copies"
                      name="copies"
                      value={formData.copies}
                      onChange={handleChange}
                    >
                      <option value="1">1</option>
                      <option value="2">2</option>
                      <option value="3">3</option>
                      <option value="4">4</option>
                      <option value="5+">5+</option>
                    </select>
                  </div>

                  <div className="field">
                    <label htmlFor="cover">Album Cover</label>
                    <select
                      id="cover"
                      name="cover"
                      value={formData.cover}
                      onChange={handleChange}
                    >
                      <option value="Leather Cover">Leather Cover</option>
                      <option value="Photo Cover">Photo Cover</option>
                      <option value="Hard Cover">Hard Cover</option>
                      <option value="Acrylic Glass Cover">Acrylic Glass Cover</option>
                    </select>
                  </div>

                  <div className="field">
                    <label htmlFor="paper">Paper Quality</label>
                    <select
                      id="paper"
                      name="paper"
                      value={formData.paper}
                      onChange={handleChange}
                    >
                      <option value="Matte">Matte</option>
                      <option value="Glossy">Glossy</option>
                      <option value="Metallic / Velvet">Metallic / Velvet</option>
                    </select>
                  </div>

                  <div className="field field-full">
                    <label htmlFor="style">Design Style</label>
                    <select
                      id="style"
                      name="style"
                      value={formData.style}
                      onChange={handleChange}
                    >
                      <option value="">Select Style</option>
                      {availableDesigns.length > 0 ? (
                        availableDesigns.map((d) => (
                          <option key={d._id} value={d.designStyle || d.style}>
                            {d.designStyle || d.style}
                          </option>
                        ))
                      ) : (
                        <>
                          <option value="Classic">Classic</option>
                          <option value="Premium / Luxury">Premium / Luxury</option>
                          <option value="Cinematic">Cinematic</option>
                          <option value="Traditional">Traditional</option>
                          <option value="Studio Suggestion">Studio Suggestion</option>
                        </>
                      )}
                    </select>
                  </div>
                </div>

                <div className="form-actions">
                  <span></span>
                  <button type="button" onClick={handleNextFromStep1}>
                    Continue to Details →
                  </button>
                </div>
              </div>
            )}

            {/* STEP 2: Customer & Event Details */}
            {step === 2 && (
              <div className="booking-step-content">
                <h2>Step 2 — Customer & Event Details</h2>

                <div className="form-grid">
                  <div className="field">
                    <label htmlFor="name">
                      Customer Name <span className="required">*</span>
                    </label>
                    <input
                      id="name"
                      name="name"
                      type="text"
                      placeholder="Enter full name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                    >
                    </input>
                  </div>

                  <div className="field">
                    <label htmlFor="mobile">
                      Mobile Number <span className="required">*</span>
                    </label>
                    <input
                      id="mobile"
                      name="mobile"
                      type="tel"
                      placeholder="e.g. 9695774046"
                      value={formData.mobile}
                      onChange={handleChange}
                      required
                    >
                    </input>
                  </div>

                  <div className="field">
                    <label htmlFor="email">Email Address</label>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="name@example.com"
                      value={formData.email}
                      onChange={handleChange}
                    >
                    </input>
                  </div>

                  <div className="field">
                    <label htmlFor="event">
                      Event Type <span className="required">*</span>
                    </label>
                    <select
                      id="event"
                      name="event"
                      value={formData.event}
                      onChange={handleChange}
                      required
                    >
                      <option value="">Select Event Type</option>
                      <option value="Wedding">Wedding</option>
                      <option value="Pre-Wedding">Pre-Wedding</option>
                      <option value="Engagement">Engagement</option>
                      <option value="Birthday">Birthday</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>

                  <div className="field">
                    <label htmlFor="date">
                      Event Date <span className="required">*</span>
                    </label>
                    <input
                      id="date"
                      name="date"
                      type="date"
                      value={formData.date}
                      onChange={handleChange}
                      required
                    >
                    </input>
                  </div>

                  <div className="field">
                    <label htmlFor="city">
                      City / Village <span className="required">*</span>
                    </label>
                    <input
                      id="city"
                      name="city"
                      type="text"
                      placeholder="e.g. Raebareli"
                      value={formData.city}
                      onChange={handleChange}
                      required
                    >
                    </input>
                  </div>

                  <div className="field field-full">
                    <label htmlFor="address">Full Address</label>
                    <input
                      id="address"
                      name="address"
                      type="text"
                      placeholder="House / Street, Landmark, Area..."
                      value={formData.address}
                      onChange={handleChange}
                    >
                    </input>
                  </div>

                  <div className="field field-full">
                    <label htmlFor="notes">Special Instructions</label>
                    <textarea
                      id="notes"
                      name="notes"
                      placeholder="Specific design ideas, couple names, date format, song/quote preferences..."
                      value={formData.notes}
                      onChange={handleChange}
                    >
                    </textarea>
                  </div>
                </div>

                <div className="form-actions">
                  <button type="button" onClick={previousStep}>
                    ← Back
                  </button>
                  <button type="button" onClick={handleNextFromStep2}>
                    Review Booking →
                  </button>
                </div>
              </div>
            )}

            {/* STEP 3: Booking Summary & Confirm */}
            {step === 3 && (
              <div className="booking-step-content">
                <h2>Step 3 — Booking Summary</h2>

                <div className="booking-summary-box">
                  <div className="summary-row">
                    <span className="summary-label">Package:</span>
                    <span className="summary-value">{formData.package}</span>
                  </div>

                  <div className="summary-row">
                    <span className="summary-label">Album Size:</span>
                    <span className="summary-value">{formData.size}</span>
                  </div>

                  <div className="summary-row">
                    <span className="summary-label">Approx. Pages:</span>
                    <span className="summary-value">{formData.pages}</span>
                  </div>

                  <div className="summary-row">
                    <span className="summary-label">Number of Copies:</span>
                    <span className="summary-value">{formData.copies}</span>
                  </div>

                  <div className="summary-row">
                    <span className="summary-label">Cover Type:</span>
                    <span className="summary-value">{formData.cover}</span>
                  </div>

                  <div className="summary-row">
                    <span className="summary-label">Paper Quality:</span>
                    <span className="summary-value">{formData.paper}</span>
                  </div>

                  <div className="summary-row">
                    <span className="summary-label">Design Style:</span>
                    <span className="summary-value">{formData.style}</span>
                  </div>

                  <div className="summary-row">
                    <span className="summary-label">Customer Name:</span>
                    <span className="summary-value">{formData.name}</span>
                  </div>

                  <div className="summary-row">
                    <span className="summary-label">Mobile Number:</span>
                    <span className="summary-value">{formData.mobile}</span>
                  </div>

                  <div className="summary-row">
                    <span className="summary-label">Email:</span>
                    <span className="summary-value">{formData.email || "Not provided"}</span>
                  </div>

                  <div className="summary-row">
                    <span className="summary-label">Event Type:</span>
                    <span className="summary-value">{formData.event}</span>
                  </div>

                  <div className="summary-row">
                    <span className="summary-label">Event Date:</span>
                    <span className="summary-value">{formData.date}</span>
                  </div>

                  <div className="summary-row">
                    <span className="summary-label">City / Village:</span>
                    <span className="summary-value">{formData.city}</span>
                  </div>

                  <div className="summary-row summary-row--full">
                    <span className="summary-label">Full Address:</span>
                    <span className="summary-value">{formData.address || "Not provided"}</span>
                  </div>

                  <div className="summary-row summary-row--full">
                    <span className="summary-label">Special Instructions:</span>
                    <span className="summary-value">{formData.notes || "None"}</span>
                  </div>
                </div>

                <div className="booking-notice">
                  ℹ️ <strong>Note:</strong> Clicking "Confirm & Submit Booking" will directly save your booking in our studio database. You can also send the summary via Gmail.
                </div>

                <div className="form-actions">
                  <button type="button" onClick={previousStep} disabled={isSubmitting}>
                    ← Edit Details
                  </button>

                  <button
                    type="button"
                    onClick={handleConfirmBooking}
                    className="btn-send-gmail"
                    disabled={isSubmitting}
                    style={{ background: '#1E3A8A' }}
                  >
                    {isSubmitting ? 'Saving Booking...' : '✓ Confirm & Submit Booking'}
                  </button>

                  <button
                    type="button"
                    onClick={sendBookingViaGmail}
                    className="btn-send-gmail"
                    style={{ background: '#64748B' }}
                    title="Send pre-filled email via Gmail"
                  >
                    Send via Gmail ↗
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
};

export default Album;
