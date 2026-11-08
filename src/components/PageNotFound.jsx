import React, { useEffect } from 'react';
import { Link } from 'react-router-dom'; // For routing, if you're using React Router

const PageNotFound = () => {

  useEffect(() => {
    document.title = "Not Found"
  },[])
  return (
    <div className="flex flex-col items-center justify-center py-24 my-3 bg-gray-100">
      <h1 className="text-9xl font-bold text-gray-800 mb-4">404</h1>
      <p className="text-xl text-gray-600 mb-8">الصفحة التي تبحث عنها غير موجودة</p>
      <Link to="/" className="px-6 py-3 bg-red-500 text-white rounded-md hover:bg-red-600">
        العودة الى الصفحة الرئيسية
      </Link>
    </div>
  );
};

export default PageNotFound;