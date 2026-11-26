import database from "../database/config.js";

const countInstancias = async (empresa_uuid) => {
  const query = `
    SELECT COUNT(*) AS total
    FROM instancia i
    JOIN microsservico m ON m.uuid = i.microsservico_uuid
    WHERE m.empresa_uuid = UUID_TO_BIN(?)
      AND i.deletado_em IS NULL;`;

  const rows = await database.execute(query, [empresa_uuid]);
  return rows[0].total;
};

const getTop4Componentes = async (empresa_uuid) => {
  const query = `
    SELECT
      c.nome_tecnico AS componente,
      COUNT(CASE WHEN YEAR(a.criado_em) = YEAR(CURDATE())
                  AND MONTH(a.criado_em) = MONTH(CURDATE())
                 THEN a.uuid END) AS no_mes,
      COUNT(CASE WHEN a.status = 0 THEN a.uuid END) AS ativos
    FROM instancia_tem_componente itc
    JOIN instancia i ON i.uuid = itc.instancia_uuid
    JOIN microsservico m ON m.uuid = i.microsservico_uuid
    JOIN componente c ON c.uuid = itc.componente_uuid
    LEFT JOIN alerta a
      ON a.instancia_tem_componente_componente_uuid = itc.componente_uuid
     AND a.instancia_tem_componente_instancia_uuid = itc.instancia_uuid
     AND a.prioridade IN (1, 2)
    WHERE m.empresa_uuid = UUID_TO_BIN(?)
      AND itc.monitorado = 1
      AND itc.deletado_em IS NULL
      AND i.deletado_em IS NULL
    GROUP BY c.uuid, c.nome_tecnico
    ORDER BY no_mes DESC, ativos DESC, c.nome_tecnico ASC
    LIMIT 4;`;

  return await database.execute(query, [empresa_uuid]);
};

const getResumoAlertas = async (empresa_uuid) => {
  const query = `
    SELECT
      COUNT(CASE WHEN a.status = 0 AND a.prioridade = 2 THEN a.uuid END) AS criticos_ativos,
      COUNT(CASE WHEN a.status = 0 AND a.prioridade = 1 THEN a.uuid END) AS atencao_ativos,
      COUNT(CASE WHEN YEAR(a.criado_em) = YEAR(CURDATE())
                  AND MONTH(a.criado_em) = MONTH(CURDATE())
                 THEN a.uuid END) AS no_mes
    FROM alerta a
    JOIN instancia i ON i.uuid = a.instancia_tem_componente_instancia_uuid
    JOIN microsservico m ON m.uuid = i.microsservico_uuid
    WHERE m.empresa_uuid = UUID_TO_BIN(?)
      AND i.deletado_em IS NULL
      AND a.prioridade IN (1, 2);`;

  const rows = await database.execute(query, [empresa_uuid]);
  return rows[0];
};

const getAlertasAtivos = async (empresa_uuid) => {
  const query = `
    SELECT
      a.prioridade,
      BIN_TO_UUID(i.uuid) AS instancia_uuid,
      COALESCE(i.nome, BIN_TO_UUID(i.uuid)) AS instancia,
      c.nome_tecnico AS componente,
      c.unidade_medida,
      a.valor_detectado,
      a.criado_em
    FROM alerta a
    JOIN instancia i ON i.uuid = a.instancia_tem_componente_instancia_uuid
    JOIN microsservico m ON m.uuid = i.microsservico_uuid
    JOIN componente c ON c.uuid = a.instancia_tem_componente_componente_uuid
    WHERE m.empresa_uuid = UUID_TO_BIN(?)
      AND i.deletado_em IS NULL
      AND a.status = 0
      AND a.prioridade IN (1, 2)
    ORDER BY a.prioridade DESC, a.criado_em ASC
    LIMIT 20;`;

  return await database.execute(query, [empresa_uuid]);
};

const getAlertasPorInstancia = async (empresa_uuid) => {
  const query = `
    SELECT
      BIN_TO_UUID(i.uuid) AS instancia_uuid,
      COALESCE(i.nome, BIN_TO_UUID(i.uuid)) AS instancia,
      COUNT(a.uuid) AS no_mes,
      COUNT(CASE WHEN a.prioridade = 2 THEN a.uuid END) AS criticos,
      COUNT(CASE WHEN a.prioridade = 1 THEN a.uuid END) AS atencao,
      COUNT(CASE WHEN a.status = 0 THEN a.uuid END) AS ativos
    FROM alerta a
    JOIN instancia i ON i.uuid = a.instancia_tem_componente_instancia_uuid
    JOIN microsservico m ON m.uuid = i.microsservico_uuid
    WHERE m.empresa_uuid = UUID_TO_BIN(?)
      AND i.deletado_em IS NULL
      AND a.prioridade IN (1, 2)
      AND YEAR(a.criado_em) = YEAR(CURDATE())
      AND MONTH(a.criado_em) = MONTH(CURDATE())
    GROUP BY i.uuid, i.nome
    ORDER BY no_mes DESC, ativos DESC, instancia ASC
    LIMIT 3;`;

  return await database.execute(query, [empresa_uuid]);
};

const getVolume7Dias = async (empresa_uuid) => {
  const query = `
    WITH RECURSIVE dias AS (
      SELECT CURDATE() - INTERVAL 6 DAY AS dia
      UNION ALL
      SELECT dia + INTERVAL 1 DAY FROM dias WHERE dia < CURDATE()
    ),
    alertas_da_empresa AS (
      SELECT a.uuid, a.prioridade, a.status, a.criado_em, a.data_hora_resolvido
      FROM alerta a
      JOIN instancia i ON i.uuid = a.instancia_tem_componente_instancia_uuid
      JOIN microsservico m ON m.uuid = i.microsservico_uuid
      WHERE m.empresa_uuid = UUID_TO_BIN(?)
        AND i.deletado_em IS NULL
        AND a.prioridade IN (1, 2)
    ),
    criados AS (
      SELECT DATE(criado_em) AS dia,
             COUNT(CASE WHEN prioridade = 2 THEN uuid END) AS criticos,
             COUNT(CASE WHEN prioridade = 1 THEN uuid END) AS atencao
      FROM alertas_da_empresa
      GROUP BY DATE(criado_em)
    ),
    resolvidos AS (
      SELECT DATE(data_hora_resolvido) AS dia, COUNT(uuid) AS total
      FROM alertas_da_empresa
      WHERE status = 1 AND data_hora_resolvido IS NOT NULL
      GROUP BY DATE(data_hora_resolvido)
    )
    SELECT
      DATE_FORMAT(d.dia, '%Y-%m-%d') AS dia,
      COALESCE(c.criticos, 0) AS criticos,
      COALESCE(c.atencao, 0) AS atencao,
      COALESCE(r.total, 0) AS resolvidos
    FROM dias d
    LEFT JOIN criados c ON c.dia = d.dia
    LEFT JOIN resolvidos r ON r.dia = d.dia
    ORDER BY d.dia;`;

  return await database.execute(query, [empresa_uuid]);
};

export default {
  countInstancias,
  getTop4Componentes,
  getResumoAlertas,
  getAlertasAtivos,
  getAlertasPorInstancia,
  getVolume7Dias
};
