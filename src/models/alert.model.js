import database from "../database/config.js";

const getAll = async (empresa_uuid, filters = {}) => {
  let query = `
    SELECT
      BIN_TO_UUID(a.uuid) AS uuid,
      a.prioridade,
      a.descricao,
      a.valor_detectado,
      a.status,
      a.criado_em,
      a.data_hora_resolvido,
      BIN_TO_UUID(a.resolvido_por) AS resolvido_por,
      i.nome AS instancia,
      c.nome AS componente,
      itc.limite_maximo,
      itc.limite_minimo
    FROM alerta a
    JOIN instancia_tem_componente itc
      ON a.instancia_tem_componente_componente_uuid = itc.componente_uuid
     AND a.instancia_tem_componente_instancia_uuid = itc.instancia_uuid
    JOIN instancia i
      ON itc.instancia_uuid = i.uuid
    JOIN microsservico m
      ON i.microsservico_uuid = m.uuid
    JOIN componente c
      ON itc.componente_uuid = c.uuid
    WHERE m.empresa_uuid = UUID_TO_BIN(?)
  `;

  const params = [empresa_uuid];

  if (filters.data) {
    query += " AND DATE(a.criado_em) = ?";
    params.push(filters.data);
  }

  if (filters.instancia && filters.instancia !== "Todos") {
    query += " AND i.nome = ?";
    params.push(filters.instancia);
  }

  if (filters.componente && filters.componente !== "Todos") {
    query += " AND c.nome = ?";
    params.push(filters.componente);
  }

  if (filters.severidade && filters.severidade !== "Todos") {
    query += " AND a.prioridade = ?";
    params.push(filters.severidade);
  }

  if (filters.status !== undefined && filters.status !== null && filters.status !== "" && filters.status !== "Todos") {
    query += " AND a.status = ?";
    params.push(filters.status);
  }

  if (filters.resolvido_por && filters.resolvido_por !== "Todos") {
    query += " AND a.resolvido_por = UUID_TO_BIN(?)";
    params.push(filters.resolvido_por);
  }

  query += " ORDER BY a.criado_em DESC;";

  console.log("[SQL EM USO]", query, params);
  const [alerts] = await database.execute(query, params);

  const [usuarios] = await database.execute(
    `SELECT BIN_TO_UUID(uuid) AS uuid, nome
     FROM usuario
     WHERE empresa_uuid = UUID_TO_BIN(?) AND deletado_em IS NULL
     ORDER BY nome ASC`,
    [empresa_uuid]
  );

  return {
    alerts,
    usuarios
  };
};

const alterResolvidoPor = async (resolvido_por, empresa_uuid, uuid) => {
  const query = `
    UPDATE alerta
    SET
      status = 0,
      resolvido_por = UUID_TO_BIN(?),
      empresa_uuid = UUID_TO_BIN(?),
      data_hora_resolvido = CURRENT_TIMESTAMP()
    WHERE uuid = UUID_TO_BIN(?);
  `;
  const [result] = await database.execute(query, [resolvido_por, empresa_uuid, uuid]);
  return result;
};

export default {
  getAll,
  alterResolvidoPor
};