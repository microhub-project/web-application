import { useState } from 'react';
import { useToast } from '../context/ToastContext';

export default function RegisterModal({ isOpen, onClose, onOpenLogin }) {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [senha2, setSenha2] = useState('');
  const [codigo, setCodigo] = useState('');
  const [loading, setLoading] = useState(false);

  const { showToast } = useToast();

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();

    const trimmedNome = nome.trim();
    const trimmedEmail = email.trim();
    const cleanCode = codigo.replace(/\s+/g, '').toUpperCase();

    const regexEmail = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,}$/;
    const regexNome = /^[A-Za-zÀ-ÖØ-öø-ÿ\s]+$/;

    if (!trimmedNome || !regexNome.test(trimmedNome) || trimmedNome.length < 3) {
      return showToast('Formato do nome incorreto! Mínimo de 3 letras.', 'warning');
    }
    if (!trimmedEmail || !regexEmail.test(trimmedEmail)) {
      return showToast('Formato do email incorreto!', 'warning');
    }
    if (!senha || senha.length < 8) {
      return showToast('A senha deve ter no mínimo 8 caracteres!', 'warning');
    }
    if (senha !== senha2) {
      return showToast('As senhas não coincidem!', 'warning');
    }
    if (!cleanCode) {
      return showToast('Código de ativação é obrigatório!', 'warning');
    }

    try {
      setLoading(true);
      const res = await fetch('/usuarios/cadastrar', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: trimmedNome,
          email: trimmedEmail,
          password: senha,
          code: cleanCode,
        }),
      });

      const data = await res.json();

      if (res.status === 400 || res.status === 401) {
        return showToast(data.message || 'Dados inválidos', 'warning');
      }

      if (res.status !== 201) {
        return showToast(data.message || 'Erro ao realizar cadastro', 'error');
      }

      showToast(data.message || 'Cadastro realizado com sucesso! Faça login para prosseguir.', 'success');
      setNome('');
      setEmail('');
      setSenha('');
      setSenha2('');
      setCodigo('');
      onClose();
      if (onOpenLogin) {
        onOpenLogin();
      }
    } catch (err) {
      console.error(err);
      showToast('Algo deu errado. Tente novamente mais tarde', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 transition-opacity duration-300">
      <div className="relative w-full max-w-md bg-slate-900 border border-slate-700 rounded-2xl p-8 shadow-2xl max-h-[90vh] overflow-y-auto">
        <button
          type="button"
          onClick={onClose}
          className="absolute top-5 right-5 text-slate-400 hover:text-white cursor-pointer transition-all duration-300"
        >
          <i className="ph ph-x text-3xl"></i>
        </button>

        <div className="mb-5">
          <h2 className="text-3xl font-semibold text-white">Cadastre-se</h2>
          <p className="text-slate-400 mt-2">Crie a sua conta na Microhub</p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <div className="flex flex-col gap-1.5">
            <label htmlFor="nome" className="text-sm text-slate-300">
              Nome
            </label>
            <input
              type="text"
              id="nome"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              placeholder="Digite seu nome completo"
              className="w-full px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-lg outline-none focus:border-blue-500 transition-colors text-slate-100"
              required
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="email" className="text-sm text-slate-300">
              E-mail
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Digite seu email"
              className="w-full px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-lg outline-none focus:border-blue-500 transition-colors text-slate-100"
              required
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="senha" className="text-sm text-slate-300">
              Senha (mínimo de 8 caracteres)
            </label>
            <input
              type="password"
              id="senha"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              placeholder="Digite sua senha"
              className="w-full px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-lg outline-none focus:border-blue-500 transition-colors text-slate-100"
              required
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="senha2" className="text-sm text-slate-300">
              Confirme a senha
            </label>
            <input
              type="password"
              id="senha2"
              value={senha2}
              onChange={(e) => setSenha2(e.target.value)}
              placeholder="Digite novamente a senha"
              className="w-full px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-lg outline-none focus:border-blue-500 transition-colors text-slate-100"
              required
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="codigo" className="text-sm text-slate-300">
              Código de ativação da empresa
            </label>
            <input
              type="text"
              id="codigo"
              value={codigo}
              onChange={(e) => setCodigo(e.target.value.toUpperCase())}
              placeholder="Insira o código de 6 caracteres"
              maxLength={12}
              className="w-full px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-lg outline-none focus:border-blue-500 transition-colors text-slate-100 uppercase tracking-widest font-mono font-bold"
              required
            />
          </div>

          <div className="flex justify-between items-center text-sm text-slate-400 mt-1">
            <span
              onClick={() => {
                onClose();
                if (onOpenLogin) onOpenLogin();
              }}
              className="cursor-pointer hover:text-blue-400 transition-colors"
            >
              Já possui conta? Entrar
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
                <span>Cadastrando...</span>
              </>
            ) : (
              <span>Criar conta</span>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}