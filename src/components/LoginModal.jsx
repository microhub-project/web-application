import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

export default function LoginModal({ isOpen, onClose, onOpenRegister }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();

    const trimmedEmail = email.trim();
    if (!trimmedEmail) {
      return showToast('Preencha o campo email', 'warning');
    }
    if (!password) {
      return showToast('Preencha o campo senha', 'warning');
    }

    try {
      setLoading(true);
      const res = await fetch('/usuarios/autenticar', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: trimmedEmail,
          password: password,
        }),
      });

      const data = await res.json();

      if (res.status === 500) {
        return showToast(data.message || 'Erro no servidor', 'error');
      }

      if (String(res.status)[0] === '4') {
        return showToast(data.message || 'Credenciais inválidas', 'warning');
      }

      showToast(data.message || 'Login realizado com sucesso!', 'success');
      login(data.body);
      setEmail('');
      setPassword('');
      onClose();
      navigate('/app');
    } catch (err) {
      console.error(err);
      showToast('Algo deu errado. Tente novamente mais tarde', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 transition-all duration-300">
      <div className="relative w-full max-w-md bg-slate-900 border border-slate-700 rounded-2xl p-8 shadow-2xl">
        <button
          type="button"
          onClick={onClose}
          className="absolute top-5 right-5 text-slate-400 hover:text-white cursor-pointer transition-all duration-300"
        >
          <i className="ph ph-x text-3xl"></i>
        </button>

        <div className="mb-5">
          <h2 className="text-3xl font-semibold text-white">Entrar</h2>
          <p className="text-slate-400 mt-2">Entre na sua conta da Microhub</p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <div className="flex flex-col gap-1.5">
            <label htmlFor="emailLogin" className="text-sm text-slate-300">
              E-mail
            </label>
            <input
              type="email"
              id="emailLogin"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Digite seu email"
              className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg outline-none focus:border-blue-500 transition-colors text-slate-100"
              required
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="senhaLogin" className="text-sm text-slate-300">
              Senha (mínimo de 8 caracteres)
            </label>
            <input
              type="password"
              id="senhaLogin"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Digite sua senha"
              className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg outline-none focus:border-blue-500 transition-colors text-slate-100"
              required
            />
          </div>

          <div className="flex justify-between items-center text-sm text-slate-400">
            <span
              onClick={() => {
                onClose();
                if (onOpenRegister) onOpenRegister();
              }}
              className="cursor-pointer hover:text-blue-400 transition-colors"
            >
              Não tem conta? Cadastre-se
            </span>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 mt-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 rounded-lg font-medium transition-colors cursor-pointer flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <i className="ph ph-spinner text-xl animate-spin"></i>
                <span>Entrando...</span>
              </>
            ) : (
              <span>Entrar</span>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}