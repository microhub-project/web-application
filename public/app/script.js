const minutosAtras = (min) => new Date(Date.now() - min * 60 * 1000).toISOString();

const diaRelativo = (diasAtras) => {
  const d = new Date();
  d.setDate(d.getDate() - diasAtras);
  return [
    d.getFullYear(),
    String(d.getMonth() + 1).padStart(2, '0'),
    String(d.getDate()).padStart(2, '0')
  ].join('-');
};

const dadosExemplo = {
  totalInstancias: 10,

  alertas: { criticosAtivos: 2, atencaoAtivos: 2, noMes: 112 },

  componentes: [
    { nome: 'CPU', ativos: 2, noMes: 45 },
    { nome: 'RAM', ativos: 1, noMes: 32 },
    { nome: 'Upload', ativos: 1, noMes: 18 },
    { nome: 'Download', ativos: 0, noMes: 17 }
  ],

  alertasAtivos: [
    { severidade: 'critico', instanciaUuid: 'uuid-1', instancia: 'pagamento-01', componente: 'CPU', valor: 94, unidade: '%', criadoEm: minutosAtras(12) },
    { severidade: 'atencao', instanciaUuid: 'uuid-2', instancia: 'notificação-01', componente: 'RAM', valor: 88, unidade: '%', criadoEm: minutosAtras(24) },
    { severidade: 'atencao', instanciaUuid: 'uuid-3', instancia: 'autenticação-03', componente: 'Upload', valor: 95, unidade: 'Mbps', criadoEm: minutosAtras(60) },
    { severidade: 'atencao', instanciaUuid: 'uuid-4', instancia: 'usuario-02', componente: 'CPU', valor: 82, unidade: '%', criadoEm: minutosAtras(180) }
  ],

  alertasPorInstancia: [
    { instancia: 'pagamento-01', total: 6, criticos: 4, atencao: 2 },
    { instancia: 'notificação-01', total: 4, criticos: 1, atencao: 3 },
    { instancia: 'autenticação-03', total: 2, criticos: 0, atencao: 2 }
  ],

  volume7Dias: [
    { dia: diaRelativo(6), criticos: 5, atencao: 3, resolvidos: 4 },
    { dia: diaRelativo(5), criticos: 4, atencao: 2, resolvidos: 5 },
    { dia: diaRelativo(4), criticos: 2, atencao: 1, resolvidos: 3 },
    { dia: diaRelativo(3), criticos: 4, atencao: 3, resolvidos: 5 },
    { dia: diaRelativo(2), criticos: 2, atencao: 2, resolvidos: 3 },
    { dia: diaRelativo(1), criticos: 5, atencao: 3, resolvidos: 4 },
    { dia: diaRelativo(0), criticos: 1, atencao: 2, resolvidos: 1 }
  ],

  alertasPorComponente: [
    { nome: 'CPU', total: 23 },
    { nome: 'RAM', total: 11 },
    { nome: 'Upload', total: 3 },
    { nome: 'Download', total: 2 },
    { nome: 'Outros', total: 1 }
  ]
};

const USAR_DADOS_EXEMPLO = false;

const buscarPainel = async () => {
  if (USAR_DADOS_EXEMPLO) return dadosExemplo;

  const token = sessionStorage.getItem('JWT_TOKEN');

  if (!token) {
    logout();
    throw new Error('Sessão inválida');
  }

  const resposta = await fetch('/dashboard', {
    method: 'GET',
    headers: { 'Authorization': `Bearer ${token}` }
  });

  if (resposta.status === 401 || resposta.status === 403) {
    logout();
    throw new Error('Sessão expirada');
  }

  if (!resposta.ok) {
    throw new Error(`Erro ${resposta.status} ao carregar o dashboard`);
  }

  return await resposta.json();
};

const iconePorComponente = {
  'CPU': 'ph-cpu',
  'Frequência da CPU': 'ph-gauge',
  'RAM': 'ph-memory',
  'Swap': 'ph-swap',
  'Upload': 'ph-box-arrow-up',
  'Download': 'ph-box-arrow-down',
  'Disco': 'ph-hard-drive',
  'Processos': 'ph-list-checks',
  'Processos zumbi': 'ph-skull'
};

const coresRosca = ['#ef4444', '#facc15', '#3b82f6', '#22c55e'];
const corOutros = '#94a3b8';

const corCritico = '#f44336';
const corAtencao = '#ffd54f';

const escapeHtml = (texto) => {
  const caixa = document.createElement('div');
  caixa.textContent = texto;
  return caixa.innerHTML.split('"').join('&quot;').split("'").join('&#39;');
};

const plural = (n, singular, pluralTexto) => (n === 1 ? singular : pluralTexto);

