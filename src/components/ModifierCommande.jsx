import React, { useState } from "react";
import OrderItem from "./OrderItem";
import ConfirmModal from "./ConfirmModal";
import { Trash2 } from "lucide-react";

function Confirmes({ orders, refresh }) {
  const [selectedOrder, setSelectedOrder] = useState(null);

  const handleDeleteClick = (order) => {
    setSelectedOrder(order);
  };

  const handleConfirmDelete = () => {
    // 🔥 call your delete API here with selectedOrder.id
    console.log("Deleting order:", selectedOrder);
    setSelectedOrder(null);
    refresh(); // refresh orders after delete
  };

  return (
    <>
      <div className="overflow-x-auto rounded-lg shadow">
        <table className="w-full divide-y divide-gray-300">
          <thead className="bg-gray-100">
            <tr>
              <th
                scope="col"
                className="px-6 py-3 text-center text-xs font-semibold text-gray-800 uppercase tracking-wider"
              >
                #
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-center text-xs font-semibold text-gray-800 uppercase tracking-wider"
              >
                Nom
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-center text-xs font-semibold text-gray-800 uppercase tracking-wider"
              >
                Produit
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-center text-xs font-semibold text-gray-800 uppercase tracking-wider"
              >
                Numéro
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-center text-xs font-semibold text-gray-800 uppercase tracking-wider"
              >
                Adresse
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-center text-xs font-semibold text-gray-800 uppercase tracking-wider"
              >
                Prix total
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-center text-xs font-semibold text-gray-800 uppercase tracking-wider"
              >
                Type
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-center text-xs font-semibold text-gray-800 uppercase tracking-wider"
              >
                Etat
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-center text-xs font-semibold text-gray-800 uppercase tracking-wider"
              >
                Supprimer
              </th>
            </tr>
          </thead>

          <tbody className="bg-white divide-y divide-gray-200">
            {orders?.map((order, index) => (
              <tr key={order.id}>
                <td className="px-6 py-4 text-center text-gray-800">
                  {index + 1}
                </td>
                <OrderItem order={order} refresh={refresh} />

                {/* Delete action */}
                <td className="px-6 py-4 text-center">
                  <button
                    onClick={() => handleDeleteClick(order)}
                    className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-red-100 hover:bg-red-200 transition sm:px-3 sm:py-1 sm:rounded-md sm:w-auto sm:h-auto"
                  >
                    {/* Mobile: icon only */}
                    <Trash2 className="h-4 w-4 text-red-600 sm:mr-1" />
                    {/* Desktop: show text */}
                    <span className="hidden sm:inline text-red-600 font-medium">
                      Supprimer
                    </span>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Confirm Delete Modal */}
      <ConfirmModal
        isOpen={!!selectedOrder}
        onClose={() => setSelectedOrder(null)}
        onConfirm={handleConfirmDelete}
        title="Confirmation"
        message="Voulez-vous vraiment supprimer cette commande ?"
        confirmText="Supprimer"
        cancelText="Annuler"
        confirmColor="bg-red-500 hover:bg-red-600"
      />
    </>
  );
}

export default Confirmes;
