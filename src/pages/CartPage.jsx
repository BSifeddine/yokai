import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ShoppingCart } from "lucide-react";
import CartItem from "../components/CartItem";
import PeopleAlsoBought from "../components/PeopleAlsoBought";
import OrderSummary from "../components/OrderSummary";
import { useEffect, useState } from "react";

const CartPage = ({cart, setCart}) => {

    const [hasLoaded, setHasLoaded] = useState(false);

     // Save cart to localStorage
        const saveCartToLocalStorage = () => {
          localStorage.setItem("cart", JSON.stringify(cart));
        };
    
      // Load cart from localStorage
      const loadCartFromLocalStorage = () => {
        const storedCart = localStorage.getItem("cart");
        if (storedCart) {
          setCart(JSON.parse(storedCart));
        } else {
          localStorage.setItem("cart", JSON.stringify([]));
        }
        setHasLoaded(true);
      };
    
        // Delete a product by index
        const deleteProduct = (index) => {
          setCart((prevCart) => prevCart.filter((_, i) => i !== index));
        };
    
        useEffect(() => {
          if(hasLoaded){
              localStorage.setItem("cart", JSON.stringify(cart));
            }
        }, [cart, hasLoaded]);
    
        useEffect(() => {
        loadCartFromLocalStorage();
        }, []);

    useEffect(() => {
        document.title = "Art Tshirt | Panier"
        window.scrollTo(0, 0);
      }, []); 

    if (!hasLoaded) {
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
        <div className='mb-6 mt-20 md:mt-14'>
            <div className='mx-auto max-w-screen-xl px-4 2xl:px-0 md:flex md:flex-col md:items-center'>
                <div className='md:w-3/4 mt-6 sm:mt-8 md:gap-6 lg:flex lg:items-start xl:gap-8 md:flex md:justify-between'>
                    <div className="md:w-4/5">
                        {cart?.length === 0 ? (
                            <EmptyCartUI />
                        ) : (
                            <div className='space-y-2'>
                                <div className="flex flex-row justify-end gap-2 items-cente mb-4">
                                    <div className="flex justify-center w-7 h-7 rounded-lg items-center mt-1 bg-gray-900">
                                        <ShoppingCart className='font-bold p-1' size={25} color="white"/>
                                    </div>
                                    <h2 className="text-gray-900 font-bold text-2xl">سلة المشتريات</h2>
                                </div>
                                {cart.map((item, index) => (
                                    <CartItem 
                                        key={`${item.name}-${item.taille}-${item.color}-${index}`} 
                                        item={item} 
                                        index={index} 
                                        deleteProduct={deleteProduct} 
                                    />
                                ))}
                            </div>
                        )}
                    </div>
                        {cart?.length > 0 && (
                            <div className='mx-auto mt-6 md:w-1/2 max-w-4xl space-y-6 lg:mt-0 lg:w-full'>
                                <OrderSummary cart={cart} setCart={setCart}/>
                            </div>
                        )}

                </div>
                        <PeopleAlsoBought />
            </div>
        </div>
    );
};
export default CartPage;

const EmptyCartUI = () => (
    <div
        className='flex flex-col items-center justify-center space-y-4 py-16'
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
    >
        <ShoppingCart className='h-24 w-24 text-gray-500' />
        <h3 className='text-2xl font-semibold '>سلتك فارغة</h3>
        <p className='text-gray-500'>يبدو أنك لم تضف اي منتجات الى السلة بعد</p>
        <Link
            className='mt-4 font-bold rounded-md bg-red-500 px-6 py-2 text-white transition-colors hover:bg-red-600'
            to='/'
        >
            إبدأ التسوق
        </Link>
    </div>
);