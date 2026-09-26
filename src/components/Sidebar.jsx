import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Sidebar() {
  const location = useLocation();
  const { user, isAdmin, initials, logout } = useAuth();

  const isActive = (path) => location.pathname === path;

  const navItems = [
    { label: 'Geral', path: '/app', icon: 'ph-house' },
    { label: 'Aplicações', path: '#', icon: 'ph-hard-drives' },
    { label: 'Histórico Alertas', path: '#', icon: 'ph-bell' },
  ];

  const adminItems = [
    { label: 'Usuários', path: '/app/users', icon: 'ph-user' },
    { label: 'Códigos', path: '/app/codes', icon: 'ph-lock' },
  ];

  return (
    <aside className="w-72 fixed h-screen bg-slate-900 border-r border-slate-800 flex flex-col px-6 py-9 shrink-0 justify-between z-30">
      <div>
        <Link to="/" className="flex items-center justify-center -ml-5 mb-12">
          <img src="/assets/img/logo/logo-light.svg" alt="Logo da Microhub" className="max-h-11" />
        </Link>

        <div className="flex flex-col gap-4">
          {navItems.map((item) => {
            const active = isActive(item.path);
            return (
              <Link
                key={item.label}
                to={item.path}
                className={`font-medium transition-all flex items-center gap-3 text-lg py-2.5 px-3 rounded-xl cursor-pointer ${
                  active
                    ? 'bg-blue-600/15 text-blue-400 font-semibold'
                    : 'text-slate-300 hover:text-blue-400 hover:bg-slate-800/60'
                }`}
              >
                <i className={`ph ${item.icon} text-2xl`}></i>
                <span>{item.label}</span>
              </Link>
            );
          })}

          {isAdmin && (
            <>
              <div className="border-t border-slate-800 my-2"></div>
              <span className="text-xs uppercase tracking-wider text-slate-500 font-semibold px-3">
                Administração
              </span>
              {adminItems.map((item) => {
                const active = isActive(item.path);
                return (
                  <Link
                    key={item.label}
                    to={item.path}
                    className={`font-medium transition-all flex items-center gap-3 text-lg py-2.5 px-3 rounded-xl cursor-pointer ${
                      active
                        ? 'bg-blue-600/15 text-blue-400 font-semibold'
                        : 'text-slate-300 hover:text-blue-400 hover:bg-slate-800/60'
                    }`}
                  >
                    <i className={`ph ${item.icon} text-2xl`}></i>
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </>
          )}
        </div>
      </div>

      <div className="flex justify-between items-center bg-slate-800/80 border border-slate-700/60 px-4 py-3 rounded-xl shadow-lg">
        <div className="flex items-center gap-3 overflow-hidden">
          <div className="rounded-full bg-slate-950 size-10 shrink-0 flex justify-center items-center font-bold text-blue-400 border border-slate-700">
            {initials}
          </div>
          <div className="flex flex-col truncate">
            <span className="font-semibold text-slate-100 text-sm truncate">
              {user?.name || 'Usuário'}
            </span>
            <span className="text-xs text-slate-400 truncate">
              {isAdmin ? 'Gerente / Admin' : 'Colaborador'}
            </span>
          </div>
        </div>
        <button
          type="button"
          onClick={logout}
          title="Sair da conta"
          className="text-slate-400 hover:text-red-400 transition-colors p-1 cursor-pointer"
        >
          <i className="ph ph-sign-out text-2xl"></i>
        </button>
      </div>
    </aside>
  );
}
