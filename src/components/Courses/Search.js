import React, { useState } from "react";
import "./Search.scss";
import { useSelector } from "react-redux";
import { useBetween } from "use-between";

const SearchBox = () => {
  const state = useSelector((state) => state.data);
  const { allCourses, setCourses } = useBetween(state.useShareState);

  const [showSearch, setShowSearch] = useState(false);
  const [query, setQuery] = useState("");

  const handleSearch = (value) => {
    setQuery(value);
    if (value.trim() === "") {
      setCourses(allCourses);
    } else {
      const filtered = allCourses.filter((item) =>
        item.name.toLowerCase().includes(value.toLowerCase())
      );
      setCourses(filtered);
    }
  };

  const toggleSearch = () => {
    setShowSearch(prev => {
      if (prev) {
        setQuery("");
        setCourses(allCourses);
      }

      return !prev;
    });
  };

  return (
    <div className="search-container">
      <button className="search-icon" onClick={toggleSearch}>
        <i className="fas fa-search"></i>
      </button>
      <div className={`search-box ${showSearch ? "show" : ""}`}>
        <input
          type="text"
          placeholder="Search by name..."
          value={query}
          onChange={(e) => handleSearch(e.target.value)}
        />
      </div>


    </div>
  );
};

export default SearchBox;
