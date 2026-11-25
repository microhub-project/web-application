import model from "../models/reports.model.js"
import { S3Client, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import companyModel from "../models/company.model.js";

async function listarFunc(req, res) {
    const empresaUUID = req.companyUUID;

    if (!empresaUUID) {
        return res.status(401).json({
            message: "Empresa não identificada."
        });
    }

    try {
        const resultado = await model.getGeralFunc(empresaUUID);

        return res.status(200).json({ data: resultado });
    } catch (e) {
        console.error(e);
        return res.status(500).json({
            message: "Erro ao listar os funcionários"
        });
    }
}

async function getGeralInst(req, res) {
    const empresaUUID = req.companyUUID;

    if (!empresaUUID) {
        return res.status(401).json({
            message: "Empresa não identificada."
        });
    }

    try {
        const resultado = await model.getGeralInst(empresaUUID);

        return res.status(200).json({ data: resultado });
    } catch (e) {
        console.error(e);
        return res.status(500).json({
            message: "Erro ao listar as instâncias"
        });
    }
}

async function getTotalAlertas(req, res) {
    const empresaUUID = req.companyUUID;

    if (!empresaUUID) {
        return res.status(401).json({
            message: "Empresa não identificada."
        });
    }

    try {
        const resultado = await model.getTotalAlertas(empresaUUID);

        return res.status(200).json({ data: resultado });
    } catch (e) {
        console.error(e);
        return res.status(500).json({
            message: "Erro ao listar as instâncias"
        });
    }
}

async function getRankingAlertas(req, res) {
    const empresaUUID = req.companyUUID;

    if (!empresaUUID) {
        return res.status(401).json({
            message: "Empresa não identificada."
        });
    }

    try {
        const resultado = await model.getRankingAlertas(empresaUUID);

        return res.status(200).json({ data: resultado });
    } catch (e) {
        console.error(e);
        return res.status(500).json({
            message: "Erro ao listar as instâncias"
        });
    }
}

async function getDownloadUrl(req, res) {
    const empresaUUID = req.companyUUID;

    if (!empresaUUID) {
        return res.status(401).json({ message: "Empresa não identificada." });
    }

    try {
        const result = await companyModel.getNameByUUID(empresaUUID);

        if (result.length == 0) {
            return res.status(404).json({ message: "Empresa não encontrada" });
        }

        const fileName = result[0].nome_fantasia.replaceAll(" ", "_").toLowerCase() + ".pdf";

        const s3 = new S3Client({
            region: process.env.AWS_REGION,
            credentials: {
                accessKeyId: process.env.AWS_ACCESS_KEY_ID,
                secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
                sessionToken: process.env.AWS_SESSION_TOKEN
            }
        });

        const command = new GetObjectCommand({
            Bucket: process.env.AWS_BUCKET,
            Key: "relatorios/" + fileName,
            ResponseContentDisposition: 'attachment; filename="' + fileName + '"'
        });

        const url = await getSignedUrl(s3, command, { expiresIn: 60 });

        return res.status(200).json({ url: url });
    } catch (e) {
        console.error(e);
        return res.status(500).json({ message: "Erro ao gerar o link do PDF" });
    }
}

export default {
  listarFunc,
  getGeralInst,
  getTotalAlertas,
  getRankingAlertas,
  getDownloadUrl
};