const renderizarCabecalho = (dados) => {
  document.getElementById('total-instancias').innerText =
    `${dados.totalInstancias} ${plural(dados.totalInstancias, 'instância monitorada', 'instâncias monitoradas')}`;

  document.getElementById('data-atualizacao').innerText = new Date().toLocaleString('pt-BR', {
    day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit'
  });
};

const renderizarCardAlertas = ({ criticosAtivos, atencaoAtivos, noMes }) => {
  const total = criticosAtivos + atencaoAtivos;
  const card = document.getElementById('card-alerta');
  const temAlerta = total > 0;

  const texto = document.getElementById('texto-alerta');
  const rodape = document.getElementById('mes-alerta');

  document.getElementById('valor-alerta').innerText = total;
  rodape.innerText = `${noMes} no mês`;

  const classeCritico = temAlerta ? 'text-red-700' : '';
  const classeAtencao = temAlerta ? 'text-amber-600' : '';
  texto.innerHTML =
    `<span class="${classeCritico}">${criticosAtivos} ${plural(criticosAtivos, 'Crítico', 'Críticos')}</span>` +
    ` • <span class="${classeAtencao}">${atencaoAtivos} Em Atenção</span>`;

  card.classList.toggle('bg-red-50', temAlerta);
  card.classList.toggle('border-red-700', temAlerta);
  card.classList.toggle('text-red-700', temAlerta);
  card.classList.toggle('text-slate-900', !temAlerta);
  card.classList.toggle('bg-slate-100', !temAlerta);
  card.classList.toggle('border-blue-900', !temAlerta);

  rodape.classList.toggle('bg-red-100', temAlerta);
  rodape.classList.toggle('text-red-700', temAlerta);
  rodape.classList.toggle('border-red-300', temAlerta);
  rodape.classList.toggle('bg-slate-200', !temAlerta);
  rodape.classList.toggle('text-slate-600', !temAlerta);
  rodape.classList.toggle('border-slate-300', !temAlerta);
};

const renderizarCardsComponentes = (componentes) => {
  const area = document.getElementById('cards-componentes');

  area.innerHTML = componentes.map((c) => {
    const zerado = c.ativos === 0;
    const icone = iconePorComponente[c.nome] || 'ph-question';

    const fundo = zerado ? 'bg-slate-200' : 'bg-blue-50';
    const visual = `${fundo} border-blue-900 text-blue-900`;
    const corValor = zerado ? 'text-slate-400' : 'text-red-700';

    return `
      <div class="rounded-xl border ${visual} overflow-hidden flex flex-col transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
        <div class="relative flex-1 flex flex-col items-center justify-center pt-12 pb-3 px-4">
          <h2 class="absolute top-4 left-5 text-lg font-bold">${escapeHtml(c.nome)}</h2>
          <i class="ph-bold ${icone} absolute top-3 right-3 text-lg p-2 rounded border border-current"></i>
          <p class="text-6xl font-medium leading-none ${corValor}">${c.ativos}</p>
          <p class="text-base mt-3 ${corValor}">${plural(c.ativos, 'alerta ativo', 'alertas ativos')}</p>
        </div>
        <p class="text-center text-xl py-2 bg-slate-200 text-slate-600 border-t border-slate-300">${c.noMes} no mês</p>
      </div>`;
  }).join('');
};

const formatarDuracao = (dataIso) => {
  const minutos = Math.max(0, Math.floor((Date.now() - new Date(dataIso).getTime()) / 60000));

  if (minutos < 60) return `há ${minutos} min`;

  const horas = Math.floor(minutos / 60);
  if (horas < 24) return `há ${horas} ${plural(horas, 'hora', 'horas')}`;

  const dias = Math.floor(horas / 24);
  return `há ${dias} ${plural(dias, 'dia', 'dias')}`;
};

const renderizarTabelaAlertas = (alertas) => {
  const corpo = document.getElementById('tabela-alertas-ativos');

  if (alertas.length === 0) {
    corpo.innerHTML = `<tr><td colspan="4" class="py-8 text-center text-slate-500">Nenhum alerta ativo no momento.</td></tr>`;
    return;
  }

  corpo.innerHTML = alertas.map((a) => {
    const critico = a.severidade === 'critico';

    const pill = critico
      ? `<span class="inline-flex items-center gap-2 text-base font-bold bg-red-50 text-red-700 border border-red-700 rounded-full px-3 py-1"><span class="size-2 rounded-full bg-red-600"></span>Crítico</span>`
      : `<span class="inline-flex items-center gap-2 text-base font-bold bg-amber-50 text-amber-800 border border-amber-500 rounded-full px-3 py-1"><span class="size-2 rounded-full bg-amber-500"></span>Atenção</span>`;

    const link = `../instace-analysis/index.html?uuid=${encodeURIComponent(a.instanciaUuid)}`;

    return `
      <tr class="border-b border-slate-200 last:border-0">
        <td class="py-2 pr-4">${pill}</td>
        <td class="py-2 pr-4"><a href="${link}" class="font-bold  hover:text-blue-700">${escapeHtml(a.instancia)}</a></td>
        <td class="py-2 pr-4">${escapeHtml(a.componente)} - ${a.valor}${a.unidade === '%' ? '%' : ' ' + escapeHtml(a.unidade)}</td>
        <td class="py-2 text-slate-600">${formatarDuracao(a.criadoEm)}</td>
      </tr>`;
  }).join('');
};

