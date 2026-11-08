import { useState, useEffect } from "react";
import { Pencil, Save, X, ShoppingBag, Trash2 } from "lucide-react";
import { firestore } from "../firebase"; // 🔹 adjust path
import {
  collection,
  onSnapshot,
  updateDoc,
  deleteDoc,
  doc,
} from "firebase/firestore";
import ConfirmModal from "./ConfirmModal";

const ProduitsPage = () => {
  const [products, setProducts] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editedSizes, setEditedSizes] = useState({});
  const [deleteTarget, setDeleteTarget] = useState(null); // 🔹 product to delete

  // 🔹 Fetch products in real-time
  useEffect(() => {
    const unsub = onSnapshot(collection(firestore, "vetements"), (snapshot) => {
      const items = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setProducts(items);
    });

    return () => unsub();
  }, []);

  const handleEdit = (product) => {
    setEditingId(product.id);
    setEditedSizes({ ...product.sizes });
  };

  const handleCancel = () => {
    setEditingId(null);
    setEditedSizes({});
  };

  const handleSave = async (id) => {
    try {
      const ref = doc(firestore, "vetements", id);
      await updateDoc(ref, { sizes: editedSizes }); // 🔹 save to Firestore
      setEditingId(null);
      setEditedSizes({});
    } catch (error) {
      console.error("Erreur lors de la mise à jour :", error);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    try {
      await deleteDoc(doc(firestore, "vetements", deleteTarget.id));
      setDeleteTarget(null); // close modal
    } catch (error) {
      console.error("Erreur lors de la suppression :", error);
    }
  };

  const handleSizeChange = (size, value) => {
    setEditedSizes((prev) => ({
      ...prev,
      [size]: Number(value) || 0,
    }));
  };

  const calculateQuantity = (sizes) =>
    Object.values(sizes || {}).reduce((a, b) => a + b, 0);

  const calculateTotals = (items, sizesList) => {
    let totals = { totalQty: 0 };
    sizesList.forEach((s) => (totals[s] = 0));

    items.forEach((p) => {
      const qty = calculateQuantity(p.sizes);
      totals.totalQty += qty;
      sizesList.forEach((s) => {
        totals[s] += p.sizes?.[s] || 0;
      });
    });

    return totals;
  };

  // 🔹 Separate tables
  const vetements = products.filter((p) => p.type === "vetement");
  const chaussures = products.filter((p) => p.type === "chaussure");

  const vetementSizes = ["S", "M", "L", "XL", "XXL", "XXXL"];
  const chaussureSizes = [39, 40, 41, 42, 43, 44, 45];

  const vetementTotals = calculateTotals(vetements, vetementSizes);
  const chaussureTotals = calculateTotals(chaussures, chaussureSizes);

  return (
    <>
    <div className="bg-white md:p-4 md:rounded-lg md:shadow-md space-y-10">

      {/* Vêtements */}
      <TableSection
        title="Vêtements"
        items={vetements}
        sizes={vetementSizes}
        totals={vetementTotals}
        editingId={editingId}
        editedSizes={editedSizes}
        onEdit={handleEdit}
        onCancel={handleCancel}
        onSave={handleSave}
        onSizeChange={handleSizeChange}
        onAskDelete={(p) => setDeleteTarget(p)}
      />

      {/* Chaussures */}
      <TableSection
        title="Chaussures"
        items={chaussures}
        sizes={chaussureSizes}
        totals={chaussureTotals}
        editingId={editingId}
        editedSizes={editedSizes}
        onEdit={handleEdit}
        onCancel={handleCancel}
        onSave={handleSave}
        onSizeChange={handleSizeChange}
        onAskDelete={(p) => setDeleteTarget(p)}
      />

      {/* 🔹 Confirmation Modal */}
      <ConfirmModal
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDeleteConfirm}
        title="Supprimer le produit"
        message={`Êtes-vous sûr de vouloir supprimer "${deleteTarget?.name}" ?`}
        confirmText="Supprimer"
        cancelText="Annuler"
        confirmColor="bg-red-500 hover:bg-red-600"
      />
    </div>
    </>
  );
};

// 🔹 Reusable TableSection component
const TableSection = ({
  title,
  items,
  sizes,
  totals,
  editingId,
  editedSizes,
  onEdit,
  onCancel,
  onSave,
  onSizeChange,
  onAskDelete,
}) => (
  <div>
    <h3 className="text-lg font-semibold text-gray-700 mb-3">{title}</h3>
    <div className="overflow-x-auto">
      <table className="min-w-full table-fixed border border-gray-200 text-sm">
        <thead className="bg-gray-100 text-gray-700">
          <tr>
            <th className="w-12 px-2 py-2 border">#</th>
            <th className="w-20 px-2 py-2 border">Image</th>
            <th className="w-40 px-2 py-2 border">Nom</th>
            <th className="w-20 px-2 py-2 border">Quantité</th>
            {sizes.map((s) => (
              <th key={s} className="w-14 px-2 py-2 border">
                {s}
              </th>
            ))}
            <th className="w-28 px-2 py-2 border">Actions</th>
          </tr>
        </thead>
        <tbody>
          {items.map((product, idx) => {
            const isEditing = editingId === product.id;
            const currentSizes = isEditing ? editedSizes : product.sizes;

            return (
              <tr key={product.id} className="text-center">
                <td className="px-2 py-2 border">{idx + 1}</td>
                <td className="px-2 py-2 border">
                  {product.image ? (
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-12 h-12 object-cover rounded-full mx-auto"
                    />
                  ) : (
                    <div className="w-12 h-12 flex items-center justify-center bg-gray-200 rounded-full mx-auto">
                      <ShoppingBag className="w-6 h-6 text-gray-500" />
                    </div>
                  )}
                </td>
                <td className="px-2 py-2 border font-medium truncate">
                  {product.name}
                </td>
                <td className="px-2 py-2 border font-semibold">
                  {Object.values(currentSizes || {}).reduce((a, b) => a + b, 0)}
                </td>

                {sizes.map((size) => (
                  <td key={size} className="px-2 py-2 border">
                    {isEditing ? (
                      <input
                        type="number"
                        value={currentSizes?.[size] || 0}
                        onChange={(e) => onSizeChange(size, e.target.value)}
                        className="w-14 p-1 border rounded text-center"
                      />
                    ) : (
                      currentSizes?.[size] || 0
                    )}
                  </td>
                ))}

                <td className="px-2 py-2 border">
                  <div className="flex justify-center gap-2">
                    {isEditing ? (
                      <>
                        <button
                          onClick={() => onSave(product.id)}
                          className="p-2 bg-green-500 hover:bg-green-600 text-white rounded-full"
                        >
                          <Save className="w-4 h-4" />
                        </button>
                        <button
                          onClick={onCancel}
                          className="p-2 bg-gray-400 hover:bg-gray-500 text-white rounded-full"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          onClick={() => onEdit(product)}
                          className="p-2 bg-blue-500 hover:bg-blue-600 text-white rounded-full"
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => onAskDelete(product)}
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
            <td colSpan={3} className="px-2 py-2 border">
              Total
            </td>
            <td className="px-2 py-2 border">{totals.totalQty}</td>
            {sizes.map((s) => (
              <td key={s} className="px-2 py-2 border">
                {totals[s]}
              </td>
            ))}
            <td className="px-2 py-2 border">—</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
);

export default ProduitsPage;
