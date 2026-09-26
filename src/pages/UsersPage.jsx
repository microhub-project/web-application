import { useState, useEffect, useCallback } from 'react';
import AppLayout from '../components/AppLayout';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

export default function UsersPage() {
  const { user } = useAuth();
  const { showToast } = useToast();

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  // Update modal state
  const [selectedUser, setSelectedUser] = useState(null);
  const [updateOption, setUpdateOption] = useState('');
  const [newName, setNewName] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newRole, setNewRole] = useState('1');
  const [isUpdating, setIsUpdating] = useState(false);

  // Delete modal state
  const [userToDelete, setUserToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchUsers = useCallback(async () => {
    if (!user?.id) return;

    try {
      setLoading(true);
      const res = await fetch(`/usuarios/listar/${user.id}`);
      if (res.status === 200) {
        const data = await res.json();
        setUsers(Array.isArray(data) ? data : []);
      } else {
        showToast('Erro ao listar usuários', 'error');
      }
    } catch (err) {
      console.error(err);
      showToast('Algo deu errado. Tente novamente mais tarde', 'error');
    } finally {
      setLoading(false);
    }
  }, [user, showToast]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleSearch = async (e) => {
    if (e) e.preventDefault();
    const term = searchTerm.trim();

    if (!term) {
      return fetchUsers();
    }

    try {
      setLoading(true);
      const res = await fetch(`/usuarios/pesquisar/${encodeURIComponent(term)}`);
      if (res.status === 200) {
        const data = await res.json();
        setUsers(Array.isArray(data) ? data : []);
      } else {
        showToast('Erro ao pesquisar usuários', 'error');
      }
    } catch (err) {
      console.error(err);
      showToast('Algo deu errado ao pesquisar', 'error');
    } finally {
      setLoading(false);
    }
  };

  const getRoleBadge = (cargo) => {
    const roleNum = Number(cargo);
    if (roleNum === 1) {
      return <span className="px-3 py-1 rounded-full text-xs font-semibold bg-blue-500/20 text-blue-400 border border-blue-500/30">Gerente</span>;
    }
    if (roleNum === 2) {
      return <span className="px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">FinOps</span>;
    }
    if (roleNum === 3) {
      return <span className="px-3 py-1 rounded-full text-xs font-semibold bg-purple-500/20 text-purple-400 border border-purple-500/30">Dev / DevOps</span>;
    }
    return <span className="px-3 py-1 rounded-full text-xs font-semibold bg-slate-500/20 text-slate-300 border border-slate-500/30">Administrador</span>;
  };

  const handleOpenUpdate = (u) => {
    setSelectedUser(u);
    setUpdateOption('');
    setNewName('');
    setNewEmail('');
    setNewRole(String(u.cargo || 1));
  };

  const handleSaveUpdate = async () => {
    if (!updateOption) {
      return showToast('Selecione o que deseja atualizar', 'warning');
    }

    const payload = {};
    if (updateOption === 'nome') {
      if (!newName.trim()) return showToast('Digite o novo nome', 'warning');
      payload.nome = newName.trim();
    } else if (updateOption === 'email') {
      const emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,}$/;
      if (!newEmail.trim() || !emailRegex.test(newEmail.trim())) {
        return showToast('Digite um e-mail válido', 'warning');
      }
      payload.email = newEmail.trim();
    } else if (updateOption === 'cargo') {
      payload.cargo = Number(newRole);
    }

    try {
      setIsUpdating(true);
      const res = await fetch(`/usuarios/atualizar/${selectedUser.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const json = await res.json();
      if (res.status === 200) {
        showToast(json.message || 'Usuário atualizado com sucesso!', 'success');
        setSelectedUser(null);
        fetchUsers();
      } else {
        showToast(json.message || 'Erro ao atualizar usuário', 'error');
      }
    } catch (err) {
      console.error(err);
      showToast('Algo deu errado ao atualizar', 'error');
    } finally {
      setIsUpdating(false);
    }
  };

  const handleConfirmDelete = async () => {
    if (!userToDelete) return;

    try {
      setIsDeleting(true);
      const res = await fetch(`/usuarios/excluir/${userToDelete.id}`, {
        method: 'DELETE',
      });

      const json = await res.json();
      if (res.status === 200) {
        showToast(json.message || 'Usuário excluído com sucesso!', 'success');
        setUserToDelete(null);
        fetchUsers();
      } else {
        showToast(json.message || 'Erro ao excluir usuário', 'error');
      }
    } catch (err) {
      console.error(err);
      showToast('Algo deu errado ao excluir', 'error');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <AppLayout adminOnly>
      <div className="flex flex-col gap-8 w-full max-w-6xl mx-auto pb-16">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-100">Gerenciamento de Usuários</h1>
          <p className="text-blue-400 font-semibold text-lg mt-1">
            @{user?.companyName || 'Empresa Parceira'}
          </p>
        </div>

        {/* SEARCH BAR */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 bg-slate-800/80 border border-slate-700/80 p-4 rounded-2xl shadow-xl">
          <form onSubmit={handleSearch} className="flex gap-3 w-full sm:w-auto flex-1 max-w-md">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Pesquisar por nome..."
              className="w-full px-4 py-2.5 bg-slate-900/90 border border-slate-700 rounded-xl outline-none focus:border-blue-500 text-slate-100 transition-colors"
            />
            <button
              type="submit"
              className="py-2.5 px-5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-medium transition-all cursor-pointer flex items-center gap-2 shrink-0 shadow-md shadow-blue-600/30"
            >
              <i className="ph ph-magnifying-glass text-lg"></i>
              <span>Pesquisar</span>
            </button>
          </form>

          {searchTerm && (
            <button
              type="button"
              onClick={() => {
                setSearchTerm('');
                fetchUsers();
              }}
              className="text-xs text-slate-400 hover:text-white underline cursor-pointer"
            >
              Limpar pesquisa
            </button>
          )}
        </div>

        {/* USERS TABLE */}
        <div className="bg-slate-800/80 border border-slate-700/80 rounded-2xl shadow-xl overflow-hidden flex flex-col">
          <div className="grid grid-cols-12 px-6 py-4 bg-slate-900/80 text-xs font-bold uppercase tracking-wider text-slate-400 border-b border-slate-700/60">
            <span className="col-span-5">Nome</span>
            <span className="col-span-4">Cargo</span>
            <span className="col-span-3 text-right">Ações</span>
          </div>

          {loading ? (
            <div className="py-16 flex justify-center items-center text-slate-400 gap-3">
              <i className="ph ph-spinner text-3xl animate-spin text-blue-400"></i>
              <span>Carregando usuários...</span>
            </div>
          ) : users.length === 0 ? (
            <div className="py-16 text-center text-slate-400">
              <i className="ph ph-users text-5xl mb-2 text-slate-500"></i>
              <p>Nenhum usuário encontrado.</p>
            </div>
          ) : (
            <div className="divide-y divide-slate-700/50">
              {users.map((u) => (
                <div
                  key={u.id}
                  className="grid grid-cols-12 items-center px-6 py-4 hover:bg-slate-750/50 transition-colors"
                >
                  <div className="col-span-5 flex items-center gap-3">
                    <div className="size-9 rounded-full bg-slate-900 border border-slate-700 flex items-center justify-center font-bold text-xs text-blue-400">
                      {u.nome?.slice(0, 2).toUpperCase()}
                    </div>
                    <span className="font-semibold text-slate-100 truncate">{u.nome}</span>
                  </div>

                  <div className="col-span-4 flex items-center">
                    {getRoleBadge(u.cargo)}
                  </div>

                  <div className="col-span-3 flex justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => handleOpenUpdate(u)}
                      className="px-3.5 py-1.5 bg-slate-700 hover:bg-blue-600 text-slate-200 hover:text-white rounded-lg text-xs font-medium transition-colors cursor-pointer flex items-center gap-1.5"
                    >
                      <i className="ph ph-pencil-simple text-sm"></i>
                      <span>Atualizar</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setUserToDelete(u)}
                      className="px-3.5 py-1.5 bg-rose-950/40 hover:bg-rose-600 border border-rose-800/40 hover:border-transparent text-rose-300 hover:text-white rounded-lg text-xs font-medium transition-colors cursor-pointer flex items-center gap-1.5"
                    >
                      <i className="ph ph-trash text-sm"></i>
                      <span>Excluir</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* MODAL: UPDATE USER */}
        {selectedUser && (
          <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-slate-900 border border-slate-700 rounded-2xl p-8 max-w-md w-full shadow-2xl flex flex-col gap-5">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold text-slate-100">
                  Atualizar: <span className="text-blue-400">{selectedUser.nome}</span>
                </h2>
                <button
                  type="button"
                  onClick={() => setSelectedUser(null)}
                  className="text-slate-400 hover:text-white cursor-pointer"
                >
                  <i className="ph ph-x text-2xl"></i>
                </button>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-slate-300">O que deseja atualizar?</label>
                <select
                  value={updateOption}
                  onChange={(e) => setUpdateOption(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl outline-none focus:border-blue-500 text-slate-100 cursor-pointer"
                >
                  <option value="">Selecione uma opção</option>
                  <option value="nome">Nome</option>
                  <option value="email">E-mail</option>
                  <option value="cargo">Cargo</option>
                </select>
              </div>

              {updateOption === 'nome' && (
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-medium text-slate-300">Novo nome</label>
                  <input
                    type="text"
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    placeholder="Digite o novo nome"
                    className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl outline-none focus:border-blue-500 text-slate-100"
                  />
                </div>
              )}

              {updateOption === 'email' && (
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-medium text-slate-300">Novo e-mail</label>
                  <input
                    type="email"
                    value={newEmail}
                    onChange={(e) => setNewEmail(e.target.value)}
                    placeholder="Digite o novo e-mail"
                    className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl outline-none focus:border-blue-500 text-slate-100"
                  />
                </div>
              )}

              {updateOption === 'cargo' && (
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-medium text-slate-300">Novo cargo</label>
                  <select
                    value={newRole}
                    onChange={(e) => setNewRole(e.target.value)}
                    className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl outline-none focus:border-blue-500 text-slate-100 cursor-pointer"
                  >
                    <option value="1">Gerente</option>
                    <option value="2">FinOps</option>
                    <option value="3">Dev / DevOps</option>
                  </select>
                </div>
              )}

              {updateOption && (
                <button
                  type="button"
                  disabled={isUpdating}
                  onClick={handleSaveUpdate}
                  className="w-full py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-medium transition-all shadow-lg shadow-blue-600/30 cursor-pointer flex items-center justify-center gap-2 mt-2"
                >
                  {isUpdating ? (
                    <i className="ph ph-spinner animate-spin text-xl"></i>
                  ) : (
                    <>
                      <i className="ph ph-check text-xl"></i>
                      <span>Confirmar atualização</span>
                    </>
                  )}
                </button>
              )}
            </div>
          </div>
        )}

        {/* MODAL: DELETE USER */}
        {userToDelete && (
          <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-slate-900 border border-slate-700 rounded-2xl p-8 max-w-md w-full shadow-2xl flex flex-col gap-6">
              <h2 className="text-xl font-bold text-slate-100">Excluir usuário</h2>
              <p className="text-sm text-slate-300 leading-relaxed">
                Tem certeza que deseja excluir o usuário <strong className="text-rose-400">{userToDelete.nome}</strong>? Essa ação não poderá ser desfeita.
              </p>
              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={() => setUserToDelete(null)}
                  className="w-1/2 py-3 border border-slate-700 hover:bg-slate-800 text-slate-300 rounded-xl font-medium cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  disabled={isDeleting}
                  onClick={handleConfirmDelete}
                  className="w-1/2 py-3 bg-rose-600 hover:bg-rose-500 text-white rounded-xl font-medium shadow-lg shadow-rose-600/30 cursor-pointer flex items-center justify-center gap-2"
                >
                  {isDeleting ? <i className="ph ph-spinner animate-spin text-xl"></i> : 'Excluir'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AppLayout>
  );
}
