import { useEffect, useState } from "react";
import { firestore } from "../firebase"
import { collection,  getDocs } from 'firebase/firestore';
import NotFound from "../components/NotFound";
import ProductCard from "../components/ProductCard";
import ProduitCard from "../components/ProduitCard";

function Products() {

    const [products, setProducts] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
		const fetchData = async () => {
		  try {
			const querySnapshot = await getDocs(collection(firestore, "produits"));
			const items = querySnapshot.docs.map(doc => ({
			  id: doc.id,    // Get document ID
			  ...doc.data()  // Spread document data
			}));
			setProducts(items);
            setLoading(false)
		  } catch (error) {
			console.error("Error fetching data: ", error);
		  }
		};
	
		fetchData();
	  }, []);

      useEffect(() => {
		document.title = "Art Tshirt | Produits"
		window.scrollTo(0, 0);
	  }, []); 

  if (loading) {
    return (
      <div className="w-full h-96 flex flex-col justify-center items-center gap-4 py-32">
        <div className="w-10 h-10 border-4 border-red-500 border-t-transparent rounded-full animate-spin"></div>
        <h1 className="text-gray-700 font-bold text-xl sm:text-2xl">
          جاري التحميل
        </h1>
      </div>
    );
  }

    return (
    <>
		<div className='min-h-screen mt-12'>
			<div className='relative z-10 max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-8'>
				<h1
					className='text-center text-4xl sm:text-5xl font-bold text-gray-800 mb-8'
					initial={{ opacity: 0, y: -20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.8 }}
				>
					جميع منتاجتنا
				</h1>
				{products?.length > 0 ? <>
				<div
					className='sm:hidden grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 justify-items-center'
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.8, delay: 0.2 }}
				>

					{products?.map((product) => (
						<ProduitCard key={product.id} product={product} />
					))}
				</div>
				</>
				:
				<>
				<div className="mt-20">
					<NotFound type="products" />
				</div>
				</>
				}
				{products?.length > 0 ? <>
				<div
					className='hidden sm:grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 justify-items-center'
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.8, delay: 0.2 }}
				>

					{products?.map((product) => (
						<ProductCard key={product.id} product={product} />
					))}
				</div>
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
    </>
  )
}

export default Products