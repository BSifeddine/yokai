import { useState } from "react";
import {
  collection,
  getDocs,
  query,
  where
} from "firebase/firestore";
import { firestore } from "../firebase";
import toast from "react-hot-toast";
import NonDisponibles from "./NonDisponibles";
import { Search } from "lucide-react";

const OrdersSearch = () => {
  const [searchType, setSearchType] = useState("num");
  const [searchValue, setSearchValue] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = async () => {
    if (!searchValue.trim()) {
      toast.error("Veuillez saisir une valeur de recherche");
      return;
    }

    setLoading(true);
    setHasSearched(true);
    setResults([]);

    try {
      const q = query(
        collection(firestore, "orders"),
        where(searchType, "==", searchValue.trim())
      );

      const snapshot = await getDocs(q);

      const data = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      setResults(data);
    } catch (error) {
      console.error("Search error:", error);
      toast.error("Erreur lors de la recherche");
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <div className="bg-white p-4 rounded-xl shadow-sm space-y-4">
      
      {/* Search Controls */}
<div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center">

  {/* Select */}
  <select
    value={searchType}
    onChange={(e) => setSearchType(e.target.value)}
    className="border rounded-lg px-3 py-2"
  >
    <option value="num">Numéro téléphone</option>
    <option value="name">Nom</option>
    <option value="wilaya">Wilaya</option>
    <option value="commun">Commune</option>
  </select>

  {/* Input + Button */}
  <div className="flex w-full gap-2">
    <input
      type="text"
      value={searchValue}
      onChange={(e) => setSearchValue(e.target.value)}
      onKeyDown={handleKeyDown}
      placeholder="Valeur de recherche..."
      className="border rounded-lg px-3 py-2 flex-1"
    />

    <button
      onClick={handleSearch}
      disabled={loading}
      className="bg-orange-600 text-white px-3 py-2 rounded-lg
                 hover:bg-orange-700 transition flex items-center
                 justify-center gap-2"
    >
      <Search size={18} />
      <span className="hidden sm:inline">
        {loading ? "Recherche..." : "Rechercher"}
      </span>
    </button>
  </div>

</div>


      {/* Results / States */}
      <div className="space-y-2">
        {!hasSearched && (
          <p className="text-gray-500 text-sm text-center">
            Recherchez une commande par téléphone, nom ou localisation
          </p>
        )}

        {hasSearched && !loading && results.length === 0 && (
          <p className="text-red-500 text-sm text-center">
            Aucune commande trouvée
          </p>
        )}

        {results.length > 0 && (
          <NonDisponibles orders={results} />
        )}
      </div>
    </div>
  );
};

export default OrdersSearch;
