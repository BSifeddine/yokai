import { useState, useEffect } from "react";
import { Pencil, Save, X, Trash2 } from "lucide-react";
import { firestore } from "../firebase";
import {query, orderBy } from "firebase/firestore";
import {
  collection,
  doc,
  getDocs,
  updateDoc,
  deleteDoc,
} from "firebase/firestore";
import ConfirmModal from "../components/ConfirmModal";

const Ventes = () => {
  const [ventes, setVentes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [editedVente, setEditedVente] = useState({});
  const [deleteTarget, setDeleteTarget] = useState(null);

  // Fetch ventes
  useEffect(() => {

const fetchVentes = async () => {
  try {
    // Create a query that orders by "date" descending (newest first)
    const ventesQuery = query(
      collection(firestore, "ventes"),
      orderBy("date", "desc")
    );

    const querySnapshot = await getDocs(ventesQuery);
    const ventesData = querySnapshot.docs.map((docSnap) => ({
      id: docSnap.id,
      ...docSnap.data(),
    }));

    setVentes(ventesData);
  } catch (error) {
    console.error("Erreur lors de la récupération des ventes:", error);
  } finally {
    setLoading(false);
  }
};


    fetchVentes();
  }, []);

  const handleEdit = (vente) => {
    setEditingId(vente.id);
    setEditedVente({ ...vente });
  };

  const handleCancel = () => {
    setEditingId(null);
    setEditedVente({});
  };

  const handleSave = async (id) => {
    try {
      const venteRef = doc(firestore, "ventes", id);
      await updateDoc(venteRef, editedVente);
      setVentes((prev) =>
        prev.map((v) => (v.id === id ? { ...editedVente, id } : v))
      );
    } catch (error) {
      console.error("Erreur lors de la mise à jour de la vente:", error);
    }
    setEditingId(null);
    setEditedVente({});
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await deleteDoc(doc(firestore, "ventes", deleteTarget.id));
      setVentes((prev) => prev.filter((v) => v.id !== deleteTarget.id));
    } catch (error) {
      console.error("Erreur lors de la suppression:", error);
    }
    setDeleteTarget(null);
  };

  const handleChange = (field, value) => {
    setEditedVente((prev) => ({
      ...prev,
      [field]: field === "prix" ? Number(value) : value,
    }));
  };

  // Totals
  const totals = ventes.reduce(
    (acc, v) => {
      acc.prix += v.prix;
      return acc;
    },
    { prix: 0 }
  );

  if (loading) {
    return <div className="p-4 text-center">Chargement des ventes...</div>;
  }

  return (
    <div className="bg-white md:p-4 md:rounded-lg md:shadow-md md:space-y-8">
      <h2 className="text-xl font-bold text-gray-800 mb-4 text-center">
        Ventes
      </h2>

      <div className="overflow-x-auto">
        <table className="min-w-full table-fixed border border-gray-200 text-sm">
          <thead className="bg-gray-100 text-gray-700">
            <tr>
              <th className="w-12 px-2 py-2 border">#</th>
              <th className="w-32 px-2 py-2 border">Nom</th>
              <th className="w-32 px-2 py-2 border">Produit</th>
              <th className="w-28 px-2 py-2 border">Couleur</th>
              <th className="w-24 px-2 py-2 border">Taille</th>
              <th className="w-28 px-2 py-2 border">Prix</th>
              <th className="w-32 px-2 py-2 border">Date</th>
              <th className="w-28 px-2 py-2 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {ventes.map((vente, idx) => {
              const isEditing = editingId === vente.id;

              return (
                <tr key={vente.id} className="text-center">
                  <td className="px-2 py-2 border">{ventes - idx}</td>

                  {/* Nom */}
                  <td className="px-2 py-2 border font-medium truncate">
                    {isEditing ? (
                      <input
                        type="text"
                        value={editedVente.nom}
                        onChange={(e) => handleChange("nom", e.target.value)}
                        className="w-full p-1 border rounded"
                      />
                    ) : (
                      vente.nom
                    )}
                  </td>

                  {/* Produit */}
                  <td className="px-2 py-2 border">
                    {isEditing ? (
                      <input
                        type="text"
                        value={editedVente.produit}
                        onChange={(e) =>
                          handleChange("produit", e.target.value)
                        }
                        className="w-full p-1 border rounded"
                      />
                    ) : (
                      vente.produit
                    )}
                  </td>

                  {/* Couleur */}
                  <td className="px-2 py-2 border">
                    {isEditing ? (
                      <input
                        type="text"
                        value={editedVente.couleur}
                        onChange={(e) =>
                          handleChange("couleur", e.target.value)
                        }
                        className="w-full p-1 border rounded"
                      />
                    ) : (
                      vente.couleur
                    )}
                  </td>

                  {/* Taille */}
                  <td className="px-2 py-2 border">
                    {isEditing ? (
                      <input
                        type="text"
                        value={editedVente.taille}
                        onChange={(e) =>
                          handleChange("taille", e.target.value)
                        }
                        className="w-full p-1 border rounded text-center"
                      />
                    ) : (
                      vente.taille
                    )}
                  </td>

                  {/* Prix */}
                  <td className="px-2 py-2 border font-semibold">
                    {isEditing ? (
                      <input
                        type="number"
                        value={editedVente.prix}
                        onChange={(e) => handleChange("prix", e.target.value)}
                        className="w-full p-1 border rounded text-center"
                      />
                    ) : (
                      vente.prix
                    )}
                  </td>

                  {/* Date */}
                  <td className="px-2 py-2 border">
                    {isEditing ? (
                      <input
                        type="date"
                        value={editedVente.date}
                        onChange={(e) => handleChange("date", e.target.value)}
                        className="w-full p-1 border rounded"
                      />
                    ) : (
                      vente.date
                    )}
                  </td>

                  {/* Actions */}
                  <td className="px-2 py-2 border">
                    <div className="flex justify-center gap-2">
                      {isEditing ? (
                        <>
                          <button
                            onClick={() => handleSave(vente.id)}
                            className="p-2 bg-green-500 hover:bg-green-600 text-white rounded-full"
                          >
                            <Save className="w-4 h-4" />
                          </button>
                          <button
                            onClick={handleCancel}
                            className="p-2 bg-gray-400 hover:bg-gray-500 text-white rounded-full"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            onClick={() => handleEdit(vente)}
                            className="p-2 bg-blue-500 hover:bg-blue-600 text-white rounded-full"
                          >
                            <Pencil className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => setDeleteTarget(vente)}
                            className="p-2 bg-red-500 hover:bg-red-600 text-white rounded-full"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}

            {/* Totals Row */}
            <tr className="bg-gray-50 font-bold text-center">
              <td colSpan={5} className="px-2 py-2 border">
                Total
              </td>
              <td className="px-2 py-2 border text-orange-600">{totals.prix}</td>
              <td className="px-2 py-2 border">—</td>
              <td className="px-2 py-2 border">—</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Confirm Delete Modal */}
      <ConfirmModal
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        title="Supprimer la vente"
        message={`Êtes-vous sûr de vouloir supprimer la vente de "${deleteTarget?.produit}" ?`}
        confirmText="Supprimer"
        cancelText="Annuler"
        confirmColor="bg-red-500 hover:bg-red-600"
      />
    </div>
  );
};

export default Ventes;
