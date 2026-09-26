import { useState, useEffect, useCallback } from 'react';
import AppLayout from '../components/AppLayout';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

const roleHash = {
  0: 'Novo parceiro',
  1: 'Gerente TI',
  2: 'FinOps',
  3: 'DevOps',
};

const dateToTime = (date) => {
  if (!date) return '';
  const incomingDate = new Date(date);
  const nowDate = new Date();
  const diferenceMs = Math.abs(nowDate.getTime() - incomingDate.getTime());

  const seconds = (diferenceMs / 1000).toFixed(0);
  const minutes = (diferenceMs / (1000 * 60)).toFixed(0);
  const hours = (diferenceMs / (1000 * 60 * 60)).toFixed(0);
  const days = (diferenceMs / (1000 * 60 * 60 * 24)).toFixed(0);

  if (seconds < 60) return seconds + ' segundo' + (seconds > 1 ? 's' : '');
  if (minutes < 60) return minutes + ' minuto' + (minutes > 1 ? 's' : '');
  if (hours < 24) return hours + ' hora' + (hours > 1 ? 's' : '');
  return days + ' dia' + (days > 1 ? 's' : '');
};

export default function CodesPage() {
  const { user } = useAuth();
  const { showToast } = useToast();

  const [codes, setCodes] = useState([]);
  const [loading, setLoading] = useState(true);

  // New code generation state
  const [newRole, setNewRole] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [showSendModal, setShowSendModal] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  // Resend code modal
  const [resendCodeTarget, setResendCodeTarget] = useState(null);
  const [resendEmail, setResendEmail] = useState('');

  // Disable code modal
  const [disableCodeTarget, setDisableCodeTarget] = useState(null);

  // Edit role modal
  const [editRoleTarget, setEditRoleTarget] = useState(null);
  const [editRoleValue, setEditRoleValue] = useState(null);

  const fetchCodes = useCallback(async () => {
    if (!user?.id || !user?.companyId) return;

    try {
      setLoading(true);
      const res = await fetch(`/code/getAll?userId=${user.id}&companyId=${user.companyId}`);
      if (res.status === 204) {
        setCodes([]);
        return;
      }

      const json = await res.json();
      if (res.status === 200 && json.data) {
        setCodes(Array.isArray(json.data) ? json.data : []);
      } else {
        showToast(json.message || 'Erro ao carregar códigos', 'error');
      }
    } catch (err) {
      console.error(err);
      showToast('Erro ao buscar códigos de ativação', 'error');
    } finally {
      setLoading(false);
    }
  }, [user, showToast]);

  useEffect(() => {
    fetchCodes();
  }, [fetchCodes]);

  const handleCopyCode = (codigo) => {
    navigator.clipboard.writeText(codigo);
    showToast('Código copiado para sua área de transferência.', 'success');
  };

  const handleStartGenerate = (e) => {
    e.preventDefault();
    if (newRole === '' || newRole === undefined) {
      return showToast('Selecione um cargo', 'warning');
    }
    const emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,}$/;
    if (!newEmail || !emailRegex.test(newEmail.trim())) {
      return showToast('Digite um email válido', 'warning');
    }

    setShowSendModal(true);
  };

  const handleConfirmSendCode = async () => {
    try {
      setActionLoading(true);
      const res = await fetch('/code/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          companyId: user.companyId,
          role: Number(newRole),
          email: newEmail.trim(),
        }),
      });

      const json = await res.json();
      if (res.status === 200) {
        showToast(json.message || 'Código gerado e enviado com sucesso!', 'success');
        setShowSendModal(false);
        setNewRole('');
        setNewEmail('');
        fetchCodes();
      } else {
        showToast(json.message || 'Erro ao gerar código', 'error');
      }
    } catch (err) {
      console.error(err);
      showToast('Algo deu errado. Tente novamente mais tarde', 'error');
    } finally {
      setActionLoading(false);
    }
  };

  const handleConfirmResend = async () => {
    const emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,}$/;
    if (!resendEmail || !emailRegex.test(resendEmail.trim())) {
      return showToast('Email inválido', 'warning');
    }

    try {
      setActionLoading(true);
      const res = await fetch('/code/edit', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: resendCodeTarget.id,
          role: null,
          email: resendEmail.trim(),
          isRenewal: true,
        }),
      });

      const json = await res.json();
      if (res.status === 200) {
        showToast(json.message || 'Código renovado e reenviado!', 'success');
        setResendCodeTarget(null);
        setResendEmail('');
        fetchCodes();
      } else {
        showToast(json.message || 'Erro ao reenviar código', 'error');
      }
    } catch (err) {
      console.error(err);
      showToast('Algo deu errado ao reenviar', 'error');
    } finally {
      setActionLoading(false);
    }
  };

  const handleConfirmDisable = async () => {
    try {
      setActionLoading(true);
      const res = await fetch('/code/disable', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: disableCodeTarget.id }),
      });

      const json = await res.json();
      if (res.status === 200) {
        showToast(json.message || 'Código desativado com sucesso!', 'success');
        setDisableCodeTarget(null);
        fetchCodes();
      } else {
        showToast(json.message || 'Erro ao desativar código', 'error');
      }
    } catch (err) {
      console.error(err);
      showToast('Algo deu errado ao desativar', 'error');
    } finally {
      setActionLoading(false);
    }
  };

  const handleConfirmEditRole = async () => {
    try {
      setActionLoading(true);
      const res = await fetch('/code/edit', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: editRoleTarget.id,
          role: Number(editRoleValue),
          email: null,
          isRenewal: false,
        }),
      });

      const json = await res.json();
      if (res.status === 200) {
        showToast(json.message || 'Cargo atualizado com sucesso!', 'success');
        setEditRoleTarget(null);
        setEditRoleValue(null);
        fetchCodes();
      } else {
        showToast(json.message || 'Erro ao atualizar cargo', 'error');
      }
    } catch (err) {
      console.error(err);
      showToast('Algo deu errado ao atualizar cargo', 'error');
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <AppLayout adminOnly>
      <div className="flex flex-col gap-8 w-full max-w-6xl mx-auto pb-16">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-100">Códigos de Ativação</h1>
          <p className="text-slate-400 mt-1">
            Gere códigos para novos colaboradores ou parceiros entrarem na sua organização.
          </p>
        </div>

        {/* GENERATE NEW CODE CARD */}
        <div className="bg-slate-800/80 border border-slate-700/80 p-6 rounded-2xl flex flex-col gap-5 shadow-xl">
          <h2 className="text-xl font-bold text-slate-100 flex items-center gap-2">
            <i className="ph ph-plus-circle text-blue-400 text-2xl"></i>
            Gerar novo código
          </h2>
          <div className="border-t border-slate-700/60"></div>
          <form onSubmit={handleStartGenerate} className="flex flex-col md:flex-row gap-4 items-center">
            <div className="flex items-center gap-2 bg-slate-900/90 border border-slate-700 px-4 py-3 rounded-xl w-full md:w-64">
              <i className="ph-bold ph-briefcase text-2xl text-blue-400 shrink-0"></i>
              <select
                value={newRole}
                onChange={(e) => setNewRole(e.target.value)}
                className="bg-transparent text-slate-200 outline-none w-full text-base cursor-pointer"
                required
              >
                <option value="" disabled className="bg-slate-900">
                  Selecione um cargo
                </option>
                {Number(user?.role) === 1 && Number(user?.companyId) === 1 && (
                  <option value="0" className="bg-slate-900">
                    Novo parceiro
                  </option>
                )}
                <option value="1" className="bg-slate-900">
                  Gerente TI
                </option>
                <option value="2" className="bg-slate-900">
                  FinOps
                </option>
                <option value="3" className="bg-slate-900">
                  DevOps
                </option>
              </select>
            </div>

            <div className="flex-1 w-full">
              <input
                type="email"
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
                placeholder="Digite o email do destinatário"
                className="w-full px-4 py-3 bg-slate-900/90 border border-slate-700 rounded-xl outline-none focus:border-blue-500 transition-colors text-slate-100"
                required
              />
            </div>

            <button
              type="submit"
              className="py-3 px-6 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-medium transition-all cursor-pointer flex items-center gap-2 shadow-lg shadow-blue-600/30 shrink-0"
            >
              <i className="ph-bold ph-paper-plane-tilt text-xl"></i>
              <span>Enviar código</span>
            </button>
          </form>
        </div>

        {/* CODES LIST */}
        <section className="flex flex-col gap-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold text-slate-200">Códigos Gerados</h2>
            <button
              type="button"
              onClick={fetchCodes}
              className="text-sm text-slate-400 hover:text-blue-400 flex items-center gap-1 cursor-pointer"
            >
              <i className="ph ph-arrows-clockwise text-lg"></i> Atualizar lista
            </button>
          </div>

          {loading ? (
            <div className="py-12 flex justify-center items-center text-slate-400 gap-3">
              <i className="ph ph-spinner text-3xl animate-spin text-blue-400"></i>
              <span>Carregando códigos...</span>
            </div>
          ) : codes.length === 0 ? (
            <div className="bg-slate-800/40 border border-slate-700/50 rounded-2xl p-12 text-center text-slate-400">
              <i className="ph ph-ticket text-5xl mb-3 text-slate-500"></i>
              <p className="text-lg">Nenhum código de ativação ativo ou registrado.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {codes.map((code) => {
                const isUsed = Boolean(code.usado_em);
                const isExpired = new Date(code.expira_em) < new Date();

                return (
                  <div
                    key={code.id}
                    className="bg-slate-800/80 border border-slate-700/80 p-6 rounded-2xl flex flex-col gap-4 shadow-lg hover:border-slate-600 transition-all"
                  >
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2 bg-slate-900/60 px-3 py-1.5 rounded-lg border border-slate-700/60">
                        <i className="ph-bold ph-briefcase text-lg text-blue-400"></i>
                        <select
                          value={code.cargo}
                          onChange={(e) => {
                            setEditRoleTarget(code);
                            setEditRoleValue(e.target.value);
                          }}
                          className="bg-transparent text-sm font-semibold text-slate-200 outline-none cursor-pointer"
                        >
                          {Number(user?.role) === 1 && Number(user?.companyId) === 1 && (
                            <option value="0" className="bg-slate-900">
                              Novo parceiro
                            </option>
                          )}
                          <option value="1" className="bg-slate-900">
                            Gerente TI
                          </option>
                          <option value="2" className="bg-slate-900">
                            FinOps
                          </option>
                          <option value="3" className="bg-slate-900">
                            DevOps
                          </option>
                        </select>
                      </div>

                      <h3 className="text-2xl font-black tracking-widest text-blue-400 font-mono">
                        {code.codigo}
                      </h3>

                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => handleCopyCode(code.codigo)}
                          title="Copiar código"
                          className="p-2 text-slate-400 hover:text-blue-400 hover:bg-slate-700/60 rounded-lg transition-colors cursor-pointer"
                        >
                          <i className="ph-bold ph-copy-simple text-xl"></i>
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setResendCodeTarget(code);
                            setResendEmail('');
                          }}
                          disabled={isUsed}
                          title="Reenviar e renovar"
                          className="p-2 text-slate-400 hover:text-emerald-400 hover:bg-slate-700/60 rounded-lg transition-colors cursor-pointer disabled:opacity-30 disabled:pointer-events-none"
                        >
                          <i className="ph-bold ph-arrows-clockwise text-xl"></i>
                        </button>
                        <button
                          type="button"
                          onClick={() => setDisableCodeTarget(code)}
                          title="Desativar código"
                          className="p-2 text-slate-400 hover:text-rose-400 hover:bg-slate-700/60 rounded-lg transition-colors cursor-pointer"
                        >
                          <i className="ph-bold ph-trash-simple text-xl"></i>
                        </button>
                      </div>
                    </div>

                    <div className="border-t border-slate-700/50"></div>

                    <div className="flex flex-col gap-1.5 text-xs text-slate-300">
                      <span className="flex items-center gap-2">
                        <i className="ph ph-calendar-dot text-base text-slate-400"></i>
                        Criado há {dateToTime(code.criado_em)} atrás
                      </span>

                      {isUsed ? (
                        <span className="flex items-center gap-2 text-emerald-400 font-medium">
                          <i className="ph ph-calendar-check text-base"></i>
                          Usado há {dateToTime(code.usado_em)} atrás
                        </span>
                      ) : !isExpired ? (
                        <span className="flex items-center gap-2 text-blue-400 font-medium">
                          <i className="ph ph-calendar-x text-base"></i>
                          Expirará em {dateToTime(code.expira_em)}
                        </span>
                      ) : (
                        <span className="flex items-center gap-2 text-rose-400 font-medium">
                          <i className="ph ph-calendar-x text-base"></i>
                          Expirou há {dateToTime(code.expira_em)} atrás
                        </span>
                      )}

                      {code.atualizado_em && (
                        <span className="flex items-center gap-2 text-slate-400">
                          <i className="ph ph-calendar-plus text-base"></i>
                          Última atualização há {dateToTime(code.atualizado_em)} atrás
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>

        {/* MODAL: CONFIRM GENERATE */}
        {showSendModal && (
          <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-slate-900 border border-slate-700 rounded-2xl p-8 max-w-md w-full shadow-2xl flex flex-col gap-6">
              <h2 className="text-xl font-bold text-slate-100">Confirme o envio do código</h2>
              <div className="flex flex-col gap-2 text-slate-300 bg-slate-800/80 p-4 rounded-xl border border-slate-700/60">
                <p>
                  <strong className="text-slate-100">Cargo:</strong> {roleHash[newRole]}
                </p>
                <p>
                  <strong className="text-slate-100">Destinatário:</strong> {newEmail}
                </p>
              </div>
              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={() => setShowSendModal(false)}
                  className="w-1/2 py-3 border border-slate-700 hover:bg-slate-800 text-slate-300 rounded-xl font-medium cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  disabled={actionLoading}
                  onClick={handleConfirmSendCode}
                  className="w-1/2 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-medium shadow-lg shadow-blue-600/30 cursor-pointer flex items-center justify-center gap-2"
                >
                  {actionLoading ? <i className="ph ph-spinner animate-spin text-xl"></i> : 'Confirmar'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* MODAL: RESEND CODE */}
        {resendCodeTarget && (
          <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-slate-900 border border-slate-700 rounded-2xl p-8 max-w-md w-full shadow-2xl flex flex-col gap-6">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold text-slate-100">
                  Reenviar código <span className="text-blue-400">{resendCodeTarget.codigo}</span>
                </h2>
                <button
                  type="button"
                  onClick={() => setResendCodeTarget(null)}
                  className="text-slate-400 hover:text-white"
                >
                  <i className="ph ph-x text-2xl"></i>
                </button>
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-slate-300">Novo e-mail de destino</label>
                <input
                  type="email"
                  value={resendEmail}
                  onChange={(e) => setResendEmail(e.target.value)}
                  placeholder="Digite o email a receber"
                  className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl outline-none focus:border-blue-500 text-slate-100"
                />
              </div>
              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={() => setResendCodeTarget(null)}
                  className="w-1/2 py-3 border border-slate-700 hover:bg-slate-800 text-slate-300 rounded-xl font-medium cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  disabled={actionLoading}
                  onClick={handleConfirmResend}
                  className="w-1/2 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-medium shadow-lg shadow-blue-600/30 cursor-pointer flex items-center justify-center gap-2"
                >
                  {actionLoading ? <i className="ph ph-spinner animate-spin text-xl"></i> : 'Reenviar'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* MODAL: DISABLE CODE */}
        {disableCodeTarget && (
          <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-slate-900 border border-slate-700 rounded-2xl p-8 max-w-md w-full shadow-2xl flex flex-col gap-6">
              <h2 className="text-xl font-bold text-slate-100">
                Desativar código <span className="text-rose-400 font-mono">{disableCodeTarget.codigo}</span>?
              </h2>
              <p className="text-sm text-slate-300">
                Tem certeza que deseja invalidar este código de ativação? Novos cadastros não poderão utilizá-lo.
              </p>
              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={() => setDisableCodeTarget(null)}
                  className="w-1/2 py-3 border border-slate-700 hover:bg-slate-800 text-slate-300 rounded-xl font-medium cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  disabled={actionLoading}
                  onClick={handleConfirmDisable}
                  className="w-1/2 py-3 bg-rose-600 hover:bg-rose-500 text-white rounded-xl font-medium shadow-lg shadow-rose-600/30 cursor-pointer flex items-center justify-center gap-2"
                >
                  {actionLoading ? <i className="ph ph-spinner animate-spin text-xl"></i> : 'Desativar'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* MODAL: EDIT ROLE */}
        {editRoleTarget && (
          <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-slate-900 border border-slate-700 rounded-2xl p-8 max-w-md w-full shadow-2xl flex flex-col gap-6">
              <h2 className="text-xl font-bold text-slate-100">Confirmar alteração de cargo</h2>
              <p className="text-sm text-slate-300">
                Deseja alterar o cargo do código <strong className="text-blue-400 font-mono">{editRoleTarget.codigo}</strong> para{' '}
                <strong className="text-emerald-400">{roleHash[editRoleValue]}</strong>?
              </p>
              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={() => {
                    setEditRoleTarget(null);
                    setEditRoleValue(null);
                  }}
                  className="w-1/2 py-3 border border-slate-700 hover:bg-slate-800 text-slate-300 rounded-xl font-medium cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  disabled={actionLoading}
                  onClick={handleConfirmEditRole}
                  className="w-1/2 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-medium shadow-lg shadow-blue-600/30 cursor-pointer flex items-center justify-center gap-2"
                >
                  {actionLoading ? <i className="ph ph-spinner animate-spin text-xl"></i> : 'Alterar cargo'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AppLayout>
  );
}
