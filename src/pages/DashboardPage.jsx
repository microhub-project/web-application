import { useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';
import AppLayout from '../components/AppLayout';

export default function DashboardPage() {
  const chart1Ref = useRef(null);
  const chart2Ref = useRef(null);
  const chart3Ref = useRef(null);
  const chart4Ref = useRef(null);

  useEffect(() => {
    const instances = [];

    const commonOptions = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          labels: {
            color: '#94a3b8',
            font: { family: 'JetBrains Mono' },
          },
        },
      },
      scales: {
        x: {
          grid: { color: 'rgba(148, 163, 184, 0.1)' },
          ticks: { color: '#94a3b8' },
        },
        y: {
          beginAtZero: true,
          grid: { color: 'rgba(148, 163, 184, 0.1)' },
          ticks: { color: '#94a3b8' },
        },
      },
    };

    if (chart1Ref.current) {
      instances.push(
        new Chart(chart1Ref.current, {
          type: 'bar',
          data: {
            labels: ['Serviço A', 'Serviço B', 'Serviço C', 'Serviço D', 'Serviço E', 'Serviço F'],
            datasets: [
              {
                label: 'Uso de CPU (%)',
                data: [12, 19, 3, 5, 2, 3],
                backgroundColor: 'rgba(59, 130, 246, 0.7)',
                borderColor: '#3b82f6',
                borderWidth: 1,
                borderRadius: 4,
              },
            ],
          },
          options: commonOptions,
        })
      );
    }

    if (chart2Ref.current) {
      instances.push(
        new Chart(chart2Ref.current, {
          type: 'line',
          data: {
            labels: ['00:00', '04:00', '08:00', '12:00', '16:00', '20:00'],
            datasets: [
              {
                label: 'Consumo de Memória (GB)',
                data: [3, 2, 5, 3, 19, 12],
                backgroundColor: 'rgba(168, 85, 247, 0.2)',
                borderColor: '#a855f7',
                borderWidth: 2,
                fill: true,
                tension: 0.3,
              },
            ],
          },
          options: commonOptions,
        })
      );
    }

    if (chart3Ref.current) {
      instances.push(
        new Chart(chart3Ref.current, {
          type: 'bar',
          data: {
            labels: ['00:00', '04:00', '08:00', '12:00', '16:00', '20:00'],
            datasets: [
              {
                label: 'Tráfego de Rede (MB/s)',
                data: [3, 2, 5, 3, 19, 12],
                backgroundColor: 'rgba(16, 185, 129, 0.7)',
                borderColor: '#10b981',
                borderWidth: 1,
                borderRadius: 4,
              },
            ],
          },
          options: commonOptions,
        })
      );
    }

    if (chart4Ref.current) {
      instances.push(
        new Chart(chart4Ref.current, {
          type: 'line',
          data: {
            labels: ['Serviço A', 'Serviço B', 'Serviço C', 'Serviço D', 'Serviço E', 'Serviço F'],
            datasets: [
              {
                label: 'I/O de Disco (IOPS)',
                data: [12, 19, 3, 5, 2, 3],
                backgroundColor: 'rgba(245, 158, 11, 0.2)',
                borderColor: '#f59e0b',
                borderWidth: 2,
                fill: true,
                tension: 0.3,
              },
            ],
          },
          options: commonOptions,
        })
      );
    }

    return () => {
      instances.forEach((inst) => inst.destroy());
    };
  }, []);

  return (
    <AppLayout>
      <div className="flex flex-col gap-8 w-full max-w-7xl mx-auto pb-12">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-100">Visão Geral dos Microsserviços</h1>
          <p className="text-slate-400 mt-1">
            Métricas em tempo real de infraestrutura e serviços monitorados.
          </p>
        </div>

        {/* METRICS CARDS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 w-full">
          <div className="rounded-2xl bg-slate-800/80 border-2 border-emerald-500/80 p-6 flex flex-col justify-between relative overflow-hidden shadow-lg">
            <i className="ph-bold ph-trend-up absolute top-5 right-5 text-xl p-2.5 rounded-lg border border-emerald-400 text-emerald-400 bg-emerald-500/10"></i>
            <span className="text-sm font-semibold uppercase tracking-wider text-slate-400">Taxa de Sucesso</span>
            <p className="text-4xl font-extrabold text-emerald-400 mt-4">98.4%</p>
            <span className="text-xs text-slate-400 mt-2 flex items-center gap-1">
              <i className="ph ph-arrow-up text-emerald-400"></i> +2.1% em relação a ontem
            </span>
          </div>

          <div className="rounded-2xl bg-slate-800/80 border-2 border-amber-500/80 p-6 flex flex-col justify-between relative overflow-hidden shadow-lg">
            <i className="ph-bold ph-cpu absolute top-5 right-5 text-xl p-2.5 rounded-lg border border-amber-400 text-amber-400 bg-amber-500/10"></i>
            <span className="text-sm font-semibold uppercase tracking-wider text-slate-400">Média CPU</span>
            <p className="text-4xl font-extrabold text-amber-400 mt-4">64%</p>
            <span className="text-xs text-slate-400 mt-2 flex items-center gap-1">
              <i className="ph ph-warning text-amber-400"></i> Alerta moderado em 2 nós
            </span>
          </div>

          <div className="rounded-2xl bg-slate-800/80 border-2 border-rose-500/80 p-6 flex flex-col justify-between relative overflow-hidden shadow-lg">
            <i className="ph-bold ph-bell-ringing absolute top-5 right-5 text-xl p-2.5 rounded-lg border border-rose-400 text-rose-400 bg-rose-500/10"></i>
            <span className="text-sm font-semibold uppercase tracking-wider text-slate-400">Alertas Críticos</span>
            <p className="text-4xl font-extrabold text-rose-400 mt-4">3</p>
            <span className="text-xs text-slate-400 mt-2 flex items-center gap-1 text-rose-300">
              <i className="ph ph-warning-circle text-rose-400"></i> Timeout em Microsserviço de Pagamento
            </span>
          </div>

          <div className="rounded-2xl bg-slate-800/80 border-2 border-blue-500/80 p-6 flex flex-col justify-between relative overflow-hidden shadow-lg">
            <i className="ph-bold ph-hard-drives absolute top-5 right-5 text-xl p-2.5 rounded-lg border border-blue-400 text-blue-400 bg-blue-500/10"></i>
            <span className="text-sm font-semibold uppercase tracking-wider text-slate-400">Serviços Ativos</span>
            <p className="text-4xl font-extrabold text-blue-400 mt-4">12 / 12</p>
            <span className="text-xs text-slate-400 mt-2 flex items-center gap-1">
              <i className="ph ph-check-circle text-emerald-400"></i> 100% de disponibilidade
            </span>
          </div>
        </div>

        {/* CHARTS GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 w-full">
          <div className="bg-slate-800/60 border border-slate-700/60 rounded-2xl p-6 shadow-xl flex flex-col">
            <h3 className="text-lg font-bold text-slate-200 mb-4 flex items-center gap-2">
              <i className="ph ph-cpu text-blue-400 text-xl"></i>
              Uso de CPU por Microsserviço
            </h3>
            <div className="h-64 w-full">
              <canvas ref={chart1Ref}></canvas>
            </div>
          </div>

          <div className="bg-slate-800/60 border border-slate-700/60 rounded-2xl p-6 shadow-xl flex flex-col">
            <h3 className="text-lg font-bold text-slate-200 mb-4 flex items-center gap-2">
              <i className="ph ph-memory text-purple-400 text-xl"></i>
              Consumo de Memória nas Últimas 24h
            </h3>
            <div className="h-64 w-full">
              <canvas ref={chart2Ref}></canvas>
            </div>
          </div>

          <div className="bg-slate-800/60 border border-slate-700/60 rounded-2xl p-6 shadow-xl flex flex-col">
            <h3 className="text-lg font-bold text-slate-200 mb-4 flex items-center gap-2">
              <i className="ph ph-network text-emerald-400 text-xl"></i>
              Tráfego de Rede
            </h3>
            <div className="h-64 w-full">
              <canvas ref={chart3Ref}></canvas>
            </div>
          </div>

          <div className="bg-slate-800/60 border border-slate-700/60 rounded-2xl p-6 shadow-xl flex flex-col">
            <h3 className="text-lg font-bold text-slate-200 mb-4 flex items-center gap-2">
              <i className="ph ph-disc text-amber-400 text-xl"></i>
              Operações de Disco (IOPS)
            </h3>
            <div className="h-64 w-full">
              <canvas ref={chart4Ref}></canvas>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
