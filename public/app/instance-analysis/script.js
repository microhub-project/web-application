let graficoPrincipal;
const labelsEixoX = [];
const cpu_valor = [];
const ram_valor = [];
const upload_valor = [];
const download_valor = [];
const cpu_frequency_valor = [];
const disk_valor = [];
const processos_valor = [];
const zumbi_valor = [];
const swap_valor = [];
const dadosGrafico = {
  cpu: {
    label: 'CPU (%)',
    data: cpu_valor, 
    limite: null,
    cor: '#64748b',
    tipoLimite: 'Limite Máximo',
    alertaTexto: ''
  },
  ram: {
    label: 'RAM (%)',
    data: ram_valor, 
    limite: null,
    cor: '#8b5cf6',
    tipoLimite: 'Limite Máximo',
    alertaTexto: ''
  },
  upload: {
    label: 'Upload (Mbps)',
    data: upload_valor,
    limite: null,
    cor: '#10b981',
    tipoLimite: 'Limite Mínimo',
    alertaTexto: ''
  },
  download: {
    label: 'Download (Mbps)',
    data: download_valor, 
    limite: null,
    cor: '#3b82f6',
    tipoLimite: 'Limite Mínimo',
    alertaTexto: ''
  },
  cpu_frequency: {
    label: 'Frequência da CPU (GHz)',
    data: cpu_frequency_valor, 
    limite: null,
    cor: '#f59e0b',
    tipoLimite: 'Limite Mínimo',
    alertaTexto: ''
  },
  disk: {
    label: 'Espaço livre no disco (GiB)',
    data: disk_valor, 
    limite: null,
    cor: '#0ea5e9',
    tipoLimite: 'Limite Máximo',
    alertaTexto: ''
  },
  processos: {
    label: 'Quantidade de processos',
    data: processos_valor, 
    limite: null,
    cor: '#14b8a6',
    tipoLimite: 'Limite Máximo',
    alertaTexto: ''
  },
  zumbi: {
    label: 'Processos zumbi (%)',
    data: zumbi_valor, 
    limite: null,
    cor: '#ef4444',
    tipoLimite: 'Limite Máximo',
    alertaTexto: ''
  },
  swap: {
    label: 'Uso de memória SWAP (%)',
    data: swap_valor, 
    limite: null,
    cor: '#ec4899',
    tipoLimite: 'Limite Máximo',
    alertaTexto: ''
  }
};

const loadCharts = () => {

  const grafico1 = document.getElementById('myChart1');

  if (grafico1) {
    const padrao = dadosGrafico.cpu; // Abre a tela mostrando a CPU

    graficoPrincipal = new Chart(grafico1, {
      type: 'line',
      data: {
        labels: labelsEixoX,
        datasets: [
          {
            label: padrao.label,
            data: padrao.data,
            borderColor: padrao.cor,
            borderWidth: 2,
          },
          {
            label: padrao.tipoLimite,
            data: Array(labelsEixoX.length).fill(padrao.limite),
            borderDash: [6, 6],
            borderColor: '#334155',
            borderWidth: 2,
            pointRadius: 0
          }
        ]
      },
      options: {
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false } // Remove a legenda padrão 
        },
        scales: {
          y: {
            beginAtZero: true,
            max: 100, // Trava o eixo y em 100
            ticks: {
              stepSize: 25 // Força as métricas de 25 em 25
            },
            grid: { color: '#cbd5e1' }
          },
          x: {
            grid: { display: false } // Remove as linhas verticais 
          }
        }
      }
    });
  }

}

