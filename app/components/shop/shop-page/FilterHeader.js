/* eslint-disable react/prop-types */
import Image from "next/image";
import React, { useState, useEffect } from "react";

export default function FilterHeader({ onFilterChange, onSearchChange, searchTerm }) {
  const options = [
    { label: "Default", value: "default" },
    { label: "High to Low", value: "price-desc" },
    { label: "Low to High", value: "price-asc" },
    { label: "New Arrival", value: "recent" },
  ];

  const [localSearch, setLocalSearch] = useState(searchTerm);

  useEffect(() => {
    setLocalSearch(searchTerm);
  }, [searchTerm]);

  const handleFilterChange = (e) => {
    onFilterChange(e.target.value);
  };

  const handleSearchInputChange = (e) => {
    setLocalSearch(e.target.value);
    onSearchChange(e.target.value);
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
        <div className="w-full md:w-auto">
          <p className="text-sm text-gray-600">
            Showing 1-12 of <span className="font-semibold text-gray-900">15</span> results
          </p>
        </div>
        <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-4 w-full md:w-auto">
          {/* Search bar */}
          <div className="relative w-full sm:w-96">
            <input
              type="text"
              placeholder="Search Something..."
              value={localSearch}
              onChange={handleSearchInputChange}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4"
            >
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
          </div>

          <div className="flex items-center space-x-2 w-full sm:w-auto">
            <button className="flex items-center px-4 py-2 border border-gray-300 rounded-md bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
              <Image
                width={14}
                height={10}
                className="mr-2"
                src="/images/icon/filter-icon.svg"
                alt="filter-icon"
              />
              Filters
            </button>
            <div className="relative w-full sm:w-auto">
              <select
                className="block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                onChange={handleFilterChange}
                value={options.find(option => option.value === "default") ? "default" : "default"} // Ensuring controlled component
              >
                <option value="default">Sort by</option>
                {options.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
