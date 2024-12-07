'use client'
import React, { useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { account } from "@/utils/appwrite/config";
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputAdornment from '@mui/material/InputAdornment';
import IconButton from '@mui/material/IconButton';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { signOutUser } from "@/utils/appwrite/Services/authServices";
import useUserStore from "@/utils/store/userStore";
import { useRouter } from "next/navigation";

const ChangePassword = () => {
  const router = useRouter();
  const clearUserStore = useUserStore((state) => state.clearUser);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showPassword, setShowPassword] = useState({ old: false, new: false, confirm: false });
  const [passwords, setPasswords] = useState({ old: "", new: "", confirm: "" });

  const validateForm = () => {
    const { old, new: newPassword, confirm } = passwords;
    if (!old || !newPassword || !confirm) {
      setError("All fields are required");
      return false;
    }
    if (newPassword.length < 8) {
      setError("Password must be at least 8 characters");
      return false;
    }
    if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/.test(newPassword)) {
      setError("Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character");
      return false;
    }
    if (newPassword !== confirm) {
      setError("Passwords must match");
      return false;
    }
    setError(null);
    return true;
  };

  const handlePasswordChange = (type) => (e) => {
    setPasswords({ ...passwords, [type]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    try {
      await account.updatePassword(passwords.new, passwords.old);
      toast.success("Password changed successfully!");

      clearUserStore();
      await signOutUser();
      setTimeout(() => {
        router.push('/');
      }, 2000);
    } catch (err) {
      console.error("Change Password Error:", err);
      setError("Failed to change password. Please check your old password.");
      toast.error("Failed to change password. Please check your old password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {error && <div className="alert alert-danger">{error}</div>}
      
      {['old', 'new', 'confirm'].map((type) => (
        <div className="col-sm-6 col-lg-7" key={type}>
          <div className="mb20">
            <FormControl variant="outlined" className="w-72">
              <InputLabel htmlFor={`${type}-password`}>{type === 'old' ? "Old Password" : type === 'new' ? "New Password" : "Re-enter New Password"}</InputLabel>
              <OutlinedInput
                id={`${type}-password`}
                type={showPassword[type] ? "text" : "password"}
                value={passwords[type]}
                onChange={handlePasswordChange(type)}
                endAdornment={
                  <InputAdornment position="end">
                    <IconButton
                      aria-label={showPassword[type] ? 'hide password' : 'show password'}
                      onClick={() => setShowPassword({ ...showPassword, [type]: !showPassword[type] })}
                      edge="end"
                    >
                      {showPassword[type] ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                }
                label={type === 'old' ? "Old Password" : type === 'new' ? "New Password" : "Re-enter New Password"}
                classes={{ notchedOutline: "rounded-lg" }}
              />
            </FormControl>
          </div>
        </div>
      ))}

      <button type="submit" className="btn btn-thm ad_flor_btn" disabled={loading}>
        {loading ? "Saving..." : "Save"}
      </button>
      
      <ToastContainer closeButton={false} limit={1} />
    </form>
  );
};

export default ChangePassword;
