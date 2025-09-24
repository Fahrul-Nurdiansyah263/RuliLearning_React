
import React from "react";

export default function SkeletonDetailMateri() {
    
  return (
    <div className="max-w-4xl mx-auto p-8">
      <div className="animate-pulse">
        <div className="h-10 w-28 bg-gray-300 rounded-lg mb-6"></div>
        <div className="h-8 bg-gray-300 rounded w-3/4 mb-4"></div>
        <div className="h-6 w-32 bg-gray-300 rounded-full mb-6"></div>
        <div className="h-96 bg-gray-300 rounded-xl shadow mb-6"></div>
        <div className="space-y-3 mb-10">
          <div className="h-4 bg-gray-300 rounded w-full"></div>
          <div className="h-4 bg-gray-300 rounded w-full"></div>
          <div className="h-4 bg-gray-300 rounded w-5/6"></div>
          <div className="h-4 bg-gray-300 rounded w-full mt-6"></div>
          <div className="h-4 bg-gray-300 rounded w-3/4"></div>
        </div>
        <div className="h-96 bg-gray-300 rounded-xl shadow mb-4"></div>
        <div className="space-y-3">
            <div className="h-4 bg-gray-300 rounded w-full"></div>
            <div className="h-4 bg-gray-300 rounded w-1/2"></div>
        </div>

      </div>
    </div>
  );
}