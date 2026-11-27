import {
    S3Client,
    GetObjectCommand
} from "@aws-sdk/client-s3";

import financeIndividualModel from "../models/finance-individual.model.js";

import { readFile, stat } from "node:fs/promises";
import { fileURLToPath } from "node:url";

const s3 = new S3Client({
    region: process.env.AWS_REGION || "us-east-1"
});

const bucket = process.env.S3_BUCKET;
const prefix = process.env.S3_HISTORICAL_PREFIX || "03-client-gold";

const PONTOS_PADRAO = 13;

const MAX_LEITURAS_CACHE = 100;

const CACHE_TTL_MS = 60 * 1000;

const CAMPOS = {
    cpu: "cpu_percent",
    ram: "ram_percent",
    upload: "upload_traffic",
    download: "download_traffic",
    cpu_frequency: "cpu_frequency",
    disk: "disk",
    processos: "processes_qtd",
    zumbi: "zombie_processes_percent",
    swap: "swap_memory_percent"
};

const normalizarMac = (mac) => String(mac || "").trim().toUpperCase();

const normalizarNomeEmpresa = (nome) => {
    return String(nome || "").toLowerCase().replace(/ /g, "_");
};

const converterNumero = (valor) => {
    if (valor === null || valor === undefined || valor === "") return null;

    const numero = Number(valor);

    return Number.isFinite(numero) ? numero : null;
};

const paraMs = (timestamp) => {
    const ms = new Date(String(timestamp).replace(" ", "T")).getTime();

    return Number.isFinite(ms) ? ms : null;
};

const caminhoLocal = () => {
    if (process.env.METRICAS_HISTORICO_PATH) {
        return process.env.METRICAS_HISTORICO_PATH;
    }

    return fileURLToPath(
        new URL("../data/microhub_historical.json", import.meta.url)
    );
};

const lerJsonLocal = async () => {
    const conteudo = await readFile(caminhoLocal(), "utf8");

    return JSON.parse(conteudo);
};

const lerJsonS3 = async (empresaUUID) => {
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
            new GetObjectCommand({ Bucket: bucket, Key: key })
        );

        const conteudo = await resposta.Body.transformToString();

        return JSON.parse(conteudo);

    } catch (erro) {
        if (
            erro.name === "NoSuchKey" ||
            erro.$metadata?.httpStatusCode === 404
        ) {
            return { empresa: nomeEmpresa, instancias: [] };
        }

        throw erro;
    }
};

const cache = new Map();

const indexarPorMac = (historico) => {
    const porMac = new Map();

    for (const instancia of historico.instancias || []) {
        const mac = normalizarMac(instancia.mac_address);

        if (!mac || !Array.isArray(instancia.leituras)) continue;

        const vistos = new Set();
        const leituras = [];

        for (const leitura of instancia.leituras) {
            if (!leitura || !leitura.timestamp) continue;
            if (vistos.has(leitura.timestamp)) continue;

            const ms = paraMs(leitura.timestamp);
            if (ms === null) continue;

            vistos.add(leitura.timestamp);
            leituras.push({ ms, leitura });
        }

        leituras.sort((a, b) => a.ms - b.ms);

        porMac.set(
            mac,
            leituras.slice(-MAX_LEITURAS_CACHE).map(item => item.leitura)
        );
    }

    return porMac;
};

const obterIndice = async (empresaUUID) => {
    const local = process.env.FINANCE_INDIVIDUAL_SOURCE === "local";

    const mtime = local ? (await stat(caminhoLocal())).mtimeMs : null;

    const chaveCache = local
        ? `local:${caminhoLocal()}`
        : `s3:${empresaUUID}`;

    const emCache = cache.get(chaveCache);

    if (
        emCache &&
        emCache.expira > Date.now() &&
        emCache.mtime === mtime
    ) {
        return emCache.porMac;
    }

    const historico = local
        ? await lerJsonLocal()
        : await lerJsonS3(empresaUUID);

    const porMac = indexarPorMac(historico);

    cache.set(chaveCache, {
        expira: Date.now() + CACHE_TTL_MS,
        mtime,
        porMac
    });

    return porMac;
};

const formatarLeitura = (leitura) => {
    const resultado = { timestamp: leitura.timestamp };

    for (const [card, campo] of Object.entries(CAMPOS)) {
        resultado[card] = converterNumero(leitura[campo]);
    }

    return resultado;
};

const obterMetricas = async (empresaUUID, mac, pontos = PONTOS_PADRAO) => {
    const porMac = await obterIndice(empresaUUID);

    const todas = porMac.get(normalizarMac(mac)) || [];

    const leituras = todas.slice(-pontos).map(formatarLeitura);

    return {
        quantidade: leituras.length,
        leituras,
        ultima: leituras[leituras.length - 1] || null
    };
};

export default {
    PONTOS_PADRAO,
    obterMetricas
};
