'use client'
import Footer from "@/app/components/common/Footer";
import DefaultHeader from "../../components/common/DefaultHeader";
import HeaderSidebar from "../../components/common/HeaderSidebar";
import MobileMenu from "../../components/common/MobileMenu";
import LoginSignupModal from "@/app/components/common/login-signup";
import { FormControl, InputLabel, OutlinedInput, InputAdornment, IconButton } from '@mui/material';
import { toast, ToastContainer } from "react-toastify";
import { useState } from "react";
import { resetPassword } from "@/utils/appwrite/Services/authServices"; // Import the resetPassword function
import Visibility from '@mui/icons-material/Visibility'; // Import Visibility icon
import VisibilityOff from '@mui/icons-material/VisibilityOff'; // Import VisibilityOff icon
import { useRouter } from "next/navigation"; // Import useRouter for navigation
import "react-toastify/dist/ReactToastify.css";

// Updated PasswordFields component to match ChangePassword.js
const PasswordFields = ({ formData, handleInputChange, showPassword, setShowPassword }) => (
  <div className="mb-4 w-[50%]">
    {['newPassword', 'confirmPassword'].map((field, index) => (
      <FormControl variant="outlined" className="w-full mb-4" key={index}>
        <InputLabel htmlFor={field}>{field === 'newPassword' ? "New Password" : "Confirm Password"}</InputLabel>
        <OutlinedInput
          id={field}
          type={showPassword[field] ? "text" : "password"}
          name={field}
          value={formData[field]}
          onChange={handleInputChange}
          required
          endAdornment={
            <InputAdornment position="end">
              <IconButton
                aria-label={showPassword[field] ? 'hide password' : 'show password'}
                onClick={() => setShowPassword((prev) => ({ ...prev, [field]: !prev[field] }))}
                edge="end"
              >
                {showPassword[field] ? <VisibilityOff /> : <Visibility />}
              </IconButton>
            </InputAdornment>
          }
          label={field === 'newPassword' ? "New Password" : "Confirm Password"}
          classes={{ notchedOutline: "rounded-lg" }}
        />
      </FormControl>
    ))}
  </div>
);

const ResetPassword = () => {
  const router = useRouter(); // Initialize useRouter
  const [formData, setFormData] = useState({
    newPassword: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState({
    newPassword: false,
    confirmPassword: false
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { newPassword, confirmPassword } = formData;

    if (newPassword !== confirmPassword) {
      toast.error("New password and confirm password do not match.");
      return;
    }

    const urlParams = new URLSearchParams(window.location.search);
    const userId = urlParams.get('userId');
    const secret = urlParams.get('secret');

    if (!userId || !secret) {
      toast.error("Invalid URL parameters.");
      return;
    }

    try {
      await resetPassword(userId, secret, newPassword, confirmPassword);
      toast.success("Password reset successfully!");
      setTimeout(() => {
        router.push('/');
      }, 2000);
    } catch (error) {
      console.error("Error resetting password:", error);
      toast.error("Failed to reset password. Please try again.");
    }
  };

  return (
    <div className="wrapper">
      <div
        className="offcanvas offcanvas-end"
        tabIndex="-1"
        id="offcanvasRight"
        aria-labelledby="offcanvasRightLabel"
      >
        <HeaderSidebar />
      </div>
      {/* Sidebar Panel End */}

      {/* Main Header Nav */}
      <DefaultHeader />
      {/* End Main Header Nav */}

      {/* Main Header Nav For Mobile */}
      <MobileMenu />
      {/* End Main Header Nav For Mobile */}

      <section className="reset-password-section bgc-f9 p-20 ">
        <div className="container">
          <form className="reset_password_form" onSubmit={handleSubmit}>
            <div className="row">
              <div className="col-sm-12">
                <PasswordFields formData={formData} handleInputChange={handleInputChange} showPassword={showPassword} setShowPassword={setShowPassword} />
              </div>
              <div className="col-lg-12">
                <div className="new_propertyform_btn">
                  <button type="submit" className="btn btn-thm ad_flor_btn">
                    Reset Password
                  </button>
                </div>
              </div>
              {/* End .col */}
            </div>
          </form>
          <ToastContainer closeButton={false} limit={1} />
        </div>
      </section>

      {/* Our Footer */}
      <Footer />
      {/* End Our Footer */}

      {/* Modal */}
      <div
        className="sign_up_modal modal fade"
        id="logInModal"
        data-backdrop="static"
        data-keyboard="false"
        tabIndex={-1}
        aria-hidden="true"
      >
        <LoginSignupModal />
      </div>
      {/* End Modal */}
    </div>
  ); // Fixed the syntax error by adding a semicolon here
};
export default ResetPassword;