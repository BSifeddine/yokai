import { Edit, Star, Trash } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { firestore } from '../firebase';
import { updateDoc, doc, deleteDoc } from 'firebase/firestore';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Link } from 'react-router-dom';
import { supabase } from '../../supabaseClient'; // <--- Import Supabase client

function ProductListItem({ product, key, refresh }) {
    const [imageURLs, setImageURLs] = useState([]);

    useEffect(() => {
        const fetchImages = async () => {
            try {
                // 1. Direct match: Use the array of public URLs saved in Firestore on creation
                if (product.images && product.images.length > 0) {
                    setImageURLs(product.images);
                    return;
                }

                // 2. Fallback: Search the 'products' bucket for files matching this product's name
                if (product.name) {
                    const { data, error } = await supabase.storage
                        .from('products')
                        .list();

                    if (error) {
                        console.error("Error listing Supabase files:", error);
                        return;
                    }

                    if (data) {
                        const cleanProdName = product.name.replace(/[^a-zA-Z0-9_.-]/g, '_').toLowerCase();
                        const matchingFiles = data.filter((file) =>
                            file.name.toLowerCase().includes(cleanProdName)
                        );


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
    }, [product]);

    const handleUpdate = async () => {
        const docRef = doc(firestore, 'produits', product.id);

        try {
            await updateDoc(docRef, {
                isFeatured: !product.isFeatured
            });
            toast.success("Le produit a été mis à jour avec succès !");
            refresh();
        } catch (error) {
            console.error('Error updating document: ', error);
            toast.error("Erreur lors de la mise à jour");
        }
    };

    const deleteProduct = async (id) => {
        try {
            const docRef = doc(firestore, "produits", id);
            await deleteDoc(docRef);
            toast.success("Le produit a été supprimé !");
            refresh();
        } catch (error) {
            console.error("Error deleting document: ", error);
            toast.error("Erreur lors de la suppression");
        }
    };

  return (
    <tr key={key} className='hover:bg-gray-700'>
							<td className='px-6 py-4 whitespace-nowrap text-sm font-medium flex flex-row items-center justify-center gap-3'>
								<Link to = {`/dashboard/modifier_produit`} state={{id : product.id}}
									className='text-blue-400 hover:text-blue-300'
								>
									<Edit className='h-5 w-5' />
								</Link>
							</td>
							<td className='px-6 py-4 whitespace-nowrap'>
								<div className='flex items-center'>
									<div className={`flex-shrink-0 h-10 rounded-full w-10 ${imageURLs.length == 0 && "bg-gray-400"}`}>
										{imageURLs.length > 0 &&
											<img
												className='h-10 w-10 rounded-full object-cover'
												src={imageURLs[0]}
												alt={product.name}
											/>
										}
									</div>
									<div className='ml-4'>
										<div className='text-sm font-medium text-white text-center'>{product.name}</div>
									</div>
								</div>
							</td>
							<td className='px-6 py-4 whitespace-nowrap flex flex-row gap-1 items-center justify-center mt-3'>
								<div className="text-sm text-gray-300">دج</div>
								<div className='text-sm text-gray-300'>{product.price}</div>
							</td>
							<td className='px-6 py-4 whitespace-nowrap text-center'>
								<div className='text-sm text-gray-300 '>{product.category}</div>
							</td>
							<td className='px-6 py-4 whitespace-nowrap text-center'>
								<button onClick={handleUpdate} 
									
									className={`p-1 rounded-full ${
										product.isFeatured ? "bg-yellow-400 text-gray-900" : "bg-gray-600 text-gray-300"
									} hover:bg-yellow-500 transition-colors duration-200`}
								>
									<Star className='h-5 w-5' />
								</button>
							</td>
							<td className='px-6 py-4 whitespace-nowrap text-sm font-medium flex flex-row items-center justify-center gap-3'>
								<button
									onClick={() => deleteProduct(product.id)}
									className='text-red-400 hover:text-red-300'
								>
									<Trash className='h-5 w-5' />
								</button>
							</td>
							<ToastContainer
								position="bottom-right"
								autoClose={5000}
								hideProgressBar={false}
								newestOnTop={false}
								closeOnClick
								rtl={false}
								pauseOnFocusLoss
								draggable
								pauseOnHover
								theme="colored"
							/>
						</tr>
  )
}

export default ProductListItem