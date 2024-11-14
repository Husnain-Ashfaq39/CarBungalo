/* eslint-disable react/prop-types */
"use client"
import React, { useState, useEffect } from "react";
import Footer from "@/app/components/common/Footer";
import DefaultHeader from "@/app/components/common/DefaultHeader";
import HeaderSidebar from "@/app/components/common/HeaderSidebar";
import MobileMenu from "@/app/components/common/MobileMenu";
import LoginSignupModal from "@/app/components/common/login-signup";
import Image from "next/image";
import BlogCard from "./blog-card";
import db from "@/utils/appwrite/Services/dbServices"; // Adjust the import path as needed
import storageServices from "@/utils/appwrite/Services/storageServices"; // Adjust the import path as needed
import { format } from 'date-fns';

const BlogDynamicSingle = ({ blog }) => {
  const [blogPosts, setBlogPosts] = useState([]);

  useEffect(() => {
    const fetchBlogPosts = async () => {
      try {
        // Fetch all documents from the Blogs collection
        const response = await db.blogs.list(); // Replace 'blogs' with your actual collection name
        let documents = response.documents;
        
        // Sort documents by publicationDate descending and take the first three
        documents.sort((a, b) => new Date(b.publicationDate) - new Date(a.publicationDate));
        documents = documents.slice(0, 3);

        // Fetch image URLs for each document
        const postsWithImages = await Promise.all(
          documents.map(async (doc) => {
            const { title, tags, author, imageUrl, publicationDate, views, content } = doc;

            // Fetch the image URL using storageServices
            const imgSrc = await storageServices.images.getFileDownload(imageUrl); // Adjust the method as per your service

            return {
              id: doc.$id, // Assuming each document has a unique '$id'
              title,
              tags,
              author,
              imageUrl,
              publicationDate,
              views,
              content,
              imgSrc,
            };
          })
        );

        setBlogPosts(postsWithImages);
      } catch (err) {
        console.error("Error fetching blog posts:", err);
        // You can handle errors here if needed
      }
    };

    fetchBlogPosts();
  }, []);

  return (
    <div className="wrapper">
      {/* Sidebar Panel */}
      <div
        className="offcanvas offcanvas-end"
        tabIndex="-1"
        id="offcanvasRight"
        aria-labelledby="offcanvasRightLabel"
      >
        <HeaderSidebar />
      </div>

      {/* Main Header Nav */}
      <DefaultHeader />

      {/* Main Header Nav For Mobile */}
      <MobileMenu />

      {/* Blog Single Post */}
      <section className="blog_post_container bt1 pt50 pb0 mt70-992">
        <div className="container">
          <div className="row">
            <div className="col-xl-8 m-auto">
              <div className="for_blog blog_single_post">
                <div className="details">
                  <div className="wrapper">
                    <h2 className="title">{blog.title}</h2>
                    <div className="bp_meta">
                      <ul>
                        <li className="list-inline-item">
                          <a href="#">
                            <span className="flaticon-user" />
                            {blog.author}
                          </a>
                        </li>
                        <li className="list-inline-item items-center">
                          <a href="#">
                            <span className="flaticon-eye" />
                            {blog.views}
                          </a>
                        </li>
                        <li className="list-inline-item">
                          <a href="#">
                            <span className="flaticon-calendar-1" />
                            {format(new Date(blog.publicationDate), 'MM/dd/yyyy')}
                          </a>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {/* End .col */}
          </div>
          {/* End .row */}
        </div>
        {/* End .container */}

        <div className="container-fluid p0">
          <div className="row">
            <div className="col-lg-12">
              <div className="blog-single-post-thumb">
                <Image
                  width={1519}
                  height={475}
                  priority
                  style={{ objectFit: "cover" }}
                  className="img-whp"
                  src={blog.imgSrc}
                  alt={blog.title}
                />
              </div>
            </div>
          </div>
          {/* End .row */}
        </div>
        {/* End container-fluid */}
      </section>
      {/* Blog Single Post */}

      {/* Blog Single Post Description */}
      <section className="blog_post_container pt50 pb70">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-xl-8">
              <div className="main_blog_post_content">
                <div className="mbp_thumb_post">
                  <div
                    className="para mb25 mt20"
                    dangerouslySetInnerHTML={{ __html: blog.content }}
                  />
                </div>
              </div>
              {/* End main_blog_post_content */}
            </div>
            {/* End .col */}
          </div>
          {/* End .row */}
        </div>
        {/* End .container */}
      </section>
      {/* End Blog Single Post Description */}

      {/* Recent Articles */}
      <section className="our-blog pb90 bgc-f9">
        <div className="container">
          <div className="row">
            <div className="col-lg-6 offset-lg-3">
              <div className="main-title text-center">
                <h2>Recent Articles</h2>
              </div>
            </div>
          </div>
          {/* End .row */}

          <div className="row">
            <BlogCard blogPosts={blogPosts} />
          </div>
          {/* End .row */}
        </div>
        {/* End .container */}
      </section>
      {/* End Recent Articles */}

      {/* Footer */}
      <Footer />

      {/* Login/Signup Modal */}
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
    </div>
    // End wrapper
  );
};

export default BlogDynamicSingle;
