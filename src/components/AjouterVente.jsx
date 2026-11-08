import { useState } from "react";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { firestore } from "../firebase";

const AjouterVente = () => {
  const [nom, setNom] = useState("");
  const [produit, setProduit] = useState("");
  const [couleur, setCouleur] = useState("");
  const [taille, setTaille] = useState("");
  const [prix, setPrix] = useState(0);
  const [date, setDate] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await addDoc(collection(firestore, "ventes"), {
        nom,
        produit,
        couleur,
        taille,
        prix,
        date,
        createdAt: serverTimestamp(),
      });

      alert("✅ Vente ajoutée avec succès !");
      setNom("");
      setProduit("");
      setCouleur("");
      setTaille("");
      setPrix(0);
      setDate("");
    } catch (error) {
      console.error("Erreur lors de l'ajout de la vente:", error);
      alert("❌ Erreur lors de l'ajout de la vente");
    }

    setLoading(false);
  };

  return (
    <div className="bg-white md:p-6 md:rounded-lg md:shadow-md max-w-lg mx-auto">
      <h2 className="text-xl font-bold text-gray-800 mb-4 text-center">
        Ajouter une vente
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Nom */}
        <div>
          <label className="block text-sm font-medium mb-1">Nom du client</label>
          <input
            type="text"
            className="w-full border rounded p-2"
            value={nom}
            onChange={(e) => setNom(e.target.value)}
            required
          />
        </div>

        {/* Produit */}
        <div>
          <label className="block text-sm font-medium mb-1">Produit</label>
          <input
            type="text"
            className="w-full border rounded p-2"
            value={produit}
            onChange={(e) => setProduit(e.target.value)}
            required
          />
        </div>

        {/* Couleur */}
        <div>
          <label className="block text-sm font-medium mb-1">Couleur</label>
          <input
            type="text"
            className="w-full border rounded p-2"
            value={couleur}
            onChange={(e) => setCouleur(e.target.value)}
            required
          />
        </div>

        {/* Taille */}
        <div>
          <label className="block text-sm font-medium mb-1">Taille</label>
          <input
            type="text"
            className="w-full border rounded p-2"
            value={taille}
            onChange={(e) => setTaille(e.target.value)}
            required
          />
        </div>

        {/* Prix */}
        <div>
          <label className="block text-sm font-medium mb-1">Prix</label>
          <input
            type="number"
            min="0"
            className="w-full border rounded p-2"
            value={prix}
            onChange={(e) => setPrix(Number(e.target.value))}
            required
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
          {loading ? "Ajout en cours..." : "Ajouter Vente"}
        </button>
      </form>
    </div>
  );
};

export default AjouterVente;
