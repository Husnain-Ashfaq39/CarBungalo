"use client";
import Footer from "@/app/components/common/Footer";
import DefaultHeader from "../../components/common/DefaultHeader";
import HeaderSidebar from "../../components/common/HeaderSidebar";
import HeaderTop from "../../components/common/HeaderTop";
import MobileMenu from "../../components/common/MobileMenu";
import LoginSignupModal from "@/app/components/common/login-signup";
import Pagination from "@/app/components/blog/Pagination";
import React,{useState,useEffect} from "react";
import BlogCard from "@/app/components/blog/blog-card";
import db from "@/utils/appwrite/Services/dbServices"; // Adjust the import path as needed
import storageServices from "@/utils/appwrite/Services/storageServices"; // Adjust the import path as needed


const Blog = () => {
  const [blogPosts, setBlogPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBlogPosts = async () => {
      try {
        // Fetch all documents from the Blogs collection
        const response = await db.blogs.list(); // Replace 'blogs' with your actual collection name
        const documents = response.documents;

        // For each document, fetch the corresponding image URL
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
        setLoading(false);
      } catch (err) {
        console.error("Error fetching blog posts:", err);
        setError("Failed to load blog posts.");
        setLoading(false);
      }
    };

    fetchBlogPosts();
  }, []);

  if (loading) {
    return <div>Loading blog posts...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }
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

      {/* header top */}
      <HeaderTop />
      {/* End header top */}

      {/* Main Header Nav */}
      <DefaultHeader />
      {/* End Main Header Nav */}

      {/* Main Header Nav For Mobile */}
      <MobileMenu />
      {/* End Main Header Nav For Mobile */}

      {/* Inner Page Breadcrumb */}
      <section className="inner_page_breadcrumb">
        <div className="container">
          <div className="row">
            <div className="col-xl-12">
              <div className="breadcrumb_content">
                <h2 className="breadcrumb_title">Blog</h2>
                <ol className="breadcrumb fn-sm">
                  <li className="breadcrumb-item">
                    <a href="#">Home</a>
                  </li>
                  <li className="breadcrumb-item active" aria-current="page">
                    <a href="#">Blog</a>
                  </li>
                </ol>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* Inner Page Breadcrumb */}

      {/* <!-- Main Blog Post Content --> */}
      <section className="blog_post_container inner_page_section_spacing">
        <div className="container">
          <div className="row">
            <BlogCard blogPosts={blogPosts} />
          </div>
          {/* End .row */}

          <div className="row">
            <div className="col-lg-12">
              <div className="mbp_pagination mt20">
                <Pagination />
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* <!-- Main Blog Post Content --> */}

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
    // End wrapper
  );
};

export default Blog;
