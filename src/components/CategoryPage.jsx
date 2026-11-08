import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { collection, query, where, getDocs } from 'firebase/firestore';
import { firestore } from '../firebase'; // Import Firestore instance
import ProductCard from "../components/ProductCard";
import NotFound from "./NotFound";

const CategoryPage = () => {

	const { category } = useParams();

    const [products, setProducts] = useState([])
	const [loading, setLoading] = useState(true);
	
	useEffect(() => {
		window.scrollTo(0, 0);
	  }, []); 

  useEffect(() => {
    const fetchDocuments = async () => {
      try {
        // Reference the collection
        const productsCollection = collection(firestore, 'produits'); // Replace with your collection name

        // Create a query: in this case, find documents where the 'name' field equals 'John Doe'
        const q = query(productsCollection, where('category', '==', category));

        // Execute the query
        const querySnapshot = await getDocs(q);

        // Process the documents and store them in the state
        const docsArray = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setProducts(docsArray);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching documents:', error);
      }
    };

    fetchDocuments();
  }, []);

  if (loading) {
	return <div className="w-full h-96 flex flex-row justify-center items-center gap-1 py-56 mb-20">
	<h1 className="text-gray-500 font-bold text-3xl">... </h1>
	<h1 className="text-gray-500 font-bold text-3xl">جاري التحميل</h1>
	</div>;  }


	return (
		<div className='min-h-screen'>
			<div className='relative z-10 max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 pb-8 mt-14'>
				<motion.h1
					className='text-center text-4xl sm:text-5xl font-bold text-gray-800 mb-8'
					initial={{ opacity: 0, y: -20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.8 }}
				>
					{category.charAt(0).toUpperCase() + category.slice(1)}
				</motion.h1>
				{products?.length > 0 ? <>
				<motion.div
					className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 justify-items-center'
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.8, delay: 0.2 }}
				>

					{products?.map((product) => (
						<ProductCard key={product.id} product={product} />
					))}
				</motion.div>
				</>
				:
				<>
				<div className="mt-20">
					<NotFound type="products" />
				</div>
				</>
				}
			</div>
		</div>
	);
};
export default CategoryPage;