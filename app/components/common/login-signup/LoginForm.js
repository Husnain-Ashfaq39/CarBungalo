'use client';
import React from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { signIn } from "@/utils/appwrite/Services/authServices";
import db from "@/utils/appwrite/Services/dbServices"; // Ensure correct path
import useUserStore from "@/utils/store/userStore"; // Path to your Zustand store

const LoginForm = () => {
  // Access the setUser function from Zustand store
  const setUser = useUserStore((state) => state.setUser);

  // Define validation schema using Yup
  const validationSchema = Yup.object({
    username: Yup.string().required("Username or email address is required"),
    password: Yup.string()
      .required("Password is required")
      .min(8, "Password must be at least 8 characters"),
  });

  // Initialize Formik
  const formik = useFormik({
    initialValues: {
      username: "",
      password: "",
    },
    validationSchema,
    onSubmit: async (values, { setSubmitting, setErrors }) => {
      try {
        // Attempt to sign in
        const user = await signIn(values.username, values.password);
        console.log("Authenticated user:", user);

        // Fetch user data from Users collection
        const userData = await db.Users.get(user.userId); // Adjust based on your dbServices implementation
        console.log("Fetched user data:", userData);

        // Store user data in Zustand store
        setUser(userData);

        // Optionally, show a success message or redirect
        alert(`${values.username} logged in successfully`);
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
      <div className="mb-2">
        <label className="form-label">Username or email address *</label>
        <input
          type="text"
          name="username"
          className={`form-control ${
            formik.touched.username && formik.errors.username ? "is-invalid" : ""
          }`}
          placeholder="Username or Email"
          value={formik.values.username}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
        />
        {formik.touched.username && formik.errors.username && (
          <div className="invalid-feedback">{formik.errors.username}</div>
        )}
      </div>

      <div className="form-group mb-2">
        <label className="form-label">Password *</label>
        <input
          type="password"
          name="password"
          className={`form-control ${
            formik.touched.password && formik.errors.password ? "is-invalid" : ""
          }`}
          placeholder="Password"
          value={formik.values.password}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
        />
        {formik.touched.password && formik.errors.password && (
          <div className="invalid-feedback">{formik.errors.password}</div>
        )}
      </div>

      {/* Display submission errors */}
      {formik.errors.submit && (
        <div className="alert alert-danger">{formik.errors.submit}</div>
      )}

      <button
        type="submit"
        className="btn btn-log btn-thm mt-3"
        disabled={formik.isSubmitting}
      >
        {formik.isSubmitting ? "Signing In..." : "Sign in"}
      </button>
    </form>
  );
};

export default LoginForm;
