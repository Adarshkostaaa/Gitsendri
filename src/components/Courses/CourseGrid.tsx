import React from 'react';
import { Course } from '../../types';
import { Clock, User, BarChart3 } from 'lucide-react';

interface CourseGridProps {
  courses: Course[];
  onPurchase: (course: Course) => void;
}

export const CourseGrid: React.FC<CourseGridProps> = ({ courses, onPurchase }) => {
  const getLevelColor = (level: string) => {
    switch (level) {
      case 'Beginner': return 'text-green-400';
      case 'Intermediate': return 'text-yellow-400';
      case 'Advanced': return 'text-orange-400';
      case 'Expert': return 'text-red-400';
      default: return 'text-cyan-400';
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {courses.map((course) => (
        <div
          key={course.id}
          className="bg-black/50 border border-cyan-500/30 rounded-lg p-6 hover:border-cyan-500 transition-all duration-300 hover:shadow-lg hover:shadow-cyan-500/20 group"
        >
          <img
            src={course.image}
            alt={course.name}
            className="w-full h-48 object-cover rounded-lg mb-4 group-hover:scale-105 transition-transform duration-300"
          />
          
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-purple-400 font-semibold">{course.category}</span>
              <span className={`text-sm font-semibold ${getLevelColor(course.level)}`}>
                {course.level}
              </span>
            </div>
            
            <h3 className="text-xl font-bold text-cyan-400 group-hover:text-cyan-300 transition-colors">
              {course.name}
            </h3>
            
            <p className="text-gray-300 text-sm line-clamp-3">{course.description}</p>
            
            <div className="flex items-center justify-between text-sm text-gray-400">
              <div className="flex items-center">
                <Clock className="w-4 h-4 mr-1" />
                {course.duration}
              </div>
              <div className="flex items-center">
                <User className="w-4 h-4 mr-1" />
                {course.instructor}
              </div>
            </div>
            
            <div className="flex justify-between items-center pt-4">
              <span className="text-2xl font-bold text-pink-400">₹{course.price.toLocaleString()}</span>
              <button
                onClick={() => onPurchase(course)}
                className="bg-gradient-to-r from-pink-500 to-purple-500 text-white px-6 py-2 rounded-lg font-bold hover:shadow-lg hover:shadow-pink-500/50 transition-all duration-300 transform hover:scale-105"
              >
                Enroll Now
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
