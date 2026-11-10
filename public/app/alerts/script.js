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


window.addEventListener("DOMContentLoaded", () => {
    atualizarDataHora();

});