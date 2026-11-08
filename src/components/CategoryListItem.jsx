import { Trash } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { firestore } from '../firebase';
import { collection, deleteDoc, doc, getDocs, query, where } from 'firebase/firestore';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { supabase } from '../../supabaseClient';

function CategoryListItem({ category, refresh }) {
    const [produits, setProduits] = useState(0);

    // Since category.image already holds the Supabase public URL, we can use it directly!
    const imageUrl = category.image || '';

    const deleteCategory = async (id) => {
        try {
            // Reference to the document
            const docRef = doc(firestore, "categories", id);
            
            // Delete the document from Firestore
            await deleteDoc(docRef);
            toast.success("La catégorie a été supprimée !");
            refresh();
        } catch (error) {
            console.error("Error deleting document: ", error);
            toast.error("Erreur lors de la suppression");
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const produitsCollection = collection(firestore, 'produits');
                const q = query(produitsCollection, where('category', '==', category.name));
                const querySnapshot = await getDocs(q);
                setProduits(querySnapshot.size);
            } catch (error) {
                console.error("Error fetching data: ", error);
            }
        };
        
        fetchData();
    }, [category.name]);

    return (
        <tr className='hover:bg-gray-700'>
            <td className='px-6 py-4 whitespace-nowrap'>
                <div className='flex items-center'>
                    <div className={`flex-shrink-0 h-10 w-10 rounded-full ${imageUrl && "bg-gray-400"}`}>
                        {imageUrl && (
                            <img
                                className='h-10 w-10 rounded-full object-cover'
                                src={imageUrl}
                                alt={category.name}
                            />
                        )}
                    </div>
                    <div className='ml-4'>
                        <div className='text-sm font-medium text-white text-center'>{category.name}</div>
                    </div>
                </div>
            </td>
            <td className='px-6 py-4 whitespace-nowrap'>
                <div className='text-sm text-gray-300 text-center'>{category.description}</div>
            </td>
            <td className='px-6 py-4 whitespace-nowrap text-center'>
                <div className='text-sm text-gray-300'>{produits}</div>
            </td>
            <td className='px-6 py-4 whitespace-nowrap text-sm font-medium text-center'>
                <button
                    onClick={() => deleteCategory(category.id)}
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
    );
}

export default CategoryListItem;