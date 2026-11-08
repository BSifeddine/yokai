import { motion } from "framer-motion";
import { Trash, Star } from "lucide-react";
import { useEffect, useState } from "react";
import { firestore } from "../firebase"
import {collection, getDocs } from '@firebase/firestore'
import ProductListItem from "./ProductListItem";

const ProductsList = () => {

    const [products, setProducts] = useState([])
	

	const fetchData = async () => {
	  try {
		const querySnapshot = await getDocs(collection(firestore, "produits"));
		const items = querySnapshot.docs.map(doc => ({
		  id: doc.id,    // Get document ID
		  ...doc.data()  // Spread document data
		}));
		setProducts(items);
	} catch (error) {
		console.error("Error fetching data: ", error);
	}
};
	useEffect(() => {
	
		fetchData();
	  }, []);


	useEffect(() => {
		document.title = "Admin | Produits"
		window.scrollTo(0, 0);
	  }, []); 

	return (
		<div
			className='bg-gray-800 shadow-lg rounded-lg overflow-scroll md:overflow-hidden max-w-4xl mx-auto'
		>
			<table className=' min-w-full divide-y divide-gray-700'>
				<thead className='bg-gray-700'>
					<tr>
						<th
							scope='col'
							className='px-6 py-3 text-xs font-medium text-gray-300 uppercase tracking-wider text-center'
						>
							Modifier
						</th>
						<th
							scope='col'
							className='px-6 py-3 text-xs font-medium text-gray-300 uppercase tracking-wider text-center'
						>
							Product
						</th>
						<th
							scope='col'
							className='px-6 py-3 text-xs font-medium text-gray-300 uppercase tracking-wider text-center'
						>
							Price
						</th>
						<th
							scope='col'
							className='px-6 py-3 text-xs font-medium text-gray-300 uppercase tracking-wider text-center'
						>
							Category
						</th>

						<th
							scope='col'
							className='px-6 py-3 text-xs font-medium text-gray-300 uppercase tracking-wider text-center'
						>
							Featured
						</th>
						<th
							scope='col'
							className='px-6 py-3 text-xs font-medium text-gray-300 uppercase tracking-wider text-center'
						>
							Supprimer
						</th>
					</tr>
				</thead>

				<tbody className='bg-gray-800 divide-y divide-gray-700'>
					{products?.map((product, index) => (
						<ProductListItem product={product} key={index} refresh={fetchData}/>
					))}
				</tbody>
			</table>
		</div>
	);
};
export default ProductsList;