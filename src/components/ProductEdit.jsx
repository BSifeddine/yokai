import { deleteObject, getDownloadURL, listAll, ref, uploadBytesResumable } from 'firebase/storage';
import React, { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { firestore, storage } from '../firebase';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { motion } from "framer-motion";
import { Check, PlusCircle, Trash, Upload } from 'lucide-react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function ProductEdit() {

    const location = useLocation();
    const { id } = location.state || {}; 

    const nav = useNavigate()

    const [newProduct, setNewProduct] = useState([])

    const [files, setFiles] = useState([]);
	const [progress, setProgress] = useState(0);
	const [downloadURLs, setDownloadURLs] = useState([]);

    const [imageURLs, setImageURLs] = useState([]);

    const [selectedColors, setSelectedColors] = useState([]);
    const [selectedImage, setSelectedImage] = useState("");
	const [selectedTailles, setSelectedTailles] = useState([]);
    const [images, setImages] = useState([]);

	const offers = ['عرض خاص', 'تخفيض']
	
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
	  { name: 'gray', hex: 'bg-gray-800' },
	  { name: 'blackwhite', hex: 'bg-black border-4 border-white' },
	  { name: 'greenwhite', hex: 'bg-green-600 border-4 border-white' },
	  { name: 'whitegreen', hex: 'bg-white border-4 border-green-600' },
	  { name: 'blackgrenat', hex: 'bg-black border-4 border-rose-950' },
	  { name: 'beigegrenat', hex: 'bg-yellow-100 border-4 border-rose-950' },
	];

    const tailles = ["S", "M", "L", "XL", "XXL", "XXXL"]

    const handleCheckboxChange = (color) => {
		setSelectedColors((prev) =>
		  prev.includes(color)
			? prev.filter((c) => c !== color) // Remove if already in the array
			: [...prev, color] // Add to array
		);
	  };
	
    const handleTaillesChange = (taille) => {
		setSelectedTailles((prev) =>
		  prev.includes(taille)
			? prev.filter((t) => t !== taille) // Remove if already in the array
			: [...prev, taille] // Add to array
		);
	  };

      const handleFileChange = (e) => {
		setFiles(e.target.files);
	  };
	
    useEffect(() => {
        const fetchDocument = async () => {
          try {
            // Reference the specific document by its ID
            const docRef = doc(firestore, 'produits', id); // Replace 'users' with your collection name
            const docSnap = await getDoc(docRef);
    
            if (docSnap.exists()) {
              // Document exists, retrieve the data
              setNewProduct(docSnap.data());
            } else {
              // Document does not exist
              console.log("No such document!");
            }
          } catch (error) {
            console.error("Error fetching document:", error);
          }
        };
    
      if(id){
        fetchDocument();
      }
      }, [id]);

      useEffect(() => {

        const fetchImages = async () => {
          try {
            // Create a reference to the folder containing the images (e.g., 'images/')
            const storageRef = ref(storage, `${newProduct.name}/`);
            
            // List all items (files) in the 'images/' folder
            const res = await listAll(storageRef);
            
            // Fetch download URLs for all items
            const urls = await Promise.all(
            res.items.map((itemRef) => getDownloadURL(itemRef))
            );
            
            // Store the URLs in state
            setImages(urls);
          } catch (error) {
            console.error("Error fetching images:", error);
          }
          };
          
          fetchImages();
    },[newProduct])


		useEffect(() => {
			window.scrollTo(0, 0);
		  }, []); 

        const handleUpdate = async () => {


		if(selectedColors.length == 0 || selectedTailles.length == 0){
			alert("Remplez les tailles et les couleurs")
		} else {
            	
		const promises = [];
		Array.from(files).forEach((file) => {
		  if (file.size === 0) {
			alert('One or more files are empty.');
			return;
		  }
	
		  const storageRef = ref(storage, `${newProduct.name}/${file.name}`);
		  const metadata = {
			contentType: file.type, // Ensure the correct MIME type is set
		  };
	
		  const uploadTask = uploadBytesResumable(storageRef, file, metadata);
	
		  promises.push(
			new Promise((resolve, reject) => {
			  uploadTask.on(
				'state_changed',
				(snapshot) => {
				  const progress = Math.round(
					(snapshot.bytesTransferred / snapshot.totalBytes) * 100
				  );
				  setProgress(progress);
				},
				(error) => {
				  console.error("Upload failed:", error);
				  reject(error);
				},
				() => {
				  getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
					setDownloadURLs((prevURLs) => [...prevURLs, downloadURL]);
					resolve(downloadURL);
				  });
				}
			  );
			})
		  );
		});
	
		Promise.all(promises)
		  .then(() => toast.success('Le produit a été modifié'))
		  .catch((err) => console.log(err));
	  

            const docRef = doc(firestore, 'produits', id); // Update this path with your collection and document ID
        
            try {
              // Update the 'name' field in the document
              await updateDoc(docRef, {
                name: newProduct.name,
				description: newProduct.description,
				price: newProduct.price,
				promotion: newProduct.promotion,
				offer2: newProduct.offer2,
				offer3: newProduct.offer3,
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
				tailles: selectedTailles,
				colors: selectedColors,
				rating: newProduct.rating,
				note: newProduct.note,
				prix_promo: newProduct.prix_promo,
              });
              nav('/dashboard/produits')
            } catch (error) {
              console.error('Error updating document: ', error);
            }
			}
          };

        const deleteImage = async (imageUrl) => {
            const imageRef = ref(storage, imageUrl);

            try {
              // Delete the file from Firebase Storage
              await deleteObject(imageRef);
              toast.danger("L'image a été supprimer")
            } catch (error) {
              setMessage(`Failed to delete image: ${error.message}`);
            }
        }

    return (
		<div
			className='bg-gray-800 shadow-lg rounded-lg p-8 mb-8 max-w-xl mx-auto'
		>
			<h2 className='text-2xl font-semibold mb-6 text-emerald-300'>Modifier produit</h2>

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
						style={{ whiteSpace: "pre-line" }}
						className='mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm
						 py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 
						 focus:border-emerald-500'
						required
					/>
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
					<button className="bg-gray-700 border border-gray-600 text-white py-1 hover:bg-gray-600 px-3 rounded-md shadow-sm"
					onClick={() => setNewProduct({...newProduct, note: ""})}>
						Reset
					</button>
					</div>
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
					<label htmlFor='price' className='block text-sm font-medium text-gray-300'>
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
						{selectedColors.includes(color.name) && <Check color={color.name == "white" || color.name == "beige" ? "black" : "white"}/>}  
						</span>
					</label>
					))}
				</div>

				<div className="flex justify-start flex-wrap gap-4 my-2 ">
				<label htmlFor='tailles' className='block text-sm font-medium text-gray-300'>
						Les tailles : 
				</label>
				<div className="flex gap-3 items-center">
					{tailles.map((taille, index) => (
					<label key={index} className="flex items-center space-x-2 cursor-pointer text-emerald-500">
						<input
						type="checkbox"
						value={taille}
						onChange={() => handleTaillesChange(taille)}
						className="hidden peer"
						/>
						<span
						className={`h-7 w-11 rounded-md border-2 flex justify-center items-center font-semibold ${
							selectedTailles.includes(taille) ? 'text-white bg-emerald-500 shadow-lg border-emerald-500' : 'bg-white border-emerald-500'
						}`} 
						>{taille}</span>
					</label>
					))}
				</div>
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
					<progress value={progress} max="100" />
					</div>
				</div>

                <div className='flex flex-row items-center justify-center gap-3'>
                    {images.map((imageUrl) => (
                        <img src={imageUrl} alt="" className={`w-12 h-12 cursor-pointer hover:opacity-85 ${selectedImage === imageUrl && "border-2 border-emerald-500 mb-1"}`} onClick={() => setSelectedImage(imageUrl)}/>
                    ))}
                    <button
						onClick={() => deleteImage(selectedImage)}
						className='text-red-400 hover:text-red-300'
					>
						<Trash className='h-5 w-5' />
					</button>
                </div>

				<button
					onClick={handleUpdate}
					className='w-full flex justify-center py-2 px-4 border border-transparent rounded-md 
					shadow-sm text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 
					focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 disabled:opacity-50'
				>
						<>
							<PlusCircle className='mr-2 h-5 w-5' />
							Modifier produit
						</>
				</button>
			</div>
		</div>
  )
}

export default ProductEdit