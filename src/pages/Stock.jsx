import { useContext, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ShoppingBasket, PlusCircle, ArrowBigDown, PackagePlus, Boxes,DiamondPlus, DollarSign} from "lucide-react";

import ProduitsPage from "../components/ProduitsPage";
import AjouterProduit from "../components/AjouterProduit";
import { MyContext } from "../App";
import AjouterAchat from "../components/AjouterAchat";
import AchatsPage from "../components/AchatsPage";
import AjouterVente from "../components/AjouterVente";
import Ventes from "../components/Ventes";

const stockTabs = [
  { id: "produits", label: "Produits", icon: ShoppingBasket },
  { id: "ajouter_produit", label: "Ajouter Produit", icon: PlusCircle },
  { id: "achats", label: "Achats", icon: Boxes },
  { id: "ajouter_achat", label: "Ajouter Achat", icon: PackagePlus },
  { id: "ventes", label: "Ventes", icon: DollarSign },
  { id: "ajouter_vente", label: "Ajouter Vente", icon: DiamondPlus },
];

const StockPage = () => {
  const { filter } = useParams();
  const nav = useNavigate();
  const context = useContext(MyContext);

  useEffect(() => {
    if (!context.isAdmin) {
      nav("/se_connecter_admin");
    }
  }, []);

  return (
    <div className="bg-white text-gray-900 rounded-xl shadow-md p-6 mt-12">
      <h2 className="text-2xl font-bold text-red-600 mb-6 pt-8 text-center">
        Stock Management
      </h2>

{/* Stock sub-menu */}
<div className="flex overflow-x-auto whitespace-nowrap mb-6 px-2 no-scrollbar">
  {stockTabs.map((tab) => (
    <Link
      key={tab.id}
      to={`/stock/${tab.id}`}
      className={`flex items-center justify-center px-4 py-2 mx-2 rounded-md transition-colors duration-200 flex-shrink-0
        ${
          filter === tab.id
            ? "bg-red-500 text-white shadow"
            : "bg-gray-200 text-gray-700 hover:bg-gray-300"
        }`}
    >
      <tab.icon className="h-5 w-5" />
      <span className="ml-2 hidden md:inline">{tab.label}</span>
    </Link>
  ))}
</div>


      {/* Content */}
      <div className="md:border md:border-gray-200 md:rounded-lg md:p-4 md:bg-gray-50">
        {filter === "produits" && <ProduitsPage />}
        {filter === "ajouter_produit" && <AjouterProduit />}
        {filter === "ajouter_achat" && <AjouterAchat />}
        {filter === "achats" && <AchatsPage />}
        {filter === "ajouter_vente" && <AjouterVente/>}
        {filter === "ventes" && <Ventes />}
      </div>
    </div>
  );
};

export default StockPage;
