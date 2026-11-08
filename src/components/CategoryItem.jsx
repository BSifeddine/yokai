import { Link } from "react-router-dom";
import { getStorage, getDownloadURL, ref } from "firebase/storage";
import { useEffect, useState } from "react";
import { storage } from '../firebase'; // Path to your Firebase config

const CategoryItem = ({ category }) => {

	const [imageUrl, setImageUrl] = useState(null);  // State to store the image URL
	const imageRefPath = `categories/${category.image}`;  // Path to the image in Firebase Storage
  
	useEffect(() => {
	  const fetchImage = async () => {
		try {
		  // Create a reference to the file in storage
		  const storageRef = ref(storage, imageRefPath);
		  
		  // Get the download URL
		  const url = await getDownloadURL(storageRef);
		  setImageUrl(url);  // Set the image URL to state
		} catch (error) {
		  console.error("Error fetching image URL:", error);
		}
	  };
  
	  fetchImage();
	}, []);
	return (
<div className="relative overflow-hidden h-40 sm:h-96 sm:w-full rounded-lg group shadow-xl">
  <Link to={"/categories/" + category.name}>
    {imageUrl && category ? (
      <div className="w-full h-full cursor-pointer relative">
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-gray-900 opacity-50 z-10" />

        {/* Background image */}
        {imageUrl && (
          <img
            src={imageUrl}
            alt={category.name}
            className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-110"
            loading="lazy"
          />
        )}

        {/* Text content */}
        <div
          className="
            absolute inset-0 z-20 flex flex-col
            items-center justify-end text-center 
            sm:items-start sm:justify-end sm:text-left
            p-4
          "
        >
          <h3 className="text-white text-2xl font-bold mb-2">
            {category.name}
          </h3>
          <p className="text-gray-200 text-sm">{category.description}</p>
        </div>
      </div>
    ) : (
      <div className="w-full h-full bg-slate-300" />
    )}
  </Link>
</div>
	);
};

export default CategoryItem;