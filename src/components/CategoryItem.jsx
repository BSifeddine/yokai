import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "../../supabaseClient"; // Adjust path to your supabase client

const CategoryItem = ({ category }) => {
  const [imageUrl, setImageUrl] = useState(null); // State to store the image URL

  useEffect(() => {
    const fetchImage = async () => {
      try {
        if (!category?.image) return;

        // Construct the file path inside your Supabase storage bucket 
        // (Assuming a 'categories' folder inside your bucket, matching your old path logic)
        const filePath = `categories/${category.image}`;

        const { data } = supabase.storage
          .from('products') // Or your specific bucket name if different
          .getPublicUrl(filePath);

        if (data?.publicUrl) {
          setImageUrl(data.publicUrl);
        }
      } catch (error) {
        console.error("Error fetching image URL from Supabase:", error);
      }
    };

    fetchImage();
  }, [category?.image]);

  return (
    <div className="relative overflow-hidden h-40 sm:h-96 sm:w-full rounded-lg group shadow-xl">
      <Link to={"/categories/" + category.name}>
        {imageUrl && category ? (
          <div className="w-full h-full cursor-pointer relative">
            {/* Gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-gray-900 opacity-50 z-10" />

            {/* Background image */}
            <img
              src={imageUrl}
              alt={category.name}
              className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-110"
              loading="lazy"
            />

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
          <div className="w-full h-full bg-slate-300 animate-pulse" />
        )}
      </Link>
    </div>
  );
};

export default CategoryItem;