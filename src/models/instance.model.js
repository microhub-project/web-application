import database from "../database/config.js";

const create = async (uuid) => {
  const query = "";
  return await database.execute(query, [uuid]);
};
// instancia `uuid`, `endereco_mac`, `tipo_uuid`, `custo_mensal`, `status`, `microsservico_uuid`
// tipo `uuid`, `nome`, `cpu`, `ram`, `custo_computacao`
// volume `uuid`, `armazenamento`, `custo_giga`, `instancia_uuid`, `status`
const getAll = async (empresa_uuid) => {
  const query = "SELECT BIN_TO_UUID(i.uuid) AS uuid, i.endereco_mac, t.nome FROM instancia i JOIN microsservico m on i.microsservico_uuid = m.uuid JOIN tipo t ON i.tipo_uuid = t.uuid WHERE m.empresa_uuid = UUID_TO_BIN(?) AND m.deletado_em IS NULL AND i.deletado_em IS NULL;";
  return await database.execute(query, [empresa_uuid]);
};

export default {
  create,
  getAll
};