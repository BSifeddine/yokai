import { useState, useRef } from "react";
import { firestore } from "../firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { supabase } from "../../supabaseClient";
import imageCompression from "browser-image-compression";

const AjouterProduit = () => {
  const [name, setName] = useState("");
  const [type, setType] = useState("vetement");
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [sizes, setSizes] = useState({});
  const fileInputRef = useRef(null);

  const vetementSizes = ["S", "M", "L", "XL", "XXL", "XXXL"];
  const chaussureSizes = [39, 40, 41, 42, 43, 44, 45];

  const handleSizeChange = (size, value) => {
    setSizes((prev) => ({
      ...prev,
      [size]: value === "" ? "" : Number(value),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      let imageUrl = "";
      if (image) {
        // Compress image in the browser before uploading
        const compressionOptions = {
          maxSizeMB: 0.8,          // Target max size in MB
          maxWidthOrHeight: 1600,  // Resize large photos while keeping aspect ratio
          useWebWorker: true,      // Offload work to a background thread
        };

        const compressedImage = await imageCompression(image, compressionOptions);

        // Preserve original extension/name safely
        const safeName = (compressedImage.name || image.name).replace(/\s+/g, "-");
        const fileName = `products/${Date.now()}-${safeName}`;

        const { error: uploadError } = await supabase.storage
          .from("products")
          .upload(fileName, compressedImage, {
            contentType: compressedImage.type || image.type,
          });

        if (uploadError) throw uploadError;

        const { data: publicUrlData } = supabase.storage
          .from("products")
          .getPublicUrl(fileName);

        imageUrl = publicUrlData.publicUrl;
      }

      const normalizedSizes = {};
      Object.entries(sizes).forEach(([k, v]) => {
        normalizedSizes[k] = v === "" ? 0 : Number(v);
      });

      await addDoc(collection(firestore, "vetements"), {
        name: name.trim(),
        type,
        image: imageUrl,
        sizes: normalizedSizes,
        createdAt: serverTimestamp(),
      });

      alert("✅ Produit ajouté avec succès !");
      setName("");
      setType("vetement");
      setImage(null);
      setSizes({});
      if (fileInputRef.current) fileInputRef.current.value = "";
    } catch (error) {
      console.error("🔥 Error:", error);
      alert("❌ Erreur lors de l'ajout du produit: " + error.message);
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="bg-white p-6 rounded-lg shadow-md max-w-lg mx-auto">
      <h2 className="text-xl font-bold text-gray-800 mb-4 text-center">
        Ajouter un produit
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
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

        <div>
          <label className="block text-sm font-medium mb-1">Type</label>
          <select
            className="w-full border rounded p-2"
            value={type}
            onChange={(e) => setType(e.target.value)}
          >
            <option value="vetement">Vêtement</option>
            <option value="chaussure">Chaussure</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Image</label>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="w-full"
            onChange={(e) => setImage(e.target.files?.[0] ?? null)}
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Tailles</label>
          <div className="grid grid-cols-3 gap-2">
            {(type === "vetement" ? vetementSizes : chaussureSizes).map(
              (size) => (
                <div key={String(size)} className="flex flex-col items-center">
                  <span className="text-sm font-semibold">{size}</span>
                  <input
                    type="number"
                    min="0"
                    value={sizes[size] ?? ""}
                    onChange={(e) => handleSizeChange(size, e.target.value)}
                    className="w-16 border rounded p-1 text-center"
                  />
                </div>
              )
            )}
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-2 px-4 rounded"
        >
          {loading ? "Ajout en cours..." : "Ajouter Produit"}
        </button>
      </form>
    </div>
  );
};

export default AjouterProduit;