const mudarGrafico = (metrica, botaoClicado) => {
  const novosDados = dadosGrafico[metrica];

  // substitui os dados da linha do componente
  graficoPrincipal.data.datasets[0].label = novosDados.label;
  graficoPrincipal.data.datasets[0].data = novosDados.data;
  graficoPrincipal.data.datasets[0].borderColor = novosDados.cor;

  // substitui os dados da linha de limite 
  graficoPrincipal.data.datasets[1].label = novosDados.tipoLimite;
  graficoPrincipal.data.datasets[1].data = Array(labelsEixoX.length).fill(novosDados.limite);

  if (metrica === 'cpu' || metrica === 'ram' ) { // Se cpu ou ram, eixo x vai até 100 / Se não, deixa livre (upload e download)
    graficoPrincipal.options.scales.y.max = 100;
    graficoPrincipal.options.scales.y.ticks.stepSize = 25;
  } else {
    delete graficoPrincipal.options.scales.y.max;
    delete graficoPrincipal.options.scales.y.ticks.stepSize;
  }


  aplicarLimitesNoGrafico(metrica);

  graficoPrincipal.update();

  // Atualiza o texto de limite
  document.getElementById('texto-limite').innerText = novosDados.alertaTexto;

  // Atualiza os botões
  const botoes = document.getElementById('botoes-grafico').children;
  for (let btn of botoes) {
    btn.className = "px-4 py-1 border-2 border-transparent text-slate-500 hover:text-slate-900 transition-all duration-300 ease-in-out";
  }
  botaoClicado.className = "px-4 py-1 bg-slate-200  border border-blue-900 rounded-2xl text-blue-950 font-bold transition-all duration-300 ease-in-out";
};

const atualizarDataHora = () => {
  const elementoData = document.getElementById('data-atualizacao');
  if (!elementoData) return;

  const agora = new Date();

  const opcoes = {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  };

  let dataFormatada = agora.toLocaleDateString('pt-BR', opcoes);

  elementoData.innerText = dataFormatada;
};


const aplicarAlertaCard = (nomeCard, valorAtual, limiteMaximo, limiteMinimo, textoExibicao) => {
  const card = document.getElementById(`card-${nomeCard}`);
  const valor = document.getElementById(`valor-${nomeCard}`);
  const texto = document.getElementById(`texto-${nomeCard}`);
  const icone = document.getElementById(`icone-${nomeCard}`);

  if (!card || !valor || !texto || !icone) return;

  valor.innerText = textoExibicao;

  const margem = 5;

  if ((limiteMaximo !== null && valorAtual >= limiteMaximo) || (limiteMinimo !== null && valorAtual <= limiteMinimo)) {
    // Remove azul e amarelo
    card.classList.remove('bg-slate-100', 'border-blue-900', 'bg-amber-50', 'border-amber-500');
    valor.classList.remove('text-slate-900', 'text-amber-600');
    texto.classList.remove('text-amber-600');
    icone.classList.remove('text-amber-600');

    // Adiciona vermelho
    card.classList.add('bg-red-50', 'border-red-700');
    valor.classList.add('text-red-700');
    texto.classList.add('text-red-700');
    icone.classList.add('text-red-700');

  } else if ((limiteMaximo !== null && valorAtual >= limiteMaximo - margem) || (limiteMinimo !== null && valorAtual <= limiteMinimo + margem)) {
    // Remove azul e vermelho
    card.classList.remove('bg-slate-100', 'border-blue-900', 'bg-red-50', 'border-red-700');
    valor.classList.remove('text-slate-900', 'text-red-700');
    texto.classList.remove('text-red-700');
    icone.classList.remove('text-red-700');

    // Adiciona amarelo 
    card.classList.add('bg-amber-50', 'border-amber-500');
    valor.classList.add('text-amber-600');
    texto.classList.add('text-amber-600');
    icone.classList.add('text-amber-600');

  } else {
    // Remove vermelho e amarelo
    card.classList.remove('bg-red-50', 'border-red-700', 'bg-amber-50', 'border-amber-500');
    valor.classList.remove('text-red-700', 'text-amber-600');
    texto.classList.remove('text-red-700', 'text-amber-600');
    icone.classList.remove('text-red-700', 'text-amber-600');

    // Adiciona normal
    card.classList.add('bg-slate-100', 'border-blue-900');
    valor.classList.add('text-slate-900');
  }
};

const cardsVisiveis = {
  cpu: 1, 
  ram: 1, 
  upload: 1, 
  download: 1,
  'cpu_frequency': 1, 
  disk: 1, 
  processos: 1, 
  zumbi: 1, 
  swap: 1,
};

const ajustarColunasGrid = () => {
  const grid = document.getElementById('card-cpu')?.parentElement;
  if (!grid) return;

  const qtd = Object.values(cardsVisiveis).filter(v => v === 1).length;

  grid.classList.remove(
    'grid-cols-1',
    'sm:grid-cols-2',
    'lg:grid-cols-3',
    '2xl:grid-cols-3',
    '2xl:grid-cols-4'
  );

  grid.classList.add('grid-cols-1');

  if (qtd === 0) return;

  let cols2xl;
  if (qtd % 4 === 0)      cols2xl = 4; 
  else if (qtd % 3 === 0) cols2xl = 3;  
  else                    cols2xl = 4; 

  if (cols2xl === 4) {
    grid.classList.add('sm:grid-cols-2', '2xl:grid-cols-4');
  } else if (cols2xl === 3) {
    grid.classList.add('sm:grid-cols-2', '2xl:grid-cols-3');
  } else {
    grid.classList.add('sm:grid-cols-2');
  }
};

