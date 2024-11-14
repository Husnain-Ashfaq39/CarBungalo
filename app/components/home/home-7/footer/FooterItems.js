// src/components/FooterItems.js
"use client"
import React, { useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import db from "@/utils/appwrite/Services/dbServices";
import { Query } from "appwrite";

const FooterItems = () => {
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
        Query.equal("email", values.email),
      ]);
  
      if (existingEmails.total > 0) {
        // Email already exists
        setSubmissionStatus({ success: false, message: "You have already subscribed." });
        return;
      }
      // Create a subscriber document
      await db.subscribers.create({ email: values.email });
      setSubmissionStatus({ success: true, message: "Subscription successful!" });
      console.log("Done");
      
      resetForm();
    } catch (error) {
      console.error("Error subscribing:", error);
      setSubmissionStatus({ success: false, message: "Subscription failed. Please try again." });
    }
  };

  return (
    <div className="row">
      <div className="col-sm-6 col-md-4 col-lg-3 col-xl-3">
                <div className="footer_about_widget home2">
                    <h5 className="title">OFFICE</h5>
                    <p>
                        Germany —<br />
                        329 Queensberry Street,
                        <br />
                        North Melbourne VIC 3051
                    </p>
                </div>
            </div>
            {/* End .col */}

            <div className="col-sm-6 col-md-4 col-lg-3 col-xl-3">
                <div className="footer_contact_widget home2">
                    <h5 className="title">NEED HELP</h5>
                    <div className="footer_phone">+1 670 936 46 70</div>
                    <p>hello@CarBungalo.com</p>
                </div>
            </div>
            {/* End .col */}

            <div className="col-sm-6 col-md-4 col-lg-3 col-xl-3">
                <div className="footer_contact_widget home2">
                    <h5 className="title">OPENING HOURS</h5>
                    <p>
                        Monday – Friday: 09:00AM – 09:00PM
                        <br />
                        Saturday: 09:00AM – 07:00PM
                        <br />
                        Sunday: Closed
                    </p>
                </div>
            </div>
            {/* End .col */}


      <div className="col-sm-6 col-md-6 col-lg-3 col-xl-3">
        <div className="footer_contact_widget home2">
          <h5 className="title">KEEP IN TOUCH</h5>
          <Formik
            initialValues={{ email: "" }}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            {({ isSubmitting }) => (
              <Form className="footer_mailchimp_form">
                <div className="wrapper">
                  <div className="col-auto d-flex">
                    <Field
                      type="email"
                      name="email"
                      className="form-control"
                      placeholder="Enter your email..."
                    />
                    <button type="submit" disabled={isSubmitting}>
                      GO
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
                submissionStatus.success
                  ? "text-success mt-2"
                  : "text-danger mt-2"
              }
            >
              {submissionStatus.message}
            </p>
          )}
          <p>Get latest updates and offers.</p>
        </div>
      </div>
      {/* End .col */}
    </div>
  );
};

export default FooterItems;
