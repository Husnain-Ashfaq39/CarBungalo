'use client'
import React from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { registerUser } from "@/utils/appwrite/Services/authServices";

const SignupForm = () => {
  // Define the validation schema using Yup
  const validationSchema = Yup.object({
    username: Yup.string()
      .min(3, "Username must be at least 3 characters")
      .max(15, "Username must be 15 characters or less")
      .required("Username is required"),
    email: Yup.string()
      .email("Invalid email address")
      .required("Email is required"),
    password: Yup.string()
      .min(6, "Password must be at least 6 characters")
      .required("Password is required"),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref("password"), null], "Passwords must match")
      .required("Confirm Password is required"),
  });

  // Initialize Formik
  const formik = useFormik({
    initialValues: {
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
    validationSchema: validationSchema,
    onSubmit: (values) => {
      // Handle form submission
      console.log("Form Data", values);
      registerUser(values.username, values.email, values.password)
      // You can replace this with an API call or other logic
    },
  });

  return (
    <form onSubmit={formik.handleSubmit}>
      <div className="row">
        {/* Username Field */}
        <div className="col-lg-6">
          <div className="form-group">
            <label htmlFor="username" className="form-label">
              Username
            </label>
            <input
              id="username"
              name="username"
              type="text"
              className={`form-control ${formik.touched.username && formik.errors.username
                  ? "is-invalid"
                  : ""
                }`}
              placeholder="Username"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.username}
            />
            {formik.touched.username && formik.errors.username ? (
              <div className="invalid-feedback">{formik.errors.username}</div>
            ) : null}
          </div>
        </div>

        {/* Email Field */}
        <div className="col-lg-12">
          <div className="form-group">
            <label htmlFor="email" className="form-label">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              className={`form-control ${formik.touched.email && formik.errors.email ? "is-invalid" : ""
                }`}
              placeholder="Email"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.email}
            />
            {formik.touched.email && formik.errors.email ? (
              <div className="invalid-feedback">{formik.errors.email}</div>
            ) : null}
          </div>
        </div>

        {/* Password Field */}
        <div className="col-lg-6">
          <div className="form-group mb20">
            <label htmlFor="password" className="form-label">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              className={`form-control ${formik.touched.password && formik.errors.password
                  ? "is-invalid"
                  : ""
                }`}
              placeholder="Password"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.password}
            />
            {formik.touched.password && formik.errors.password ? (
              <div className="invalid-feedback">{formik.errors.password}</div>
            ) : null}
          </div>
        </div>

        {/* Confirm Password Field */}
        <div className="col-lg-6">
          <div className="form-group mb20">
            <label htmlFor="confirmPassword" className="form-label">
              Confirm Password
            </label>
            <input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              className={`form-control ${formik.touched.confirmPassword && formik.errors.confirmPassword
                  ? "is-invalid"
                  : ""
                }`}
              placeholder="Confirm Password"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.confirmPassword}
            />
            {formik.touched.confirmPassword && formik.errors.confirmPassword ? (
              <div className="invalid-feedback">
                {formik.errors.confirmPassword}
              </div>
            ) : null}
          </div>
        </div>
      </div>

      <button type="submit" className="btn btn-signup btn-thm mb0">
        Sign Up
      </button>
    </form>
  );
};

export default SignupForm;
