import React, { useState } from "react";
import { toast } from "react-toastify";
import RegisterForm from "../components/RegisterForm";
import EmailVerifyNotice from "../components/EmailVerifyNotice";
import axios from "axios";
const BASE_URL = import.meta.env.VITE_API_BASE_URL;

export default function Register() {
  const [registeredEmail,setRegisteredEmail] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    adminCode: "",
  });
  
  const REGISTER_URL = `${BASE_URL}/auth/signup`;
  const [boxChange, setBoxChange] = useState(false);

  const handleOnChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]:value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(REGISTER_URL,formData,{withCredentials:true});
      if (res.status === 201) {
        toast.success("Signup successful!");
        setRegisteredEmail(formData.email);
        setFormData({
          name: "",
          email: "",
          password: "",
          confirmPassword: "",
          adminCode: "",
        });
        setBoxChange(true);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Signup failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black px-4">
      <div className="w-full max-w-md bg-zinc-900 rounded-2xl shadow-lg p-8">
        <h2 className="text-3xl font-semibold text-white text-center mb-6">
          Create an Account
        </h2>
        {boxChange ? (
          <EmailVerifyNotice email={registeredEmail} />
        ) : (
          <RegisterForm
            formData={formData}
            handleOnChange={handleOnChange}
            handleSubmit={handleSubmit}
          />
        )}
      </div>
    </div>
  );
}