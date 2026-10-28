let graficoPrincipal;
const labelsEixoX = ['8:00', '9:00', '10:00', '11:00', '12:00', '13:00', '14:00'];

const dadosGrafico = {
  cpu: {
    label: 'CPU (%)',
    data: [45, 55, 75, 68, 65, 50, 62], // Média de 60%
    limite: 80,
    cor: '#64748b',
    tipoLimite: 'Limite Máximo',
    alertaTexto: 'Limite Máximo: 80%'
  },
  ram: {
    label: 'RAM (%)',
    data: [60, 64, 72, 75, 73, 65, 68], // Média de 68%
    limite: 85,
    cor: '#8b5cf6',
    tipoLimite: 'Limite Máximo',
    alertaTexto: 'Limite Máximo: 85%'
  },
  upload: {
    label: 'Upload (Mbps)',
    data: [50, 75, 115, 100, 95, 65, 85], // Média de 83 Mbps
    limite: 30,
    cor: '#10b981',
    tipoLimite: 'Limite Mínimo',
    alertaTexto: 'Limite Mínimo: 30 Mbps'
  },
  download: {
    label: 'Download (Mbps)',
    data: [10, 18, 35, 28, 25, 12, 22], // Média de 21 Mbps.
    limite: 10,
    cor: '#3b82f6',
    tipoLimite: 'Limite Mínimo',
    alertaTexto: 'Limite Mínimo: 10 Mbps'
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
            data: Array(7).fill(padrao.limite),
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


  const grafico2 = document.getElementById('myChart2');

  new Chart(grafico2, {
    type: 'doughnut',
    data: {
      labels: ['Normal', 'Em Atenção', 'Críticos'],
      datasets: [{
        data: [40, 10, 5],
        backgroundColor: [
          '#4CAF50',
          '#FFD54F',
          '#F44336'
        ],

        borderWidth: 3,
        borderRadius: 5,
        borderColor: '#f1f5f9',
        hoverOffset: 4
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      cutout: '72%',

      layout: {
        padding: {
          top: 0,
          bottom: 0,
          left: 0,
          right: 0
        }
      },
      plugins: {
        legend: {
          position: 'right',
          align: 'center',
          labels: {
            color: '#1e293b',
            padding: 25,
            usePointStyle: true,
            pointStyle: 'circle',

            boxWidth: 10,
            boxHeight: 10,
            font: {
              size: 18,
              family: 'monospace',
              weight: 'normal'
            },

            generateLabels: function (chart) {
              const data = chart.data;
              if (data.labels.length && data.datasets.length) { // Verifica se existem textos e valores para nao quebrar
                return data.labels.map((label, i) => { // Laço de repetição, varre os labels (Normal, Crítico e Em atenção)
                  const valor = data.datasets[0].data[i];
                  return {
                    text: `  ${label.padEnd(12)} ${valor}`, // Empurra o valor para o final da linha, alinhamaneto
                    fillStyle: data.datasets[0].backgroundColor[i],
                    strokeStyle: 'transparent', // Tiram a borda da bolinha
                    lineWidth: 0
                  };
                });
              }
              return [];
            }
          }
        }
      }
    },

    plugins: [{
      id: 'textoCentral',
      beforeDraw: function (chart) { // Insere o texto ao centro após desenhar o circulo
        const { ctx } = chart;
        ctx.restore();

        const centroX = chart.getDatasetMeta(0).data[0].x;
        const centroY = chart.getDatasetMeta(0).data[0].y;

        ctx.textBaseline = 'middle';
        ctx.textAlign = 'center';

        ctx.font = 'bold 48px font-mono, monospace';
        ctx.fillStyle = '#0f172a';
        ctx.fillText('55', centroX, centroY - 8);

        ctx.font = 'normal 12px font-mono, monospace';
        ctx.fillStyle = '#64748b';
        ctx.fillText('Instâncias', centroX, centroY + 25);

        ctx.save();
      }
    }]
  });
}

const mudarGrafico = (metrica, botaoClicado) => {
  const novosDados = dadosGrafico[metrica];

  // substitui os dados da linha do componente
  graficoPrincipal.data.datasets[0].label = novosDados.label;
  graficoPrincipal.data.datasets[0].data = novosDados.data;
  graficoPrincipal.data.datasets[0].borderColor = novosDados.cor;

  // substitui os dados da linha de limite 
  graficoPrincipal.data.datasets[1].label = novosDados.tipoLimite;
  graficoPrincipal.data.datasets[1].data = Array(7).fill(novosDados.limite);

  if (metrica === 'cpu' || metrica === 'ram') { // Se cpu ou ram, eixo x vai até 100 / Se não, deixa livre (upload e download)
    graficoPrincipal.options.scales.y.max = 100;
    graficoPrincipal.options.scales.y.ticks.stepSize = 25;
  } else {
    delete graficoPrincipal.options.scales.y.max;
    delete graficoPrincipal.options.scales.y.ticks.stepSize;
  }


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

  if (nomeCard === 'alerta') {
    if (valorAtual >= 1) {
      card.classList.remove('bg-slate-100', 'border-blue-900');
      valor.classList.remove('text-slate-900');

      card.classList.add('bg-red-50', 'border-red-700');
      valor.classList.add('text-red-700');
      texto.classList.add('text-red-700');
      icone.classList.add('text-red-700');
    } else {
      card.classList.remove('bg-red-50', 'border-red-700');
      valor.classList.remove('text-red-700');
      texto.classList.remove('text-red-700');
      icone.classList.remove('text-red-700');

      card.classList.add('bg-slate-100', 'border-blue-900');
      valor.classList.add('text-slate-900');
    }

    return;
  }

  const margem = 5;

  if (valorAtual >= limiteMaximo || (limiteMinimo !== null && valorAtual <= limiteMinimo)) {
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

  } else if ((valorAtual >= limiteMaximo - margem) || (limiteMinimo !== null && valorAtual <= limiteMinimo + margem)) {
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


const loadAllMetrics = () => {

  atualizarDataHora();

  // valores mockados
  const alertas = 8;
  const cpuMedia = 60;
  const ramMedia = 68;
  const upload = 83;
  const download = 21;

  aplicarAlertaCard('cpu', cpuMedia, 80, null, cpuMedia + "%");
  aplicarAlertaCard('ram', ramMedia, 80, null, ramMedia + "%");
  aplicarAlertaCard('upload', upload, 150, 30, upload);
  aplicarAlertaCard('download', download, 150, 10, download);
  aplicarAlertaCard('alerta', alertas, null, null, alertas);

}

