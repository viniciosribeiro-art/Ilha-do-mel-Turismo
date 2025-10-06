import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { USERS } from '../constants';

const Login: React.FC = () => {
  const [selectedUserId, setSelectedUserId] = useState<string>(USERS[0].id);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    login(selectedUserId);
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">Acessar Painel</h2>
        <p className="text-center text-gray-500 mb-6">Esta é uma tela de simulação. Selecione um usuário para continuar.</p>
        <form onSubmit={handleLogin}>
          <div className="mb-4">
            <label htmlFor="user-select" className="block text-gray-700 font-medium mb-2">Selecione o Usuário</label>
            <select
              id="user-select"
              value={selectedUserId}
              onChange={(e) => setSelectedUserId(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {USERS.map(user => (
                <option key={user.id} value={user.id}>
                  {user.name} ({user.role})
                </option>
              ))}
            </select>
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Entrar
          </button>
        </form>
         <div className="text-center mt-6">
            <Link to="/" className="text-sm text-gray-600 hover:text-blue-500 hover:underline transition-colors">
                ← Voltar para a Página Inicial
            </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;