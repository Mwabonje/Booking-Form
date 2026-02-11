import React from 'react';
import { Star } from 'lucide-react';

export const Reviews: React.FC = () => {
  const reviews = [
    {
      id: 1,
      text: "The photos exceeded all our expectations. Mwabonje has a true gift for capturing emotion.",
      author: "Sarah J.",
      type: "Wedding Photography"
    },
    {
      id: 2,
      text: "Professional, punctual, and incredibly creative. The drone footage was the highlight of our video.",
      author: "Michael R.",
      type: "Event Coverage"
    },
    {
      id: 3,
      text: "I've never felt so comfortable in front of a camera. The results were absolutely stunning.",
      author: "Elena K.",
      type: "Portrait Session"
    }
  ];

  return (
    <section className="w-full max-w-4xl mx-auto px-6 py-8 mb-8 animate-fade-in">
      {/* Aggregate Rating */}
      <div className="flex flex-col items-center justify-center mb-10 text-center">
        <div className="flex items-center gap-1 mb-2">
          {[1, 2, 3, 4].map((i) => (
            <Star key={i} className="w-6 h-6 fill-yellow-400 text-yellow-400" />
          ))}
          {/* Partial Star for 0.8 */}
          <div className="relative">
            <Star className="w-6 h-6 text-gray-300 dark:text-gray-600" />
            <div className="absolute top-0 left-0 overflow-hidden w-[80%]">
              <Star className="w-6 h-6 fill-yellow-400 text-yellow-400" />
            </div>
          </div>
        </div>
        <p className="text-lg font-medium text-gray-900 dark:text-white">
          4.8/5 Average Rating
        </p>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          Based on 50+ verified bookings
        </p>
      </div>

      {/* Testimonial Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {reviews.map((review) => (
          <div 
            key={review.id} 
            className="bg-gray-50 dark:bg-neutral-900/50 p-6 rounded-xl border border-gray-100 dark:border-neutral-800 hover:shadow-md transition-all duration-300"
          >
            <div className="flex gap-0.5 mb-4">
              {[1, 2, 3, 4, 5].map((i) => (
                <Star key={i} size={14} className="fill-yellow-400 text-yellow-400" />
              ))}
            </div>
            <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed mb-6 italic">
              "{review.text}"
            </p>
            <div className="mt-auto">
              <span className="font-bold block text-gray-900 dark:text-white text-sm">{review.author}</span>
              <span className="text-xs text-gray-400 uppercase tracking-wider">{review.type}</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};