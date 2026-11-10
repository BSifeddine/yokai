import { Link } from "react-router-dom";
import { supabase } from "../../supabaseClient";

const CategoryItem = ({ category }) => {
  // Compute the public URL directly without needing async/await or useEffect
  const getCategoryImageUrl = () => {
    if (!category?.image) return null;
    
    const filePath = `categories/${category.image}`;
    const { data } = supabase.storage
      .from("products")
      .getPublicUrl(filePath);

    return data?.publicUrl || null;
  };

  const imageUrl = getCategoryImageUrl();

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
          <div className="w-full h-full bg-slate-300 animate-pulse"/>
        )}
      </Link>
    </div>
  );
};

export default CategoryItem;