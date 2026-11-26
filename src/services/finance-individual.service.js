
import {
    S3Client,
    GetObjectCommand
} from "@aws-sdk/client-s3";

import financeIndividualModel from "../models/finance-individual.model.js";

import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";

const s3 = new S3Client({
    region: process.env.AWS_REGION || "us-east-1"
});

const bucket = process.env.S3_BUCKET;
const prefix = process.env.S3_HISTORICAL_PREFIX || "03-client-gold";

// Faixas fixas de utilização
const LIMITE_SUB_UTILIZACAO = 60;
const LIMITE_SUPER_UTILIZACAO = 80;

const normalizarMac = (mac) => {
    return String(mac || "").trim().toUpperCase();
};

const normalizarNomeEmpresa = (nome) => {
    return String(nome || "")
        .toLowerCase()
        .replace(/ /g, "_");
};

const converterNumero = (valor) => {
    const numero = Number(valor);

    return Number.isFinite(numero) ? numero : null;
};

// LEITURA DO JSON

const lerJsonHistorico = async (empresaUUID) => {
    if (process.env.FINANCE_INDIVIDUAL_SOURCE === "local") {
        const caminho = fileURLToPath(
            new URL("../data/microhub_historical.json", import.meta.url)
        );

        const conteudo = await readFile(caminho, "utf8");
        const historico = JSON.parse(conteudo);

        console.log(
            `[SIMULAÇÃO LOCAL] JSON carregado: ${historico.instancias?.length || 0} instâncias`
        );

        return historico;
    }

    if (!bucket) {
        throw new Error("A variável S3_BUCKET não foi configurada.");
    }

    const resultadoEmpresa =
        await financeIndividualModel.getCompanyName(empresaUUID);

    if (!resultadoEmpresa.length) {
        throw new Error("Empresa não encontrada.");
    }

    const nomeEmpresa = normalizarNomeEmpresa(
        resultadoEmpresa[0].nome_fantasia
    );

    const key = `${prefix}/${nomeEmpresa}_historical.json`;

    try {
        const resposta = await s3.send(
            new GetObjectCommand({
                Bucket: bucket,
                Key: key
            })
        );

        const conteudo = await resposta.Body.transformToString();

        return JSON.parse(conteudo);

    } catch (erro) {
        if (
            erro.name === "NoSuchKey" ||
            erro.$metadata?.httpStatusCode === 404
        ) {
            return {
                empresa: nomeEmpresa,
                instancias: []
            };
        }

        throw erro;
    }
};

// LEITURAS

const obterLeiturasRecentes = (instanciaHistorica) => {
    if (!instanciaHistorica || !Array.isArray(instanciaHistorica.leituras)) {
        return [];
    }

    const leiturasValidas = instanciaHistorica.leituras
        .filter(leitura => leitura && leitura.timestamp)
        .sort((a, b) => {
            return new Date(b.timestamp) - new Date(a.timestamp);
        });

    const timestamps = new Set();

    const leiturasUnicas = leiturasValidas.filter(leitura => {
        if (timestamps.has(leitura.timestamp)) {
            return false;
        }

        timestamps.add(leitura.timestamp);
        return true;
    });

    return leiturasUnicas.slice(0, 5);
};

const calcularMedia = (leituras, componente) => {
    const valores = leituras
        .map(leitura => converterNumero(leitura[componente]))
        .filter(valor => valor !== null);

    if (!valores.length) {
        return null;
    }

    const soma = valores.reduce((total, valor) => total + valor, 0);

    return Number((soma / valores.length).toFixed(2));
};

// MÉTRICAS DE CPU E RAM

const analisarMetricas = (leituras) => {
    const componentes = [
        {
            nome: "CPU",
            componente: "cpu_percent"
        },
        {
            nome: "RAM",
            componente: "ram_percent"
        }
    ];

    const resultado = [];

    for (const componente of componentes) {
        const media = calcularMedia(
            leituras,
            componente.componente
        );

        if (media === null) {
            continue;
        }

        resultado.push({
            nome: componente.nome,
            componente: componente.componente,
            media
        });
    }

    return resultado;
};

const calcularUsoMedio = (metricas) => {
    if (!metricas.length) {
        return null;
    }

    const soma = metricas.reduce(
        (total, metrica) => total + metrica.media,
        0
    );

    return Number((soma / metricas.length).toFixed(2));
};

// CLASSIFICAÇÃO FIXA

const classificarInstancia = (usoMedio) => {
    if (usoMedio === null) {
        return "sem_dados";
    }

    if (usoMedio < LIMITE_SUB_UTILIZACAO) {
        return "sub_utilizada";
    }

    if (usoMedio > LIMITE_SUPER_UTILIZACAO) {
        return "super_utilizada";
    }

    return "estavel";
};

