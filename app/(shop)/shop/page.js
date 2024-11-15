// Shop.jsx

"use client";
import React, { useState, useCallback, useEffect } from "react";
import Footer from "@/app/components/home/home-7/Footer";
import DefaultHeader from "../../components/common/DefaultHeader";
import HeaderSidebar from "../../components/common/HeaderSidebar";
import MobileMenu from "../../components/common/MobileMenu";
import LoginSignupModal from "@/app/components/common/login-signup";
import FilterHeader from "@/app/components/shop/shop-page/FilterHeader";
import Pagination from "@/app/components/common/Pagination";
import Products from "@/app/components/shop/shop-page/Products";
import Categories from "@/app/components/shop/shop-page/sidebar/Categories";
import RecentPost from "@/app/components/shop/shop-page/sidebar/RecentPost";
import useDebounce from "@/utils/Hooks/useDebounce";
import db from "@/utils/appwrite/Services/dbServices";
import { Query } from "appwrite";

const Shop = () => {
  const [filter, setFilter] = useState("default");
  const [categoryFilter, setCategoryFilter] = useState([]); // Assuming multiple categories
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12; // Adjust as needed

  // State for suggestions
  const [suggestions, setSuggestions] = useState([]);
  const [isSuggestionsLoading, setIsSuggestionsLoading] = useState(false);
  const [suggestionsError, setSuggestionsError] = useState(null);

  // Debounce the search term
  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  // Fetch Suggestions based on debounced search term
  useEffect(() => {
    const fetchSuggestions = async () => {
      if (debouncedSearchTerm.trim() === "") {
        setSuggestions([]);
        return;
      }
      setIsSuggestionsLoading(true);
      setSuggestionsError(null);
      try {
        const query = [
          Query.search("name", `*${debouncedSearchTerm}*`),
          Query.limit(5), // Limit to top 5 suggestions
        ];
        const response = await db.Products.list(query);
        const docs = response.documents;
        const suggestionsData = docs.map((product) => product.name);
        setSuggestions(suggestionsData);
      } catch (err) {
        console.error("Error fetching suggestions:", err);
        setSuggestionsError("Failed to load suggestions");
      } finally {
        setIsSuggestionsLoading(false);
      }
    };

    fetchSuggestions();
  }, [debouncedSearchTerm]);

  const handleFilterChange = useCallback((newFilter) => {
    setFilter(newFilter);
    setCurrentPage(1); // Reset to first page on filter change
  }, []);

  const handleCategorySelect = useCallback((selectedCategories) => {
    setCategoryFilter(selectedCategories);
    setCurrentPage(1); // Reset to first page on category change
  }, []);

  const handleSearchChange = useCallback((newSearchTerm) => {
    setSearchTerm(newSearchTerm);
    setCurrentPage(1); // Reset to first page on search
  }, []);

  const handlePageChange = useCallback((pageNumber) => {
    setCurrentPage(pageNumber);
  }, []);

  return (
    <div className="wrapper">
      {/* Offcanvas Sidebar */}
      <div
        className="offcanvas offcanvas-end"
        tabIndex="-1"
        id="offcanvasRight"
        aria-labelledby="offcanvasRightLabel"
      >
        <HeaderSidebar />
      </div>

      {/* Header and Mobile Menu */}
      <DefaultHeader />
      <MobileMenu />

      {/* Main Shop Section */}
      <section className="our-listing pb30-991 bgc-f9 pt0">
        <div className="container">
          {/* Filter Header */}
          <div className="row">
            <FilterHeader
              onFilterChange={handleFilterChange}
              onSearchChange={handleSearchChange}
              searchTerm={searchTerm}
              suggestions={suggestions}
              isSuggestionsLoading={isSuggestionsLoading}
              suggestionsError={suggestionsError}
              filter={filter}
            />
          </div>

          <div className="row">
            {/* Sidebar */}
            <div className="col-xl-3 dn-lg">
              <div className="sidebar_listing_grid1 mb30">
                <div className="sidebar_listing_list">
                  {/* Categories */}
                  <div className="shop_category_sidebar_widgets">
                    <h4 className="title">Categories</h4>
                    <div className="widget_list">
                      <Categories
                        onCategorySelect={handleCategorySelect}
                        selectedCategories={categoryFilter}
                      />
                    </div>
                  </div>

                  {/* Recent Posts */}
                  <div className="sidebar_shop_recent_post">
                    <h4 className="title">Top Sellings</h4>
                    <RecentPost />
                  </div>
                </div>
              </div>
            </div>

            {/* Products and Pagination */}
            <div className="col-xl-9 pr0">
              <div className="row">
                <Products
                  filter={filter}
                  categoryFilter={categoryFilter}
                  searchTerm={debouncedSearchTerm}
                  currentPage={currentPage}
                  itemsPerPage={itemsPerPage}
                />
              </div>

              <div className="row">
                <div className="col-lg-12">
                  <div className="mbp_pagination mt20">
                    <Pagination
                      currentPage={currentPage}
                      itemsPerPage={itemsPerPage}
                      totalItems='12'
                      onPageChange={handlePageChange}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

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
  );
};

export default Shop;
