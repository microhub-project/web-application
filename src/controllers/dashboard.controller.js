import dashboardModel from "../models/dashboard.model.js";

const nomeCurto = {
  cpu_percent: "CPU",
  cpu_frequency: "Frequência da CPU",
  ram_percent: "RAM",
  swap_memory_percent: "Swap",
  upload_traffic: "Upload",
  download_traffic: "Download",
  disk: "Disco",
  processes_qtd: "Processos",
  zombie_processes_percent: "Processos zumbi"
};

const unidadeCorrigida = (unidade) => (unidade === "Mpbs" ? "Mbps" : unidade);

async function carregar(req, res) {
  const companyUUID = req.companyUUID;

  if (!companyUUID)
    return res.status(400).json({ message: "Empresa não identificada no token" });

  try {
    const totalInstancias = await dashboardModel.countInstancias(companyUUID);
    const top4 = await dashboardModel.getTop4Componentes(companyUUID);
    const resumo = await dashboardModel.getResumoAlertas(companyUUID);
    const ativos = await dashboardModel.getAlertasAtivos(companyUUID);
    const porInstancia = await dashboardModel.getAlertasPorInstancia(companyUUID);
    const volume = await dashboardModel.getVolume7Dias(companyUUID);

    const somaTop4 = top4.reduce((soma, c) => soma + Number(c.no_mes), 0);
    const outros = Number(resumo.no_mes) - somaTop4;

    return res.status(200).json({
      totalInstancias: Number(totalInstancias),

      alertas: {
        criticosAtivos: Number(resumo.criticos_ativos),
        atencaoAtivos: Number(resumo.atencao_ativos),
        noMes: Number(resumo.no_mes)
      },

      componentes: top4.map((c) => ({
        nome: nomeCurto[c.componente] || c.componente,
        ativos: Number(c.ativos),
        noMes: Number(c.no_mes)
      })),

      alertasAtivos: ativos.map((a) => ({
        severidade: a.prioridade === 2 ? "critico" : "atencao",
        instanciaUuid: a.instancia_uuid,
        instancia: a.instancia,
        componente: nomeCurto[a.componente] || a.componente,
        valor: Number(a.valor_detectado),
        unidade: unidadeCorrigida(a.unidade_medida),
        criadoEm: a.criado_em
      })),

      alertasPorComponente: [
        ...top4.map((c) => ({
          nome: nomeCurto[c.componente] || c.componente,
          total: Number(c.no_mes)
        })),
        ...(outros > 0 ? [{ nome: "Outros", total: outros }] : [])
      ],

      alertasPorInstancia: porInstancia.map((i) => ({
        instancia: i.instancia,
        total: Number(i.no_mes),
        criticos: Number(i.criticos),
        atencao: Number(i.atencao)
      })),

      volume7Dias: volume.map((v) => ({
        dia: v.dia,
        criticos: Number(v.criticos),
        atencao: Number(v.atencao),
        resolvidos: Number(v.resolvidos)
      }))
    });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ message: "Erro ao carregar o dashboard" });
  }
}

export default {
  carregar
};
