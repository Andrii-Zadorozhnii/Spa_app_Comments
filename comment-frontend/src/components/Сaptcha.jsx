import { useEffect, useState } from 'react';
import api from '../api/axios';

export default function Captcha({ onChange }) {
  const [captcha, setCaptcha] = useState(null);

  const fetchCaptcha = async () => {
    try {
      const res = await api.get('captcha/');
      setCaptcha(res.data);
      onChange({ key: res.data.captcha_key, text: '' });
    } catch (err) {
      console.error('CAPTCHA error:', err.response?.data || err.message || err);
    }
  };

  useEffect(() => {
    fetchCaptcha();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleInput = (e) => {
    onChange(prev => ({ ...prev, text: e.target.value }));
  };

  return (
    <div className="mb-3">
      {captcha && (
        <>
          <img
            src={`http://localhost:8005${captcha.image_url}?${Date.now()}`}
            alt="captcha"
            className="border mb-2 d-block"
          />

          <div className="input-group">
            <input
              type="text"
              className="form-control"
              placeholder="Enter CAPTCHA"
              onChange={handleInput}
            />
            <button
              type="button"
              className="btn btn-outline-secondary"
              onClick={fetchCaptcha}
            >
              ⟳
            </button>
          </div>
        </>
      )}
    </div>
  );
}