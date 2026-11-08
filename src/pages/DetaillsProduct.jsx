import { ArrowDown, ArrowDownAZ, Check, ChevronDown, ChevronUp, ShoppingBag, ShoppingCart } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { wilayas } from '../wilayas';
import { livraisonSD } from '../livraisonSD';
import { livraisonDomicile } from '../livraisonDomicile';
import { firestore } from "../firebase";
import { collection, doc, getDoc, getDocs, addDoc, query, where } from 'firebase/firestore';
import ReviewItem from '../components/ReviewItem'; 
import FeaturedProducts from '../components/FeaturedProducts'; 
import { useParams } from 'react-router-dom';
import { supabase } from '../../supabaseClient';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function DetaillsProduct({ cart, setCart }) {
  const { id } = useParams();

  const [reviews, setReviews] = useState([]);
  const newWilayas = Object.keys(wilayas);
  
  const [imageURLs, setImageURLs] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);
  const [produit, setProduit] = useState({});
  const [loading, setLoading] = useState(true);
  const [communes, setCommunes] = useState([]);
  const [sd, setSd] = useState(0);
  const [domicile, setDomicile] = useState(0);

  const [prod1, setProd1] = useState({ taille1: "", color1: "" });
  const [prod2, setProd2] = useState({ taille2: "", color2: "" });
  const [prod3, setProd3] = useState({ taille3: "", color3: "" });

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

  const [hasLoaded, setHasLoaded] = useState(false);

  const loadCartFromLocalStorage = () => {
    const storedCart = localStorage.getItem("cart");
    if (storedCart) {
      setCart(JSON.parse(storedCart));
    } else {
      localStorage.setItem("cart", JSON.stringify([]));
    }
    setHasLoaded(true);
  };