const aplicarVisibilidadeCards = () => {
  for (const [nome, visivel] of Object.entries(cardsVisiveis)) {
    document.getElementById(`card-${nome}`)?.classList.toggle('hidden', visivel !== 1);
  }
  ajustarColunasGrid();
};
//Antigo load para nortea em caso de confusão
const loadAllMetrics = () => {
  atualizarDataHora();
  aplicarVisibilidadeCards();
  const ult = (arr) => arr[arr.length - 1];
  const lim = (nome) => limitesInstancia[nome] || { max: null, min: null };
  aplicarAlertaCard('cpu', ult(cpu_valor), lim('cpu').max, lim('cpu').min, ult(cpu_valor) + "%");
  aplicarAlertaCard('ram', ult(ram_valor), lim('ram').max, lim('ram').min, ult(ram_valor) + "%");
  aplicarAlertaCard('upload', ult(upload_valor), lim('upload').max, lim('upload').min, ult(upload_valor));
  aplicarAlertaCard('download', ult(download_valor), lim('download').max, lim('download').min, ult(download_valor));
  aplicarAlertaCard('cpu_frequency', ult(cpu_frequency_valor), lim('cpu_frequency').max, lim('cpu_frequency').min, ult(cpu_frequency_valor));
  aplicarAlertaCard('disk', ult(disk_valor), lim('disk').max, lim('disk').min, ult(disk_valor));
  aplicarAlertaCard('processos', ult(processos_valor), lim('processos').max, lim('processos').min, ult(processos_valor));
  aplicarAlertaCard('zumbi', ult(zumbi_valor), lim('zumbi').max, lim('zumbi').min, ult(zumbi_valor) + "%");
  aplicarAlertaCard('swap', ult(swap_valor), lim('swap').max, lim('swap').min, ult(swap_valor) + "%");
};
const toggleInstancias = (abrir) => {
  const painel = document.getElementById('painel-instancias');
  if (!painel) return;

  painel.classList.toggle('hidden', !abrir);

  const nome = document.getElementById('detalheNome');
  const alvo = document.getElementById('toggle-instancia-nome');
  if (nome && alvo) alvo.innerText = nome.innerText;
};

window.addEventListener('DOMContentLoaded', () => {
  toggleInstancias(true);

  document.getElementById('listaDeInstancias')?.addEventListener('click', (e) => {
    const linha = e.target.closest('tr[data-uuid]');
    if (linha) selecionarInstancia(linha.dataset.uuid);
    if (e.target.closest('tr') && window.innerWidth < 1280) toggleInstancias(false);
  });

  document.getElementById('instanciasProcura')?.addEventListener('input', mostrarInstancias);
  document.getElementById('filtroServiço')?.addEventListener('change', mostrarInstancias);
  document.getElementById('filtroStatus')?.addEventListener('change', mostrarInstancias);

  document.getElementById('listaDeAlertas')?.addEventListener('click', (e) => {
    const botao = e.target.closest('button[data-alerta]');
    if (botao) updateAlertStatus(botao);
  });
});


let instancias = [];
let alertas = [];
let componentes = [];
let instanciaSelecionada = null;
let limitesInstancia = {}; // limites das KPIs selecionadas da instância: { cpu: { max, min, unidade } }

// card -> nome_tecnico do componente no banco
const componentesCards = {
  cpu: 'cpu_percent',
  ram: 'ram_percent',
  upload: 'upload_traffic',
  download: 'download_traffic',
  cpu_frequency: 'cpu_frequency',
  disk: 'disk',
  processos: 'processes_qtd',
  zumbi: 'zombie_processes_percent',
  swap: 'swap_memory_percent'
};

const escapeHtml = (texto) => String(texto ?? '').replace(/[&<>"']/g, (c) => ({
  '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
}[c]));

const formatarDataHora = (data) => {
  if (!data) return '—';
  return new Date(data).toLocaleString('pt-BR', {
    day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit'
  }).replace(', ', ' ');
};

