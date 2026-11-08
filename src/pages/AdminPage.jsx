import { 
  BarChart, 
  BadgePlus, 
  BoxIcon, 
  LayoutGrid, 
  FilePlus, 
  PlusCircle, 
  ShoppingBasket,
  Boxes, // ✅ Import Boxes icon
  SearchIcon
} from "lucide-react";
import { useContext, useEffect, useState } from "react";
import { motion } from "framer-motion";

import AnalyticsTab from "../components/AnalyticsTab";
import CreateProductForm from "../components/CreateProductForm";
import ProductsList from "../components/ProductsList";
import CreateCategoryForm from "../components/CreateCategoryForm";
import CategoryList from "../components/CategoryList";
import DetailCommande from "../components/DetailCommande";
import { Link, useNavigate, useParams } from "react-router-dom";
import Orders from "../components/Orders";
import ProductEdit from "../components/ProductEdit";
import Search from "../components/Search";
import { MyContext } from "../App";

// ✅ Added Stock tab here
const tabs = [
	{ id: "stock", label: "Stock", icon: Boxes }, // ✅ New element
  { id: "commandes", label: "Commandes", icon: BoxIcon },
  { id: "ajouter_produit", label: "Ajouter Produit", icon: PlusCircle },
  { id: "ajouter_categorie", label: "Ajouter Category", icon: FilePlus },
  { id: "produits", label: "Produits", icon: ShoppingBasket },
  { id: "categories", label: "Catégories", icon: LayoutGrid },
  { id: "rechercher", label: "Rechercher", icon: SearchIcon },
  { id: "analytics", label: "Analytics", icon: BarChart },
];

const AdminPage = () => {
  const { filter } = useParams()
  const context = useContext(MyContext)
  const nav = useNavigate()

  useEffect(() => {
    if(!context.isAdmin){
      nav("/se_connecter_admin")
    }
  },[])

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []); 

  return (
    <>
      {context.isAdmin &&
      <div className='min-h-screen relative overflow-hidden mt-12'>
        <div className='relative z-10 container mx-auto px-4 pt-8 pb-8'>
          <h1
            className='text-4xl font-bold mb-8 text-red-500 text-center'
          >
            Admin Dashboard
          </h1>

          <div className='md:flex md:justify-center mb-8 hidden'>
            {tabs.map((tab) => (
              <Link
                key={tab.id}
                to={tab.id == "stock" ? `/stock/produits` : `/dashboard/${tab.id}`}
                className={`flex items-center px-4 py-2 mx-2 rounded-md transition-colors duration-200 ${
                  filter == tab.id
                    ? "bg-red-600 text-white"
                    : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                }`}
              >
                <tab.icon className='mr-2 h-5 w-5' />
                {tab.label}
              </Link>
            ))}
          </div>

<div className="flex justify-start mb-8 md:hidden overflow-x-auto scrollbar-hide px-2">
  {tabs.map((tab) => (
    <Link
      key={tab.id}
      to={tab.id == "stock" ? `/stock/produits` : `/dashboard/${tab.id}`}
      className={`flex items-center px-4 py-2 mr-2 rounded-md transition-colors duration-200 flex-shrink-0 ${
        filter == tab.id
          ? "bg-red-600 text-white"
          : "bg-gray-700 text-gray-300 hover:bg-gray-600"
      }`}
    >
      <tab.icon className="w-5 h-5" />
    </Link>
  ))}
</div>

          {filter === "ajouter_categorie" && <CreateCategoryForm />}
          {filter === "ajouter_produit" && <CreateProductForm />}
          {filter === "produits" && <ProductsList />}
          {filter === "analytics" && <AnalyticsTab />}
          {filter === "commandes" && <Orders />}
          {filter === "rechercher" && <Search />}
          {filter === "categories" && <CategoryList />}
          {filter === "modifier_produit" && <ProductEdit />}
          {filter === "details_commande" && <DetailCommande />}
        </div>
      </div>}
    </>
  );
};

export default AdminPage;
