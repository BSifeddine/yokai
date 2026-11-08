import { useState, useEffect } from "react";
import { Pencil, Save, X, Trash2 } from "lucide-react";
import { firestore } from "../firebase";
import { query, orderBy } from "firebase/firestore";
import {
  collection,
  doc,
  getDocs,
  updateDoc,
  deleteDoc,
} from "firebase/firestore";
import ConfirmModal from "../components/ConfirmModal";

const AchatsPage = () => {
  const [achats, setAchats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [editedAchat, setEditedAchat] = useState({});
  const [deleteTarget, setDeleteTarget] = useState(null);

  // Fetch achats from Firestore
  useEffect(() => {

const fetchAchats = async () => {
  try {
    // Query achats ordered by date descending (newest first)
    const achatsQuery = query(
      collection(firestore, "achats"),
      orderBy("date", "desc")
    );

    const querySnapshot = await getDocs(achatsQuery);
    const achatsData = querySnapshot.docs.map((docSnap) => ({
      id: docSnap.id,
      ...docSnap.data(),
    }));

    setAchats(achatsData);
  } catch (error) {
    console.error("Erreur lors de la récupération des achats:", error);
  } finally {
    setLoading(false);
  }
};


    fetchAchats();
  }, []);

  const handleEdit = (achat) => {
    setEditingId(achat.id);
    setEditedAchat({ ...achat });
  };

  const handleCancel = () => {
    setEditingId(null);
    setEditedAchat({});
  };

  const handleSave = async (id) => {
    try {
      const achatRef = doc(firestore, "achats", id);
      await updateDoc(achatRef, editedAchat);
      setAchats((prev) =>
        prev.map((a) => (a.id === id ? { ...editedAchat, id } : a))
      );
    } catch (error) {
      console.error("Erreur lors de la mise à jour de l'achat:", error);
    }
    setEditingId(null);
    setEditedAchat({});
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await deleteDoc(doc(firestore, "achats", deleteTarget.id));
      setAchats((prev) => prev.filter((a) => a.id !== deleteTarget.id));
    } catch (error) {
      console.error("Erreur lors de la suppression:", error);
    }
    setDeleteTarget(null);
  };

  const handleChange = (field, value) => {
    setEditedAchat((prev) => ({
      ...prev,
      [field]:
        field === "quantity" ||
        field === "prixUnitaire" ||
        field === "livraison"
          ? Number(value)
          : value,
    }));
  };

  const calculatePrix = (a) => a.quantity * a.prixUnitaire;
  const calculatePrixTotal = (a) => calculatePrix(a) + a.livraison;

  // Totals
  const totals = achats.reduce(
    (acc, a) => {
      const prix = calculatePrix(a);
      const total = prix + a.livraison;
      acc.quantity += a.quantity;
      acc.prix += prix;
      acc.livraison += a.livraison;
      acc.prixTotal += total;
      return acc;
    },
    { quantity: 0, prix: 0, livraison: 0, prixTotal: 0 }
  );

  if (loading) {
    return <div className="p-4 text-center">Chargement des achats...</div>;
  }

  return (
    <div className="bg-white md:p-4 md:rounded-lg md:shadow-md md:space-y-8">
      <h2 className="text-xl font-bold text-gray-800 mb-4 text-center">
        Achats
      </h2>

      <div className="overflow-x-auto">
        <table className="min-w-full table-fixed border border-gray-200 text-sm">
          <thead className="bg-gray-100 text-gray-700">
            <tr>
              <th className="w-12 px-2 py-2 border">#</th>
              <th className="w-40 px-2 py-2 border">Produit</th>
              <th className="w-20 px-2 py-2 border">Quantité</th>
              <th className="w-28 px-2 py-2 border">Prix Unitaire</th>
              <th className="w-28 px-2 py-2 border">Prix</th>
              <th className="w-28 px-2 py-2 border">Livraison</th>
              <th className="w-28 px-2 py-2 border">Prix Total</th>
              <th className="w-32 px-2 py-2 border">Date</th>
              <th className="w-28 px-2 py-2 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {achats.map((achat, idx) => {
              const isEditing = editingId === achat.id;
              const prix = isEditing
                ? editedAchat.quantity * editedAchat.prixUnitaire
                : calculatePrix(achat);
              const prixTotal = isEditing
                ? prix + editedAchat.livraison
                : calculatePrixTotal(achat);

              return (
                <tr key={achat.id} className="text-center">
                  <td className="px-2 py-2 border">{achats.length - idx}</td>
                  <td className="px-2 py-2 border font-medium truncate">
                    {isEditing ? (
                      <input
                        type="text"
                        value={editedAchat.name}
                        onChange={(e) => handleChange("name", e.target.value)}
                        className="w-full p-1 border rounded"
                      />
                    ) : (
                      achat.name
                    )}
                  </td>
                  <td className="px-2 py-2 border">
                    {isEditing ? (
                      <input
                        type="number"
                        value={editedAchat.quantity}
                        onChange={(e) =>
                          handleChange("quantity", e.target.value)
                        }
                        className="w-full p-1 border rounded text-center"
                      />
                    ) : (
                      achat.quantity
                    )}
                  </td>
                  <td className="px-2 py-2 border">
                    {isEditing ? (
                      <input
                        type="number"
                        value={editedAchat.prixUnitaire}
                        onChange={(e) =>
                          handleChange("prixUnitaire", e.target.value)
                        }
                        className="w-full p-1 border rounded text-center"
                      />
                    ) : (
                      achat.prixUnitaire
                    )}
                  </td>
                  <td className="px-2 py-2 border font-semibold">{prix}</td>
                  <td className="px-2 py-2 border">
                    {isEditing ? (
                      <input
                        type="number"
                        value={editedAchat.livraison}
                        onChange={(e) =>
                          handleChange("livraison", e.target.value)
                        }
                        className="w-full p-1 border rounded text-center"
                      />
                    ) : (
                      achat.livraison
                    )}
                  </td>
                  <td className="px-2 py-2 border font-bold text-orange-600">
                    {prixTotal}
                  </td>
                  <td className="px-2 py-2 border">
                    {isEditing ? (
                      <input
                        type="date"
                        value={editedAchat.date}
                        onChange={(e) => handleChange("date", e.target.value)}
                        className="w-full p-1 border rounded"
                      />
                    ) : (
                      achat.date
                    )}
                  </td>
                  <td className="px-2 py-2 border">
                    <div className="flex justify-center gap-2">
                      {isEditing ? (
                        <>
                          <button
                            onClick={() => handleSave(achat.id)}
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
                            onClick={() => handleEdit(achat)}
                            className="p-2 bg-blue-500 hover:bg-blue-600 text-white rounded-full"
                          >
                            <Pencil className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => setDeleteTarget(achat)}
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
              <td colSpan={2} className="px-2 py-2 border">
                Total
              </td>
              <td className="px-2 py-2 border">{totals.quantity}</td>
              <td className="px-2 py-2 border">—</td>
              <td className="px-2 py-2 border">{totals.prix}</td>
              <td className="px-2 py-2 border">{totals.livraison}</td>
              <td className="px-2 py-2 border text-orange-600">
                {totals.prixTotal}
              </td>
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
        title="Supprimer l'achat"
        message={`Êtes-vous sûr de vouloir supprimer "${deleteTarget?.name}" ?`}
        confirmText="Supprimer"
        cancelText="Annuler"
        confirmColor="bg-red-500 hover:bg-red-600"
      />
    </div>
  );
};

export default AchatsPage;
