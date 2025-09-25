// src/components/Login/LoginForm.jsx
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import LoginHeader from './LoginHeader';
import LoginFooter from './LoginFooter';
import Input from '../ui/Input';
import Button from '../ui/Button';
import { login } from '../../actions/authActions';

function LoginForm() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector((state) => state.user);

  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch(login(formData.email, formData.password))
      .then((data) => {
        console.log('Login successful, received data:', data);
        // Store the user ID in local storage
        localStorage.setItem('userId', data.user._id);
        // Navigate to dashboard with user ID in URL
        navigate(`/${data.user._id}/dashboard`);
      })
      .catch((err) => {
        console.error('Login failed:', err);
      });
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <>
      <LoginHeader />
      {error && <p className="text-red-500">{error}</p>}
      <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
        <div className="space-y-5">
          <Input
            id="email"
            name="email"
            type="email"
            label="Email"
            icon="fa-envelope"
            placeholder="Enter your email"
            value={formData.email}
            onChange={handleChange}
            required
          />
          <Input
            id="password"
            name="password"
            type="password"
            label="Password"
            icon="fa-lock"
            placeholder="Enter your password"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>
        <Button type="submit" disabled={loading} className="w-full">
          {loading ? 'Signing in...' : 'Sign in'}
        </Button>
        <LoginFooter />
      </form>
    </>
  );
}

export default LoginForm;