const formatarValor = (valor, unidade) => {
  const numero = Number(valor).toLocaleString('pt-BR', { maximumFractionDigits: 2 });
  return unidade === '%' ? `${numero}%` : `${numero}${unidade ? ' ' + unidade : ''}`;
};

const textoDoLimite = ({ max, min, unidade }) => {
  if (max !== null && min !== null) return `Mín.: ${formatarValor(min, unidade)} · Máx.: ${formatarValor(max, unidade)}`;
  if (max !== null) return `Limite máximo: ${formatarValor(max, unidade)}`;
  if (min !== null) return `Limite mínimo: ${formatarValor(min, unidade)}`;
  return 'Sem limite definido';
};

const getInstances = async () => {
  const token = sessionStorage.getItem('JWT_TOKEN');
  const userData = getUserSession();

  if (!token || !userData) {
    logout();
    return showToast("Sessão inválida, faça login novamente", "warning");
  }

  try {
    const response = await fetch('/instances/listar', {
      method: "GET",
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });

    if (response.status === 401 || response.status === 403) {
      logout();
      return;
    }

    if (response.status === 204) {
      return showToast("Não há nenhuma instância", "warning");
    }

    const body = await response.json();

    if (response.status === 400) {
      return showToast(body.message || "Requisição inválida", "warning");
    }

    if (response.status === 500) {
      return showToast(body.message || "Erro interno do servidor", "error");
    }

    instancias = body.data || [];

    componentes = await getComponents() || [];
    await getAlerts();

    const filtro = document.getElementById('filtroServiço');
    const servicos = new Map(instancias.map((i) => [i.microsservico_uuid, i.microsservico]));
    filtro.innerHTML = '<option value="">Todos</option>' + [...servicos]
      .map(([uuid, nome]) => `<option value="${escapeHtml(uuid)}">${escapeHtml(nome)}</option>`)
      .join('');

    mostrarInstancias();

    if (instancias.length > 0) selecionarInstancia(instancias[0].uuid);
  } catch (e) {
    console.error(e);
    showToast("Algo deu errado ao carregar as instâncias.", "error");
  }
};

const getComponents = async () => {
  const token = sessionStorage.getItem('JWT_TOKEN');
  const userData = getUserSession();

  if (!token || !userData) {
    logout();
    return showToast("Sessão inválida, faça login novamente", "warning");
  }

  try {
    const response = await fetch('/instances/listar-componentes', {
      method: "GET",
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });

    if (response.status === 401 || response.status === 403) {
      logout();
      return;
    }

    const body = await response.json();

    if (response.status === 400) {
      return showToast(body.message || "Requisição inválida", "warning");
    }

    if (response.status === 500) {
      return showToast(body.message || "Erro interno do servidor", "error");
    }

    return body.data || [];
  } catch (e) {
    console.error(e);
    showToast("Algo deu errado ao carregar os componentes.", "error");
  }
};

const getMonitoredComponents = async (instance_uuid) => {
  const token = sessionStorage.getItem('JWT_TOKEN');
  const userData = getUserSession();

  if (!token || !userData) {
    logout();
    return showToast("Sessão inválida, faça login novamente", "warning");
  }

  try {
    const response = await fetch(`/instances/listar-componentes-monitorados/${instance_uuid}`, {
      method: "GET",
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });

    if (response.status === 401 || response.status === 403) {
      logout();
      return;
    }

    const body = await response.json();

    if (response.status === 400) {
      return showToast(body.message || "Requisição inválida", "warning");
    }

    if (response.status === 500) {
      return showToast(body.message || "Erro interno do servidor", "error");
    }

    return body.data || [];
  } catch (e) {
    console.error(e);
    showToast("Algo deu errado ao carregar os componentes monitorados.", "error");
  }
};

const arraysDasMetricas = {
  cpu: cpu_valor,
  ram: ram_valor,
  upload: upload_valor,
  download: download_valor,
  cpu_frequency: cpu_frequency_valor,
  disk: disk_valor,
  processos: processos_valor,
  zumbi: zumbi_valor,
  swap: swap_valor
};

const formatarRotuloTempo = (timestamp) => {
  const m = String(timestamp ?? '').match(/^(\d{4})-(\d{2})-(\d{2})[ T](\d{2}):(\d{2})/);
  return m ? `${m[3]}/${m[2]} ${m[4]}:${m[5]}` : String(timestamp ?? '');
};