const renderizarAlertasPorInstancia = (instancias) => {
  const area = document.getElementById('lista-alertas-instancia');

  if (instancias.length === 0) {
    area.innerHTML = `<p class="text-slate-500">Nenhum alerta neste mês.</p>`;
    return;
  }

  const maior = Math.max(...instancias.map((i) => i.total));

  area.innerHTML = instancias.map((inst) => {
    const larguraTotal = (inst.total / maior) * 100;
    const parteCritica = (inst.criticos / inst.total) * 100;
    const parteAtencao = (inst.atencao / inst.total) * 100;
    const detalhe = `${inst.criticos} ${plural(inst.criticos, 'crítico', 'críticos')} • ${inst.atencao} em atenção`;

    const numero = (valor) => (valor > 0 ? valor : '');

    return `
    <div class="flex flex-col gap-1 lg:flex-1 lg:justify-center lg:min-h-[44px]">
      <div class="flex justify-between font-medium gap-3 shrink-0">
        <span class="truncate text-sm" title="${escapeHtml(inst.instancia)}">${escapeHtml(inst.instancia)}</span>
        <span class="font-bold text-base leading-none">${inst.total}</span>
      </div>
      <div class="h-5 shrink-0 bg-slate-200 rounded-full overflow-hidden" title="${detalhe}">
        <div class="h-full flex" style="width: ${larguraTotal}%">
          <div class="h-full flex items-center justify-center text-[11px] font-bold text-white"
               style="width: ${parteCritica}%; background: ${corCritico}">${numero(inst.criticos)}</div>
          <div class="h-full flex items-center justify-center text-[11px] font-bold text-slate-800"
                 style="width: ${parteAtencao}%; background: ${corAtencao}">${numero(inst.atencao)}</div>
        </div>
      </div>
    </div>`;
  }).join('');
};

let graficoVolume;
let graficoComponente;

const pluginNumeroNasBarras = {
  id: 'numeroNasBarras',
  afterDatasetsDraw(chart) {
    const { ctx } = chart;
    const barras = chart.data.datasets
      .map((dataset, i) => ({ dataset, meta: chart.getDatasetMeta(i) }))
      .filter(({ dataset }) => dataset.type === 'bar');

    ctx.save();
    ctx.textAlign = 'center';
    ctx.lineJoin = 'round';
    ctx.lineWidth = 8;

    ctx.font = 'bold 18px monospace';
    ctx.textBaseline = 'middle';
    barras.forEach(({ dataset, meta }, nivel) => {
      meta.data.forEach((barra, j) => {
        const valor = dataset.data[j];
        const altura = Math.abs(barra.base - barra.y);
        if (valor > 0 && altura >= 18) {
          const y = (barra.y + barra.base) / 2;
          ctx.strokeStyle = dataset.backgroundColor[j];
          ctx.strokeText(valor, barra.x, y);
          ctx.fillStyle = nivel === 0 ? '#ffffff' : '#1e293b';
          ctx.fillText(valor, barra.x, y);
        }
      });
    });

    ctx.font = 'bold 18px monospace';
    ctx.textBaseline = 'bottom';
    ctx.fillStyle = '#1e293b';
    const quantosDias = chart.data.labels.length;
    for (let j = 0; j < quantosDias; j++) {
      const total = barras.reduce((soma, { dataset }) => soma + dataset.data[j], 0);
      const topo = Math.min(...barras.map(({ meta }) => meta.data[j].y));
      ctx.strokeStyle = '#f1f5f9';
      ctx.strokeText(total, barras[0].meta.data[j].x, topo - 4);
      ctx.fillText(total, barras[0].meta.data[j].x, topo - 4);
    }
    ctx.restore();
  }
};

const topoDoEixo = (volume) =>
  Math.max(...volume.map((v) => Math.max(v.criticos + v.atencao, v.resolvidos))) + 1;

const rotuloDoDia = (diaIso) => {
  const data = new Date(`${diaIso}T00:00:00`);
  const semana = data.toLocaleDateString('pt-BR', { weekday: 'short' }).replace('.', '').toUpperCase();
  const diaMes = data.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' });
  return [semana, diaMes];
};

