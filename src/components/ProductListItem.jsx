import { Edit, Star, Trash } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { firestore } from '../firebase';
import { updateDoc, doc, deleteDoc } from 'firebase/firestore';
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';
import { supabase } from '../../supabaseClient';

function ProductListItem({ product, refresh }) {
    const [imageURLs, setImageURLs] = useState([]);
    const [isUpdating, setIsUpdating] = useState(false);

    useEffect(() => {
        let active = true;

        const fetchImages = async () => {
            setImageURLs([]);

            try {
                if (product?.images?.length > 0) {
                    if (active) setImageURLs(product.images);
                    return;
                }

                if (product?.name) {
                    const { data, error } = await supabase.storage
                        .from('products')
                        .list();

                    if (error) {
                        console.error('Error listing Supabase files:', error);
                        return;
                    }

                    if (data && active) {
                        const cleanProdName = product.name
                            .replace(/[^a-zA-Z0-9_.-]/g, '_')
                            .toLowerCase();

                        const urls = data
                            .filter((file) => file.name.toLowerCase().includes(cleanProdName))
                            .map((file) => {
                                const { data: publicUrlData } = supabase.storage
                                    .from('products')
                                    .getPublicUrl(file.name);
                                return publicUrlData.publicUrl;
                            });

                        setImageURLs(urls);
                    }
                }
            } catch (error) {
                console.error('Error fetching images:', error);
            }
        };

        fetchImages();
        return () => {
            active = false;
        };
    }, [product]);

    const handleUpdate = async () => {
        if (isUpdating) return;
        setIsUpdating(true);

        const docRef = doc(firestore, 'produits', product.id);
        try {
            await updateDoc(docRef, {
                isFeatured: !product.isFeatured,
            });
            toast.success('Le produit a été mis à jour avec succès !');
            refresh?.();
        } catch (error) {
            console.error('Error updating document:', error);
            toast.error('Erreur lors de la mise à jour');
        } finally {
            setIsUpdating(false);
        }
    };

const SUPABASE_BUCKET = 'products';

function getStoragePathFromPublicUrl(url, bucket = SUPABASE_BUCKET) {
    if (!url) return null;
    try {
        const parsed = new URL(url);
        const marker = `/storage/v1/object/public/${bucket}/`;
        const idx = parsed.pathname.indexOf(marker);
        if (idx === -1) return null;
        return decodeURIComponent(parsed.pathname.slice(idx + marker.length));
    } catch {
        return null;
    }
}

const deleteProduct = async (id) => {
    const pathsToDelete = new Set();

    // 1. Collect paths from saved image URLs
    const knownUrls = [
        ...(Array.isArray(product?.images) ? product.images : []),
        ...(Array.isArray(imageURLs) ? imageURLs : []),
    ];
    knownUrls.forEach((url) => {
        const path = getStoragePathFromPublicUrl(url);
        if (path) pathsToDelete.add(path);
    });

    // 2. Also list files in the product's folder in Supabase Storage
    if (product?.name) {
        const folder = product.name.replace(/[^a-zA-Z0-9_.-]/g, '_').toLowerCase();
        const { data: files, error: listError } = await supabase.storage
            .from(SUPABASE_BUCKET)
            .list(folder);

        if (listError) {
            console.error('Error listing product images for deletion:', listError);
        } else if (Array.isArray(files)) {
            files
                .filter((file) => file.name && !file.name.startsWith('.'))
                .forEach((file) => pathsToDelete.add(`${folder}/${file.name}`));
        }
    }

    try {
        // 3. Remove files from Supabase Storage if any exist
        if (pathsToDelete.size > 0) {
            const { error: removeError } = await supabase.storage
                .from(SUPABASE_BUCKET)
                .remove(Array.from(pathsToDelete));

            if (removeError) {
                throw removeError;
            }
        }

        // 4. Delete Firestore document
        const docRef = doc(firestore, 'produits', id);
        await deleteDoc(docRef);

        toast.success('Le produit et ses images ont été supprimés !');
        refresh?.();
    } catch (error) {
        console.error('Error deleting product:', error);
        toast.error('Erreur lors de la suppression');
    }
};

    return (
        <tr className="hover:bg-gray-700">
            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <div className="flex flex-row items-center justify-center gap-3">
                    <Link
                        to="/dashboard/modifier_produit"
                        state={{ id: product.id }}
                        className="text-blue-400 hover:text-blue-300"
                        aria-label={`Modifier ${product.name}`}
                    >
                        <Edit className="h-5 w-5" />
                    </Link>
                </div>
            </td>

            <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center">
                    <div
                        className={`flex-shrink-0 h-10 w-10 rounded-full overflow-hidden ${
                            imageURLs.length === 0 ? 'bg-gray-600' : ''
                        }`}
                    >
                        {imageURLs.length > 0 && (
                            <img
                                className="h-10 w-10 rounded-full object-cover"
                                src={imageURLs[0]}
                                alt={product.name}
                            />
                        )}
                    </div>
                    <div className="ml-4">
                        <div className="text-sm font-medium text-white">{product.name}</div>
                    </div>
                </div>
            </td>

            <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex flex-row gap-1 items-center justify-center text-sm text-gray-300">
                    <span>دج</span>
                    <span>{product.price}</span>
                </div>
            </td>

            <td className="px-6 py-4 whitespace-nowrap text-center">
                <div className="text-sm text-gray-300">{product.category}</div>
            </td>

            <td className="px-6 py-4 whitespace-nowrap text-center">
                <button
                    type="button"
                    onClick={handleUpdate}
                    disabled={isUpdating}
                    aria-label={product.isFeatured ? 'Retirer des produits phares' : 'Mettre en avant'}
                    className={`p-1 rounded-full transition-colors duration-200 ${
                        product.isFeatured
                            ? 'bg-yellow-400 text-gray-900 hover:bg-yellow-500'
                            : 'bg-gray-600 text-gray-300 hover:bg-gray-500'
                    }`}
                >
                    <Star className="h-5 w-5" />
                </button>
            </td>

            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <div className="flex flex-row items-center justify-center gap-3">
                    <button
                        type="button"
                        onClick={() => deleteProduct(product.id)}
                        className="text-red-400 hover:text-red-300"
                        aria-label={`Supprimer ${product.name}`}
                    >
                        <Trash className="h-5 w-5" />
                    </button>
                </div>
            </td>
        </tr>
    );
}

export default ProductListItem;