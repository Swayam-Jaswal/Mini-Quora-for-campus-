import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { loginUser } from '../../../app/authSlice';
import { toast } from 'react-toastify';
import LoginForm from '../components/LoginForm';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const dispatch = useDispatch();
  const { loading, error } = useSelector((state) => state.auth);

  const handleOnChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await dispatch(loginUser(formData));
    if (loginUser.fulfilled.match(result)) {
      toast.success('Login successful!');
      setFormData({ email: '', password: '' });
      navigate('/');
    } else {
      toast.error(result.payload || 'Login failed');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black px-4">
      <div className="w-full max-w-md bg-zinc-900 rounded-2xl shadow-lg p-8">
        <h2 className="text-3xl font-semibold text-white text-center mb-6">
          Log In
        </h2>
        <LoginForm
          formData={formData}
          handleOnChange={handleOnChange}
          handleSubmit={handleSubmit}
        />
        {loading && <p className="text-blue-400 text-center mt-4">Loading...</p>}
        {error && <p className="text-red-400 text-center mt-2">{error}</p>}
      </div>
    </div>
  );
}
