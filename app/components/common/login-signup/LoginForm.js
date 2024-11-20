/* eslint-disable react/prop-types */
// LoginForm.jsx
'use client';
import React from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { signIn } from "@/utils/appwrite/Services/authServices";
import db from "@/utils/appwrite/Services/dbServices"; // Ensure correct path
import useUserStore from "@/utils/store/userStore"; // Path to your Zustand store
import { useRouter } from 'next/navigation';


const LoginForm = ({ onClose }) => {
  const setUser = useUserStore((state) => state.setUser);
  const setSession = useUserStore((state) => state.setSession);
  const router = useRouter();

  const validationSchema = Yup.object({
    email: Yup.string().required("email or email address is required"),
    password: Yup.string()
      .required("Password is required")
      .min(8, "Password must be at least 8 characters"),
  });

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema,
    onSubmit: async (values, { setSubmitting, setErrors }) => {
      try {
        // Attempt to sign in
        const {  session,userId } = await signIn(values.email, values.password);
        

        // Fetch additional user data if needed
        const userData = await db.Users.get(userId); // Adjust based on your dbServices implementation
        console.log("Fetched user data:", userData);

        // Store user and session data in Zustand store
        await setUser(userData);
        await setSession({ id: session.$id, userId });

     
        if (onClose) onClose(); // Close the modal
        window.location.reload();
      } catch (error) {
        console.error("Error during sign-in", error);
        setErrors({ submit: error.message || "Login failed. Please check your credentials." });
      } finally {
        setSubmitting(false);
      }
    },
  });



  return (
    <form onSubmit={formik.handleSubmit}>
      {/* Email Field */}
      <div className="mb-2">
        <label className="form-label">Email Address *</label>
        <input
          type="email"
          name="email"
          className={`form-control ${
            formik.touched.email && formik.errors.email
              ? 'is-invalid'
              : ''
          }`}
          placeholder="Email"
          value={formik.values.email}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
        />
        {formik.touched.email && formik.errors.email && (
          <div className="invalid-feedback">
            {formik.errors.email}
          </div>
        )}
      </div>

      {/* Password Field */}
      <div className="form-group mb-2">
        <label className="form-label">Password *</label>
        <input
          type="password"
          name="password"
          className={`form-control ${
            formik.touched.password && formik.errors.password
              ? 'is-invalid'
              : ''
          }`}
          placeholder="Password"
          value={formik.values.password}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
        />
        {formik.touched.password && formik.errors.password && (
          <div className="invalid-feedback">
            {formik.errors.password}
          </div>
        )}
      </div>

      {/* Display submission errors */}
      {formik.errors.submit && (
        <div className="alert alert-danger">
          {formik.errors.submit}
        </div>
      )}

      {/* Submit Button */}
      <button
        type="submit"
        className="btn btn-log btn-thm mt-3 w-full"
        disabled={formik.isSubmitting}
      >
        {formik.isSubmitting ? 'Signing In...' : 'Sign in'}
      </button>

      {/* Divider */}
      <div className="flex items-center my-4">
        <hr className="flex-grow border-gray-300" />
        <span className="mx-2 text-gray-500">or</span>
        <hr className="flex-grow border-gray-300" />
      </div>

      {/* Google Sign-In Button */}
      <div className="mt-4">
        <button
          type="button"
          className="btn btn-google w-full flex items-center justify-center"
         
        >
          {/* Google SVG Icon */}
          <svg
            className="w-5 h-5 mr-2"
            viewBox="0 0 48 48"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fill="#FFC107"
              d="M43.6 20.2H42V20H24v8h11.3C34.7 32.6 30 36 24 36c-7.7 0-14-6.3-14-14s6.3-14 14-14c3.5 0 6.7 1.3 9.2 3.6l6.4-6.4C34.9 2.6 29.1 0 24 0 11.8 0 2 9.8 2 22s9.8 22 22 22c11 0 19.7-8 21.6-18h-21.6v-8z"
            />
          </svg>
          Sign in with Google
        </button>
      </div>
    </form>
  );
};

export default LoginForm;
