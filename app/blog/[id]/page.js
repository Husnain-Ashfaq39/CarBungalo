import React from "react";
import BlogDynamicSingle from "@/app/components/blog/blog-details";
import db from "@/utils/appwrite/Services/dbServices"; // Adjust the import path as needed
import storageServices from "@/utils/appwrite/Services/storageServices"; // Adjust the import path as needed

const BlogPage = async ({ params }) => {
  const { id } = params;

  try {
    // Fetch the specific blog post by ID
    const response = await db.blogs.get(id); // Replace 'blogs' with your actual collection name
    const doc = response;

    // Fetch the image URL using storageServices
    const imgSrc = await storageServices.images.getFileDownload(doc.imageUrl); // Adjust the method as per your service

    const blogData = {
      id: doc.$id,
      title: doc.title,
      tags: doc.tags,
      author: doc.author,
      imageUrl: doc.imageUrl,
      publicationDate: doc.publicationDate,
      views: doc.views,
      content: doc.content,
      imgSrc,
    };

    return <BlogDynamicSingle blog={blogData} />;
  } catch (error) {
    console.error("Error fetching blog post:", error);
    return <div>Failed to load blog post.</div>;
  }
};

export default BlogPage;