const getMetrics = async (instance_uuid) => {
  const token = sessionStorage.getItem('JWT_TOKEN');
  const userData = getUserSession();

  if (!token || !userData) {
    logout();
    return null;
  }

  try {
    const response = await fetch(`/instances/metricas/${instance_uuid}?pontos=13`, {
      method: "GET",
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });

    if (response.status === 401 || response.status === 403) {
      logout();
      return null;
    }

    const body = await response.json();

    if (!response.ok) {
      showToast(body.message || "Não foi possível carregar as métricas", "warning");
      return null;
    }

    return body.data || null;
  } catch (e) {
    console.error(e);
    showToast("Algo deu errado ao carregar as métricas.", "error");
    return null;
  }
};

const carregarMetricas = async (instance_uuid) => {
  const dados = await getMetrics(instance_uuid);

  if (!dados) return;

  const leituras = dados.leituras || [];

  labelsEixoX.splice(0, labelsEixoX.length, ...leituras.map((l) => formatarRotuloTempo(l.timestamp)));

  for (const [card, array] of Object.entries(arraysDasMetricas)) {
    array.splice(0, array.length, ...leituras.map((l) => l[card]));
  }

  if (graficoPrincipal) graficoPrincipal.update();
};

window.addEventListener('DOMContentLoaded', () => {
  for (const nome of Object.keys(componentesCards)) {
    document.getElementById(`card-${nome}`)?.classList.add('hidden');
    const valor = document.getElementById(`valor-${nome}`);
    if (valor) valor.innerText = '';
  }
});

const corrigirKPIs = () => {
  for (const [card, array] of Object.entries(arraysDasMetricas)) {
    const limite = limitesInstancia[card];

    if (!limite) continue;

    const valor = array[array.length - 1];
    const campoUnidade = document.getElementById(`unidade-${card}`);
    const semLeitura = valor === null || valor === undefined || !Number.isFinite(Number(valor));

    if (semLeitura) {
      aplicarAlertaCard(card, 0, null, null, '—');
      if (campoUnidade) campoUnidade.innerText = '';
      continue;
    }

    const numero = Number(valor);
    const texto = formatarValor(numero, '');

    if (limite.unidade === '%') {
      document.getElementById(`valor-${card}`).innerText = `${texto}%`;
      if (campoUnidade) campoUnidade.innerText = '';
    } else {
      document.getElementById(`valor-${card}`).innerText = texto;
      if (campoUnidade) campoUnidade.innerText = limite.unidade || '';
    }
  }
};

const MARGEM_ALERTA_GRAFICO = 5;

const COR_ZONA_VERMELHA = 'rgba(239, 68, 68, 0.20)';
const COR_ZONA_AMARELA = 'rgba(245, 158, 11, 0.25)';

const zonasLimitesPlugin = {
  id: 'zonasLimites',

  beforeDatasetsDraw(chart, args, opcoes) {
    if (!opcoes || (opcoes.max == null && opcoes.min == null)) return;

    const { ctx, chartArea: area, scales } = chart;
    const y = scales.y;
    if (!area || !y) return;

    const pintarFaixa = (deValor, ateValor, cor) => {
      const p1 = y.getPixelForValue(deValor);
      const p2 = y.getPixelForValue(ateValor);
      const topo = Math.max(area.top, Math.min(p1, p2));
      const base = Math.min(area.bottom, Math.max(p1, p2));
      if (base <= topo) return;
      ctx.fillStyle = cor;
      ctx.fillRect(area.left, topo, area.right - area.left, base - topo);
    };

    const margem = opcoes.margem ?? MARGEM_ALERTA_GRAFICO;

    ctx.save();

    if (opcoes.max != null) pintarFaixa(opcoes.max - margem, opcoes.max, COR_ZONA_AMARELA);
    if (opcoes.min != null) pintarFaixa(opcoes.min, opcoes.min + margem, COR_ZONA_AMARELA);

    if (opcoes.max != null) pintarFaixa(opcoes.max, y.max, COR_ZONA_VERMELHA);
    if (opcoes.min != null) pintarFaixa(y.min, opcoes.min, COR_ZONA_VERMELHA);

    ctx.restore();
  },

  afterDatasetsDraw(chart, args, opcoes) {
    if (!opcoes || (opcoes.max == null && opcoes.min == null)) return;

    const { ctx, chartArea: area, scales } = chart;
    const y = scales.y;
    if (!area || !y) return;

    const escreverRotulo = (valor, rotulo, cor) => {
      const yLinha = y.getPixelForValue(valor);
      if (yLinha < area.top || yLinha > area.bottom) return;

      const texto = `${rotulo}: ${formatarValor(valor, opcoes.unidade)}`;

      ctx.save();
      ctx.font = 'bold 12px sans-serif';
      ctx.textAlign = 'right';
      ctx.textBaseline = 'middle';

      const largura = ctx.measureText(texto).width;
      const x = area.right - 8;

      const yCaixa = yLinha - 22 >= area.top ? yLinha - 21 : yLinha + 5;

      ctx.fillStyle = 'rgba(255, 255, 255, 0.85)';
      ctx.fillRect(x - largura - 6, yCaixa, largura + 12, 16);

      ctx.fillStyle = cor;
      ctx.fillText(texto, x, yCaixa + 8);
      ctx.restore();
    };

    if (opcoes.max != null) escreverRotulo(opcoes.max, 'Máximo', '#991b1b');
    if (opcoes.min != null) escreverRotulo(opcoes.min, 'Mínimo', '#92400e');
  }
};

