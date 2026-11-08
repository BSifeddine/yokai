import { useEffect, useState } from "react";
import CategoryItem from "../components/CategoryItem";
import { firestore } from "../firebase";
import { collection, query, where, getDocs } from "firebase/firestore";
import FeaturedProducts from "../components/FeaturedProducts";
import Reviews from "../components/Reviews";
import image from "../../public/clothes.jpg";
import NotFound from "../components/NotFound";

const HomePage = () => {
  const [categories, setCategories] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    document.title = "Art Tshirt";
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const querySnapshot = await getDocs(collection(firestore, "categories"));
        const items = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setCategories(items);
      } catch (error) {
        console.error("Error fetching data: ", error);
      }
    };

    fetchData();
  }, []);


  useEffect(() => {
    if (categories) {
      setLoading(false);
    }
  }, [categories]);

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
    <div className="relative min-h-screen text-white overflow-hidden mt-14">

      {/* ✅ Full-Width Hero Banner */}
<section className="relative w-full h-[70vh] md:h-[80vh] shadow-lg overflow-hidden">
  {/* Background (black & white) */}
  <div
    className="absolute inset-0 bg-cover bg-center filter grayscale"
    style={{
      backgroundImage: `url(${image})`,
    }}
  />

        <div className="absolute inset-0 bg-black bg-opacity-60 flex flex-col justify-center items-center text-center px-4 sm:px-6">
          <h1
            className="text-2xl sm:text-4xl md:text-6xl font-bold mb-3 sm:mb-4 text-red-500"
            style={{
              WebkitTextStroke: "1px #000", // white outline
              paintOrder: "stroke fill",
              textShadow: "0 0 4px rgba(10,10,10,0.5)", // blurry glow
            }}
          >
            أفضل الألبسة الرجالية بلمسة عصرية
          </h1>

          <p className="text-sm sm:text-lg md:text-2xl text-gray-200 max-w-md sm:max-w-2xl mb-4 sm:mb-6 leading-relaxed">
            جودة عالية – أسعار مناسبة – شحن سريع إلى باب منزلك
          </p>
          <a
            href="/produits"
            className="bg-red-500 hover:bg-red-600 transition px-4 sm:px-6 py-2 sm:py-3 rounded-full text-sm sm:text-lg font-semibold shadow-md"
          >
            تسوق الآن
          </a>
        </div>
      </section>

      {/* ✅ Page Content (centered) */}
      <div className="relative z-10 max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-6 sm:py-10">
        <FeaturedProducts />

        {/* ✅ Categories after Featured */}
        <h2 className="text-center text-2xl sm:text-3xl md:text-5xl font-bold text-red-500 mt-12 sm:mt-16 mb-3 sm:mb-4">
          تصفح مختلف أصنافنا
        </h2>
        <p className="text-center text-base sm:text-lg md:text-xl font-semibold text-gray-700 mb-6 sm:mb-10">
          متجرنا يوفر ألبسة رجالية متنوعة
        </p>
        {categories ? (
          <div className="grid sm:hidden grid-cols-2 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4 mb-6 sm:mb-10">
            {categories?.map((category) => (
              <CategoryItem category={category} key={category.name} />
            ))}
          </div>
        ) : (
        <NotFound type={"categories"} />
        )}
        {categories ? (
          <div className="hidden sm:grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4 mb-6 sm:mb-10">
            {categories?.map((category) => (
              <CategoryItem category={category} key={category.name} />
            ))}
          </div>
        ) : (
          <NotFound type={"categories"} />
        )}

        {/* ✅ Reviews */}
        <h2 className="text-center text-2xl sm:text-3xl md:text-5xl font-bold text-red-500 mt-12 sm:mt-16 mb-3 sm:mb-4">
          تقييماتكم
        </h2>
        <p className="text-center text-base sm:text-lg md:text-xl font-semibold text-gray-700 mb-6 sm:mb-10">
          آراء عملائنا
        </p>
        <Reviews />
      </div>
    </div>
  );
};

export default HomePage;
