import React, { useState, useEffect } from 'react';
import api from '../api/axios';

const CommentForm = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    homepage: '',
    text: '',
    captcha_text: '',
    captcha_key: ''
  });

  const [captcha, setCaptcha] = useState(null);
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchCaptcha = async () => {
    try {
      const { data } = await api.get('captcha/');
      setCaptcha(data);
      console.log(setCaptcha(data))
      setFormData(prev => ({
        ...prev,
        captcha_key: data.captcha_key,
        image_url: data.image_url,
      }));
    } catch (error) {
      console.error('CAPTCHA error:', error);
      setMessage('Failed to load CAPTCHA. Please refresh the page.');
    }
  };

  const validateForm = () => {
    if (!formData.username.trim()) return 'Username is required';
    if (!formData.email.trim()) return 'Email is required';
    if (!formData.text.trim()) return 'Comment text is required';
    if (!formData.captcha_text.trim()) return 'CAPTCHA is required';
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage('');

    const error = validateForm();
    if (error) {
      setMessage(error);
      setIsSubmitting(false);
      return;
    }

    try {
      await api.post('/comments/', formData);
      setMessage('✅ Comment submitted successfully!');
      setFormData({
        username: '',
        email: '',
        homepage: '',
        text: '',
        captcha_text: '',
        captcha_key: ''
      });
      fetchCaptcha();
    } catch (error) {
      console.error('Submit error:', error);
      setMessage(error.response?.data?.message || '❌ Submission failed.');
      fetchCaptcha();
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    fetchCaptcha();
  }, []);

  return (
    <form onSubmit={handleSubmit} className="container mt-4 col-md-6">
      <h4 className="mb-4">Leave a Comment</h4>

      {message && <div className="alert alert-info">{message}</div>}

      <div className="mb-3">
        <label className="form-label">Username*</label>
        <input
          type="text"
          className="form-control"
          value={formData.username}
          onChange={(e) => setFormData({...formData, username: e.target.value})}
          disabled={isSubmitting}
        />
      </div>

      <div className="mb-3">
        <label className="form-label">Email*</label>
        <input
          type="email"
          className="form-control"
          value={formData.email}
          onChange={(e) => setFormData({...formData, email: e.target.value})}
          disabled={isSubmitting}
        />
      </div>

      <div className="mb-3">
        <label className="form-label">Homepage</label>
        <input
          type="url"
          className="form-control"
          value={formData.homepage}
          onChange={(e) => setFormData({...formData, homepage: e.target.value})}
          disabled={isSubmitting}
        />
      </div>

      <div className="mb-3">
        <label className="form-label">Comment*</label>
        <textarea
          className="form-control"
          rows="3"
          value={formData.text}
          onChange={(e) => setFormData({...formData, text: e.target.value})}
          disabled={isSubmitting}
        />
      </div>

      {captcha ? (
        <div className="mb-3">
          <label className="form-label d-block">CAPTCHA*</label>
          <div className="mb-2">
            <img
              src={`http://localhost:8005${captcha.image_url}?${Date.now()}`}
              alt="CAPTCHA"
              className="border"
            />
          </div>
          <div className="input-group">
            <input
              type="text"
              className="form-control"
              placeholder="Enter CAPTCHA text"
              value={formData.captcha_text}
              onChange={(e) => setFormData({...formData, captcha_text: e.target.value})}
              disabled={isSubmitting}
            />
            <button
              type="button"
              className="btn btn-outline-secondary"
              onClick={fetchCaptcha}
              disabled={isSubmitting}
            >
              ⟳
            </button>
          </div>
        </div>
      ) : (
        <p>Loading CAPTCHA...</p>
      )}

      <button
        type="submit"
        className="btn btn-primary w-100"
        disabled={isSubmitting || !captcha}
      >
        {isSubmitting ? 'Submitting...' : 'Submit Comment'}
      </button>
    </form>
  );
};

export default CommentForm;