// src/components/CallToAction.js
"use client"
import React, { useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import db from "@/utils/appwrite/Services/dbServices";
import { Query } from "appwrite";

const CallToAction = () => {
  const [submissionStatus, setSubmissionStatus] = useState(null);

  // Define the validation schema using Yup
  const validationSchema = Yup.object({
    email: Yup.string()
      .email("Invalid email address")
      .required("Email is required"),
  });

  // Handle form submission
  const handleSubmit = async (values, { resetForm }) => {
    try {
      // Check if email already exists in the subscribers collection
      const existingEmails = await db.subscribers.list([
        Query.equal("email", [values.email]), // Correct format for Query.equal
      ]);

      if (existingEmails.total > 0) {
        // Email already exists
        setSubmissionStatus({ success: false, message: "This email is already subscribed." });
        return;
      }

      // Create a new subscriber document
      await db.subscribers.create({ email: values.email });
      setSubmissionStatus({ success: true, message: "Subscription successful!" });
      resetForm();
    } catch (error) {
      console.error("Error subscribing:", error);
      setSubmissionStatus({ success: false, message: "Subscription failed. Please try again." });
    }
  };

  return (
    <div className="feature_icons home7_style">
      <div className="row">
        <div className="col-lg-6 col-xl-7">
          <div className="mailchimp_widget home7_style mb30-md">
            <div className="details">
              <h3 className="title">Subscribe to our newsletter</h3>
              <p className="para">
                Your download should start automatically; if not, Click here.
                Should I give up, huh?.
              </p>
            </div>
          </div>
        </div>
        {/* End .col-lg-6 */}

        <div className="col-lg-6 col-xl-5">
          <div className="footer_social_widget">
            <Formik
              initialValues={{ email: "" }}
              validationSchema={validationSchema}
              onSubmit={handleSubmit}
            >
              {({ isSubmitting }) => (
                <Form className="footer_mailchimp_form home2 home7_style">
                  <div className="row align-items-center">
                    <div className="col-auto d-flex">
                      <Field
                        type="email"
                        name="email"
                        className="form-control"
                        placeholder="Your Email..."
                      />
                      <button className="btn-thm" type="submit" disabled={isSubmitting}>
                        Subscribe
                      </button>
                    </div>
                  </div>
                  <ErrorMessage name="email" component="div" className="error-message" />
                </Form>
              )}
            </Formik>
            {submissionStatus && (
              <p
                className={
                  submissionStatus.success ? "text-success mt-2" : "text-danger mt-2"
                }
              >
                {submissionStatus.message}
              </p>
            )}
          </div>
        </div>
        {/* End .col-lg-6 */}
      </div>
      {/* End .row */}
    </div>
  );
};

export default CallToAction;