// RECOMENDAÇÃO VERTICAL

const obterProximoTipo = (tipoAtual, tipos) => {
    const candidatos = tipos.filter(tipo => {
        return Number(tipo.cpu) >= Number(tipoAtual.cpu) &&
            Number(tipo.ram) >= Number(tipoAtual.ram) &&
            (
                Number(tipo.cpu) > Number(tipoAtual.cpu) ||
                Number(tipo.ram) > Number(tipoAtual.ram)
            );
    });

    candidatos.sort((a, b) => {
        const capacidadeA = Number(a.cpu) * Number(a.ram);
        const capacidadeB = Number(b.cpu) * Number(b.ram);

        return capacidadeA - capacidadeB;
    });

    return candidatos[0] || null;
};

const obterTipoAnterior = (tipoAtual, tipos) => {
    const candidatos = tipos.filter(tipo => {
        return Number(tipo.cpu) <= Number(tipoAtual.cpu) &&
            Number(tipo.ram) <= Number(tipoAtual.ram) &&
            (
                Number(tipo.cpu) < Number(tipoAtual.cpu) ||
                Number(tipo.ram) < Number(tipoAtual.ram)
            );
    });

    candidatos.sort((a, b) => {
        const capacidadeA = Number(a.cpu) * Number(a.ram);
        const capacidadeB = Number(b.cpu) * Number(b.ram);

        return capacidadeB - capacidadeA;
    });

    return candidatos[0] || null;
};

// RECOMENDAÇÃO HORIZONTAL

const calcularInstanciasHorizontais = (usoMedio) => {
    if (usoMedio === null || usoMedio <= LIMITE_SUPER_UTILIZACAO) {
        return null;
    }

    return Math.max(
        1,
        Math.ceil(usoMedio / LIMITE_SUPER_UTILIZACAO) - 1
    );
};

// GERAÇÃO DAS RECOMENDAÇÕES

const gerarRecomendacao = (status, tipoAtual, tipos, usoMedio) => {
    if (status === "super_utilizada") {
        const proximoTipo = obterProximoTipo(tipoAtual, tipos);

        return {
            vertical: proximoTipo
                ? {
                    acao: "aumentar",
                    tipo_atual: tipoAtual,
                    tipo_recomendado: proximoTipo
                }
                : null,

            horizontal: {
                acao: "adicionar",
                tipo: tipoAtual,
                quantidade: calcularInstanciasHorizontais(usoMedio)
            }
        };
    }

    if (status === "sub_utilizada") {
        const tipoAnterior = obterTipoAnterior(tipoAtual, tipos);

        return {
            vertical: tipoAnterior
                ? {
                    acao: "reduzir",
                    tipo_atual: tipoAtual,
                    tipo_recomendado: tipoAnterior
                }
                : null,

            horizontal: null
        };
    }

    return {
        vertical: null,
        horizontal: null
    };
};

// ANÁLISE DAS INSTÂNCIAS

const analisarInstancias = async (empresaUUID, instancias) => {
    const [historico, tipos] = await Promise.all([
        lerJsonHistorico(empresaUUID),
        financeIndividualModel.getTypes()
    ]);

    const historicoPorMac = new Map();

    for (const instancia of historico.instancias || []) {
        historicoPorMac.set(
            normalizarMac(instancia.mac_address),
            instancia
        );
    }

    return instancias.map(instancia => {
        const instanciaHistorica = historicoPorMac.get(
            normalizarMac(instancia.endereco_mac)
        );

        const leituras = obterLeiturasRecentes(instanciaHistorica);
        const metricas = analisarMetricas(leituras);

        const usoMedio = calcularUsoMedio(metricas);
        const status = classificarInstancia(usoMedio);

        const recomendacao = gerarRecomendacao(
            status,
            instancia,
            tipos,
            usoMedio
        );

        return {
            ...instancia,

            analise: {
                status,
                quantidade_leituras: leituras.length,
                ultima_leitura: leituras[0]?.timestamp || null,
                uso_medio: usoMedio,

                capacidade_nao_utilizada: usoMedio === null
                    ? null
                    : Number((100 - usoMedio).toFixed(2)),

                metricas,
                recomendacao
            }
        };
    });
};

const analisarInstancia = async (empresaUUID, uuid) => {
    const instancias = await financeIndividualModel.getItens(
        uuid,
        empresaUUID
    );

    if (!instancias.length) {
        return [];
    }

    return await analisarInstancias(empresaUUID, instancias);
};

export default {
    analisarInstancias,
    analisarInstancia
};
