import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { firestore } from "../firebase"
import {collection, getDocs } from '@firebase/firestore'
import CategoryListItem from "./CategoryListItem";

const CategoryList = () => {
	
	const [categories, setCategories] = useState([])

	const fetchData = async () => {
	  try {
		const querySnapshot = await getDocs(collection(firestore, "categories"));
		const items = querySnapshot.docs.map(doc => ({
		  id: doc.id,    // Get document ID
		  ...doc.data()  // Spread document data
		}));
		setCategories(items);
	  } catch (error) {
		console.error("Error fetching data: ", error);
	  }
	};

	useEffect(() => {
		fetchData();
	  }, []);

	  useEffect(() => {
		document.title = "Admin | Categories"
		window.scrollTo(0, 0);
	  }, []); 

	return (
		<div
			className='bg-gray-800 shadow-lg rounded-lg overflow-scroll md:overflow-hidden max-w-4xl mx-auto'
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.8 }}
		>
			<table className=' min-w-full divide-y divide-gray-700'>
				<thead className='bg-gray-700'>
					<tr>
						<th
							scope='col'
							className='px-6 py-3 text-center text-xs font-medium text-gray-300 uppercase tracking-wider'
						>
							Category
						</th>

						<th
							scope='col'
							className='px-6 py-3 text-center text-xs font-medium text-gray-300 uppercase tracking-wider'
						>
							Description
						</th>

						<th
							scope='col'
							className='px-6 py-3 text-center text-xs font-medium text-gray-300 uppercase tracking-wider'
						>
							Produits
						</th>

						<th
							scope='col'
							className='px-6 py-3 text-center text-xs font-medium text-gray-300 uppercase tracking-wider'
						>
							Actions
						</th>
					</tr>
				</thead>

				<tbody className='bg-gray-800 divide-y divide-gray-700'>
					{categories?.map((category) => {
						return (<CategoryListItem category={category} refresh={fetchData}/>)}
						)}
				</tbody>
			</table>
		</div>
	);
};
export default CategoryList;