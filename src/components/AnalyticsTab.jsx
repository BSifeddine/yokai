import { useEffect, useState } from "react";
import { ShoppingCart, Check, RotateCcw, BadgeCheck, X } from "lucide-react";
import { collection, getDocs, query, where } from "firebase/firestore";
import { firestore } from "../firebase";

const AnalyticsTab = () => {
  const [orders, setOrders] = useState(0);
  const [livre, setLivre] = useState(0);
  const [retours, setRetours] = useState(0);
  const [enLivraison, setEnLivraison] = useState(0);
  const [annulers, setAnnulers] = useState(0);
  const [confirmes, setConfirmes] = useState(0);
  const [productStats, setProductStats] = useState([]);
  const [con, setCon] = useState(0)
  const [liv, setLiv] = useState(0)
  const [livCon, setLivCon] = useState(0)
  const [ann, setAnn] = useState(0)

  useEffect(() => {
    document.title = "Admin | Analytics";

    const fetchOrders = async () => {
      const querySnapshot = await getDocs(collection(firestore, "orders"));
      setOrders(querySnapshot.size);

      const stats = {};
      querySnapshot.forEach((doc) => {
        const data = doc.data();

        for (let i = 1; i <= 3; i++) {
          const produitKey = `produit${i}`;
          const tailleKey = `taille${i}`;
          const colorKey = `color${i}`;

          const productName = data[produitKey];
          if (!productName) continue;

          if (!stats[productName]) {
            stats[productName] = { count: 0, tailles: {}, colors: {} };
          }

          stats[productName].count += 1;

          const taille = data[tailleKey];
          const color = data[colorKey];

          if (taille)
            stats[productName].tailles[taille] =
              (stats[productName].tailles[taille] || 0) + 1;
          if (color)
            stats[productName].colors[color] =
              (stats[productName].colors[color] || 0) + 1;
        }
      });

      const sortedStats = Object.entries(stats)
        .map(([name, info]) => ({
          name,
          count: info.count,
          tailles: Object.entries(info.tailles)
            .sort((a, b) => b[1] - a[1])
            .reduce((acc, [k, v]) => ({ ...acc, [k]: v }), {}),
          colors: Object.entries(info.colors)
            .sort((a, b) => b[1] - a[1])
            .reduce((acc, [k, v]) => ({ ...acc, [k]: v }), {}),
        }))
        .sort((a, b) => b.count - a.count);

      setProductStats(sortedStats);
    };

    fetchOrders();
  }, []);

  useEffect(() => {
    const fetchDelivered = async () => {
      const q = query(collection(firestore, "orders"), where("etat", "==", "Livré"));
      const querySnapshot = await getDocs(q);
      setLivre(querySnapshot.size);
    };
    fetchDelivered();
  }, []);

    useEffect(() => {
    const fetchDelivering = async () => {
      const q = query(collection(firestore, "orders"), where("etat", "==", "En Livraison"));
      const querySnapshot = await getDocs(q);
      setEnLivraison(querySnapshot.size);
    };
    fetchDelivering();
  }, []);

  useEffect(() => {
    const fetchRetours = async () => {
      const q = query(collection(firestore, "orders"), where("etat", "==", "Retour"));
      const querySnapshot = await getDocs(q);
      setRetours(querySnapshot.size);
    };
    fetchRetours();
  }, []);

  useEffect(() => {
    const fetchConfirmes = async () => {
      const q = query(collection(firestore, "orders"), where("etat", "==", "Annulé"));
      const querySnapshot = await getDocs(q);
      setAnnulers(querySnapshot.size);
    };
    fetchConfirmes();
  }, []);

  useEffect(() => {
setCon(
  Math.floor((orders - annulers)
  / (orders || 1) * 100 )
);

  },[orders,annulers])

useEffect(() => {
  setLiv(
  Math.floor((retours || 0)
  / ((orders - annulers) || 1) * 100)
);
  setAnn(Math.floor(100 - con))
},[con])

useEffect(() => {
  setLivCon(Math.floor(100 - liv))
},[liv])

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <AnalyticsCard title="Les commandes" value={orders} icon={ShoppingCart} color="from-purple-500 to-pink-700" />
        <AnalyticsCard title="Commandes Livrées" value={livre} icon={Check} color="from-green-500 to-emerald-700" />
        <AnalyticsCard title="Commandes Annulés" value={annulers} icon={X} color="from-orange-500 to-yellow-700" />
        <AnalyticsCard title="Les Retours" value={retours} icon={RotateCcw} color="from-red-500 to-orange-700" />
      </div>
      
      {/* Orders per product table */}
      <div className="p-6 flex flex-col items-end gap-2">
        <h2 className="font-semibold text-xl "><span> : </span> احصائيات التوصيل</h2>
        <div className="rounded-xl shadow-lg p-2 bg-gray-50 hover:bg-gray-100">
         <span className={`font-semibold ${con > 50 ? "text-green-700" : con == 50 ? "text-gray-700" : "text-red-700"}`}>{con}%</span><span> : </span>نسبة الطلبيات المؤكدة
        </div>
        <div className="rounded-xl shadow-lg p-2 bg-gray-50 hover:bg-gray-100">
         <span className={`font-semibold ${ann < 50 ? "text-green-700" : ann == 50 ? "text-gray-700" : "text-red-700"}`}>{ann}%</span><span> : </span>نسبة الطلبيات غير المؤكدة
        </div>
        <div className="rounded-xl shadow-lg p-2 bg-gray-50 hover:bg-gray-100">
         <span className={`font-semibold ${livCon > 50 ? "text-green-700" : livCon == 50 ? "text-gray-700" : "text-red-700"}`}>{livCon}%</span><span> : </span>نسبة الطلبيات الواصلة
        </div>
        <div className="rounded-xl shadow-lg p-2 bg-gray-50 hover:bg-gray-100">
         <span className={`font-semibold ${liv < 50 ? "text-green-700" : liv == 50 ? "text-gray-700" : "text-red-700"}`}>{liv}%</span><span> : </span>نسبة الطلبيات الملغية
        </div>
      </div>


      {/* Orders per product table */}
      <div className="bg-gray-900 rounded-xl shadow-lg p-6 border border-gray-700">
        <h2 className="text-2xl font-bold mb-6 text-orange-500">
          Statistiques des produits
        </h2>
        <div className="overflow-x-auto rounded-lg">
          <table className="min-w-full text-left text-gray-300 border-separate border-spacing-y-2">
            <thead>
              <tr className="bg-gray-800">
                <th className="py-3 px-4 rounded-l-lg">Produit</th>
                <th className="py-3 px-4">Commandes</th>
                <th className="py-3 px-4">Tailles vendues</th>
                <th className="py-3 px-4 rounded-r-lg">Couleurs vendues</th>
              </tr>
            </thead>
            <tbody>
              {productStats.map((item, idx) => (
                <tr
                  key={idx}
                  className="bg-gray-800/60 hover:bg-gray-700/70 transition rounded-lg"
                >
                  <td className="py-3 px-4 font-medium text-white">{item.name}</td>
                  <td className="py-3 px-4 font-bold text-orange-500">{item.count}</td>
                  <td className="py-3 px-4">
                    <div className="flex flex-wrap gap-2">
                      {Object.entries(item.tailles).map(([taille, count]) => (
                        <span
                          key={taille}
                          className="px-3 py-1 rounded-full text-sm bg-emerald-600/20 text-emerald-400 border border-emerald-500/30"
                        >
                          {taille}: {count}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex flex-wrap gap-2">
                      {Object.entries(item.colors).map(([color, count]) => (
                        <span
                          key={color}
                          className="px-3 py-1 rounded-full text-sm bg-cyan-600/20 text-cyan-400 border border-cyan-500/30"
                        >
                          {color}: {count}
                        </span>
                      ))}
                    </div>
                  </td>
                </tr>
              ))}
              {productStats.length === 0 && (
                <tr>
                  <td colSpan="4" className="text-center py-6 text-gray-500 italic">
                    Aucune commande trouvée
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsTab;

const AnalyticsCard = ({ title, value, icon: Icon, color }) => (
  <div className="relative bg-gray-900 rounded-xl p-6 shadow-md overflow-hidden">
    <div className="flex justify-between items-center z-10 relative">
      <div>
        <p className="text-gray-400 text-sm mb-1 font-medium">{title}</p>
        <h3 className="text-white text-3xl font-bold">{value}</h3>
      </div>
      <div className="p-3 rounded-lg">
        <Icon className="h-8 w-8 text-gray-400" />
      </div>
    </div>
    <div
      className={`absolute inset-0 bg-gradient-to-br ${color} opacity-20 rounded-xl`}
    />
  </div>
);
