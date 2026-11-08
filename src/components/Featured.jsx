import { Link } from "react-router-dom"
import React, { useEffect, useState } from 'react'
import { storage } from '../firebase';
import { getDownloadURL, ref, listAll } from 'firebase/storage';
import { ShoppingCart } from "lucide-react";

function Featured({product}) {

    const [imageURLs, setImageURLs] = useState();

	useEffect(() => {
		const fetchImages = async () => {
			try {
			  // Create a reference to the folder containing the images (e.g., 'images/')
			  const storageRef = ref(storage, `${product.name}/`);
			  
			  // List all items (files) in the 'images/' folder
			  const res = await listAll(storageRef);
			  
			  // Fetch download URLs for all items
			  const urls = await Promise.all(
				res.items.map((itemRef) => getDownloadURL(itemRef))
			  );
			  
			  // Store the URLs in state
			  setImageURLs(urls);
			} catch (error) {
			  console.error("Error fetching images:", error);
			}
		  };
	  
		  fetchImages();
	}, []);


  return (
    <>
    {imageURLs &&
    <Link to={`/produit/${product.id}`} key={product.id} className='w-full sm:w-1/2 lg:w-1/3 xl:w-1/4 flex-shrink-0 px-2 cursor-pointer'>
    <div className='bg-white bg-opacity-10  rounded-lg overflow-hidden h-full border'>
        <div className='overflow-hidden'>
            {imageURLs.length > 0 && 
            <img
            src={imageURLs[0]}
                alt={product.name}
                className='w-full h-48 object-cover transition-transform duration-300 ease-in-out hover:scale-110'
            />
            }
        </div>
        <div className='p-4 bg-white'>
            <h3 className='text-lg font-semibold mb-2 text-gray-800'>{product.name}</h3>
            <div className="flex flex-row gap-1 items-center mb-4 justify-end">
            <p className='text-orange-500 font-medium text-xl'>
                دج
            </p>
            <p className='text-orange-500 font-medium text-xl'>
                {product.price}
            </p>
            </div>
        </div>
    </div>
    </Link>
    }
    </>
  )
}

export default Featured