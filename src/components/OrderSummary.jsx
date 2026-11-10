import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { MoveLeft, MoveRight, ShoppingBag } from "lucide-react";
import { useEffect, useState } from "react";
import { wilayas } from '../wilayas'
import { livraisonSD } from '../livraisonSD';
import { livraisonDomicile } from '../livraisonDomicile';
import { firestore } from "../firebase"
import { collection, doc, getDoc, getDocs, addDoc, query, where} from 'firebase/firestore'
import { storage } from '../firebase';
import { toast } from 'react-toastify';
import { useNavigate } from "react-router-dom";
import 'react-toastify/dist/ReactToastify.css';

const OrderSummary = ({ cart , setCart }) => {

	const navigate = useNavigate();

	const [subtotal, setSubtotal] = useState(0);

	  const newWilayas = Object.keys(wilayas)
		const [communes, setCommunes] = useState([])
		const [sd, setSd] = useState(0)
		const [domicile, setDomicile] = useState(0)
		const [prix , setPrix] = useState(0)
		const [prixTotal, setPrixTotal] = useState(0)
	
	const [formData, setFormData] = useState({
		  name: '',
		  num: '',
		  commun: '',
		  wilaya: '',
		  offer: 1,
		  produit: [],
		  prix: 0,
		  type_livraison: 'domicile',
		  montant_livraison: 0,
		  prix_total: 0,
		});
	
	const [prod1, setProd1] = useState({
	  name1: "",
	  taille1: "",
	  color1: "",
	})
	const [prod2, setProd2] = useState({
	  name2: "",
	  taille2: "",
	  color2: "",
	})
	const [prod3, setProd3] = useState({
	  name3: "",
	  taille3: "",
	  color3: "",
	})
	const [prod4, setProd4] = useState({
		name4: "",
		taille4: "",
		color4: "",
	  })
	  const [prod5, setProd5] = useState({
		name5: "",
		taille5: "",
		color5: "",
	  })


	useEffect(() => {
		if(cart?.length > 0){
			prod1.name1 = cart[0].name
			prod1.taille1 = cart[0].taille
			prod1.color1 = cart[0].color
		}
		if(cart?.length > 1){
			prod2.name2 = cart[1].name
			prod2.taille2 = cart[1].taille
			prod2.color2 = cart[1].color
		}
		if(cart?.length > 2){
			prod3.name3 = cart[2].name
			prod3.taille3 = cart[2].taille
			prod3.color3 = cart[2].color
		}
		if(cart?.length > 3){
			prod4.name4 = cart[3].name
			prod4.taille4 = cart[3].taille
			prod4.color4 = cart[3].color
		}
		if(cart?.length > 4){
			prod5.name5 = cart[4].name
			prod5.taille5 = cart[4].taille
			prod5.color5 = cart[4].color
		}
		cart.map((item) => {
			setSubtotal(s =>( parseInt( s ) + parseInt(item.price) / 2 ))
		})
	},[cart])

	useEffect(() => {
		const total = cart?.reduce((acc, item) => acc + parseInt(item.price || 0), 0);
		setPrix(total);
	},[cart])

	useEffect(() => {
		const prixValue = parseInt(prix) || 0;
		const livraisonValue = parseInt(formData.montant_livraison) || 0;
		setPrixTotal(prixValue + livraisonValue);
	},[formData.montant_livraison])

	useEffect(() => {
		  setCommunes(wilayas[formData.wilaya])  
		  setSd(livraisonSD[formData.wilaya])
		  setDomicile(livraisonDomicile[formData.wilaya])
		  setFormData({...formData, commun: ""})
		},[formData.wilaya])
	
		useEffect(() => {
		  if(formData.type_livraison == "domicile"){
			setFormData({...formData, type_livraison: "domicile", montant_livraison: domicile})
		  } else {
			setFormData({...formData, type_livraison: "sd", montant_livraison: sd})
		  }
		},[domicile])  
		
		// Handle form input changes
		const handleChange = (e) => {
		  setFormData({
			...formData,
			[e.target.name]: e.target.value,
		  });
		};
	const validation = () => {
	
		  if(formData.name.length == 0 || formData.num.length == 0){
			toast.error("الرجاء ادخال معلوماتك الشخصية")
			return false
		  } else if(formData.name.length < 4){
			toast.warning("الرجاء التأكد من الإسم")
			return false
		  } else if(formData.num.length != 10){
			toast.warning("الرجاء التأكد من رقم الهاتف")
			return false 
		  } else if(formData.wilaya == ""){
			toast.warning("الرجاء اختيار الولاية")
			return false
		  } else if(formData.type_livraison == "domicile" && formData.commun == ""){
			toast.warning("الرجاء اختيار البلدية")
			return false 
		  }else{
			// Inside your order success handler:
			navigate("/thank-you", { state: { success: true } });
			return true
		  }
		}
		const handleSubmit = async(e) => {
		
			  e.preventDefault()
		
			  if(validation()){
			  if(cart?.length == 1){
				await addDoc(collection(firestore, "orders"),{
				  produit1: prod1.name1,
				  name: formData.name,
				  num: formData.num,
				  wilaya: formData.wilaya,
				  commun : formData.commun,
				  offer: formData.offer,
				  taille1: prod1.taille1,
				  color1: prod1.color1,
				  prix : prix,
				  type_livraison: formData.type_livraison,
				  montant_livraison: formData.montant_livraison,
				  prix_total: prixTotal,
				  etat: "Non confirmé",
				  timestamp: new Date(), 
				})
			  } else if(cart?.length == 2){
				await addDoc(collection(firestore, "orders"),{
				  produit1: prod1.name1,
			      produit2: prod2.name2,
				  name: formData.name,
				  num: formData.num,
				  wilaya: formData.wilaya,
				  commun : formData.commun,
				  offer: formData.offer,
				  taille1: prod1.taille1,
				  color1: prod1.color1,
				  taille2: prod2.taille2,
				  color2: prod2.color2,
				  prix : prix,
				  type_livraison: formData.type_livraison,
				  montant_livraison: formData.montant_livraison,
				  prix_total: prixTotal,
				  etat: "Non confirmé",
				  timestamp: new Date(), 
				})
			  } else if(cart?.length == 3){
				await addDoc(collection(firestore, "orders"),{
				  produit1: prod1.name1,
				  produit2: prod2.name2,
				  produit3: prod3.name3,
				  name: formData.name,
				  num: formData.num,
				  wilaya: formData.wilaya,
				  commun : formData.commun,
				  offer: formData.offer,
				  taille1: prod1.taille1,
				  color1: prod1.color1,
				  taille2: prod2.taille2,
				  color2: prod2.color2,
				  taille3: prod3.taille3,
				  color3: prod3.color3,
				  prix : prix,
				  type_livraison: formData.type_livraison,
				  montant_livraison: formData.montant_livraison,
				  prix_total: prixTotal,
				  etat: "Non confirmé",
				  timestamp: new Date(), 
				})
			} else if(cart?.length == 4){
				await addDoc(collection(firestore, "orders"),{
				  produit1: prod1.name1,
				  produit2: prod2.name2,
				  produit3: prod3.name3,
				  produit4: prod4.name4,
				  name: formData.name,
				  num: formData.num,
				  wilaya: formData.wilaya,
				  commun : formData.commun,
				  offer: formData.offer,
				  taille1: prod1.taille1,
				  color1: prod1.color1,
				  taille2: prod2.taille2,
				  color2: prod2.color2,
				  taille3: prod3.taille3,
				  color3: prod3.color3,
				  taille4: prod4.taille4,
				  color4: prod4.color4,
				  prix : prix,
				  type_livraison: formData.type_livraison,
				  montant_livraison: formData.montant_livraison,
				  prix_total: prixTotal,
				  etat: "Non confirmé",
				  timestamp: new Date(), 
				})
			}
			else {
				await addDoc(collection(firestore, "orders"),{
				  produit1: prod1.name1,
				  produit2: prod2.name2,
				  produit3: prod3.name3,
				  produit4: prod4.name4,
				  produit5: prod5.name5,
				  name: formData.name,
				  num: formData.num,
				  wilaya: formData.wilaya,
				  commun : formData.commun,
				  offer: formData.offer,
				  taille1: prod1.taille1,
				  color1: prod1.color1,
				  taille2: prod2.taille2,
				  color2: prod2.color2,
				  taille3: prod3.taille3,
				  color3: prod3.color3,
				  taille4: prod4.taille4,
				  color4: prod4.color4,
				  taille5: prod5.taille5,
				  color5: prod5.color5,
				  prix : prix,
				  type_livraison: formData.type_livraison,
				  montant_livraison: formData.montant_livraison,
				  prix_total: prixTotal,
				  etat: "Non confirmé",
				  timestamp: new Date(), 
				})
			}
			
			setFormData({
			name: "",
			num: "",
			commun: "",
			wilaya: "",
			offer: 1,
			prix: 0,
			type_livraison: 'domicile',
			montant_livraison: 0,
			prix_total: 0,
		  })
		  setProd1({
			name1: "",
			taille1: "",
			color1: "",
		  })
		  setProd2({
			name2: "",
			taille2: "",
			color2: "",
		  })
		  setProd3({
			name3: "",
			taille3: "",
			color3: "",
		  })
		  setProd4({
			name4: "",
			taille4: "",
			color4: "",
		  })
		  setProd5({
			name5: "",
			taille5: "",
			color5: "",
		  })
		  
		  localStorage.removeItem('cart');
		  setCart([])
		  setPrix(0)
		  setPrixTotal(0)
		}
		}
		
	


	return (
		<div className="border border-gray-100 rounded-lg shadow-lg bg-white p-5">
			<div className="flex justify-end">
				<p className='text-xl font-bold text-red-500 justify-self-end pb-4'>ملخص الطلبية</p>
			</div>

			<div className='space-y-4'>
				{/* Name Input */}
				<div className="mb-4 flex flex-col items-end">
          <label htmlFor="name" className="block text-gray-700 text-sm font-bold mb-2">
            الإسم الكامل
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="w-full px-4 text-end py-2 bg-white text-gray-700 border border-gray-300 rounded-lg focus:outline-none focus:border-gray-400"
            placeholder="الإسم الكامل"
            required
          />
        </div>

        {/* Num Input */}
          <div className="mb-4 flex flex-col items-end">
          <label htmlFor="name" className="block text-gray-700 text-sm font-bold mb-2">
            رقم الهاتف
          </label>
          <input
            type="Number"
            id="num"
            name="num"
            value={formData.num}
            onChange={handleChange}
            className="w-full px-4 text-end py-2 bg-white text-gray-700 border border-gray-300 rounded-lg focus:outline-none focus:border-gray-400"
            placeholder="رقم الهاتف"
            required
          />
        </div>


        <div className='flex gap-3 w-full'>
      {/* Commun Input */}
      <div className="mb-4 flex flex-col items-end w-full">
          <label htmlFor="name" className="block text-gray-700 text-sm font-bold mb-2">
          البلدية
          </label>
      <select
        value={formData.commun}
        onChange={handleChange}
        name='commun'
        className="block w-full text-right px-4 py-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none  text-gray-800 focus:border-gray-400"
      >
        <option value="" disabled>اختر البلدية</option>
        {formData.wilaya && communes?.map((option, index) => (
          <option key={index} value={option}>
            {option}
          </option>
        ))}
      </select>
      </div>

      {/* Wilaya Input */}
      <div className="mb-4 flex flex-col items-end w-full">
          <label htmlFor="name" className="block text-gray-700 text-sm font-bold mb-2">
          الولاية
          </label>
      <select
        value={formData.wilaya}
        onChange={handleChange}
        name='wilaya'
        className="block w-full text-right px-4 py-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none text-gray-800 focus:border-gray-400"
      >
        <option className='flex justify-end' value="" disabled>اختر الولاية</option>
        {newWilayas.map((option, index) => (
        <option className='float-right' key={index} value={option} >
          {option}
        </option>
        ))}
      </select>
      </div>

      </div>
            {/* livraison */}
            <div className='flex flex-col w-full'>
      <div className='flex justify-between mb-2 items-center'>
        {formData.wilaya? 
          <div className='flex gap-1 items-center justify-center bg-red-500 rounded-lg px-3 h-8'>
            <p className='text-white font-bold'>دج</p>
            <p className='text-white font-bold'>{formData.montant_livraison}</p>
          </div>
        :
          <div className='flex gap-1 items-center justify-center bg-red-500 rounded-lg px-3 h-8'>
            <p className='text-white font-bold'>اختر الولاية</p>
          </div>
        }
        <label htmlFor="name" className="block text-gray-700 text-right text-sm font-bold mb-2">
          التوصيل
        </label>
      </div>
      <div className='flex gap-3 w-full'>
      {/* sd */}
      <div className="mb-2 flex flex-col items-end w-full">
        <button type='button' onClick={() => setFormData({...formData, type_livraison: "sd", montant_livraison: sd})}
          className={`${formData.type_livraison === "sd" && formData.wilaya ? "border-2 border-red-500": "border-gray-300"} block w-full cursor-pointer ${sd != 0 && formData.wilaya && formData.type_livraison != "sd" && "hover:border-gray-400"} text-right px-4 py-2 border bg-white rounded-md shadow-sm focus:outline-none text-red-500`}
          disabled = {!formData.wilaya || sd == 0 ? true : false}
        >
        {formData.wilaya ? 
          <div className='flex justify-between'>
          {sd != 0?
            <>
              <div className='flex flex-row gap-1 text-gray-700 font-semibold'>
                <p>دج</p>
                <p>{sd}</p>
              </div>
              <p className='text-gray-700'>المكتب</p>
            </>
          :
          <>
            <p></p>
            <p className='text-gray-700'>لا يوجد مكتب</p>
          </>
          }
          </div>
        :
          <div className='flex justify-between'>
            <div className='flex flex-row gap-1 text-gray-700 font-semibold'>
              <p className='text-sm md:text-md'> ... </p>
            </div>
          <p className='text-gray-700'>المكتب</p>
          </div>  
        }
        </button>
      </div>

      {/* domicile */}
      <div className="mb-2 flex flex-col items-end w-full">
        <button type='button' onClick={() => setFormData({...formData, type_livraison: "domicile", montant_livraison: domicile})}
          className={`${formData.type_livraison === "domicile" && formData.wilaya ? "border-2 border-red-500": "border-gray-300"} block w-full cursor-pointer ${formData.wilaya && formData.type_livraison != "domicile" && "hover:border-gray-400"} text-right px-4 py-2 border bg-white rounded-md shadow-sm focus:outline-none text-red-500`}
          disabled = {!formData.wilaya ? true : false}
        >
          <div className='flex justify-between'>
          {formData.wilaya? 
            <div className='flex flex-row gap-1 text-gray-700 font-semibold'>
              <p>دج</p>
              <p>{domicile}</p>
            </div>
          :
            <div className='flex flex-row gap-1 text-gray-700 font-semibold'>
              <p className='text-sm md:text-md'> ... </p>
            </div>
          }
          <p className='text-gray-700'>المنزل</p>
        </div>
        </button>
      </div>
      </div>
        <div className='flex flex-row justify-end gap-1 mb-4 mt-1'>
          <p style={{fontSize: "0.9em"}} className='text-gray-500'>ZR Express</p>
          <p style={{fontSize: "0.9em"}} className='text-gray-500'>التوصيل مع شركة </p>
        </div>
      </div>
				<div className='w-full flex flex-col justify-between border border-gray-300 mb-4 cursor-pointer text-right px-5 py-2 bg-white rounded-md shadow-sm focus:outline-none'>
				<div className='flex flex-row items-center justify-between py-2'>       
						<div className='flex flex-row items-center justify-between gap-1 text-gray-800 font-semibold'>
						<p>دج</p>
						<p>{prix}</p>
						</div>
						<p className='text-gray-600 font-semibold'>السعر</p>
					</div>

					<div className='flex flex-row items-center justify-between py-2'>       
						<div className='flex flex-row items-center justify-between gap-1 text-gray-800 font-semibold'>
						{formData.wilaya ? <>
						<p>دج</p>
						<p>{formData.wilaya ? formData.montant_livraison : "اختر الولاية"}</p>
						</>
						:
						<>
						<p>اختر الولاية</p>
						</>
						}
						</div>
						<p className='text-gray-600 font-semibold'>التوصيل</p>
					</div>
					<hr/>
					<div className='flex flex-row items-center justify-between py-2'>       
					<div className='flex flex-row items-center justify-between gap-1 text-gray-800 font-bold'>
					{!formData.wilaya ? <>
					<p>التوصيل + </p>
					<p>دج</p>
					<p>{prix}</p>
					</>
					: <>
					<p>دج</p>
					<p>{prixTotal}</p>
					</>
					}
					</div>
					<p className='text-gray-600 font-semibold'>السعر الكلي</p>
				</div>
				</div>

				<button
					className="w-full flex items-center gap-1 justify-center bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded-lg focus:outline-none focus:shadow-outline"
		  			onClick={handleSubmit}
				>
					<ShoppingBag className='inline-block mr-1' size={20}/>
          إشتري الآن
				</button>

				<div className='flex items-center justify-center gap-2'>
					<Link
						to='/'
						className='inline-flex items-center gap-2 text-sm font-medium text-red-400 underline hover:text-red-300 hover:no-underline'
					>
						<MoveLeft size={16} />
						واصل التسوق
					</Link>
					<span className='text-sm font-normal text-gray-800'>او</span>
				</div>
			</div>
		</div>
	);
};
export default OrderSummary;