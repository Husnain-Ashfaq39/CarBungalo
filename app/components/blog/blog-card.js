/* eslint-disable react/prop-types */
import React from "react";
import Image from "next/image";
import Link from "next/link";
import { format } from 'date-fns'; // Import the format function

const BlogCard = ({ blogPosts }) => {
  return (
    <div className="row">
      {blogPosts.map((post) => (
        <div
          key={post.id}
          className="col-md-6 col-xl-4"
          data-aos="fade-up"
          data-aos-delay="100"
        >
          <div className="for_blog">
            <div className="thumb">
              <div className="tag">{post.tags[0]}</div>
              <Image
                width={394}
                height={254}
                style={{ objectFit: "cover" }}
                className="img-whp"
                src={post.imgSrc}
                alt={post.title}
              />
            </div>
            <div className="details">
              <div className="wrapper">
                <div className="bp_meta">
                  <ul>
                    <li className="list-inline-item">
                      <a href="#">
                        <span className="flaticon-user" />
                        {post.author}
                      </a>
                    </li>
                    <li className="list-inline-item items-center">
                      <a href="#">
                        <span className="flaticon-eye" />
                        {post.views}
                      </a>
                    </li>
                    <li className="list-inline-item">
                      <a href="#">
                        <span className="flaticon-calendar-1" />
                        {format(new Date(post.publicationDate), 'MM/dd/yyyy')} {/* Consistent Formatting */}
                      </a>
                    </li>
                  </ul>
                </div>
                <h4 className="title">
                  <Link href={`/blog/${post.id}`}>{post.title}</Link>
                </h4>
                <Link href={`/blog/${post.id}`} className="more_listing">
                  Read More{" "}
                  <span className="icon">
                    <span className="fas fa-plus" />
                  </span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default BlogCard;
