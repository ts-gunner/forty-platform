import { useState } from 'react'
import './ApplySupplier.css'

const categoryOptions = [
  { id: 'audio', name: 'Audio' },
  { id: 'mic', name: 'Microphones' },
  { id: 'lighting', name: 'Lighting' },
]

function ApplySupplier() {
  const [form, setForm] = useState({
    company: '',
    contact: '',
    phone: '',
    email: '',
    categories: [],
    description: '',
  })
  const [errors, setErrors] = useState({})
  const [submitted, setSubmitted] = useState(false)
  const [showToast, setShowToast] = useState(false)

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }))
    // Clear error for this field
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: '' }))
    }
  }

  const toggleCategory = (catId) => {
    setForm((prev) => {
      const exists = prev.categories.includes(catId)
      return {
        ...prev,
        categories: exists
          ? prev.categories.filter((c) => c !== catId)
          : [...prev.categories, catId],
      }
    })
  }

  const validate = () => {
    const errs = {}
    if (!form.company.trim()) errs.company = 'Company name is required'
    if (!form.contact.trim()) errs.contact = 'Contact person is required'
    if (!form.phone.trim() && !form.email.trim()) {
      errs.phone = 'At least one contact method is required'
    }
    if (form.categories.length === 0) errs.categories = 'Select at least one category'
    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!validate()) return
    // Simulate submission
    setShowToast(true)
    setTimeout(() => {
      setSubmitted(true)
      setShowToast(false)
    }, 1500)
  }

  // Success page
  if (submitted) {
    return (
      <div className="apply-supplier">
        <div className="apply-supplier__success">
          <div className="apply-supplier__success-icon">
            <svg viewBox="0 0 24 24" width="48" height="48" fill="#00E5FF">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
            </svg>
          </div>
          <h2>Application Submitted!</h2>
          <p>Thank you for your interest. Our team will review your application and get back to you within 2-3 business days.</p>
          <button
            className="apply-supplier__success-btn"
            onClick={() => {
              setSubmitted(false)
              setForm({
                company: '',
                contact: '',
                phone: '',
                email: '',
                categories: [],
                description: '',
              })
            }}
          >
            Submit Another Application
          </button>
        </div>
      </div>
    )
  }

  // Form
  return (
    <div className="apply-supplier">
      {/* Toast */}
      <div className={`apply-supplier__toast ${showToast ? 'show' : ''}`}>
        <svg viewBox="0 0 24 24" width="18" height="18" fill="#00E5FF">
          <path d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20zm-1 14l-4-4 1.4-1.4L11 13.2l5.6-5.6L18 9l-7 7z" />
        </svg>
        <span>Submitting...</span>
      </div>

      {/* Header */}
      <div className="apply-supplier__header">
        <h1 className="apply-supplier__title">Become a Supplier</h1>
        <p className="apply-supplier__subtitle">
          Join MediaGear's global marketplace and reach thousands of professional buyers worldwide.
        </p>
      </div>

      {/* Form */}
      <form className="apply-supplier__form" onSubmit={handleSubmit}>
        <div className="apply-supplier__hero-banner glass-card">
          <div className="apply-supplier__hero-icon">
            <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="#00E5FF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 21h18M5 21V7l8-4v18M19 21V11l-6-4M9 9v.01M9 13v.01M9 17v.01" />
            </svg>
          </div>
          <div className="apply-supplier__hero-text">
            <span className="apply-supplier__hero-label">Verified Supplier Benefits</span>
            <span className="apply-supplier__hero-desc">Global exposure · Verified badge · Priority support</span>
          </div>
        </div>

        {/* Company Name */}
        <div className="apply-supplier__field">
          <label className="apply-supplier__label">Company Name *</label>
          <input
            className={`apply-supplier__input ${errors.company ? 'error' : ''}`}
            type="text"
            placeholder="Enter your company name"
            value={form.company}
            onChange={(e) => handleChange('company', e.target.value)}
          />
          {errors.company && <span className="apply-supplier__error">{errors.company}</span>}
        </div>

        {/* Contact Person */}
        <div className="apply-supplier__field">
          <label className="apply-supplier__label">Contact Person *</label>
          <input
            className={`apply-supplier__input ${errors.contact ? 'error' : ''}`}
            type="text"
            placeholder="Full name"
            value={form.contact}
            onChange={(e) => handleChange('contact', e.target.value)}
          />
          {errors.contact && <span className="apply-supplier__error">{errors.contact}</span>}
        </div>

        {/* Phone */}
        <div className="apply-supplier__field">
          <label className="apply-supplier__label">Phone</label>
          <input
            className={`apply-supplier__input ${errors.phone ? 'error' : ''}`}
            type="tel"
            placeholder="+1 234 567 8900"
            value={form.phone}
            onChange={(e) => handleChange('phone', e.target.value)}
          />
          {errors.phone && <span className="apply-supplier__error">{errors.phone}</span>}
        </div>

        {/* Email */}
        <div className="apply-supplier__field">
          <label className="apply-supplier__label">Email</label>
          <input
            className="apply-supplier__input"
            type="email"
            placeholder="contact@company.com"
            value={form.email}
            onChange={(e) => handleChange('email', e.target.value)}
          />
        </div>

        {/* Categories (multi-select) */}
        <div className="apply-supplier__field">
          <label className="apply-supplier__label">Main Categories *</label>
          <div className="apply-supplier__checkbox-row">
            {categoryOptions.map((opt) => (
              <button
                key={opt.id}
                type="button"
                className={`apply-supplier__checkbox ${form.categories.includes(opt.id) ? 'checked' : ''}`}
                onClick={() => toggleCategory(opt.id)}
              >
                {form.categories.includes(opt.id) && (
                  <svg viewBox="0 0 24 24" width="14" height="14" fill="#00E5FF">
                    <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
                  </svg>
                )}
                <span>{opt.name}</span>
              </button>
            ))}
          </div>
          {errors.categories && <span className="apply-supplier__error">{errors.categories}</span>}
        </div>

        {/* Description */}
        <div className="apply-supplier__field">
          <label className="apply-supplier__label">Company Description</label>
          <textarea
            className="apply-supplier__textarea"
            placeholder="Briefly describe your company, products, and experience..."
            rows={4}
            value={form.description}
            onChange={(e) => handleChange('description', e.target.value)}
          />
        </div>

        {/* Upload (UI placeholder) */}
        <div className="apply-supplier__field">
          <label className="apply-supplier__label">Upload Qualifications / Product Images</label>
          <div className="apply-supplier__upload-zone">
            <svg viewBox="0 0 24 24" width="24" height="24" fill="#6B7280" opacity="0.5">
              <path d="M19.35 10.04C18.67 6.59 15.64 4 12 4 9.11 4 6.6 5.64 5.35 8.04 2.34 8.36 0 10.91 0 14c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.65-4.96zM14 13v4h-4v-4H7l5-5 5 5h-3z" />
            </svg>
            <span>Tap to upload (Business license, certificates, product photos)</span>
            <span className="apply-supplier__upload-hint">JPG, PNG, PDF · Max 10MB per file</span>
          </div>
        </div>

        {/* Submit */}
        <button type="submit" className="apply-supplier__submit">
          Submit Application
        </button>
      </form>
    </div>
  )
}

export default ApplySupplier