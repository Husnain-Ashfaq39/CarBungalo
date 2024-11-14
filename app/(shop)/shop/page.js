"use client"
import Footer from "@/app/components/home/home-7/Footer";
import DefaultHeader from "../../components/common/DefaultHeader";
import HeaderSidebar from "../../components/common/HeaderSidebar";
import MobileMenu from "../../components/common/MobileMenu";
import LoginSignupModal from "@/app/components/common/login-signup";
import FilterHeader from "@/app/components/shop/shop-page/FilterHeader";
import Pagination from "@/app/components/common/Pagination";
import Products from "@/app/components/shop/shop-page/Products";
import React from "react";
import Categories from "@/app/components/shop/shop-page/sidebar/Categories";
import RecentPost from "@/app/components/shop/shop-page/sidebar/RecentPost";
import  {  useState } from "react";

const Shop = () => {
  const [filter, setFilter] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const handleFilterChange = (newFilter) => {
    setFilter(newFilter);
  };
  const handleCategorySelect = (categoryIds) => {
    setCategoryFilter(categoryIds); 
  };

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

      <DefaultHeader />

      <MobileMenu />

      <section className="inner_page_breadcrumb style2 bgc-f9">
        <div className="container">
          <div className="row">
            <div className="col-xl-12">
              <div className="breadcrumb_content style2">
                <h2 className="breadcrumb_title">Shop</h2>
                <p className="subtitle">Shop</p>
                <ol className="breadcrumb">
                  <li className="breadcrumb-item">
                    <a href="#">Home</a>
                  </li>
                  <li className="breadcrumb-item active" aria-current="page">
                    Shop
                  </li>
                </ol>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* End Inner Page Breadcrumb */}

      {/* Listing Grid View */}
      <section className="our-listing pb30-991 bgc-f9 pt0">
        <div className="container">
          <div className="row">
            <FilterHeader onFilterChange={handleFilterChange} />
            {/* End .sp_search_content */}
          </div>
          {/* End .row */}

          <div className="row">
            <div className="col-xl-3 dn-lg">
              <div className="sidebar_listing_grid1 mb30">
                <div className="sidebar_listing_list">
                  <div className="shop_category_sidebar_widgets">
                    <h4 className="title">Categories</h4>
                    <div className="widget_list">
                    <Categories onCategorySelect={handleCategorySelect} />
                    </div>
                  </div>
                  {/* End Categories */}

                  <div className="sidebar_shop_recent_post">
                    <h4 className="title">Top Sellings</h4>
                    <RecentPost />
                  </div>
                  {/* End .sidebar_shop_recent_post */}
                </div>
              </div>
            </div>
            {/* End .col-xl-3 */}

            <div className="col-xl-9 pr0">
              <div className="row">
              <Products filter={filter} categoryFilter={categoryFilter} />
              </div>
              {/* End .row */}

              <div className="row">
                <div className="col-lg-12">
                  <div className="mbp_pagination mt20">
                    <Pagination />
                  </div>
                </div>
              </div>
              {/* End .row */}
            </div>
            {/* End .col-xl-9 */}
          </div>
          {/* End .row */}
        </div>
        {/* End .container */}
      </section>
  
      <Footer />
 
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

export default Shop;