const addProduct = (e) => {
    e.preventDefault();
    
    // Grab the first image URL available in your component state or product object
    // (Adjust 'imageURLs[0]' or 'produit.image' to match the exact variable name holding your image URL string)
    const firstImageUrl = (imageURLs && imageURLs.length > 0 ? imageURLs[0] : produit?.image) || "";

    if (parseInt(cart.length) + parseInt(formData.offer) <= 5) {
      if (formData.offer == 1) {
        if (prod1.taille1 && prod1.color1) {
          const product = {
            name: produit.name,
            taille: prod1.taille1,
            color: prod1.color1,
            price: produit.price,
            image: firstImageUrl, // <--- Saves the first image URL string
          };
          setCart((prevCart) => [...prevCart, product]);
          toast.success("تمت الاضافة الى السلة");
        } else {
          toast.warning("يرجى اختيار اللون والمقاس");
        }
      } else if (formData.offer == 2) {
        if (prod2.taille2 && prod2.color2 && prod1.taille1 && prod1.color1) {
          const product = {
            name: produit.name,
            taille: prod1.taille1,
            color: prod1.color1,
            price: produit.price,
            image: firstImageUrl,
          };
          const product2 = {
            name: produit.name,
            taille: prod2.taille2,
            color: prod2.color2,
            price: produit.price,
            image: firstImageUrl,
          };
          setCart((prevCart) => [...prevCart, product, product2]);
          toast.success("تمت الاضافة الى السلة");
        } else {
          toast.warning("يرجى اختيار اللون والمقاس");
        }
      } else {
        if (prod3.taille3 && prod3.color3 && prod2.taille2 && prod2.color2 && prod1.taille1 && prod1.color1) {
          const product = {
            name: produit.name,
            taille: prod1.taille1,
            color: prod1.color1,
            price: produit.price,
            image: firstImageUrl,
          };
          const product2 = {
            name: produit.name,
            taille: prod2.taille2,
            color: prod2.color2,
            price: produit.price,
            image: firstImageUrl,
          };
          const product3 = {
            name: produit.name,
            taille: prod3.taille3,
            color: prod3.color3,
            price: produit.price,
            image: firstImageUrl,
          };
          setCart((prevCart) => [...prevCart, product, product2, product3]);
          toast.success("تمت الاضافة الى السلة");
        } else {
          toast.warning("يرجى اختيار اللون والمقاس");
        }
      }
    } else {
      toast.error("لا يمكن اضافة المزيد الى السلة");
    }
  };

  useEffect(() => {
    if (hasLoaded) {
      localStorage.setItem("cart", JSON.stringify(cart));
    }
  }, [cart, hasLoaded]);

  useEffect(() => {
    loadCartFromLocalStorage();
  }, []);

  useEffect(() => {
    const fetchDocument = async () => {
      try {
        const docRef = doc(firestore, 'produits', id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setProduit(docSnap.data());
        } else {
          console.log("No such document!");
        }
      } catch (error) {
        console.error("Error fetching document:", error);
      }
    };

    if (id) {
      fetchDocument();
    }
  }, [id]);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const q = query(
          collection(firestore, 'produit_reviews'),
          where('produit', '==', id)
        );

        const querySnapshot = await getDocs(q);
        const reviewsList = [];
        querySnapshot.forEach((doc) => {
          reviewsList.push({ id: doc.id, ...doc.data() });
        });

        setReviews(reviewsList);
      } catch (error) {
        console.error('Error fetching Reviews:', error);
      }
    };
    
    fetchReviews();
  }, [id]);

  useEffect(() => {
    if (formData.offer == 1) {
      setProd2({ taille2: "", color2: "" });
      setFormData({ ...formData, prix: produit.price });
      setProd3({ taille3: "", color3: "" });
    } else if (formData.offer == 2) {
      setProd3({ taille3: "", color3: "" });
      setFormData({ ...formData, prix: produit.offer2 });
    } else {
      setFormData({ ...formData, prix: produit.offer3 });
    }
  }, [formData.offer]);

  useEffect(() => {
    setFormData({ ...formData, prix: produit.price, prix_total: produit.price });
  }, [produit]);

  useEffect(() => {
    setFormData({ ...formData, prix_total: parseInt(formData.prix || 0) + parseInt(formData.montant_livraison || 0) });
  }, [formData.prix, formData.montant_livraison]);

  // Fetch product images from Supabase
  useEffect(() => {
    const fetchImages = async () => {
      try {
        // 1. Direct match from Firestore document (stored as array on upload)
        if (produit.images && produit.images.length > 0) {
          setImageURLs(produit.images);
          return;
        }

        // 2. Fallback filter for files in the 'products' bucket matching product name
        if (produit.name) {
          const { data, error } = await supabase.storage
            .from('products')
            .list();

          if (error) {
            console.error("Error listing Supabase files:", error);
            return;
          }

          if (data) {
            const cleanProdName = produit.name.replace(/[^a-zA-Z0-9_.-]/g, '_').toLowerCase();
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

    if (produit?.name) {
      fetchImages();
    }
  }, [produit]);

  useEffect(() => {
    if (imageURLs.length > 0) {
      setSelectedImage(imageURLs[0]);
    }
  }, [imageURLs]);

  useEffect(() => {
    setCommunes(wilayas[formData.wilaya] || []);
    setSd(livraisonSD[formData.wilaya] || 0);
    setDomicile(livraisonDomicile[formData.wilaya] || 0);
    setFormData({ ...formData, commun: "" });
  }, [formData.wilaya]);

  useEffect(() => {
    if (formData.type_livraison == "domicile") {
      setFormData((prev) => ({ ...prev, type_livraison: "domicile", montant_livraison: domicile }));
    } else {
      setFormData((prev) => ({ ...prev, type_livraison: "sd", montant_livraison: sd }));
    }
  }, [domicile, sd]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleChangeProd1 = (e) => {
    setProd1({ ...prod1, [e.target.name]: e.target.value });
  };
  const handleChangeProd2 = (e) => {
    setProd2({ ...prod2, [e.target.name]: e.target.value });
  };
  const handleChangeProd3 = (e) => {
    setProd3({ ...prod3, [e.target.name]: e.target.value });
  };

  useEffect(() => {
    if (produit?.name) {
      document.title = `${produit.name}`;
    }
  }, [produit]);

  useEffect(() => {
    document.title = "Art Tshirt";
    window.scrollTo(0, 0);
  }, []); 

  useEffect(() => {
    if (imageURLs.length > 0 && produit) {
      setLoading(false);
    }
  }, [imageURLs, produit]);

  const validation = () => {
    if (formData.name.length == 0 || formData.num.length == 0) {
      toast.error("الرجاء ادخال معلوماتك الشخصية");
      return false;
    } else if (formData.name.length < 4) {
      toast.warning("الرجاء التأكد من الإسم");
      return false;
    } else if (formData.num.length != 10) {
      toast.warning("الرجاء التأكد من رقم الهاتف");
      return false; 
    } else if (formData.wilaya == "") {
      toast.warning("الرجاء اختيار الولاية");
      return false;
    } else if (formData.type_livraison == "domicile" && formData.commun == "") {
      toast.warning("الرجاء اختيار البلدية");
      return false; 
    } else if (prod1.taille1 == "" || prod1.color1 == "") {
      toast.warning("الرجاء اختيار اللون والمقاس");
      return false; 
    } else if (formData.offer == 2 && (prod2.taille2 == "")) {
      toast.warning("الرجاء اختيار اللون والمقاس للقطعة الثانية");
      return false;
    } else if (formData.offer == 3 && (prod3.taille3 == "")) {
      toast.warning("الرجاء اختيار اللون والمقاس للقطعة الثالثة");
      return false;
    } else {
      toast.success("تم الشراء بنجاح");
      return true;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (validation()) {
      if (formData.offer == 1) {
        await addDoc(collection(firestore, "orders"), {
          produit1: produit.name,
          name: formData.name,
          num: formData.num,
          wilaya: formData.wilaya,
          commun: formData.commun,
          offer: formData.offer,
          taille1: prod1.taille1,
          color1: prod1.color1,
          prix: formData.prix,
          type_livraison: formData.type_livraison,
          montant_livraison: formData.montant_livraison,
          prix_total: formData.prix_total,
          etat: "Non confirmé",
          note: "",
          timestamp: new Date(), 
        });
      } else if (formData.offer == 2) {
        await addDoc(collection(firestore, "orders"), {
          produit1: produit.name,
          produit2: produit.name,
          name: formData.name,
          num: formData.num,
          wilaya: formData.wilaya,
          commun: formData.commun,
          offer: formData.offer,
          taille1: prod1.taille1,
          color1: prod1.color1,
          taille2: prod2.taille2,
          color2: prod2.color2,
          prix: formData.prix,
          type_livraison: formData.type_livraison,
          montant_livraison: formData.montant_livraison,
          prix_total: formData.prix_total,
          etat: "Non confirmé",
          timestamp: new Date(), 
          note: "",
        });
      } else {
        await addDoc(collection(firestore, "orders"), {
          produit1: produit.name,
          produit2: produit.name,
          produit3: produit.name,
          name: formData.name,
          num: formData.num,
          wilaya: formData.wilaya,
          commun: formData.commun,
          offer: formData.offer,
          taille1: prod1.taille1,
          color1: prod1.color1,
          taille2: prod2.taille2,
          color2: prod2.color2,
          taille3: prod3.taille3,
          color3: prod3.color3,
          prix: formData.prix,
          type_livraison: formData.type_livraison,
          montant_livraison: formData.montant_livraison,
          prix_total: formData.prix_total,
          etat: "Non confirmé",
          timestamp: new Date(),
          note: "",
        });
      }

      setFormData({
        name: "",
        num: "",
        commun: "",
        wilaya: "",
        offer: 1,
        prix: produit?.price,
        type_livraison: 'domicile',
        montant_livraison: 0,
        prix_total: 0,
      });
      setProd1({ taille1: "", color1: "" });
      setProd2({ taille2: "", color2: "" });
      setProd3({ taille3: "", color3: "" });
    }
  };

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
    <div className="flex flex-wrap gap-10 w-full px-4 justify-center pt-8 pb-7 mt-12">
    <div className="flex w-full md:w-1/2 lg:w-2/5 relative flex-col overflow-hidden rounded-lg  items-end">
      <div className= "lg:mr-2 flex flex-col items-end">
        {produit.note && <div className='flex flex-row items-center justify-end pr-2 w-full'>
        <div className={`${produit.note == "عرض خاص" ? "bg-red-500 w-40" : "bg-red-500 w-28"} text-lg h-10 rounded-br-2xl rounded-tl-2xl font-bold text-white flex flex-row justify-center items-center`}>
          <p className="mb-1">{produit.note}</p>
        </div>
        </div>}
        <h2 className="text-center text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800 mb-3 mt-4">{produit?.name}</h2>
        
        <p style={{ whiteSpace: "pre-line" }} className="text-base sm:text-lg font-medium tracking-tight text-gray-600 text-end">
          {produit?.description}
        </p>
        <div className='flex items-center justify-center gap-3 md:mt-2'>
        {produit?.promotion > 0 &&
          <>
            <div className="bg-red-500 px-3 py-1 rounded-full mb-1">
                <p className='text-center text-lg text-white font-bold'>-{produit.promotion}%</p>
            </div>
            <div className='flex mb-1'>
                <p className='text-center text-lg line-through font-semibold text-gray-800'>دج</p>
                <p className='text-center text-lg line-through font-semibold text-gray-800'>{produit?.prix_promo}</p>
            </div>
          </>
        }
            <div className='flex'>
                <h2 className="text-center text-xl sm:text-1xl md:text-2xl font-bold text-red-500 mb-1">دج</h2>
                <h2 className="text-center text-xl sm:text-1xl md:text-2xl font-bold text-red-500 mb-1">{parseInt(produit?.price)}</h2>
            </div>
        </div>
        <p className="text-yellow-500 text-2xl mb-4 ">
				{"★".repeat(produit?.rating)}<span className="text-gray-300">{"★".repeat(5 - produit?.rating)}</span>{" "}
				</p>
      </div>
      {/* Phone Images */}
      <div className="md:hidden flex w-full relative mb-1 flex-col overflow-hidden rounded-lg items-center">
        <div className='w-full rounded-lg flex justify-center' style={{height: "60vh"}}>
        {imageURLs.length > 0 && selectedImage && 
          <img src={selectedImage} className="object-cover w-full lg:w-11/12 md:w-11/12 rounded-lg" />
        }
        </div>
        <div className='flex justify-center mt-3 gap-3 w-11/12'>
        {imageURLs?.map((url) => {
          return <img onClick={() => setSelectedImage(url)} className={`rounded-lg cursor-pointer ${url === selectedImage ? "w-12 h-11 border-2 border-red-500" : "w-11 h-10 "}`} src={url} alt="" />
        })}
        </div>
      </div> 

      <form
        onSubmit={handleSubmit}
        className="w-full bg-white p-6 rounded-lg shadow-lg mt-2 lg:mr-2"
      >
        <h2 className="text-2xl font-bold mb-6 text-gray-800 text-center">أطلب الآن</h2>

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
      
      {/* offer Input */}
        <div className="mb-4 flex flex-col items-end">
          <label htmlFor="name" className="block text-gray-700 text-sm font-bold mb-2">
          العروض 
          </label>
          <div className="flex flex-col gap-3 items-end">
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="radio"
                  name="offer"
                  value= {1}
                  checked={formData.offer == 1}
                  onChange={handleChange}
                  className="form-radio h-5 w-5 text-blue-600 hidden p-3"
                />
                <div className='flex flex-row justify-end gap-3'>
                  <div className='flex flex-row'>
                    <span className='text-gray-800'>دج</span>
                    <span className='text-gray-800'>{produit?.price}</span>
                  </div>
                    <span className='text-gray-800'> قطعة واحدة   </span>
                  <span
                    className={`h-8 w-8 md:h-7 md:w-7 flex justify-center items-center transition-all rounded-full border-2 ${
                      formData.offer == 1 ? 'shadow-lg bg-red-500 border-red-500' : 'border-gray-400'
                    }`}
                  >
                  {formData.offer == 1 && <Check color='white'/>}  
                  </span>
                </div>
              </label>
            {produit?.offer2 > 0 &&
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="radio"
                  name="offer"
                  value={2}
                  checked={formData.offer == 2}
                  onChange={handleChange}
                  className="form-radio h-5 w-5 text-blue-600 hidden p-3"
                />
                <div className='flex flex-row justify-end gap-3'>
                  <div className='flex flex-row'>
                    <span className='text-gray-800'>دج</span>
                    <span className='text-gray-800'>{produit?.offer2}</span>
                  </div>
                    <span className='text-gray-800'> قطعتين  </span>
                  <span
                    className={`h-8 w-8 md:h-7 md:w-7 flex justify-center items-center transition-all rounded-full border-2 ${
                      formData.offer == 2 ? 'shadow-lg bg-red-500 border-red-500' : 'border-gray-400'
                    }`}
                  >
                  {formData.offer == 2 && <Check color='white'/>}  
                  </span>
                </div>
              </label>
            }
            {produit?.offer3 > 0 &&
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="radio"
                  name="offer"
                  value={3}
                  checked={formData.offer == 3}
                  onChange={handleChange}
                  className="form-radio h-5 w-5 text-blue-600 hidden p-3"
                />
                <div className='flex flex-row justify-end gap-3'>
                  <div className='flex flex-row'>
                    <span className='text-gray-800'>دج</span>
                    <span className='text-gray-800'>{produit?.offer3}</span>
                  </div>
                    <span className='text-gray-800'> ثلاث قطع  </span>
                  <span
                    className={`h-8 w-8 md:h-7 md:w-7 flex justify-center items-center transition-all rounded-full border-2 ${
                      formData.offer == 3 ? 'shadow-lg bg-red-500 border-red-500' : 'border-gray-400'
                    }`}
                  >
                  {formData.offer == 3 && <Check color='white'/>}  
                  </span>
                </div>
              </label>
            }
          </div>
      </div>
      

      {/* First Piece */}
      <div className='flex flex-row justify-end gap-2 mb-3'>
      <div className='flex flex-col border-r-2 border-gray-400 pr-3'>
        {/* Color Input */}
        <div className="mb-4 flex flex-col items-end">
          <label htmlFor="name" className="block text-gray-800 text-sm font-bold mb-2">
          المقاس 
          </label>
          <div className="flex gap-1 items-center">
            {produit?.tailles.map((taille, index) => (
              <label key={index} className="flex items-center space-x-2 cursor-pointer text-gray-800">
                <input
                  type="radio"
                  name="taille1"
                  value={taille}
                  checked={prod1.taille1 === taille}
                  onChange={handleChangeProd1}
                  className="form-radio h-5 w-5 text-blue-600 hidden p-3"
                />
                <span
                  className={`h-6 w-10 md:h-7 md:w-11 md:text-md text-xs rounded-md border-2 flex justify-center items-center font-bold ${
                    prod1.taille1 === taille ? 'text-white bg-red-500 shadow-lg border-red-500' : 'border-gray-400'
                  }`} 
                >{taille}</span>
              </label>
            ))}
          </div>
      </div>

        {/* Size Input */}
        <div className="mb-4 flex flex-col items-end">
          <label htmlFor="name" className="block text-gray-800 text-sm font-bold mb-2">
          اللون
          </label>
          <div className="flex gap-1 items-center">
            {produit?.colors.map((color, index) => (
              <label key={index} className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="radio"
                  name="color1"
                  value={color}
                  checked={prod1.color1 === color}
                  onChange={handleChangeProd1}
                  className="form-radio h-5 w-5 text-blue-600 hidden p-3"
                />
                <span
                  className={`h-8 w-8 md:h-7 md:w-7 flex justify-center items-center rounded-full ${
                    prod1.color1 === color ? 'border-gray-800 shadow-[0px_0px_0px_2px_#ff6800]' : 'shadow-[0px_0px_0px_2px_rgba(0,_0,_0,_0.7)]'
                  } ${color == "black" || color == "white" ? "bg-" + color :
                     color == "green" ? "bg-green-700" : color == "blue" ? "bg-blue-600" :
                     color == "grey" ? "bg-gray-400" :
                     color == "rose" ? "bg-rose-950" :
                     color == "whitegreen" ? "border-4 border-green-600 bg-white" :
                     color == "greenwhite" ? "border-4 border-white bg-green-600" :
                     color == "blackwhite" ? "border-4 border-white bg-black" :
                     color == "blackgrenat" ? "border-4 border-rose-950 bg-black" :
                     color == "beigegrenat" ? "border-4 border-rose-950 bg-yellow-100" :
                     color == "bleu_nuit" ? "bg-blue-950":
                     color == "gray" ? "bg-gray-700" :
								     color == "cyan" ? "bg-cyan-300" :
                     color == "red" ? "bg-red-600"
                    : color == "beige" ? "bg-yellow-100" : "bg-" + color +"-500"} `}
                >
                {prod1.color1 === color && <Check color={color == "white" || color == "grey" || color == "beige" || color == "cyan"
                  || color == "whitegreen" || color == "beigegrenat" ? "black" : "white"}/>}  
                </span>
              </label>
            ))}
          </div>
      </div>
      </div>
      <div className='flex justify-center items-center w-3'>
        <span className='text-gray-800 font-bold text-md'>1</span>
      </div>
      </div>

      {/* Second Piece */}
      {formData.offer >= 2 && <>
        <div className='flex flex-row justify-end gap-2 mb-3'>
      <div className='flex flex-col border-r-2 border-gray-400 pr-3'>
        {/* Color Input */}
        <div className="mb-4 flex flex-col items-end">
          <label htmlFor="name" className="block text-gray-800 text-sm font-bold mb-2">
          المقاس 
          </label>
          <div className="flex gap-1 items-center">
            {produit?.tailles.map((taille, index) => (
              <label key={index} className="flex items-center space-x-2 cursor-pointer text-gray-800">
                <input
                  type="radio"
                  name="taille2"
                  value={taille}
                  checked={prod2.taille2 === taille}
                  onChange={handleChangeProd2}
                  className="form-radio h-5 w-5 text-blue-600 hidden p-3"
                />
                <span
                  className={`h-6 w-10 md:h-7 md:w-11 rounded-md border-2 flex md:text-md text-xs justify-center items-center font-bold ${
                    prod2.taille2 === taille ? 'text-white bg-red-500 shadow-lg border-red-500' : 'border-gray-400'
                  }`} 
                >{taille}</span>
              </label>
            ))}
          </div>
      </div>

        {/* Size Input */}
        <div className="mb-4 flex flex-col items-end">
          <label htmlFor="name" className="block text-gray-800 text-sm font-bold mb-2">
          اللون
          </label>
          <div className="flex gap-1 items-center">
            {produit?.colors.map((color, index) => (
              <label key={index} className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="radio"
                  name="color2"
                  value={color}
                  checked={prod2.color2 === color}
                  onChange={handleChangeProd2}
                  className="form-radio h-5 w-5 text-blue-600 hidden p-3"
                />
                <span
                  className={`h-8 w-8 md:h-7 md:w-7 flex justify-center items-center rounded-full border-2 ${
                    prod2.color2 === color ? 'border-gray-800 shadow-lg' : 'border-gray-400'
                  } ${color == "black" || color == "white" ? "bg-" + color :
                    color == "green" ? "bg-green-700" : color == "blue" ? "bg-blue-600" :
                    color == "grey" ? "bg-gray-400" :
                    color == "rose" ? "bg-rose-950" :
                    color == "bleu_nuit" ? "bg-blue-950":
                    color == "gray" ? "bg-gray-700" :
								    color == "cyan" ? "bg-cyan-300" :
                    color == "red" ? "bg-red-600"
                   : color == "beige" ? "bg-yellow-100" : "bg-" + color +"-500"} `}
                >
                {prod2.color2 === color && <Check color={color == "white" || color == "grey" || color == "cyan" || color == "beige" ? "black" : "white"}/>}  
                </span>
              </label>
            ))}
          </div>
      </div>
      </div>
      <div className='flex justify-center items-center w-3'>
        <span className='text-gray-800 font-bold text-md'>2</span>
      </div>
      </div>
      </>}

      {/* Third Piece */}
        {formData.offer == 3 && <>
          <div className='flex flex-row justify-end gap-2 mb-3'>
      <div className='flex flex-col border-r-2 border-gray-400 pr-3'>
        {/* Color Input */}
        <div className="mb-4 flex flex-col items-end">
          <label htmlFor="name" className="block text-gray-800 text-sm font-bold mb-2">
          المقاس
          </label>
          <div className="flex gap-1 items-center">
            {produit?.tailles.map((taille, index) => (
              <label key={index} className="flex items-center space-x-2 cursor-pointer text-gray-800">
                <input
                  type="radio"
                  name="taille3"
                  value={taille}
                  checked={prod3.taille3 === taille}
                  onChange={handleChangeProd3}
                  className="form-radio h-5 w-5 text-blue-600 hidden p-3"
                />
                <span
                  className={`h-6 w-10 md:h-7 md:w-11 rounded-md border-2 text-xs md:text-md flex justify-center items-center font-bold ${
                    prod3.taille3 === taille ? 'text-white bg-red-500 shadow-lg border-red-500' : 'border-gray-400'
                  }`} 
                >{taille}</span>
              </label>
            ))}
          </div>
      </div>

        {/* Size Input */}
        <div className="mb-4 flex flex-col items-end">
          <label htmlFor="name" className="block text-gray-800 text-sm font-bold mb-2">
          اللون
          </label>
          <div className="flex gap-1 items-center">
            {produit?.colors.map((color, index) => (
              <label key={index} className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="radio"
                  name="color3"
                  value={color}
                  checked={prod3.color3 === color}
                  onChange={handleChangeProd3}
                  className="form-radio h-5 w-5 text-blue-600 hidden p-3"
                />
                <span
                  className={`h-8 w-8 flex justify-center items-center rounded-full border-2 ${
                    prod3.color3 === color ? 'border-gray-800 shadow-lg' : 'border-gray-400'
                  } ${color == "black" || color == "white" ? "bg-" + color :
                    color == "green" ? "bg-green-700" : color == "blue" ? "bg-blue-600" :
                    color == "grey" ? "bg-gray-400" :
                    color == "rose" ? "bg-rose-950" :
                    color == "bleu_nuit" ? "bg-blue-950":
                    color == "gray" ? "bg-gray-700" :
								    color == "cyan" ? "bg-cyan-300" :
                    color == "red" ? "bg-red-600"
                   : color == "beige" ? "bg-yellow-100" : "bg-" + color +"-500"} `}
                >
                {prod3.color3 === color && <Check color={color == "white" || color == "cyan" ||color == "grey" || color == "beige" ? "black" : "white"}/>}  
                </span>
              </label>
            ))}
          </div>
      </div>
      </div>
      <div className='flex justify-center items-center w-3'>
        <span className='text-gray-800 font-bold text-md'>3</span>
      </div>
      </div>
      </>}

      <div className='w-full flex flex-col justify-between border border-gray-300 mb-4 cursor-pointer text-right px-5 py-2 bg-white rounded-md shadow-sm focus:outline-none '>
          <div className='flex flex-row items-center justify-between py-2'>       
            <div className='flex flex-row items-center justify-between gap-1 text-gray-800 font-semibold'>
              <p>دج</p>
              <p>{formData.prix}</p>
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
          <hr />
          <div className='flex flex-row items-center justify-between py-2'>       
            <div className='flex flex-row items-center justify-between gap-1 text-gray-800 font-bold'>
              {!formData.wilaya ? <>
              <p>التوصيل + </p>
              <p>دج</p>
              <p>{formData.prix}</p>
              </>
              : <>
              <p>دج</p>
              <p>{formData.prix_total}</p>
              </>
              }
            </div>
            <p className='text-gray-600 font-semibold'>السعر الكلي</p>
          </div>
      </div>

      <div className='flex flex-col gap-3'>
        {/* Submit Button */}
        <button
          type='submit'
          className="w-full flex items-center gap-1 justify-center bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded-lg focus:outline-none focus:shadow-outline"
        >
          <ShoppingBag className='inline-block mr-1' size={20}/>
          إشتري الآن
        </button>
        {/* Add To Cart Button */}
              <button type="button"
              onClick={addProduct}
          className="w-full flex items-center gap-1 justify-center bg-gray-700 md:bg-gray-700 hover:bg-gray-800 text-white font-bold py-2 px-4 rounded-lg focus:outline-none focus:shadow-outline"
        >
          <ShoppingCart className='inline-block mr-1' size={20}/>
          إضافة الى السلة
        </button>
      </div>
      </form>
    </div>
    {produit.m_tol && produit.m_poids && produit.l_tol && produit.l_poids &&
     <div className="p-4 md:hidden">
      <div className='flex flex-row justify-center items-center pb-5'>
        <h2 className='font-bold text-3xl'>المقاسات</h2>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white rounded-xl shadow">
          <thead>
            <tr className="text-center">
              <th className="p-3">الطول</th>
              <th className="p-3">الوزن</th>
              <th className="p-3">المقاس</th>
            </tr>
          </thead>
          <tbody>
            {produit.s_tol && produit.s_poids &&
              <tr
                className="border-t hover:bg-gray-50 transition-colors text-center"
              >
                <td className="p-3">{produit.s_tol}</td>
                <td className="p-3">{produit.s_poids}</td>
                <td className="p-3">S</td>
              </tr>
            }
            {produit.m_tol && produit.m_poids &&
              <tr
                className="border-t hover:bg-gray-50 transition-colors text-center"
              >
                <td className="p-3">{produit.m_tol}</td>
                <td className="p-3">{produit.m_poids}</td>
                <td className="p-3">M</td>
              </tr>
            }
            {produit.l_tol && produit.l_poids &&
              <tr
                className="border-t hover:bg-gray-50 transition-colors text-center"
              >
                <td className="p-3">{produit.l_tol}</td>
                <td className="p-3">{produit.l_poids}</td>
                <td className="p-3">L</td>
              </tr>
            }
            {produit.xl_tol && produit.xl_poids &&
              <tr
                className="border-t hover:bg-gray-50 transition-colors text-center"
              >
                <td className="p-3">{produit.xl_tol}</td>
                <td className="p-3">{produit.xl_poids}</td>
                <td className="p-3">XL</td>
              </tr>
            }
            {produit.xxl_tol && produit.xxl_poids &&
              <tr
                className="border-t hover:bg-gray-50 transition-colors text-center"
              >
                <td className="p-3">{produit.xxl_tol}</td>
                <td className="p-3">{produit.xxl_poids}</td>
                <td className="p-3">XXL</td>
              </tr>
            }
            {produit.xxxl_tol && produit.xxxl_poids &&
              <tr
                className="border-t hover:bg-gray-50 transition-colors text-center"
              >
                <td className="p-3">{produit.xxxl_tol}</td>
                <td className="p-3">{produit.xxxl_poids}</td>
                <td className="p-3">XXXL</td>
              </tr>
            }
          </tbody>
        </table>
      </div>
    </div>}
    {reviews.length > 0 &&
    <div className='flex w-full md:hidden flex-col justify-center items-center pb-5'>
        <h2 className='font-bold text-3xl pb-5'>اراء زبائننا</h2>
        <div className="flex flex-col gap-4 w-full">
        {reviews.map( (review , index)  => {
          return <ReviewItem index={index} review={review}/> 
        })}
        </div>
    </div>
    }
    <div className="md:flex hidden w-11/12 lg:w-2/5 relative flex-col overflow-hidden rounded-lg items-center">
        <div className='w-full rounded-lg flex justify-center' style={{height: "34vw"}}>
        {imageURLs.length > 0 && selectedImage && 
          <img src={selectedImage} alt={produit.name} className="object-cover md:w-10/12 rounded-lg w-full" />
        }
        </div>
        <div className='flex justify-center mt-3 gap-3 w-11/12'>
        {imageURLs?.map((url) => {
          return <img onClick={() => setSelectedImage(url)} className={`rounded-lg cursor-pointer ${url === selectedImage ? "w-12 h-11 border-2 border-red-500" : "w-11 h-10 "}`} src={url} alt="" />
        })}
        </div>
        {produit.m_tol && produit.m_poids && produit.l_tol && produit.l_poids &&
     <div className="p-4 hidden md:block">
      <div className='flex flex-row justify-center items-center pb-5'>
        <h2 className='font-bold text-3xl'>المقاسات</h2>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white rounded-xl shadow">
          <thead>
            <tr className=" text-center">
              <th className="p-3">الطول</th>
              <th className="p-3">الوزن</th>
              <th className="p-3">المقاس</th>
            </tr>
          </thead>
          <tbody>
            {produit.s_tol && produit.s_poids &&
              <tr
                className="border-t hover:bg-gray-50 transition-colors text-center"
              >
                <td className="p-3">{produit.s_tol}</td>
                <td className="p-3">{produit.s_poids}</td>
                <td className="p-3">S</td>
              </tr>
            }
            {produit.m_tol && produit.m_poids &&
              <tr
                className="border-t hover:bg-gray-50 transition-colors text-center"
              >
                <td className="p-3">{produit.m_tol}</td>
                <td className="p-3">{produit.m_poids}</td>
                <td className="p-3">M</td>
              </tr>
            }
            {produit.l_tol && produit.l_poids &&
              <tr
                className="border-t hover:bg-gray-50 transition-colors text-center"
              >
                <td className="p-3">{produit.l_tol}</td>
                <td className="p-3">{produit.l_poids}</td>
                <td className="p-3">L</td>
              </tr>
            }
            {produit.xl_tol && produit.xl_poids &&
              <tr
                className="border-t hover:bg-gray-50 transition-colors text-center"
              >
                <td className="p-3">{produit.xl_tol}</td>
                <td className="p-3">{produit.xl_poids}</td>
                <td className="p-3">XL</td>
              </tr>
            }
            {produit.xxl_tol && produit.xxl_poids &&
              <tr
                className="border-t hover:bg-gray-50 transition-colors text-center"
              >
                <td className="p-3">{produit.xxl_tol}</td>
                <td className="p-3">{produit.xxl_poids}</td>
                <td className="p-3">XXL</td>
              </tr>
            }
            {produit.xxxl_tol && produit.xxxl_poids &&
              <tr
                className="border-t hover:bg-gray-50 transition-colors text-center"
              >
                <td className="p-3">{produit.xxxl_tol}</td>
                <td className="p-3">{produit.xxxl_poids}</td>
                <td className="p-3">XXXL</td>
              </tr>
            }
          </tbody>
        </table>
      </div>
    </div>}
    {reviews.length > 0 &&
    <div className='hidden w-full md:flex flex-col justify-center items-center pt-4 pb-5'>
        <h2 className='font-bold text-3xl pt-4 pb-5'>اراء زبائننا</h2>
        <div className="flex flex-col gap-4 w-full">
        {reviews.map( (review , index)  => {
          return <ReviewItem index={index} review={review}/> 
        })}
        </div>
    </div>
    }
    </div>
    <FeaturedProducts />
    </div>
  )
}

export default DetaillsProduct