import { useState } from "react";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { firestore } from "../firebase";

const AjouterAchat = () => {
  const [name, setName] = useState("");
  const [quantity, setQuantity] = useState(0);
  const [prixUnitaire, setPrixUnitaire] = useState(0);
  const [livraison, setLivraison] = useState(0);
  const [date, setDate] = useState("");
  const [loading, setLoading] = useState(false);

  // Derived values
  const prix = quantity * prixUnitaire;
  const prixTotal = prix + livraison;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await addDoc(collection(firestore, "achats"), {
        name,
        quantity,
        prixUnitaire,
        prix,
        livraison,
        prixTotal,
        date,
        createdAt: serverTimestamp(),
      });

      alert("✅ Achat ajouté avec succès !");
      setName("");
      setQuantity(0);
      setPrixUnitaire(0);
      setLivraison(0);
      setDate("");
    } catch (error) {
      console.error("Erreur lors de l'ajout de l'achat:", error);
      alert("❌ Erreur lors de l'ajout de l'achat");
    }

    setLoading(false);
  };

  return (
    <div className="bg-white md:p-6 md:rounded-lg md:shadow-md max-w-lg mx-auto">
      <h2 className="text-xl font-bold text-gray-800 mb-4 text-center">
        Ajouter un achat
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Name */}
        <div>
          <label className="block text-sm font-medium mb-1">Nom</label>
          <input
            type="text"
            className="w-full border rounded p-2"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>

        {/* Quantity */}
        <div>
          <label className="block text-sm font-medium mb-1">Quantité</label>
          <input
            type="number"
            min="0"
            className="w-full border rounded p-2"
            value={quantity}
            onChange={(e) => setQuantity(Number(e.target.value))}
            required
          />
        </div>

        {/* Prix Unitaire */}
        <div>
          <label className="block text-sm font-medium mb-1">Prix unitaire</label>
          <input
            type="number"
            min="0"
            className="w-full border rounded p-2"
            value={prixUnitaire}
            onChange={(e) => setPrixUnitaire(Number(e.target.value))}
            required
          />
        </div>

        {/* Prix (calculated) */}
        <div>
          <label className="block text-sm font-medium mb-1">Prix</label>
          <input
            type="number"
            className="w-full border rounded p-2 bg-gray-100"
            value={prix}
            readOnly
          />
        </div>

        {/* Livraison */}
        <div>
          <label className="block text-sm font-medium mb-1">Livraison</label>
          <input
            type="number"
            min="0"
            className="w-full border rounded p-2"
            value={livraison}
            onChange={(e) => setLivraison(Number(e.target.value))}
          />
        </div>

        {/* Prix Total (calculated) */}
        <div>
          <label className="block text-sm font-medium mb-1">Prix total</label>
          <input
            type="number"
            className="w-full border rounded p-2 bg-gray-100"
            value={prixTotal}
            readOnly
          />
        </div>

        {/* Date */}
        <div>
          <label className="block text-sm font-medium mb-1">Date</label>
          <input
            type="date"
            className="w-full border rounded p-2"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
          />
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-2 px-4 rounded"
        >
          {loading ? "Ajout en cours..." : "Ajouter Achat"}
        </button>
      </form>
    </div>
  );
};

export default AjouterAchat;
