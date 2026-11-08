import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { PlusCircle, Upload, Loader, Check, Redo } from "lucide-react";
import { firestore } from "../firebase";
import { addDoc, collection, getDocs } from 'firebase/firestore';
import { supabase } from '../../supabaseClient'; // <--- Import Supabase client
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const CreateProductForm = () => {
    const [categories, setCategories] = useState([]);
    const [files, setFiles] = useState([]);
    const [loading, setLoading] = useState(false);

    const [newProduct, setNewProduct] = useState({
        name: "",
        description: "",
        price: 0,
        promotion: 0,
        offer2: 0,
        offer3: 0,
        rating: 0,
        s_poids: "",
        m_poids: "",
        l_poids: "",
        xl_poids: "",
        xxl_poids: "",
        xxxl_poids: "",
        s_tol: "",
        m_tol: "",
        l_tol: "",
        xl_tol: "",
        xxl_tol: "",
        xxxl_tol: "",
        type: "",
        category: "",
        note: "",
        prix_promo: 0,
    });

    const [selectedColors, setSelectedColors] = useState([]);
    const [selectedTailles, setSelectedTailles] = useState([]);
    
    const colors = [
      { name: 'black', hex: "bg-black"},
      { name: 'white', hex: 'bg-white'},
      { name: 'grey', hex: 'bg-gray-400'},
      { name: 'red', hex: 'bg-red-600' },
      { name: 'green', hex: 'bg-green-700' },
      { name: 'blue', hex: 'bg-blue-600' },
      { name: 'rose', hex: 'bg-rose-950'},
      { name: 'yellow', hex: 'bg-yellow-500' },
      { name: 'bleu_nuit', hex: 'bg-blue-950' },
      { name: 'beige', hex: 'bg-yellow-100' },
      { name: 'cyan', hex: 'bg-cyan-300' },
      { name: 'gray', hex: 'bg-gray-700' },
    ];
    const taillesV = ["S", "M", "L", "XL", "XXL", "XXXL"];
    const taillesC = ["39", "40", "41", "42", "43", "44", "45"];
    const types = ["Vêtements", "Chaussures"];
    const offers = ['عرض خاص', 'تخفيض'];

    const handleCheckboxChange = (color) => {
        setSelectedColors((prev) =>
          prev.includes(color)
            ? prev.filter((c) => c !== color)
            : [...prev, color]
        );
    };
    
    const handleTaillesChange = (taille) => {
        setSelectedTailles((prev) =>
          prev.includes(taille)
            ? prev.filter((t) => t !== taille)
            : [...prev, taille]
        );
    };

    useEffect(() => {
        const fetchData = async () => {
          try {
            const querySnapshot = await getDocs(collection(firestore, "categories"));
            const items = querySnapshot.docs.map(doc => ({
              id: doc.id,
              ...doc.data()
            }));
            setCategories(items);
        } catch (error) {
            console.error("Error fetching data: ", error);
        }
    };
    
        fetchData();
    }, []);
    
    // Handle file selection
    const handleFileChange = (e) => {
        setFiles(e.target.files);
    };
 
    // Upload files to Supabase Storage & save to Firestore
    const handleUpload = async (e) => {
        if (e) e.preventDefault();

        if (files.length === 0) {
            toast.error('Aucun fichier sélectionné.');
            return;
        }

        setLoading(true);

        try {
            const downloadURLs = [];

            // Loop through all selected files and upload them to Supabase
            for (let i = 0; i < files.length; i++) {
                const file = files[i];
                if (file.size === 0) continue;

                // Clean filename to prevent path issues
                const cleanFileName = `products/${Date.now()}_${file.name.replace(/[^a-zA-Z0-9_.-]/g, '_')}`;

                const { error: uploadError } = await supabase.storage
                    .from('products') // Adjust bucket name if you use a separate one for products
                    .upload(cleanFileName, file);

                if (uploadError) {
                    console.error("Upload failed:", uploadError);
                    throw uploadError;
                }

                // Get public URL
                const { data: publicUrlData } = supabase.storage
                    .from('products')
                    .getPublicUrl(cleanFileName);

                if (publicUrlData?.publicUrl) {
                    downloadURLs.push(publicUrlData.publicUrl);
                }
            }

            // Save product details along with image URLs to Firestore
            await addDoc(collection(firestore, "produits"), {
                name: newProduct.name,
                description: newProduct.description,
                price: Number(newProduct.price),
                promotion: Number(newProduct.promotion),
                offer2: Number(newProduct.offer2),
                offer3: Number(newProduct.offer3),
                category: newProduct.category,
                tailles: selectedTailles,
                colors: selectedColors,
                type: newProduct.type,
                images: downloadURLs, // Storing array of image URLs
                s_poids: newProduct.s_poids,
                m_poids: newProduct.m_poids,
                l_poids: newProduct.l_poids,
                xl_poids: newProduct.xl_poids,
                xxl_poids: newProduct.xxl_poids,
                xxxl_poids: newProduct.xxxl_poids,
                s_tol: newProduct.s_tol,
                m_tol: newProduct.m_tol,
                l_tol: newProduct.l_tol,
                xl_tol: newProduct.xl_tol,
                xxl_tol: newProduct.xxl_tol,
                xxxl_tol: newProduct.xxxl_tol,
                isFeatured: false,
                note: newProduct.note,
                rating: Number(newProduct.rating),
                prix_promo: Number(newProduct.prix_promo),
                timestamp: new Date(),
            });

            toast.success('Le produit a été ajouté avec succès !');
            resetForm();
        } catch (error) {
            console.error("Error adding product: ", error);
            toast.error("Erreur: " + error.message);
        } finally {
            setLoading(false);
        }
    };

    const resetForm = () => {
        setNewProduct({
            name: "",
            description: "",
            price: 0,
            promotion: 0,
            offer2: 0,
            offer3: 0,
            s_poids: "",
            m_poids: "",
            l_poids: "",
            xl_poids: "",
            xxl_poids: "",
            xxxl_poids: "",
            type: "",
            s_tol: "",
            m_tol: "",
            l_tol: "",
            xl_tol: "",
            xxl_tol: "",
            xxxl_tol: "",
            category: "",
            note: "",
            prix_promo: 0,
        });
        setSelectedColors([]);
        setSelectedTailles([]);
        setFiles([]);
    };

    useEffect(() => {
        document.title = "Admin | Produit";
        window.scrollTo(0, 0);
    }, []);
	return (
		<div
			className='bg-gray-800 shadow-lg rounded-lg p-8 mb-8 max-w-xl mx-auto'
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.8 }}
		>
			<h2 className='text-2xl font-semibold mb-6 text-orange-500'>Ajouter un produit</h2>

			<div className='space-y-4'>
				<div>
					<label htmlFor='name' className='block text-sm font-medium text-gray-300'>
						Nom de produit
					</label>
					<input
						type='text'
						id='name'
						name='name'
						value={newProduct.name}
						onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
						className='mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2
						 px-3 text-white focus:outline-none focus:ring-2
						focus:ring-emerald-500 focus:border-emerald-500'
						required
					/>
				</div>

				<div>
					<label htmlFor='description' className='block text-sm font-medium text-gray-300'>
						Déscription
					</label>
					<textarea
						id='description'
						name='description'
						value={newProduct.description}
						onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
						rows='3'
						className='mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm
						 py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 
						 focus:border-emerald-500'
						required
					/>
				</div>

				<div>
					<label htmlFor='price' className='block text-sm font-medium text-gray-300'>
						Prix
					</label>
					<input
						type='number'
						id='price'
						name='price'
						value={newProduct.price}
						onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
						className='mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm 
						py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500
						 focus:border-emerald-500'
						required
					/>
				</div>
				<div>
					<label htmlFor='price' className='block text-sm font-medium text-gray-300'>
						offre 2
					</label>
					<input
						type='number'
						id='offer2'
						name='offer2'
						value={newProduct.offer2}
						onChange={(e) => setNewProduct({ ...newProduct, offer2: e.target.value })}
						className='mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm 
						py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500
						 focus:border-emerald-500'
						required
					/>
				</div>
				<div>
					<label htmlFor='price' className='block text-sm font-medium text-gray-300'>
						offre 3
					</label>
					<input
						type='number'
						id='offer3'
						name='offer3'
						value={newProduct.offer3}
						onChange={(e) => setNewProduct({ ...newProduct, offer3: e.target.value })}
						className='mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm 
						py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500
						 focus:border-emerald-500'
						required
					/>
				</div>
				<div>
					<label htmlFor='promotion' className='block text-sm font-medium text-gray-300'>
						Promotion
					</label>
					<input
						type='number'
						id='promotion'
						name='promotion'
						value={newProduct.promotion}
						onChange={(e) => setNewProduct({ ...newProduct, promotion: e.target.value })}
						className='mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm 
						py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500
						 focus:border-emerald-500'
						required
					/>
				</div>

				<div>
					<label htmlFor='price' className='block text-sm font-medium text-gray-300'>
						Prix ancien
					</label>
					<input
						type='number'
						id='prix_promo'
						name='prix_promo'
						value={newProduct.prix_promo}
						onChange={(e) => setNewProduct({ ...newProduct, prix_promo: e.target.value })}
						className='mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm 
						py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500
						 focus:border-emerald-500'
						required
					/>
				</div>
				<div>
					<label htmlFor='type' className='block text-sm font-medium text-gray-300'>
						Type
					</label>
					<select
						id='type'
						name='type'
						value={newProduct.type}
						onChange={(e) => setNewProduct({ ...newProduct, type: e.target.value })}
						className='mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md
						 shadow-sm py-2 px-3 text-white focus:outline-none 
						 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500'
						required
					>
						<option value='' disabled>Séléctionner une type</option>
						{types?.map((type) => (
							<option key={type} value={type}>
								{type}
							</option>
						))}
					</select>
				</div>
				<div>
					<label htmlFor='category' className='block text-sm font-medium text-gray-300'>
						Catégorie
					</label>
					<select
						id='category'
						name='category'
						value={newProduct.category}
						onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
						className='mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md
						 shadow-sm py-2 px-3 text-white focus:outline-none 
						 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500'
						required
					>
						<option value='' disabled>Séléctionner une catégorie</option>
						{categories?.map((category) => (
							<option key={category.id} value={category.name}>
								{category.name}
							</option>
						))}
					</select>
				</div>
				<div>
					<label htmlFor='category' className='block text-sm font-medium text-gray-300'>
						Note 
					</label>
					<div className="flex flex-row items-center justify-between gap-3">
					<select
						id='note'
						name='note'
						value={newProduct.note}
						onChange={(e) => setNewProduct({ ...newProduct, note: e.target.value })}
						className='mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md
						 shadow-sm py-2 px-3 text-white focus:outline-none 
						 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500'
						required
					>
						<option value='' disabled>Séléctionner une note</option>
						{offers?.map((offer) => (
							<option key={offer} value={offer}>
								{offer}
							</option>
						))}
					</select>
					</div>
				</div>
				<div className="flex justify-start flex-wrap gap-3 my-2">
					<label htmlFor='couleurs' className='block text-sm font-medium text-gray-300'>
						Les couleurs : 
					</label>
					{colors.map((color) => (
					<label key={color.name} className="flex items-center gap-2 cursor-pointer">
						<input
						type="checkbox"
						value={color.name}
						onChange={() => handleCheckboxChange(color.name)}
						className="hidden peer"
						/>
						<span
						className={`h-7 w-7 flex justify-center items-center rounded-full border-2 ${color.hex}`}
						>
						{selectedColors.includes(color.name) && <Check color={color.name == "white" || color.name == "beige" || color.name == "grey" || color.name == "cyan" ? "black" : "white"}/>}  
						</span>
					</label>
					))}
				</div>

				<div className="flex justify-start flex-wrap gap-3 my-2 ">
				<label htmlFor='tailles' className='block text-sm font-medium text-gray-300'>
						Les tailles : 
				</label>
				{newProduct.type === "Vêtements" ? 
				<div className="flex gap-1 items-center">
					{taillesV.map((taille, index) => (
					<label key={index} className="flex items-center space-x-2 cursor-pointer text-emerald-500">
						<input
						type="checkbox"
						value={taille}
						onChange={() => handleTaillesChange(taille)}
						className="hidden peer"
						/>
						<span
						className={`h-6 w-9 text-sm rounded-md border-2 flex justify-center items-center font-semibold ${
							selectedTailles.includes(taille) ? 'text-white bg-emerald-500 shadow-lg border-emerald-500' : 'bg-white border-emerald-500'
						}`} 
						>{taille}</span>
					</label>
					))}
				</div>
				: newProduct.type === "Chaussures" ? 
					<div className="flex gap-1 items-center">
					{taillesC.map((taille, index) => (
					<label key={index} className="flex items-center space-x-2 cursor-pointer text-emerald-500">
						<input
						type="checkbox"
						value={taille}
						onChange={() => handleTaillesChange(taille)}
						className="hidden peer"
						/>
						<span
						className={`h-6 w-9 text-sm rounded-md border-2 flex justify-center items-center font-semibold ${
							selectedTailles.includes(taille) ? 'text-white bg-emerald-500 shadow-lg border-emerald-500' : 'bg-white border-emerald-500'
						}`} 
						>{taille}</span>
					</label>
					))}
				</div>
				: <div className="flex gap-1 items-center">
					<label className="flex items-center space-x-2 cursor-pointer text-orange-500">
						Sélectionner un type
					</label>
				</div>
				}
				</div>

			<div>
			<div className="flex flex-row justify-between gap-3 items-center">
					<label htmlFor='name' className='block text-sm font-medium w-24 text-gray-300'>
						s
					</label>
					<input
						type='text'
						id='s_poids'
						name='s_poids'
						value={newProduct.s_poids}
						onChange={(e) => setNewProduct({ ...newProduct, s_poids: e.target.value })}
						className='mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2
						 px-3 text-white focus:outline-none focus:ring-2
						focus:ring-emerald-500 focus:border-emerald-500'
						required
					/>
					<input
						type='text'
						id='s_tol'
						name='s_tol'
						value={newProduct.s_tol}
						onChange={(e) => setNewProduct({ ...newProduct, s_tol: e.target.value })}
						className='mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2
						 px-3 text-white focus:outline-none focus:ring-2
						focus:ring-emerald-500 focus:border-emerald-500'
						required
					/>
				</div>
				<div className="flex flex-row justify-between gap-3 items-center">
					<label htmlFor='name' className='block text-sm font-medium w-24 text-gray-300'>
						m
					</label>
					<input
						type='text'
						id='m_poids'
						name='m_poids'
						value={newProduct.m_poids}
						onChange={(e) => setNewProduct({ ...newProduct, m_poids: e.target.value })}
						className='mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2
						 px-3 text-white focus:outline-none focus:ring-2
						focus:ring-emerald-500 focus:border-emerald-500'
						required
					/>
					<input
						type='text'
						id='m_tol'
						name='m_tol'
						value={newProduct.m_tol}
						onChange={(e) => setNewProduct({ ...newProduct, m_tol: e.target.value })}
						className='mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2
						 px-3 text-white focus:outline-none focus:ring-2
						focus:ring-emerald-500 focus:border-emerald-500'
						required
					/>
				</div>
				<div className="flex flex-row justify-between gap-3 items-center">
					<label htmlFor='name' className='block text-sm font-medium w-24 text-gray-300'>
						L
					</label>
					<input
						type='text'
						id='l_poids'
						name='l_poids'
						value={newProduct.l_poids}
						onChange={(e) => setNewProduct({ ...newProduct, l_poids: e.target.value })}
						className='mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2
						 px-3 text-white focus:outline-none focus:ring-2
						focus:ring-emerald-500 focus:border-emerald-500'
						required
					/>
					<input
						type='text'
						id='l_tol'
						name='l_tol'
						value={newProduct.l_tol}
						onChange={(e) => setNewProduct({ ...newProduct, l_tol: e.target.value })}
						className='mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2
						 px-3 text-white focus:outline-none focus:ring-2
						focus:ring-emerald-500 focus:border-emerald-500'
						required
					/>
				</div>
				<div className="flex flex-row justify-between gap-3 items-center">
					<label htmlFor='name' className='block text-sm font-medium w-24 text-gray-300'>
						XL
					</label>
					<input
						type='text'
						id='xl_poids'
						name='xl_poids'
						value={newProduct.xl_poids}
						onChange={(e) => setNewProduct({ ...newProduct, xl_poids: e.target.value })}
						className='mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2
						 px-3 text-white focus:outline-none focus:ring-2
						focus:ring-emerald-500 focus:border-emerald-500'
						required
					/>
					<input
						type='text'
						id='xl_tol'
						name='xl_tol'
						value={newProduct.xl_tol}
						onChange={(e) => setNewProduct({ ...newProduct, xl_tol: e.target.value })}
						className='mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2
						 px-3 text-white focus:outline-none focus:ring-2
						focus:ring-emerald-500 focus:border-emerald-500'
						required
					/>
				</div>
				<div className="flex flex-row justify-between gap-3 items-center">
					<label htmlFor='name' className='block text-sm font-medium w-24 text-gray-300'>
						XXL
					</label>
					<input
						type='text'
						id='xxl_poids'
						name='xxl_poids'
						value={newProduct.xxl_poids}
						onChange={(e) => setNewProduct({ ...newProduct, xxl_poids: e.target.value })}
						className='mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2
						 px-3 text-white focus:outline-none focus:ring-2
						focus:ring-emerald-500 focus:border-emerald-500'
						required
					/>
					<input
						type='text'
						id='xxl_tol'
						name='xxl_tol'
						value={newProduct.xxl_tol}
						onChange={(e) => setNewProduct({ ...newProduct, xxl_tol: e.target.value })}
						className='mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2
						 px-3 text-white focus:outline-none focus:ring-2
						focus:ring-emerald-500 focus:border-emerald-500'
						required
					/>
				</div>
				<div className="flex flex-row justify-between gap-3 items-center">
					<label htmlFor='name' className='block text-sm font-medium w-24 text-gray-300'>
						XXXL
					</label>
					<input
						type='text'
						id='xxxl_poids'
						name='xxxl_poids'
						value={newProduct.xxxl_poids}
						onChange={(e) => setNewProduct({ ...newProduct, xxxl_poids: e.target.value })}
						className='mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2
						 px-3 text-white focus:outline-none focus:ring-2
						focus:ring-emerald-500 focus:border-emerald-500'
						required
					/>
					<input
						type='text'
						id='xxxl_tol'
						name='xxxl_tol'
						value={newProduct.xxxl_tol}
						onChange={(e) => setNewProduct({ ...newProduct, xxxl_tol: e.target.value })}
						className='mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2
						 px-3 text-white focus:outline-none focus:ring-2
						focus:ring-emerald-500 focus:border-emerald-500'
						required
					/>
				</div>
					<label htmlFor='price' className='block text-sm font-medium text-gray-300'>
						Rating
					</label>
					<input
						type='number'
						id='rating'
						name='rating'
						value={newProduct.rating}
						onChange={(e) => setNewProduct({ ...newProduct, rating: e.target.value })}
						className='mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm 
						py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500
						focus:border-emerald-500'
						required
						/>
				</div>

				<div className='mt-1 flex items-center'>
					<input type='file' id='image' className='sr-only' accept='image/*' multiple onChange={handleFileChange}/>
					<label
						htmlFor='image'
						className='cursor-pointer bg-gray-700 py-2 px-3 border border-gray-600 rounded-md shadow-sm text-sm leading-4 font-medium text-gray-300 hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500'
					>
						<Upload className='h-5 w-5 inline-block mr-2' />
						Ajouter image
					</label>
					{files.length > 0 && <span className='ml-3 text-sm text-gray-400'>Image ajouté </span>}
					<div>
					</div>
				</div>
				<div className="flex flex-row justify-center items-center gap-2">
				<button
					onClick={handleUpload}
					className='w-full flex justify-center py-2 px-4 border border-transparent rounded-md 
					shadow-sm text-sm font-medium text-white bg-orange-600 hover:bg-orange-700 
					focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 disabled:opacity-50'
					>

						<>
							<PlusCircle className='mr-2 h-5 w-5' />
							Ajouter produit
						</>
				</button>
				<button className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md 
					shadow-sm text-sm font-medium text-black bg-gray-300 hover:bg-gray-400 
					focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 disabled:opacity-50'"
					onClick={resetForm}>
						<Redo className='mr-2 h-5 w-5' />
						Reset
				</button>
				</div>
			</div>
		</div>
	);
}
export default CreateProductForm;