if (typeof Chart !== 'undefined') Chart.register(zonasLimitesPlugin);

const aplicarLimitesNoGrafico = (card) => {
  if (!graficoPrincipal) return;

  const limite = limitesInstancia[card];
  const max = limite && limite.max !== null ? limite.max : null;
  const min = limite && limite.min !== null ? limite.min : null;
  const pontos = labelsEixoX.length;
  const datasets = graficoPrincipal.data.datasets;

  if (!datasets[2]) {
    datasets[2] = {
      label: 'Limite Mínimo',
      data: [],
      borderDash: [6, 6],
      borderColor: '#334155',
      borderWidth: 2,
      pointRadius: 0
    };
  }

  datasets[1].label = 'Limite Máximo';
  datasets[1].data = max !== null ? Array(pontos).fill(max) : [];
  datasets[1].hidden = max === null;

  datasets[2].label = 'Limite Mínimo';
  datasets[2].data = min !== null ? Array(pontos).fill(min) : [];
  datasets[2].hidden = min === null;

  const escalaY = graficoPrincipal.options.scales.y;
  const eixoFixo = escalaY.max !== undefined;
  escalaY.suggestedMax = (!eixoFixo && max !== null) ? Math.ceil(max * 1.15) : undefined;

  graficoPrincipal.options.plugins.zonasLimites = limite
    ? { max, min, unidade: limite.unidade, margem: MARGEM_ALERTA_GRAFICO }
    : false;
};

const getAlerts = async () => {
  const token = sessionStorage.getItem('JWT_TOKEN');
  const userData = getUserSession();

  if (!token || !userData) {
    logout();
    return showToast("Sessão inválida, faça login novamente", "warning");
  }

  try {
    const response = await fetch('/alerts/listar', {
      method: "GET",
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });

    if (response.status === 401 || response.status === 403) {
      logout();
      return;
    }

    const body = await response.json();

    if (response.status === 400) {
      return showToast(body.message || "Requisição inválida", "warning");
    }

    if (response.status === 500) {
      return showToast(body.message || "Erro interno do servidor", "error");
    }

    alertas = body.data || [];
    mostrarInstancias();
    mostrarAlertas();
  } catch (e) {
    console.error(e);
    showToast("Algo deu errado ao carregar os alertas.", "error");
  }
};

const updateAlertStatus = async (botao) => {
  const token = sessionStorage.getItem('JWT_TOKEN');
  const userData = getUserSession();

  if (!token || !userData) {
    logout();
    return showToast("Sessão inválida, faça login novamente", "warning");
  }

  botao.disabled = true;

  const body = {
    "uuid": botao.dataset.alerta,
    "status": Number(botao.dataset.novoStatus)
  };

  try {
    const atualizar = await fetch("/alerts/resolver", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(body)
    });

    if (atualizar.status === 401 || atualizar.status === 403) {
      logout();
      return;
    }

    const response = await atualizar.json();

    if (atualizar.status === 500) {
      botao.disabled = false;
      return showToast(response.message, "error");
    }

    if (atualizar.status === 400) {
      botao.disabled = false;
      return showToast(response.message, "warning");
    }

    if (!atualizar.ok) {
      botao.disabled = false;
      return showToast(response.message, "error");
    }

    showToast(response.message, "success");
    await getAlerts();
  } catch (e) {
    console.error(e);
    botao.disabled = false;
    showToast("Algo deu errado ao atualizar o alerta.", "error");
  }
};

