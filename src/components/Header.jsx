import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Header({ onOpenLogin, onOpenRegister }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { isAuthenticated, user, logout } = useAuth();

  const toggleMenu = () => setIsMenuOpen((prev) => !prev);

  return (
    <>
      <header
        id="header-main"
        className="w-full bg-slate-950/90 backdrop-blur-md flex items-center justify-between py-6 max-md:px-4 px-12 border-b border-slate-800 z-40 fixed overflow-hidden h-24 top-0 left-0"
      >
        <Link to="/" className="flex items-center gap-3">
          <img src="/assets/img/logo/logo-light.svg" alt="Logo da Microhub" className="max-h-10" />
        </Link>

        <nav className="flex gap-8 text-slate-300 *:border-b-2 *:border-transparent *:hover:border-blue-400 *:cursor-pointer *:hover:text-slate-50 *:transition-all *:duration-300 max-md:hidden font-medium">
          <a href="#home">Início</a>
          <a href="#solution">Solução</a>
          <a href="#faq">FAQ</a>
          <a href="#contact-us">Contate-nos</a>
        </nav>

        <div className="flex gap-4 items-center max-md:hidden">
          {isAuthenticated ? (
            <div className="flex items-center gap-3">
              <Link
                to="/app"
                className="py-2.5 px-5 bg-blue-600 hover:bg-blue-500 rounded-lg text-white font-medium transition-all shadow-md shadow-blue-600/30 flex items-center gap-2"
              >
                <i className="ph ph-squares-four text-lg"></i>
                Dashboard ({user?.name?.split(' ')[0]})
              </Link>
              <button
                type="button"
                onClick={logout}
                className="py-2.5 px-3 border border-slate-700 hover:bg-slate-800 rounded-lg text-slate-300 hover:text-white transition-all cursor-pointer"
                title="Sair"
              >
                <i className="ph ph-sign-out text-xl"></i>
              </button>
            </div>
          ) : (
            <>
              <button
                type="button"
                onClick={onOpenLogin}
                className="min-w-28 py-2.5 px-4 border border-slate-700 rounded-lg hover:bg-slate-800 hover:border-slate-500 text-slate-200 transition-colors duration-300 cursor-pointer"
              >
                Entrar
              </button>
              <button
                type="button"
                onClick={onOpenRegister}
                className="min-w-28 py-2.5 px-4 bg-blue-600 hover:bg-blue-500 text-white rounded-lg transition-colors duration-300 font-medium cursor-pointer shadow-md shadow-blue-600/30"
              >
                Cadastre-se
              </button>
            </>
          )}
        </div>

        <div className="flex items-center justify-center md:hidden">
          <button
            type="button"
            onClick={toggleMenu}
            className="p-2 text-slate-300 hover:text-white cursor-pointer"
          >
            <i className={`ph ${isMenuOpen ? 'ph-x' : 'ph-list'} text-3xl`}></i>
          </button>
        </div>
      </header>

      {/* Mobile drawer */}
      <div
        id="header-mobile"
        className={`w-full fixed top-24 left-0 h-[calc(100vh-6rem)] bg-slate-950/95 backdrop-blur-xl flex flex-col items-center justify-center border-b border-slate-800 z-40 md:hidden gap-10 transition-transform duration-300 ${
          isMenuOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <nav className="flex flex-col gap-6 text-slate-300 *:text-xl *:cursor-pointer *:hover:text-slate-50 text-center font-medium">
          <a href="#home" onClick={toggleMenu}>
            Início
          </a>
          <a href="#solution" onClick={toggleMenu}>
            Solução
          </a>
          <a href="#faq" onClick={toggleMenu}>
            FAQ
          </a>
          <a href="#contact-us" onClick={toggleMenu}>
            Contate-nos
          </a>
        </nav>
        <div className="flex flex-col w-64 gap-3">
          {isAuthenticated ? (
            <>
              <Link
                to="/app"
                onClick={toggleMenu}
                className="w-full py-3 bg-blue-600 text-center text-white rounded-lg font-medium shadow-md shadow-blue-600/30"
              >
                Ir para Dashboard
              </Link>
              <button
                type="button"
                onClick={() => {
                  logout();
                  toggleMenu();
                }}
                className="w-full py-3 border border-slate-700 text-slate-300 rounded-lg hover:bg-slate-800"
              >
                Sair
              </button>
            </>
          ) : (
            <>
              <button
                type="button"
                onClick={() => {
                  onOpenLogin();
                  toggleMenu();
                }}
                className="w-full py-3 border border-slate-700 text-slate-200 rounded-lg hover:bg-slate-800"
              >
                Entrar
              </button>
              <button
                type="button"
                onClick={() => {
                  onOpenRegister();
                  toggleMenu();
                }}
                className="w-full py-3 bg-blue-600 text-white rounded-lg font-medium shadow-md shadow-blue-600/30"
              >
                Cadastre-se
              </button>
            </>
          )}
        </div>
      </div>
    </>
  );
}