import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { CheckCircle2 } from "lucide-react";

const ThankYouPage = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Check if the user arrived here legitimately via checkout state
  const isAuthorized = location.state?.success === true;

  useEffect(() => {
    // If someone tries to access via direct URL or refresh, redirect them home
    if (!isAuthorized) {
      navigate("/", { replace: true });
    }
    window.scrollTo(0, 0);
    document.title = "Art Tshirt | Merci pour votre achat";
  }, [isAuthorized, navigate]);

  // If not authorized, return null while redirecting to prevent a flash of content
  if (!isAuthorized) {
    return null;
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 mt-16 md:mt-10">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl border border-gray-100 p-8 text-center flex flex-col items-center space-y-6">
        
        {/* Success Icon */}
        <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center text-green-500">
          <CheckCircle2 size={50} strokeWidth={2.5} />
        </div>

        {/* Heading & Message */}
        <div className="space-y-2">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
            شكرا لك على طلبك!
          </h1>
          <p className="text-gray-500 text-sm sm:text-base leading-relaxed">
            تم استلام طلبك بنجاح وسنقوم بالتواصل معك قريبا لتأكيد الشحن.
          </p>
        </div>

        {/* OK Button */}
        <button
          type="button"
          onClick={() => navigate("/", { replace: true })}
          className="w-full py-3 px-6 bg-red-500 hover:bg-red-600 text-white font-bold rounded-xl transition-colors shadow-lg shadow-red-500/20"
        >
          حسناً (العودة للرئيسية)
        </button>

      </div>
    </div>
  );
};

export default ThankYouPage;