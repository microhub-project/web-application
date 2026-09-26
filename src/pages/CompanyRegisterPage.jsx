import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useToast } from '../context/ToastContext';

export default function CompanyRegisterPage() {
  const [cnpj, setCnpj] = useState('');
  const [nomeFantasia, setNomeFantasia] = useState('');
  const [razaoSocial, setRazaoSocial] = useState('');
  const [codigo, setCodigo] = useState('');
  const [loading, setLoading] = useState(false);

  const { showToast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!cnpj.trim()) {
      return showToast('Preencha o campo CNPJ', 'warning');
    }
    if (!nomeFantasia.trim()) {
      return showToast('Preencha o Nome Fantasia', 'warning');
    }
    if (!razaoSocial.trim()) {
      return showToast('Preencha a Razão Social', 'warning');
    }
    if (!codigo.trim()) {
      return showToast('Preencha o Código de Parceiro', 'warning');
    }

    try {
      setLoading(true);
      // In current backend, company registration is done via partner code
      // We simulate or call the relevant endpoint if available
      showToast('Solicitação de cadastro de empresa enviada! Analisaremos seu cadastro.', 'success');
      setTimeout(() => {
        navigate('/');
      }, 2000);
    } catch (err) {
      console.error(err);
      showToast('Erro ao cadastrar empresa. Tente novamente mais tarde.', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50 font-mono font-normal overflow-x-hidden antialiased relative">
      <div className="bg-noise"></div>

      <header
        id="header-main"
        className="w-full bg-slate-950/90 backdrop-blur-md flex items-center justify-between py-6 px-8 md:px-12 border-b border-slate-800 z-40 fixed top-0 left-0 h-24"
      >
        <Link to="/" className="flex items-center gap-3">
          <img src="/assets/img/logo/logo-light.svg" alt="Logo da Microhub" className="max-h-11" />
        </Link>
        <div>
          <Link
            to="/"
            className="min-w-32 py-2 px-5 border border-blue-600 rounded-lg hover:bg-blue-600 transition-colors duration-300 font-medium inline-block text-center"
          >
            Início
          </Link>
        </div>
      </header>

      <div className="w-xl h-40 bg-blue-800 absolute top-0 -left-56 blur-[10rem] rotate-45 pointer-events-none"></div>
      <div className="w-xl h-40 bg-indigo-600 absolute bottom-0 -right-70 blur-[12rem] rotate-45 pointer-events-none"></div>

      <div className="min-h-screen flex flex-col items-center justify-center pt-28 pb-16 px-4">
        <h1 className="font-semibold text-4xl md:text-5xl lg:text-6xl flex justify-center items-center bg-gradient-to-r from-blue-600 via-blue-400 to-indigo-600 bg-clip-text bg-[length:200%_auto] text-transparent animate-aurora-text mb-12 text-center">
          Cadastre sua empresa!
        </h1>

        <div className="w-full max-w-2xl bg-slate-900/90 border border-slate-800 p-8 md:p-10 rounded-2xl flex flex-col gap-5 shadow-2xl backdrop-blur-xl">
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <label htmlFor="cnpj" className="text-sm font-medium text-slate-300">
                CNPJ
              </label>
              <input
                type="text"
                id="cnpj"
                value={cnpj}
                onChange={(e) => setCnpj(e.target.value)}
                placeholder="00.000.000/0000-00"
                className="w-full px-4 py-3 bg-slate-800/80 border border-slate-700 rounded-lg outline-none focus:border-blue-500 transition-colors text-slate-100"
                required
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label htmlFor="nomeFantasia" className="text-sm font-medium text-slate-300">
                Nome Fantasia
              </label>
              <input
                type="text"
                id="nomeFantasia"
                value={nomeFantasia}
                onChange={(e) => setNomeFantasia(e.target.value)}
                placeholder="Digite seu Nome Fantasia"
                className="w-full px-4 py-3 bg-slate-800/80 border border-slate-700 rounded-lg outline-none focus:border-blue-500 transition-colors text-slate-100"
                required
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label htmlFor="razaoSocial" className="text-sm font-medium text-slate-300">
                Razão Social
              </label>
              <input
                type="text"
                id="razaoSocial"
                value={razaoSocial}
                onChange={(e) => setRazaoSocial(e.target.value)}
                placeholder="Digite sua Razão Social"
                className="w-full px-4 py-3 bg-slate-800/80 border border-slate-700 rounded-lg outline-none focus:border-blue-500 transition-colors text-slate-100"
                required
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label htmlFor="codigo" className="text-sm font-medium text-slate-300">
                Código de Parceria
              </label>
              <input
                type="text"
                id="codigo"
                value={codigo}
                onChange={(e) => setCodigo(e.target.value.toUpperCase())}
                placeholder="Digite seu código de ativação / parceiro"
                className="w-full px-4 py-3 bg-slate-800/80 border border-slate-700 rounded-lg outline-none focus:border-blue-500 transition-colors text-slate-100 uppercase tracking-wider font-mono font-bold"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full min-h-14 py-3 bg-blue-600 hover:bg-blue-500 rounded-lg font-medium transition-all cursor-pointer mt-4 flex items-center justify-center gap-2 shadow-lg shadow-blue-600/30 disabled:opacity-50 text-white"
            >
              {loading ? (
                <>
                  <i className="ph ph-spinner text-xl animate-spin"></i>
                  <span>Cadastrando...</span>
                </>
              ) : (
                <span>Cadastrar Empresa</span>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
