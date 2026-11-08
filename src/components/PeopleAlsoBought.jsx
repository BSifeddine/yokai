import { useEffect, useState } from "react";
import ProductCard from "./ProductCard";
import ProduitCard from "./ProduitCard";
import { firestore } from "../firebase"
import { collection,  getDocs, query, where } from 'firebase/firestore';
import NotFound from "../components/NotFound";
import FeaturedProducts from "./FeaturedProducts";

const PeopleAlsoBought = () => {

	return (
		<div className='mt-2'>
			<FeaturedProducts />
		</div>
	);
};
export default PeopleAlsoBought;