import React, { useContext, useEffect, useState } from 'react';
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from '../firebase';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { MyContext } from '../App';

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const nav = useNavigate()
  const context = useContext(MyContext)

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const token = await userCredential.user.getIdToken();
  
        // Store the token in localStorage
        localStorage.setItem('userToken', token);
  
        toast.success("Bienvenue Admin ^_^")
        context.setIsAdmin(true)
        nav("/dashboard/commandes")
      } catch (error) {
        setError('Failed to login. Please check your credentials.');
        console.error('Login error:', error);
      }
  };

  useEffect(() => {
    document.title = "Admin | Se connecter"
    if(context.isAdmin){
        nav("/dashboard/commandes")
    }
  },[])



  return (
    <div className="flex items-center justify-center py-16 my-2">
      <div className="w-full max-w-md bg-white shadow-md rounded-md px-8 py-6">
        <h2 className="text-2xl text-gray-800 font-bold text-center mb-4">Se connecter</h2>
        {error && <div className="text-red-500 text-center mb-4">{error}</div>}
        <form onSubmit={handleLogin}>
          <div className="mb-4">
            <label className="block text-gray-800 text-sm font-bold mb-2" htmlFor="email">
              Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              placeholder="Enter your email"
              required
            />
          </div>
          <div className="mb-6">
            <label className="block text-gray-800 text-sm font-bold mb-2" htmlFor="password">
              Mot de passe
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
              placeholder="Enter your password"
              required
            />
          </div>
          <div className="flex items-center justify-between">
            <button
              type="submit"
              className="w-full bg-emerald-500 hover:bg-emerald-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            >
              Se connecter
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;