const statusDaInstancia = (instance_uuid) => {
  const prioridade = alertas
    .filter((a) => a.instancia_uuid === instance_uuid && Number(a.status) === 1)
    .reduce((max, a) => Math.max(max, a.prioridade), 0);

  if (prioridade >= 3) return { texto: 'Crítico', borda: 'border-red-500 bg-red-50 text-red-700', ponto: 'bg-red-600' };
  if (prioridade >= 1) return { texto: 'Atenção', borda: 'border-amber-500 bg-amber-50 text-amber-700', ponto: 'bg-amber-500' };
  return { texto: 'Normal', borda: 'border-emerald-500 bg-emerald-50 text-emerald-700', ponto: 'bg-emerald-600' };
};

const mostrarInstancias = () => {
  const lista = document.getElementById('listaDeInstancias');
  const busca = document.getElementById('instanciasProcura').value.trim().toLowerCase();
  const servico = document.getElementById('filtroServiço').value;
  const status = document.getElementById('filtroStatus').value;

  const filtradas = instancias.filter((i) => {
    const nome = `${i.nome || ''} ${i.endereco_mac} ${i.microsservico}`.toLowerCase();
    return (!busca || nome.includes(busca))
      && (!servico || i.microsservico_uuid === servico)
      && (!status || statusDaInstancia(i.uuid).texto === status);
  });

  if (filtradas.length === 0) {
    lista.innerHTML = '<tr><td colspan="3" class="px-2 py-6 text-center text-slate-500">Nenhuma instância encontrada</td></tr>';
    return;
  }

  lista.innerHTML = filtradas.map((i) => {
    const st = statusDaInstancia(i.uuid);
    const selecionada = instanciaSelecionada && instanciaSelecionada.uuid === i.uuid;
    return `
      <tr data-uuid="${escapeHtml(i.uuid)}" class="cursor-pointer ${selecionada ? 'bg-blue-100 border-l-2 border-blue-900' : ''}">
        <td class="px-2 py-3">${escapeHtml(i.nome || i.endereco_mac)}</td>
        <td class="px-2 py-3">${escapeHtml(i.microsservico)}</td>
        <td class="px-2 py-3 text-center"><span
            class="inline-flex items-center gap-1 rounded-full border ${st.borda} px-2 py-0.5"><span
                class="size-1.5 rounded-full ${st.ponto}"></span>${st.texto}</span></td>
      </tr>`;
  }).join('');
};

const selecionarInstancia = async (instance_uuid) => {
  const instancia = instancias.find((i) => i.uuid === instance_uuid);
  if (!instancia) return;

  instanciaSelecionada = instancia;

  const nome = instancia.nome || instancia.endereco_mac;
  document.getElementById('detalheNome').innerText = nome;
  document.getElementById('detalheServico').innerText = `Microsserviço: ${instancia.microsservico} · ${instancia.endereco_mac}`;
  document.getElementById('toggle-instancia-nome').innerText = nome;

  mostrarInstancias();
  mostrarAlertas();

  const monitorados = await getMonitoredComponents(instance_uuid) || [];

  if (!instanciaSelecionada || instanciaSelecionada.uuid !== instance_uuid) return;

  await carregarMetricas(instance_uuid);

  if (!instanciaSelecionada || instanciaSelecionada.uuid !== instance_uuid) return;

  limitesInstancia = {};

  for (const [card, nomeTecnico] of Object.entries(componentesCards)) {
    const componente = componentes.find((c) => c.nome_tecnico === nomeTecnico);
    const monitorado = componente && monitorados.find((m) => m.componente_uuid === componente.uuid && Number(m.status) === 1);

    cardsVisiveis[card] = monitorado ? 1 : 0;

    const botao = document.querySelector(`#botoes-grafico button[onclick*="'${card}'"]`);
    if (botao) botao.style.display = monitorado ? '' : 'none';

    if (!monitorado) continue;

    const limite = {
      max: monitorado.limite_maximo === null ? null : Number(monitorado.limite_maximo),
      min: monitorado.limite_minimo === null ? null : Number(monitorado.limite_minimo),
      unidade: componente.unidade_medida
    };
    limitesInstancia[card] = limite;

    document.getElementById(`limite-${card}`).innerText = textoDoLimite(limite);

    dadosGrafico[card].limite = limite.max !== null ? limite.max : limite.min;
    dadosGrafico[card].tipoLimite = limite.max !== null ? 'Limite Máximo' : 'Limite Mínimo';
    dadosGrafico[card].alertaTexto = textoDoLimite(limite);
  }

  loadAllMetrics();

  corrigirKPIs();

  const primeira = Object.keys(cardsVisiveis).find((card) => cardsVisiveis[card] === 1);
  if (primeira) {
    mudarGrafico(primeira, document.querySelector(`#botoes-grafico button[onclick*="'${primeira}'"]`));
  } else {
    document.getElementById('texto-limite').innerText = 'Nenhuma KPI selecionada para esta instância';
  }
};

