import { useState } from "react";
import { firestore } from "../firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { PackagePlus, Shirt, Footprints, Loader2 } from "lucide-react";

const AjouterProduit = () => {
  const [name, setName] = useState("");
  const [type, setType] = useState("vetement");
  const [loading, setLoading] = useState(false);
  const [sizes, setSizes] = useState({});

  const vetementSizes = ["S", "M", "L", "XL", "XXL", "XXXL"];
  const chaussureSizes = [39, 40, 41, 42, 43, 44, 45];

  const handleSizeChange = (size, value) => {
    setSizes((prev) => ({
      ...prev,
      [size]: value === "" ? "" : Number(value),
    }));
  };

  const handleTypeChange = (newType) => {
    setType(newType);
    setSizes({}); // Reset sizes when toggling category
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const normalizedSizes = {};
      Object.entries(sizes).forEach(([k, v]) => {
        normalizedSizes[k] = v === "" ? 0 : Number(v);
      });

      await addDoc(collection(firestore, "vetements"), {
        name: name.trim(),
        type,
        sizes: normalizedSizes,
        createdAt: serverTimestamp(),
      });

      alert("✅ Produit ajouté avec meccès !");
      setName("");
      setType("vetement");
      setSizes({});
    } catch (error) {
      console.error("🔥 Error:", error);
      alert("❌ Erreur lors de l'ajout du produit: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const currentSizes = type === "vetement" ? vetementSizes : chaussureSizes;

  return (
    <div className="max-w-lg mx-auto bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden">
      {/* Header Accent */}
      <div className="bg-gradient-to-r from-orange-500 to-amber-500 p-6 text-white text-center">
        <div className="inline-flex p-3 bg-white/10 rounded-xl backdrop-blur-md mb-2">
          <PackagePlus className="w-8 h-8 text-white" />
        </div>
        <h2 className="text-2xl font-bold tracking-tight">Nouveau Produit</h2>
        <p className="text-orange-100 text-sm mt-1">
          Ajouter un article à votre inventaire
        </p>
      </div>

      <form onSubmit={handleSubmit} className="p-6 space-y-6">
        {/* Name Field */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            Nom du produit
          </label>
          <input
            type="text"
            placeholder="ex: T-Shirt Oversized Black"
            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition text-slate-800 placeholder:text-slate-400 font-medium"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>

        {/* Custom Type Selector Pills */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            Catégorie
          </label>
          <div className="grid grid-cols-2 gap-3 p-1 bg-slate-100 rounded-xl">
            <button
              type="button"
              onClick={() => handleTypeChange("vetement")}
              className={`flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg font-medium text-sm transition-all ${
                type === "vetement"
                  ? "bg-white text-orange-600 shadow-sm font-semibold"
                  : "text-slate-500 hover:text-slate-800"
              }`}
            >
              <Shirt className="w-4 h-4" />
              Vêtement
            </button>
            <button
              type="button"
              onClick={() => handleTypeChange("chaussure")}
              className={`flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg font-medium text-sm transition-all ${
                type === "chaussure"
                  ? "bg-white text-orange-600 shadow-sm font-semibold"
                  : "text-slate-500 hover:text-slate-800"
              }`}
            >
              <Footprints className="w-4 h-4" />
              Chaussure
            </button>
          </div>
        </div>

        {/* Sizes Grid */}
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Stock par Taille
            </label>
            <span className="text-xs text-slate-400">Quantité (Qté)</span>
          </div>

          <div className="grid grid-cols-3 sm:grid-cols-4 gap-2.5">
            {currentSizes.map((size) => {
              const hasValue =
                sizes[size] !== undefined &&
                sizes[size] !== "" &&
                sizes[size] > 0;
              return (
                <div
                  key={String(size)}
                  className={`flex flex-col items-center p-2 rounded-xl border transition-all ${
                    hasValue
                      ? "border-orange-500/50 bg-orange-50/30"
                      : "border-slate-200 hover:border-slate-300 bg-slate-50/50"
                  }`}
                >
                  <span className="text-xs font-bold text-slate-600 mb-1">
                    {size}
                  </span>
                  <input
                    type="number"
                    min="0"
                    placeholder="0"
                    value={sizes[size] ?? ""}
                    onChange={(e) => handleSizeChange(size, e.target.value)}
                    className="w-full text-center bg-white border border-slate-200 rounded-lg py-1 px-2 text-sm font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
                  />
                </div>
              );
            })}
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 active:scale-[0.99] text-white font-semibold py-3 px-6 rounded-xl shadow-lg shadow-orange-500/25 transition flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {loading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              <span>Ajout en cours...</span>
            </>
          ) : (
            <span>Enregistrer le produit</span>
          )}
        </button>
      </form>
    </div>
  );
};

export default AjouterProduit;