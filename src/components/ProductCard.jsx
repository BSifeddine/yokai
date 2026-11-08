import { Link } from "react-router-dom"
import React, { useEffect, useState } from 'react'
import { supabase } from '../../supabaseClient'; // <--- Import Supabase client

const ProductCard = ({ product, isFeatured }) => {
  const [imageURLs, setImageURLs] = useState([]);

  useEffect(() => {
    const fetchImages = async () => {
      try {
        // 1. Ideal Case: Use the array of public URLs already saved directly on the product document in Firestore
        if (product.images && product.images.length > 0) {
          setImageURLs(product.images);
          return;
        }

        // 2. Fallback Case: Search the 'products' bucket for files matching this product's name
        if (product.name) {
          const { data, error } = await supabase.storage
            .from('products')
            .list();

          if (error) {
            console.error("Error listing Supabase files:", error);
            return;
          }

          if (data) {
            // Sanitize product name to match the naming pattern used during upload
            const cleanProdName = product.name.replace(/[^a-zA-Z0-9_.-]/g, '_').toLowerCase();
            
            // Filter files that contain this product's name
            const matchingFiles = data.filter((file) =>
              file.name.toLowerCase().includes(cleanProdName)
            );

            // Get public URLs for the matching images
            const urls = matchingFiles.map((file) => {
              const { data: publicUrlData } = supabase.storage
                .from('products')
                .getPublicUrl(file.name);
              return publicUrlData.publicUrl;
            });

            setImageURLs(urls);
          }
        }
      } catch (error) {
        console.error("Error fetching images:", error);
      }
    };

    fetchImages();
  }, [product.name]);

  return (
    <Link
      to={`/produit/${product.id}`}
      className={`flex flex-col bg-white relative overflow-hidden rounded-lg 
        ${!isFeatured ? "shadow-md" : ""} transition hover:scale-[1.02] duration-200`}
      style={{ width: "290px", height: "320px" }} // fixed card size
    >
      {/* Promo / Note Badge */}
      {product.note && (
        <div
          className={`absolute z-40 
            ${product.note === "عرض خاص" ? "bg-red-500" : "bg-red-500"} 
            text-sm md:text-base w-2/5 h-8 md:h-10 rounded-br-2xl 
            font-bold text-white flex justify-center items-center`}
        >
          <p>{product.note}</p>
        </div>
      )}

      {/* Product Image (Square) */}
      <div className="relative flex w-full aspect-square overflow-hidden">
        {imageURLs.length > 0 && (
          <img
            className="object-cover w-full h-full"
            src={imageURLs[0]}
            alt={product.name}
          />
        )}
      </div>

      {/* Product Info */}
      <div className="flex-1 flex flex-col justify-between px-3 py-3">
        <h5 className="text-base font-semibold text-gray-800 truncate">
          {product.name}
        </h5>

        {/* Price */}
        <div className="mt-1 flex items-center justify-end gap-3">
          {product?.promotion > 0 && (
            <div className="flex gap-1 items-center">
              <p className="text-sm line-through text-gray-500">دج</p>
              <p className="text-sm line-through text-gray-500">
                {product?.prix_promo}
              </p>
            </div>
          )}
          <div className="flex items-center gap-1">
            <p className="text-lg font-bold text-red-500">دج</p>
            <p className="text-lg font-bold text-red-500">{product.price}</p>
          </div>
        </div>

        {/* Rating */}
        <p className="text-yellow-500 text-base flex justify-end">
          {"★".repeat(product?.rating)}
          <span className="text-gray-300">
            {"★".repeat(5 - product?.rating)}
          </span>
        </p>
      </div>
    </Link>
  );
};

export default ProductCard;
