/* eslint-disable react/prop-types */
// FilterHeader.js
import React from "react";
import Image from "next/image";

const FilterHeader = ({ onFilterChange }) => {
  const options = [
    { label: "Default", value: "" }, 
    { label: "High to Low", value: "price-asc" },
    { label: "Low to High", value: "price-desc" },
    { label: "New Arrival", value: "recent" },
  ];

  const handleChange = (e) => {
    onFilterChange(e.target.value);
  };

  return (
    <div className="sp_search_content">
      <div className="col-sm-12 col-md-4 col-lg-4 col-xl-5">
        <div className="left_area tac-xsd mb30-767 mt15">
          <p>
            Showing 1-12 of <span className="heading-color fw600">15</span> results
          </p>
        </div>
      </div>

      <div className="col-sm-12 col-md-8 col-lg-8 col-xl-7">
        <div className="right_area text-end tac-xsd">
          <ul>
            <li className="list-inline-item mb10-400">
              <div
                id="open2"
                className="filter_open_btn style2 dn db-lg"
                role="button"
              >
                <Image
                  width={14}
                  height={10}
                  className="mr10"
                  src="/images/icon/filter-icon.svg"
                  alt="filter-icon.svg"
                />
                Filters
              </div>
            </li>
            <li className="list-inline-item listone">Sort by:</li>
            <li className="list-inline-item listwo">
              <select className="form-select show-tick" onChange={handleChange}>
                {options.map((option, index) => (
                  <option key={index} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default FilterHeader;
