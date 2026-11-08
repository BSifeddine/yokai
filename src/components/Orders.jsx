import { motion } from "framer-motion";
import { Menu, X, Check, CheckCheck, Truck, CircleOff, PhoneCall, Timer, Box, NutOff, PointerOff } from "lucide-react";
import { useEffect, useState } from "react";
import OrderItem from "./OrderItem";
import { collection, deleteDoc, getDocs, orderBy, query } from "firebase/firestore";
import { firestore } from "../firebase";
import Tous from "./Tous";
import Confirmes from "./Confirmes";
import NonConfirmes from "./NonConfirmes";
import Livres from "./Livres";
import Retours from "./Retours";
import EnLivraison from "./EnLivraison";
import NeRepondsPas from "./NeRepondsPas";
import NonDisponibles from "./NonDisponibles";
import Reportes from "./Reportes";
import Search from "./Search"

    const Orders = () => {

    const [orders, setOrders] = useState([])
	const [confirmes, setConfirmes] = useState([])
	const [nonConfirmes, setNonConfirmes] = useState([])
	const [livres, setLivres] = useState([])
	const [retours, setRetours] = useState([])
	const [enLivraison, setEnLivraison] = useState([])
	const [neRepondsPas, setNeRepondsPas] = useState([])
	const [reportes, setReportes] = useState([])
	const [nonDisponibles, setNonDisponibles] = useState([])
	const [active, setActive] = useState("Tous")
	const actives = [
		{name: "Tous", icon: Menu},
		{name: "Non confirmés", icon: X},
		{name: "Confirmés", icon: Check},
		{name: "Livrés", icon: CheckCheck},
		{name: "En livraison", icon: Truck},
		{name: "Retours", icon: CircleOff},
		{name: "Ne reponds pas", icon: PhoneCall},
		{name: "Reporté", icon: Timer},
		{name: "Non disponible", icon: PointerOff},
	]

	const fetchData = async () => {
	  try {
		const ordersQuery = query(collection(firestore, "orders"), orderBy("timestamp", "desc"));
		const querySnapshot = await getDocs(ordersQuery);
		const items = querySnapshot.docs.map(doc => ({
			id: doc.id,    // Get document ID
			...doc.data()  // Spread document data
		  }));
		setOrders(items);
	} catch (error) {
		console.error("Error fetching data: ", error);
	}	
}

	useEffect(() => {
		fetchData();

		const intervalId = setInterval(fetchData, 300000)

		return () => clearInterval(intervalId)
	  }, []);

	useEffect(() => {
		setConfirmes(() => orders.filter((order) => order.etat == "Confirmé" ))
		setNonConfirmes(() => orders.filter((order) => order.etat == "Non confirmé" ))
		setLivres(() => orders.filter((order) => order.etat == "Livré" ))
		setRetours(() => orders.filter((order) => order.etat == "Retour" ))
		setEnLivraison(() => orders.filter((order) => order.etat == "En livraison" ))
		setNeRepondsPas(() => orders.filter((order) => order.etat == "Ne reponds pas" ))
		setReportes(() => orders.filter((order) => order.etat == "Reporté" ))
		setNonDisponibles(() => orders.filter((order) => order.etat == "Non disponible" ))
	},[orders])

	useEffect(() => {
		document.title = "Admin | Commandes"
		window.scrollTo(0, 0);
	  }, []); 

	return (
		<>
			<div className="md:flex md:flex-row md:gap-3 mb-4 hidden">
				{actives.map((btn, index) => (
					<button key={index} className= {`flex flex-row items-center gap-2 font-semibold py-2 px-3 rounded-md
						${btn.name === active ? "bg-gray-800 text-gray-100": "hover:bg-gray-400 bg-gray-300 hover:text-gray-900 text-gray-800" }`}
						onClick={() => {setActive(btn.name); fetchData()}}
						>
							{<btn.icon size={20} />}
							{btn.name}
					</button>
				))}
			</div>
<div className="flex w-full flex-row justify-start gap-3 overflow-x-scroll mb-4 md:hidden px-2">
  {actives.map((btn, index) => (
    <button
      key={index}
      className={`shrink-0 w-10 h-10 flex items-center justify-center rounded-md
        ${btn.name === active
          ? "bg-gray-800 text-gray-100"
          : "hover:bg-gray-400 bg-gray-300 hover:text-gray-900 text-gray-800"
        }`}
      onClick={() => {
        setActive(btn.name);
        fetchData();
      }}
    >
      <btn.icon className="w-5 h-5" />
    </button>
  ))}
</div>

		<div
			className='bg-gray-800 shadow-lg rounded-lg overflow-scroll md:overflow-hidden mx-auto'
		>

					{active == "Tous" ? <>
						<Tous orders = {orders} refresh={fetchData}/>
					</>
					: active == "Non confirmés" ? <>
						<NonConfirmes orders = {nonConfirmes} refresh={fetchData}/>
					</>
					: active == "Confirmés" ? <>
						<Confirmes orders = {confirmes} refresh={fetchData}/>
					</>
					: active == "Livrés" ? <>
						<Livres orders = {livres} refresh={fetchData}/>
					</>
					: active == "Retours" ? <>
						<Retours orders = {retours} refresh={fetchData}/>
					</>
					: active == "Ne reponds pas" ? <>
						<NeRepondsPas orders={neRepondsPas} refresh={fetchData}/>
					</>
					: active == "Reporté" ? <>
						<Reportes orders={reportes} refresh={fetchData}/>
					</>
					: active == "Non disponible" ? <>
						<NonDisponibles orders={nonDisponibles} refresh={fetchData}/>
					</>
					: <>
						<EnLivraison orders = {enLivraison} refresh={fetchData}/>
					</>
					}

		</div>
		</>
	);
};

export default Orders