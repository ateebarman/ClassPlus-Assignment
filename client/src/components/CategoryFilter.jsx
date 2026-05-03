import React from 'react';

const CategoryFilter = ({ categories, active, onChange }) => {
  return (
    <div className="flex items-center gap-3 overflow-x-auto pb-4 no-scrollbar -mx-4 px-4 sm:mx-0 sm:px-0">
      {categories.map((category) => (
        <button
          key={category}
          onClick={() => onChange(category)}
          className={`category-pill ${
            active === category ? 'category-pill-active' : 'category-pill-inactive'
          }`}
        >
          {category}
        </button>
      ))}
    </div>
  );
};

export default CategoryFilter;
