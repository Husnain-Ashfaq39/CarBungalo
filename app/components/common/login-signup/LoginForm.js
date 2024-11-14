'use client'
import React from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { signIn } from "@/utils/appwrite/Services/authServices";

const LoginForm = () => {
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
    onSubmit: async (values) => {
      try {
        // Attempt to sign in
        await signIn(values.username, values.password);

        // On success, show a success pop-up or notification
        alert(`${values.username} logged in successfully`);

        // Optionally, you could reset the form after successful login:
        formik.resetForm();

      } catch (error) {
        console.error("Error during sign-in", error);
        alert("Login failed. Please check your credentials.");
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
          className="form-control"
          placeholder="Username or Email"
          value={formik.values.username}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
        />
        {formik.touched.username && formik.errors.username && (
          <div className="text-danger">{formik.errors.username}</div>
        )}
      </div>

      <div className="form-group mb-2">
        <label className="form-label">Password *</label>
        <input
          type="password"
          name="password"
          className="form-control"
          placeholder="Password"
          value={formik.values.password}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
        />
        {formik.touched.password && formik.errors.password && (
          <div className="text-danger">{formik.errors.password}</div>
        )}
      </div>

      <button type="submit" className="btn btn-log btn-thm mt-3">
        Sign in
      </button>
    </form>
  );
};

export default LoginForm;
