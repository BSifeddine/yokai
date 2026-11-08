import { useEffect, useState } from "react";
import NotFound from "./NotFound";
import ProduitCard from "./ProduitCard";
import ProductCard from "./ProductCard";
import { firestore } from "../firebase";
import { collection, query, where, getDocs } from "firebase/firestore";

const FeaturedProducts = () => {
	const [currentIndex, setCurrentIndex] = useState(0);
	const [itemsPerPage, setItemsPerPage] = useState(4);
	const [isLoading, setIsLoading] = useState(true)

		const [products, setProducts] = useState([])
	
		useEffect(() => {
		  const fetchDocuments = async () => {
			try {
			  // Reference the collection
			  const productsCollection = collection(firestore, 'produits'); // Replace with your collection name
	  
			  // Create a query: in this case, find documents where the 'name' field equals 'John Doe'
			  const q = query(productsCollection, where('isFeatured', '==', true));
	  
			  // Execute the query
			  const querySnapshot = await getDocs(q);
	  
			  // Process the documents and store them in the state
			  const docsArray = querySnapshot.docs.map((doc) => ({
				id: doc.id,
				...doc.data(),
			  }));
	  
			  setProducts(docsArray);
			  setIsLoading(false)
			} catch (error) {
			  console.error('Error fetching documents:', error);
			}
		  };
	  
		  fetchDocuments();
		}, []);

	useEffect(() => {
		const handleResize = () => {
			if (window.innerWidth < 640) setItemsPerPage(1);
			else if (window.innerWidth < 1024) setItemsPerPage(2);
			else if (window.innerWidth < 1280) setItemsPerPage(3);
			else setItemsPerPage(4);
		};

		handleResize();
		window.addEventListener("resize", handleResize);
		return () => window.removeEventListener("resize", handleResize);
	}, []);

	const nextSlide = () => {
		setCurrentIndex((prevIndex) => prevIndex + itemsPerPage);
	};

	const prevSlide = () => {
		setCurrentIndex((prevIndex) => prevIndex - itemsPerPage);
	};

	const isStartDisabled = currentIndex === 0;
	const isEndDisabled = currentIndex >= products.length - itemsPerPage;

		  if (isLoading) {
		return <div className="w-full h-96 flex flex-row justify-center items-center gap-1 py-56 mb-20">
		<h1 className="text-gray-500 font-bold text-3xl">... </h1>
		<h1 className="text-gray-500 font-bold text-3xl">جاري التحميل</h1>
		</div>;  }
		
	return (
	<div className='py-4'>
		<div className='container mx-auto px-1'>
				<h2 className='text-center text-4xl md:text-6xl font-bold text-red-500 mb-4 pt-8'>منتجاتنا المميزة</h2>
				<p className='text-center text-xl md:text-2xl font-semibold text-gray-700 mb-10'>
					أكثر المنتجات طلبا
				</p>
		{products.length > 0 ? <div className='relative'>
				<div
					className='sm:hidden grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 justify-items-center'
				>

					{products?.slice(0,4).map((product) => (
						<ProduitCard key={product.id} product={product} />
					))}
				</div>
				</div>
			:
			<div className="mb-8">
				<NotFound type="featured"/>
			</div>
		}
		{products.length > 0 ? <div className='relative'>
				<div
					className='hidden sm:grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 justify-items-center'
				>

					{products?.slice(0,4).map((product) => (
						<ProductCard key={product.id} product={product} />
					))}
				</div>
				</div>
			:
			<div className="mb-8">
				<NotFound type="featured"/>
			</div>
		}
		</div>
	</div>
	);
};
export default FeaturedProducts;