import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "../../supabaseClient"; // Adjust path if needed

const SUPABASE_BUCKET = "categories"; // Change to "products" if category images live in that bucket

const CategoryItem = ({ category }) => {
  const [imageUrl, setImageUrl] = useState(null);

  useEffect(() => {
    let active = true;
    setImageUrl(null);

    if (!category?.image) return;

    if (
      category.image.startsWith("http://") ||
      category.image.startsWith("https://")
    ) {
      if (active) setImageUrl(category.image);
      return;
    }

    // If category.image is e.g. "shirts.jpg" or "categories/shirts.jpg", normalize the path
    const filePath = category.image.replace(/^categories\//, "");

    const { data } = supabase.storage
      .from(SUPABASE_BUCKET)
      .getPublicUrl(filePath);

    if (active && data?.publicUrl) {
      setImageUrl(data.publicUrl);
    }

    return () => {
      active = false;
    };
  }, [category?.image]);

  if (!category) return null;

  return (
    <div className="relative overflow-hidden h-40 sm:h-96 sm:w-full rounded-lg group shadow-xl">
      <Link to={`/categories/${encodeURIComponent(category.name)}`}>
        {imageUrl ? (
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
          <div className="w-full h-full bg-slate-300" />
        )}
      </Link>
    </div>
  );
};

export default CategoryItem;