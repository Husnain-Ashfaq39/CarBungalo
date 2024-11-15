"use client";
import React from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { registerUser } from "@/utils/appwrite/Services/authServices";
import db from "@/utils/appwrite/Services/dbServices"; // Ensure the correct path

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

  // Function to add user data to the Users collection
  const addUserToCollection = async (userId, name, email) => {
    try {
      const userData = {
        userId: userId,
        role: "customer",
        name: name,
        email: email,
        // telephone: "", // Telephone field is omitted as per your requirement
      };

      // Use the dynamic 'create' method for the Users collection
      const response = await db.Users.create(userData,userId);

      console.log("User added to Users collection:", response);
    } catch (error) {
      console.error("Error adding user to Users collection:", error);
      throw new Error("Failed to save user data.");
    }
  };

  // Initialize Formik
  const formik = useFormik({
    initialValues: {
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
    validationSchema: validationSchema,
    onSubmit: async (values, { setSubmitting, setErrors }) => {
      try {
        console.log("Form Data", values);
        // Register the user and get the user object
        const user = await registerUser(values.username, values.email, values.password);

        // Assuming registerUser returns an object with the user's ID
        const userId = user.$id; // Adjust based on your registerUser implementation

        // Add user data to the Users collection
        await addUserToCollection(userId, values.username, values.email);

        // Optionally, you can redirect the user or show a success message here
        // For example:
        // router.push('/welcome');
        alert("Registration successful!");
      } catch (error) {
        console.error("Registration error:", error);
        setErrors({ submit: error.message || "Registration failed" });
      } finally {
        setSubmitting(false);
      }
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
              className={`form-control ${
                formik.touched.username && formik.errors.username
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
              className={`form-control ${
                formik.touched.email && formik.errors.email
                  ? "is-invalid"
                  : ""
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
              className={`form-control ${
                formik.touched.password && formik.errors.password
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
              className={`form-control ${
                formik.touched.confirmPassword && formik.errors.confirmPassword
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

      {/* Display submission errors */}
      {formik.errors.submit && (
        <div className="error-message">{formik.errors.submit}</div>
      )}

      <button
        type="submit"
        className="btn btn-signup btn-thm mb0"
        disabled={formik.isSubmitting}
      >
        {formik.isSubmitting ? "Signing Up..." : "Sign Up"}
      </button>
    </form>
  );
};

export default SignupForm;