const mostrarAlertas = () => {
  const lista = document.getElementById('listaDeAlertas');
  const doAlertas = instanciaSelecionada ? alertas.filter((a) => a.instancia_uuid === instanciaSelecionada.uuid) : [];

  if (doAlertas.length === 0) {
    lista.innerHTML = '<tr><td colspan="7" class="py-6 text-center text-slate-500">Nenhum alerta registrado para esta instância</td></tr>';
    return;
  }

  const severidades = {
    3: { texto: 'Crítico', classe: 'border-red-500 bg-red-50 text-red-700', ponto: 'bg-red-600' },
    2: { texto: 'Atenção', classe: 'border-amber-500 bg-amber-50 text-amber-700', ponto: 'bg-amber-500' },
    1: { texto: 'Baixa', classe: 'border-slate-400 bg-slate-100 text-slate-700', ponto: 'bg-slate-500' }
  };

  lista.innerHTML = doAlertas.map((a) => {
    const sev = severidades[a.prioridade] || severidades[1];
    const ativo = Number(a.status) === 1;
    const valor = a.valor_detectado === null ? null : Number(a.valor_detectado);
    const max = a.limite_maximo === null ? null : Number(a.limite_maximo);
    const min = a.limite_minimo === null ? null : Number(a.limite_minimo);


    let limite = '—';
    if (valor !== null && max !== null && valor >= max) limite = `Máx. ${formatarValor(max, a.unidade_medida)}`;
    else if (valor !== null && min !== null && valor <= min) limite = `Mín. ${formatarValor(min, a.unidade_medida)}`;
    else if (max !== null) limite = `Máx. ${formatarValor(max, a.unidade_medida)}`;
    else if (min !== null) limite = `Mín. ${formatarValor(min, a.unidade_medida)}`;

    const botao = ativo
      ? `<button type="button" data-alerta="${escapeHtml(a.uuid)}" data-novo-status="0" title="Clique para marcar como resolvido"
            class="inline-flex rounded-full border border-blue-500 bg-blue-100 text-blue-800 px-2 py-0.5 cursor-pointer disabled:opacity-50">Ativo</button>`
      : `<button type="button" data-alerta="${escapeHtml(a.uuid)}" data-novo-status="1" title="Clique para reabrir o alerta"
            class="inline-flex rounded-full border border-emerald-500 bg-emerald-100 text-emerald-800 px-2 py-0.5 cursor-pointer disabled:opacity-50">Resolvido</button>`;

    return `
      <tr>
        <td class="py-3 px-2">${formatarDataHora(a.criado_em)}</td>
        <td class="py-3 px-2 text-center" title="${escapeHtml(a.descricao || '')}">${escapeHtml(a.componente)}</td>
        <td class="py-3 px-2 text-center">${valor === null ? '—' : formatarValor(valor, a.unidade_medida)}</td>
        <td class="py-3 px-2 text-center">${limite}</td>
        <td class="py-3 px-2 text-center"><span
            class="inline-flex items-center gap-1 rounded-full border ${sev.classe} px-2 py-0.5"><span
                class="size-1.5 rounded-full ${sev.ponto}"></span>${sev.texto}</span></td>
        <td class="py-3 px-2 text-center">${botao}</td>
        <td class="py-3 px-2 text-center">${ativo ? '—' : formatarDataHora(a.data_hora_resolvido)}</td>
      </tr>`;
  }).join('');
};