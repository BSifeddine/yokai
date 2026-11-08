import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { PlusCircle, Upload, Loader } from "lucide-react";
import { firestore } from "../firebase";
import { addDoc, collection, Timestamp, serverTimestamp } from "firebase/firestore";
import { ToastContainer, toast } from 'react-toastify';
import { supabase } from '../../supabaseClient';

const CreateCategoryForm = () => {
    const [imageUpload, setImageUpload] = useState(null);
    const [name, setName] = useState("");
    const [description, setDesciption] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        if (e) e.preventDefault();
        setLoading(true);

        try {
            console.log("1. Starting upload process...");
            let imageUrl = "";

            if (imageUpload) {
                // Ensure filename has no invalid characters or leading slashes
                const cleanFileName = `${Date.now()}_${imageUpload.name.replace(/[^a-zA-Z0-9_.-]/g, '_')}`;

                console.log("2. Uploading to Supabase bucket...");
                const { error: uploadError } = await supabase.storage
                    .from('categories')
                    .upload(cleanFileName, imageUpload);

                if (uploadError) {
                    console.error("❌ Supabase Upload Error:", uploadError);
                    throw uploadError;
                }

                console.log("3. Getting public URL...");
                const { data: publicUrlData } = supabase.storage
                    .from('categories')
                    .getPublicUrl(cleanFileName);

                imageUrl = publicUrlData.publicUrl;
            }

            console.log("4. Saving to Firestore...");
            await addDoc(collection(firestore, "categories"), {
                name: name.trim(),
                description: description.trim(),
                image: imageUrl,
                timestamp: serverTimestamp ? serverTimestamp() : new Date(), 
            });

            toast.success("La catégorie a été ajoutée avec succès !");
            setName("");
            setDesciption("");
            setImageUpload(null);
        }
        catch (error) {
            console.error("🔥 Error caught: ", error);
            toast.error("Erreur: " + error.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        document.title = "Admin | Catégorie";
        window.scrollTo(0, 0);
    }, []); 

    return (
        <div className='bg-gray-800 shadow-lg rounded-lg p-8 mb-8 max-w-xl mx-auto'>
            <h2 className='text-2xl font-semibold mb-6 text-orange-500'>Ajouter une catégorie</h2>

            <div className='space-y-4'>
                <div>
                    <label htmlFor='name' className='block text-sm font-medium text-gray-300'>
                        Nom de catégorie
                    </label>
                    <input
                        type='text'
                        id='name'
                        name='name'
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className='mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500'
                        required
                    />
                </div>

                <div>
                    <label htmlFor='description' className='block text-sm font-medium text-gray-300'>
                        Description
                    </label>
                    <textarea
                        id='description'
                        name='description'
                        value={description}
                        onChange={(e) => setDesciption(e.target.value)}
                        rows='3'
                        className='mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500'
                        required
                    />
                </div>

                <div className='mt-1 flex items-center'>
                    <input 
                        type='file' 
                        id='image' 
                        className='sr-only' 
                        accept='image/*' 
                        onChange={(e) => { setImageUpload(e.target.files[0]); }}
                    />
                    <label
                        htmlFor='image'
                        className='cursor-pointer bg-gray-700 py-2 px-3 border border-gray-600 rounded-md shadow-sm text-sm leading-4 font-medium text-gray-300 hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500'
                    >
                        <Upload className='h-5 w-5 inline-block mr-2' />
                        Ajouter Image
                    </label>

                    {imageUpload && <span className='ml-3 text-sm text-gray-400'>Image ajoutée : {imageUpload.name}</span>}
                </div>

                <button
                    onClick={handleSubmit}
                    disabled={loading}
                    className='w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 disabled:opacity-50'
                >
                    {loading ? (
                        <>
                            <Loader className='mr-2 h-5 w-5 animate-spin' aria-hidden='true' />
                            Chargement...
                        </>
                    ) : (
                        <>
                            <PlusCircle className='mr-2 h-5 w-5' />
                            Ajouter catégorie
                        </>
                    )}
                </button>
            </div>
        </div>
    );
};

export default CreateCategoryForm;