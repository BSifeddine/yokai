import { createContext, useEffect, useState } from 'react'
import { Route, Routes, useNavigate } from 'react-router-dom'
import NavBar from './components/NavBar'
import HomePage from './pages/HomePage'
import AdminPage from './pages/AdminPage'
import CategoryPage from './components/CategoryPage'
import CartPage from './pages/CartPage'
import DetaillsProduct from './pages/DetaillsProduct'
import Footer from './components/Footer'
import Products from './pages/Products'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import PageNotFound from './components/PageNotFound'
import Login from './components/Login'
import StockPage from './pages/Stock' 
import ThankYou from './pages/Thankyou'

export const MyContext = createContext();

function App() {

  const [isAdmin, setIsAdmin] = useState(false)
  const [reload, setReload] = useState(false)
  const nav = useNavigate()
  const [cart, setCart] = useState([])

  const [hasLoaded, setHasLoaded] = useState(false);
  
      // Load cart from localStorage
    const loadCartFromLocalStorage = () => {
      const storedCart = localStorage.getItem("cart");
      if (storedCart) {
        setCart(JSON.parse(storedCart));
      } else {
        localStorage.setItem("cart", JSON.stringify([]));
      }
      setHasLoaded(true)
    };

  useEffect(() => {

    const token = localStorage.getItem('userToken');
    
    if (token) {
      setIsAdmin(true)
    }
    loadCartFromLocalStorage()
  },[])

  return (
    <div className='min-h-scree bg-gray-100 relative overflow-hidden'>
      {/* Backgroud gradient */}

      <div className="relative z-20">
      <MyContext.Provider value={{ isAdmin, reload, setReload, setIsAdmin }}>
      <NavBar cart={cart} setCart={setCart}/>
      <Routes>
         <Route path='/' element={<HomePage />} />
         {isAdmin && <Route path='/dashboard/:filter' element={<AdminPage />}/>}
         <Route path='/categories/:category' element={<CategoryPage />} />
         <Route path='/panier' element={<CartPage cart={cart} setCart={setCart}/>} />
         <Route path='/produits' element={<Products />} />
         <Route path='/stock/:filter' element={<StockPage />} />
         <Route path='/produit/:id' element={<DetaillsProduct cart={cart} setCart={setCart}/>} />
         <Route path='/se_connecter_admin' element={<Login />} />
         <Route path="/thank-you" element={<ThankYou />} />
         <Route path='*' element={<PageNotFound />} />
      </Routes>
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
      <Footer />
      </MyContext.Provider>
      </div>
    </div>
  )
}

export default App
