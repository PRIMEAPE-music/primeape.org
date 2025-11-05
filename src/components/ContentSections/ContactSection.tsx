import React, { useState, forwardRef } from 'react';
import type { ContactFormTab, FormSubmissionState, ContactFormData } from '../../types';
import './ContactSection.css';

/**
 * ContactSection Component
 * 
 * Contact form with two tabs (General / Booking) integrated with Netlify Forms.
 * Includes honeypot spam protection and success/error states.
 * 
 * Phase 6E: Initial implementation
 * Future: Can add additional validation, analytics tracking
 */

interface ContactSectionProps {
  initialTab?: ContactFormTab;
}

const ContactSection = forwardRef<HTMLElement, ContactSectionProps>(
  ({ initialTab = 'general' }, ref) => {
    // Tab state
    const [activeTab, setActiveTab] = useState<ContactFormTab>(initialTab);

    // Form state
    const [formData, setFormData] = useState<ContactFormData>({
      name: '',
      email: '',
      message: '',
      formType: initialTab
    });

    // Submission state
    const [submissionState, setSubmissionState] = useState<FormSubmissionState>('idle');

    // Honeypot (hidden field for spam prevention)
    const [honeypot, setHoneypot] = useState('');

    // Handle tab change
    const handleTabChange = (tab: ContactFormTab) => {
      setActiveTab(tab);
      setFormData(prev => ({ ...prev, formType: tab }));
    };

    // Handle input changes
    const handleInputChange = (
      e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
      const { name, value } = e.target;
      setFormData(prev => ({ ...prev, [name]: value }));
    };

    // Handle form submission
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();

      // Check honeypot (if filled, it's a bot)
      if (honeypot) {
        console.log('Bot detected via honeypot');
        return;
      }

      setSubmissionState('submitting');

      try {
        // Netlify Forms submission
        const formDataEncoded = new URLSearchParams();
        formDataEncoded.append('form-name', 'contact-form');
        formDataEncoded.append('name', formData.name);
        formDataEncoded.append('email', formData.email);
        formDataEncoded.append('message', formData.message);
        formDataEncoded.append('formType', formData.formType);

        const response = await fetch('/', {
          method: 'POST',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          body: formDataEncoded.toString()
        });

        if (response.ok) {
          setSubmissionState('success');
          // Reset form
          setFormData({
            name: '',
            email: '',
            message: '',
            formType: activeTab
          });
        } else {
          throw new Error('Form submission failed');
        }
      } catch (error) {
        console.error('Form submission error:', error);
        setSubmissionState('error');
      }
    };

    // Reset submission state (for showing form again after success/error)
    const resetSubmissionState = () => {
      setSubmissionState('idle');
    };

    return (
      <section
        ref={ref}
        className="contact-section"
        aria-labelledby="contact-heading"
      >
        <div className="contact-section__container">
          <h2 id="contact-heading" className="contact-section__title">
            Contact
          </h2>

          <div className="contact-section__content">
            {/* Tab buttons */}
            <div className="contact-section__tabs" role="tablist" aria-label="Contact form types">
              <button
                type="button"
                role="tab"
                aria-selected={activeTab === 'general'}
                aria-controls="contact-form"
                className={`contact-section__tab ${activeTab === 'general' ? 'contact-section__tab--active' : ''}`}
                onClick={() => handleTabChange('general')}
              >
                General Contact
              </button>
              <button
                type="button"
                role="tab"
                aria-selected={activeTab === 'booking'}
                aria-controls="contact-form"
                className={`contact-section__tab ${activeTab === 'booking' ? 'contact-section__tab--active' : ''}`}
                onClick={() => handleTabChange('booking')}
              >
                Booking
              </button>
            </div>

            {/* Form */}
            {submissionState === 'success' ? (
              <div className="contact-section__message contact-section__message--success">
                <h3>Thank you for reaching out!</h3>
                <p>
                  Your message has been received. I'll get back to you as soon as possible.
                </p>
                <button
                  type="button"
                  className="contact-section__reset-btn"
                  onClick={resetSubmissionState}
                >
                  Send another message
                </button>
              </div>
            ) : submissionState === 'error' ? (
              <div className="contact-section__message contact-section__message--error">
                <h3>Oops! Something went wrong.</h3>
                <p>
                  There was an error submitting your message. Please try again or email directly.
                </p>
                <button
                  type="button"
                  className="contact-section__reset-btn"
                  onClick={resetSubmissionState}
                >
                  Try again
                </button>
              </div>
            ) : (
              <form
                id="contact-form"
                name="contact-form"
                method="POST"
                data-netlify="true"
                data-netlify-honeypot="bot-field"
                className="contact-section__form"
                onSubmit={handleSubmit}
              >
                {/* Hidden fields for Netlify */}
                <input type="hidden" name="form-name" value="contact-form" />
                <input type="hidden" name="formType" value={formData.formType} />

                {/* Honeypot field (hidden from users, visible to bots) */}
                <div style={{ display: 'none' }} aria-hidden="true">
                  <label htmlFor="bot-field">Don't fill this out if you're human:</label>
                  <input
                    id="bot-field"
                    name="bot-field"
                    value={honeypot}
                    onChange={(e) => setHoneypot(e.target.value)}
                    tabIndex={-1}
                    autoComplete="off"
                  />
                </div>

                {/* Name field */}
                <div className="contact-section__field">
                  <label htmlFor="contact-name" className="contact-section__label">
                    Name <span className="contact-section__required">*</span>
                  </label>
                  <input
                    type="text"
                    id="contact-name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    className="contact-section__input"
                    placeholder="Your name"
                    autoComplete="name"
                  />
                </div>

                {/* Email field */}
                <div className="contact-section__field">
                  <label htmlFor="contact-email" className="contact-section__label">
                    Email <span className="contact-section__required">*</span>
                  </label>
                  <input
                    type="email"
                    id="contact-email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className="contact-section__input"
                    placeholder="your.email@example.com"
                    autoComplete="email"
                  />
                </div>

                {/* Message field */}
                <div className="contact-section__field">
                  <label htmlFor="contact-message" className="contact-section__label">
                    Message <span className="contact-section__required">*</span>
                  </label>
                  <textarea
                    id="contact-message"
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    required
                    className="contact-section__textarea"
                    placeholder={
                      activeTab === 'booking'
                        ? 'Please include event details, date, venue, and budget...'
                        : 'Your message...'
                    }
                    rows={8}
                  />
                </div>

                {/* Submit button */}
                <button
                  type="submit"
                  className="contact-section__submit"
                  disabled={submissionState === 'submitting'}
                >
                  {submissionState === 'submitting' ? 'Sending...' : 'Send Message'}
                </button>
              </form>
            )}
          </div>
        </div>
      </section>
    );
  }
);

ContactSection.displayName = 'ContactSection';

export default ContactSection;