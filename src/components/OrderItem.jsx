import { deleteDoc, doc, updateDoc } from "firebase/firestore";
import { Trash } from "lucide-react";
import React, { useState } from "react";
import { firestore } from "../firebase";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import ConfirmModal from "./ConfirmModal";

function OrderItem({ order, refresh, index, total }) {
  const etats = [
    "Non confirmé",
    "Confirmé",
    "En livraison",
    "Livré",
    "Retour",
    "Ne reponds pas",
    "Reporté",
    "Non disponible",
    "Annulé"
  ];

  const nav = useNavigate();
  const [newEtat, setNewEtat] = useState(order.etat);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);

  const borderColors = {
    "Non confirmé": "border-gray-600 bg-gray-500",
    Retour: "border-red-700 bg-red-600",
    Livré: "border-green-700 bg-green-600",
    "En livraison": "border-teal-800 bg-teal-700",
    Confirmé: "border-orange-600 bg-orange-500",
    "Ne reponds pas": "border-purple-600 bg-purple-500",
    Reporté: "border-yellow-600 bg-yellow-500",
    "Non disponible": "border-orange-900 bg-orange-950",
    Annulé: "border-red-500 bg-red-400",
  };

  async function handleEtat(e) {
    e.stopPropagation(); // ✅ prevent row click
    const docRef = doc(firestore, "orders", order.id);
    setNewEtat(e.target.value);
    try {
      await updateDoc(docRef, {
        etat: e.target.value,
      });
      toast.success(e.target.value);
    } catch (error) {
      console.error("Error updating document: ", error);
    }
  }

  const borderClass = borderColors[newEtat] || "";

  return (
    <>
      <tr
        key={order.id}
        className="hover:bg-gray-100 cursor-pointer"
        onClick={() =>
          nav("/dashboard/details_commande", { state: { id: order.id } })
        }
      >
        <td width="5%" className="px-6 py-4 text-center">
          <div className="text-sm text-gray-800">{total - index}</div>
        </td>

        <td className="px-6 py-4 whitespace-nowrap">
          <div className="text-sm font-semibold text-gray-800 text-center">
            {order.name}
          </div>
        </td>

        <td className="px-6 py-4 whitespace-nowrap">
          <div className="text-sm font-semibold text-gray-800 text-center">
            {order.produit1}
          </div>
        </td>

        <td className="px-6 py-4 whitespace-nowrap">
          <div className="text-sm text-gray-800 text-center">{order.num}</div>
        </td>

        <td className="px-6 py-4 whitespace-nowrap">
          <div className="text-sm text-gray-800 text-center">
            {order.type_livraison === "sd" ? "" : order.commun + " / "}{" "}
            {order.wilaya}
          </div>
        </td>

        <td className="px-6 py-4 whitespace-nowrap">
          <div className="text-sm text-gray-800 text-center">
            {order.prix_total} DA
          </div>
        </td>

        <td className="px-6 py-4 whitespace-nowrap">
          <div className="text-sm text-white text-center font-semibold flex justify-center items-center">
            <div
              className={`py-1 px-2 rounded-md ${
                order.type_livraison === "sd" ? "bg-red-600" : "bg-emerald-700"
              }`}
            >
              {order.type_livraison === "sd" ? "SD" : "Domicile"}
            </div>
          </div>
        </td>

        <td
          className="px-6 py-4 whitespace-nowrap flex justify-center"
          onClick={(e) => e.stopPropagation()} // ✅ prevent row navigation
        >
          <select
            id="etat"
            name="etat"
            value={newEtat}
            onChange={handleEtat}
            className={`mt-1 block w-6/7 bg-gray-700 rounded-md
                shadow-sm py-1 text-white focus:outline-none 
                text-sm border-2
                ${borderClass}`}
          >
            <option value="" disabled>
              {order.etat}
            </option>
            {etats?.map((etat) => (
              <option key={etat} value={etat}>
                {etat}
              </option>
            ))}
          </select>
        </td>
      </tr>

    </>
  );
}

export default OrderItem;