const corCriticoParcial = '#f2a5a1';
const corAtencaoParcial = '#f9e49c';

const renderizarGraficoVolume = (volume) => {
  const canvas = document.getElementById('grafico-volume');
  if (!canvas) return;

  const indiceHoje = volume.length - 1;

  const ultimoDia = new Date(`${volume[indiceHoje].dia}T00:00:00`);
  document.getElementById('subtitulo-volume').innerText =
    `Ocorrências diárias em ${ultimoDia.toLocaleDateString('pt-BR', { month: 'long' })}`;

  const dados = {
    labels: volume.map((v) => rotuloDoDia(v.dia)),
    datasets: [
      {
        type: 'bar', label: 'Crítico', data: volume.map((v) => v.criticos),
        backgroundColor: volume.map((_, i) => (i === indiceHoje ? corCriticoParcial : corCritico)),
        borderRadius: 3, barPercentage: 0.55, order: 2
      },
      {
        type: 'bar', label: 'Atenção', data: volume.map((v) => v.atencao),
        backgroundColor: volume.map((_, i) => (i === indiceHoje ? corAtencaoParcial : corAtencao)),
        borderRadius: 3, barPercentage: 0.55, order: 2
      },
      {
        type: 'line', label: 'Resolvidos por dia', data: volume.map((v) => v.resolvidos),
        borderColor: '#1e293b', borderWidth: 2,
        pointRadius: 0, pointHoverRadius: 4, pointHitRadius: 8,
        segment: { borderDash: (ctx) => (ctx.p1DataIndex === indiceHoje ? [6, 6] : undefined) },
        order: 1
      }
    ]
  };

  if (graficoVolume) {
    graficoVolume.data = dados;
    graficoVolume.options.scales.y.suggestedMax = topoDoEixo(volume);
    graficoVolume.update();
    return;
  }

  graficoVolume = new Chart(canvas, {
    data: dados,
    options: {
      maintainAspectRatio: false,
      plugins: { legend: { display: false } },
      scales: {
        y: {
          beginAtZero: true,
          stacked: true,
          suggestedMax: topoDoEixo(volume),
          ticks: { precision: 0 },
          grid: { color: '#cbd5e1' }
        },
        x: { stacked: true, grid: { display: false } }
      }
    },
    plugins: [pluginNumeroNasBarras]
  });
};

const renderizarGraficoComponente = (itens) => {
  const canvas = document.getElementById('grafico-componente');
  if (!canvas) return;

  const cores = itens.map((item, i) => (item.nome === 'Outros' ? corOutros : coresRosca[i % coresRosca.length]));

  const dados = {
    labels: itens.map((i) => i.nome),
    datasets: [{
      data: itens.map((i) => i.total),
      backgroundColor: cores,
      borderWidth: 3,
      borderColor: '#f1f5f9',
      hoverOffset: 4,
      borderRadius: 5 
    }]
  };

  document.getElementById('legenda-componente').innerHTML = itens.map((item, i) => `
    <li class="flex items-center justify-between gap-6">
      <span class="flex items-center gap-2">
        <span class="inline-block size-3 rounded-full" style="background:${cores[i]}"></span>${escapeHtml(item.nome)}
      </span>
      <span class="font-bold">${item.total}</span>
    </li>`).join('');

  if (graficoComponente) {
    graficoComponente.data = dados;
    graficoComponente.update();
    return;
  }

  graficoComponente = new Chart(canvas, {
    type: 'doughnut',
    data: dados,
    options: {
      maintainAspectRatio: false,
      cutout: '65%',
      plugins: { legend: { display: false } }
    }
  });
};

const renderizarPainel = (dados) => {
  renderizarCabecalho(dados);
  renderizarCardAlertas(dados.alertas);
  renderizarCardsComponentes(dados.componentes);
  renderizarTabelaAlertas(dados.alertasAtivos);
  renderizarAlertasPorInstancia(dados.alertasPorInstancia);
  renderizarGraficoVolume(dados.volume7Dias);
  renderizarGraficoComponente(dados.alertasPorComponente);
};

const carregarPainel = async () => {
  const erro = document.getElementById('erro-painel');

  try {
    const dados = await buscarPainel();
    erro.classList.add('hidden');
    renderizarPainel(dados);
  } catch (e) {
    console.error(e);
    erro.innerText = 'Não foi possível carregar o painel. Tente novamente em instantes.';
    erro.classList.remove('hidden');
  }
};

window.addEventListener('DOMContentLoaded', () => {
  carregarPainel();
  setInterval(carregarPainel, 60 * 1000);
});
