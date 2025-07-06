import React from 'react';
import { Search, Filter } from 'lucide-react';
import { categories } from '../../data/courses';

interface CourseFiltersProps {
  searchTerm: string;
  selectedCategory: string;
  onSearchChange: (term: string) => void;
  onCategoryChange: (category: string) => void;
}

export const CourseFilters: React.FC<CourseFiltersProps> = ({
  searchTerm,
  selectedCategory,
  onSearchChange,
  onCategoryChange
}) => {
  return (
    <div className="mb-12 space-y-6">
      {/* Search Bar */}
      <div className="relative max-w-2xl mx-auto">
        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
        <input
          type="text"
          placeholder="Search courses..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full bg-gray-800 border border-cyan-500/30 rounded-lg pl-12 pr-4 py-4 text-cyan-300 focus:border-cyan-500 focus:outline-none text-lg"
        />
      </div>

      {/* Category Filters */}
      <div className="flex flex-wrap justify-center gap-3">
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => onCategoryChange(category)}
            className={`px-6 py-2 rounded-lg font-semibold transition-all duration-300 ${
              selectedCategory === category
                ? 'bg-cyan-500 text-black shadow-lg shadow-cyan-500/50'
                : 'bg-gray-800 text-cyan-300 hover:bg-cyan-500/20 hover:text-cyan-400 border border-cyan-500/30'
            }`}
          >
            {category}
          </button>
        ))}
      </div>
    </div>
  );
};
