import { doc, getDoc, deleteDoc, updateDoc, getDocs, collection } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { firestore } from "../firebase";
import { Edit, Trash2, X, Save, Check, PrinterIcon } from "lucide-react";
import toast from "react-hot-toast";
import ConfirmModal from "../components/ConfirmModal";
import axios from 'axios'

function DetailCommande() {

  const location = useLocation();
  const navigate = useNavigate();
  const { id } = location.state || {};

  const [order, setOrder] = useState(null);
  const [editedOrder, setEditedOrder] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [date, setDate] = useState(null);
  const [strDate, setStrDate] = useState("");
  const [products, setProducts] = useState([])
  const [openDropdown, setOpenDropdown] = useState(null);

  const [note, setNote] = useState(order?.note || "");
  const [newNote, setNewNote] = useState("");

  const handleAddNote = async () => {
    if (!editedOrder?.note?.trim()) {
      toast.error("Veuillez saisir une note avant d'ajouter !");
      return;
    }

    try {
      const docRef = doc(firestore, "orders", id);
      await updateDoc(docRef, editedOrder);
      fetchData()
      toast.success("Commande mise à jour ✅");
    } catch (error) {
      console.error("Error updating document: ", error);
      toast.error("Erreur lors de la mise à jour ❌");
    }
  };

    const fetchProducts = async () => {
    try {
      const querySnapshot = await getDocs(collection(firestore, "produits"));
      const products = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setProducts(products);
    } catch (error) {
      console.error("Error fetching products: ", error);
    }
  };

  useEffect(() => {
    fetchProducts();
  },[])
  
	const colors = [
	  { name: 'black', class: "bg-black"},
	  { name: 'white', class: 'bg-white'},
	  { name: 'grey', class: 'bg-gray-400'},
	  { name: 'red', class: 'bg-red-600' },
	  { name: 'green', class: 'bg-green-700' },
	  { name: 'blue', class: 'bg-blue-600' },
	  { name: 'rose', class: 'bg-rose-950'},
	  { name: 'yellow', class: 'bg-yellow-500' },
	  { name: 'bleu_nuit', class: 'bg-blue-950' },
	  { name: 'beige', class: 'bg-yellow-100' },
	  { name: 'cyan', class: 'bg-cyan-300' },
	  { name: 'gray', class: 'bg-gray-700' },
	];


  const deleteOrder = async () => {
    try {
      const docRef = doc(firestore, "orders", id);
      await deleteDoc(docRef);
      toast.success("La commande a été supprimée ✅");
      navigate("/dashboard/commandes");
    } catch (error) {
      console.error("Error deleting document: ", error);
      toast.error("Erreur lors de la suppression ❌");
    } finally {
      setIsConfirmOpen(false);
    }
  };

  const fetchData = async () => {
    try {
      const docRef = doc(firestore, "orders", id);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setOrder({ id: docSnap.id, ...docSnap.data() });
      }
    } catch (error) {
      console.error("Error fetching data: ", error);
    }
  };

  const updateOrder = async () => {
    try {
      const docRef = doc(firestore, "orders", id);
      await updateDoc(docRef, editedOrder);
      setOrder(editedOrder);
      setIsEditing(false);
      toast.success("Commande mise à jour ✅");
    } catch (error) {
      console.error("Error updating document: ", error);
      toast.error("Erreur lors de la mise à jour ❌");
    }
  };

  useEffect(() => {
    fetchData();
  }, [id]);

  useEffect(() => {
    if (order?.timestamp) {
      setDate(order.timestamp.toDate());
    }
  }, [order]);

  useEffect(() => {
    if (date) setStrDate(date.toLocaleString());
  }, [date]);

  useEffect(() => {
    document.title = "Détails commande";
  }, []);

  // Auto quantity calculation
  const getQuantity = (obj) => {
    return [1, 2, 3, 4, 5].filter((i) => obj?.[`produit${i}`]).length;
  };

  return (
    <>
      {order && (
        <div className="bg-white shadow-lg rounded-lg p-6 mb-8 max-w-4xl mx-auto">
          <h2 className="text-2xl font-semibold mb-6 text-orange-600 text-center">
            Détails de la commande
          </h2>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full divide-y divide-gray-200">
              <tbody className="bg-white divide-y divide-gray-200 text-gray-800">
                <tr>
                  <td className="px-4 py-3 font-medium w-1/3">Nom</td>
                  <td className="px-4 py-3">
                    {isEditing ? (
                      <input
                        className="border rounded p-1 w-full"
                        value={editedOrder?.name || ""}
                        onChange={(e) =>
                          setEditedOrder({ ...editedOrder, name: e.target.value })
                        }
                      />
                    ) : (
                      order?.name
                    )}
                  </td>
                </tr>
                <tr>
                  <td className="px-4 py-3 font-medium">Numéro</td>
                  <td className="px-4 py-3">
                    {isEditing ? (
                      <input
                        className="border rounded p-1 w-full"
                        value={editedOrder?.num || ""}
                        onChange={(e) =>
                          setEditedOrder({ ...editedOrder, num: e.target.value })
                        }
                      />
                    ) : (
                      order?.num
                    )}
                  </td>
                </tr>
                <tr>
                  <td className="px-4 py-3 font-medium">Adresse</td>
                  <td className="px-4 py-3">
                    {isEditing ? (
                      <div className="flex gap-2">
                        <input
                          className="border rounded p-1 flex-1"
                          placeholder="Wilaya"
                          value={editedOrder?.wilaya || ""}
                          onChange={(e) =>
                            setEditedOrder({
                              ...editedOrder,
                              wilaya: e.target.value,
                            })
                          }
                        />
                        <input
                          className="border rounded p-1 flex-1"
                          placeholder="Commune"
                          value={editedOrder?.commun || ""}
                          onChange={(e) =>
                            setEditedOrder({
                              ...editedOrder,
                              commun: e.target.value,
                            })
                          }
                        />
                      </div>
                    ) : (
                      <>
                        {order?.wilaya}{" "}
                        {order?.commun !== "" && " / " + order?.commun}
                      </>
                    )}
                  </td>
                </tr>
                <tr>
                  <td className="px-4 py-3 font-medium">Livraison</td>
                  <td className="px-4 py-3 flex flex-wrap gap-3 items-center">
                    {isEditing ? (
                      <>
                        <select
                          className="border rounded p-1"
                          value={editedOrder?.type_livraison || ""}
                          onChange={(e) =>
                            setEditedOrder({
                              ...editedOrder,
                              type_livraison: e.target.value,
                            })
                          }
                        >
                          <option value="sd">SD</option>
                          <option value="domicile">Domicile</option>
                        </select>
                        <input
                          type="number"
                          className="border rounded p-1 w-24"
                          value={editedOrder?.montant_livraison || ""}
                          onChange={(e) =>
                            setEditedOrder({
                              ...editedOrder,
                              montant_livraison: e.target.value,
                            })
                          }
                        />
                      </>
                    ) : (
                      <>
                        <span
                          className={`px-3 py-1 rounded-md text-white font-semibold text-sm ${
                            order?.type_livraison === "sd"
                              ? "bg-red-600"
                              : "bg-emerald-600"
                          }`}
                        >
                          {order?.type_livraison === "sd" ? "SD" : "Domicile"}
                        </span>
                        <span className="px-3 py-1 rounded-md border border-gray-300 text-sm">
                          {order?.montant_livraison} DA
                        </span>
                      </>
                    )}
                  </td>
                </tr>
                <tr>
                  <td className="px-4 py-3 font-medium">Quantité</td>
                  <td className="px-4 py-3">
                    {getQuantity(isEditing ? editedOrder : order)}
                  </td>
                </tr>

{/* Produits */}
                {[1, 2, 3, 4, 5].map(
                  (i) =>
                    (isEditing || order?.[`produit${i}`]) && (
                      <tr key={i}>
                        <td className="px-4 py-3 font-medium">Produit {i}</td>
                        <td className="px-4 py-3 flex flex-wrap gap-3 items-center">
                          {isEditing ? (
                            <>
                              {/* 🔥 Produit select */}
                              <select
                                className="border rounded p-1"
                                value={editedOrder?.[`produit${i}`] || ""}
                                onChange={(e) =>
                                  setEditedOrder({
                                    ...editedOrder,
                                    [`produit${i}`]: e.target.value,
                                  })
                                }
                              >
                                <option value="">{order?.[`produit${i}`]}</option>
                                {products.map((p) => (
                                  <option key={p.id} value={p.name}>
                                    {p.name}
                                  </option>
                                ))}
                              </select>

                              {/* Taille */}
                              <input
                                className="border rounded p-1 w-16"
                                placeholder="Taille"
                                value={editedOrder?.[`taille${i}`] || ""}
                                onChange={(e) =>
                                  setEditedOrder({
                                    ...editedOrder,
                                    [`taille${i}`]: e.target.value,
                                  })
                                }
                              />

                              {/* Color */}
                              <div className="relative">
                                <button
                                  type="button"
                                  className="border rounded p-1 flex items-center gap-2"
                                  onClick={() =>
                                    setOpenDropdown(openDropdown === i ? null : i)
                                  }
                                >
                                  {editedOrder?.[`color${i}`] ? (
                                    <span
                                      className={`h-5 w-5 rounded-full border 
                                        ${editedOrder[`color${i}`] == "black" ? "bg-black" : 
                                      	  editedOrder[`color${i}`] == 'white'? 'bg-white':
                                          editedOrder[`color${i}`] == 'grey' ? 'bg-gray-400':
                                          editedOrder[`color${i}`] == 'red' ? 'bg-red-600' :
                                          editedOrder[`color${i}`] == 'green' ? 'bg-green-700' :
                                          editedOrder[`color${i}`] == 'blue' ?  'bg-blue-600' :
                                          editedOrder[`color${i}`] == 'rose' ? 'bg-rose-950':
                                          editedOrder[`color${i}`] == 'yellow' ? 'bg-yellow-500' :
                                          editedOrder[`color${i}`] == 'bleu_nuit' ? 'bg-blue-950' :
                                          editedOrder[`color${i}`] == 'beige' ? 'bg-yellow-100' :
                                          editedOrder[`color${i}`] == 'cyan' ? 'bg-cyan-300' :
                                          editedOrder[`color${i}`] == 'gray' ? 'bg-gray-700' : ""}`}
                                    ></span>
                                  ) : (
                                    <span className="text-gray-400">
                                      Choisir...
                                    </span>
                                  )}
                                </button>

                                {openDropdown === i && (
                                  <div className="absolute z-10 mt-1 bg-white border rounded shadow-md">
                                    {colors.map((c) => (
                                      <div
                                        key={c.name}
                                        className="flex items-center gap-2 px-2 py-1 cursor-pointer hover:bg-gray-100"
                                        onClick={() => {
                                          setEditedOrder({
                                            ...editedOrder,
                                            [`color${i}`]: c.name,
                                          });
                                          setOpenDropdown(null);
                                        }}
                                      >
                                        <span
                                          className={`h-5 w-5 rounded-full border ${c.class}`}
                                        ></span>
                                        <span>{c.name}</span>
                                      </div>
                                    ))}
                                  </div>
                                )}
                              </div>
                            </>
                          ) : (
                            <>
                              <span className="px-3 py-2 bg-gray-100 border border-gray-300 rounded-md text-sm">
                                {order?.[`produit${i}`]}
                              </span>
                              <span className="h-7 w-12 flex justify-center items-center rounded-full border border-gray-300 text-sm">
                                {order?.[`taille${i}`]}
                              </span>
                              <span
                                className={`h-7 w-7 flex justify-center items-center rounded-full border border-gray-300 
                                  ${order[`color${i}`] == "black" ? "bg-black" : 
                                      	  order[`color${i}`] == 'white'? 'bg-white':
                                          order[`color${i}`] == 'grey' ? 'bg-gray-400':
                                          order[`color${i}`] == 'red' ? 'bg-red-600' :
                                          order[`color${i}`] == 'green' ? 'bg-green-700' :
                                          order[`color${i}`] == 'blue' ?  'bg-blue-600' :
                                          order[`color${i}`] == 'rose' ? 'bg-rose-950':
                                          order[`color${i}`] == 'yellow' ? 'bg-yellow-500' :
                                          order[`color${i}`] == 'bleu_nuit' ? 'bg-blue-950' :
                                          order[`color${i}`] == 'beige' ? 'bg-yellow-100' :
                                          order[`color${i}`] == 'cyan' ? 'bg-cyan-300' :
                                          order[`color${i}`] == 'gray' ? 'bg-gray-700' : ""}`}
                              ></span>
                            </>
                          )}
                        </td>
                      </tr>
                    )
                )}
                <tr>
                  <td className="px-4 py-3 font-medium">Prix total</td>
                  <td className="px-4 py-3">
                    {isEditing ? (
                      <input
                        type="number"
                        className="border rounded p-1 w-24"
                        value={editedOrder?.prix_total || ""}
                        onChange={(e) =>
                          setEditedOrder({
                            ...editedOrder,
                            prix_total: e.target.value,
                          })
                        }
                      />
                    ) : (
                      `${order?.prix_total} DA`
                    )}
                  </td>
                </tr>
                <tr>
                  <td className="px-4 py-3 font-medium">Date</td>
                  <td className="px-4 py-3">{strDate}</td>
                </tr>
                <tr>
                  <td className="px-4 py-3 font-medium">État</td>
                  <td className="px-4 py-3">
                      {order?.etat}
                  </td>
                </tr>
<tr>
      <td className="px-4 py-3 font-medium">Note</td>
      <td className="px-4 py-3">
        {order?.note ? (
          <div className="flex items-center gap-2">
            {isEditing ? (
              <>
                <input
                  type="text"
                  value={editedOrder?.note || ""}
                     onChange={(e) =>
                          setEditedOrder({
                            ...editedOrder,
                            note: e.target.value,
                          })
                        }
                  className="border rounded-lg px-2 py-1 focus:outline-none focus:ring-2 focus:ring-orange-600"
                />
              </>
            ) : (
              <>
                <span>{order?.note}</span>
              </>
            )}
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <input
              type="text"
              placeholder="Ajouter une note..."
              value={editedOrder?.note || ""}
              onChange={(e) =>
                          setEditedOrder({
                            ...editedOrder,
                            note: e.target.value,
                          })
                        }
              className="border rounded-lg px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              onClick={handleAddNote}
              className="bg-gray-200 text-gray-800 px-3 py-1 rounded-lg hover:bg-gray-300 transition"
            >
              Ajouter note
            </button>
          </div>
        )}
      </td>
    </tr>
              </tbody>
            </table>
          </div>

          {/* Actions */}
          <div className="flex flex-row justify-center items-center gap-4 mt-6">
            {isEditing ? (
              <>
                <button
                  onClick={updateOrder}
                  className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-lg text-sm"
                >
                  <Save size={18} />
                  Enregistrer
                </button>
                <button
                  onClick={() => {
                    setIsEditing(false);
                    setEditedOrder(order);
                  }}
                  className="flex items-center gap-2 bg-gray-500 hover:bg-gray-600 text-white font-semibold py-2 px-4 rounded-lg text-sm"
                >
                  <X size={18} />
                  Annuler
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => {
                    setIsEditing(true);
                    setEditedOrder(order);
                  }}
                  className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white font-semibold py-2 px-4 rounded-lg text-sm"
                >
                  <Edit size={18} />
                  <span className="hidden sm:block">Modifier</span>
                </button>
                <button
                  onClick={() => setIsConfirmOpen(true)}
                  className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded-lg text-sm"
                >
                  <Trash2 size={18} />
                  <span className="hidden sm:block">Supprimer</span>
                </button>
              </>
            )}
          </div>
        </div>
      )}

      {/* Confirm Modal */}
      <ConfirmModal
        isOpen={isConfirmOpen}
        onClose={() => {
          setIsConfirmOpen(false);
          toast("Suppression annulée ❌", { icon: "⚠️" });
        }}
        onConfirm={deleteOrder}
        title="Supprimer la commande"
        message="Êtes-vous sûr de vouloir supprimer cette commande ? Cette action est irréversible."
        confirmText="Supprimer"
        cancelText="Annuler"
        confirmColor="bg-red-500 hover:bg-red-600"
      />
    </>
  );
}

export default DetailCommande;
