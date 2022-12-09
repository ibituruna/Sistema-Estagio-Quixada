const StringMask = require('string-mask');
const PizZip = require('pizzip');
const Docxtemplater = require('docxtemplater');
const mammoth = require('mammoth');
const puppeteer = require('puppeteer');
const moment = require('moment');

const fs = require('fs');
const path = require('path');

/* Constants */
const TCE_TEMPLATES_BASE_PATH = path.resolve(__dirname, '../templates/TCE/');
const TCE_TEMPLATE_PATH = path.resolve(TCE_TEMPLATES_BASE_PATH, 'termo-de-compromisso-de-estagio-obrigatorio.docx');
const TCE_HEADER_PATH = path.resolve(TCE_TEMPLATES_BASE_PATH, 'termo-de-compromisso-de-estagio-obrigatorio-header.html');
const TCE_CSS_PATH = path.resolve(TCE_TEMPLATES_BASE_PATH, 'termo-de-compromisso-de-estagio-obrigatorio.css');

function initializeDocxTemplater() {
    // Load the docx file as binary content
    const content = fs.readFileSync(TCE_TEMPLATE_PATH, 'binary');
    const zip = new PizZip(content);

    return new Docxtemplater(zip, {
        paragraphLoop: true,
        linebreaks: true,
    });
}

function getTceParams(tce) {
    function resolvePath(objectPath, obj) {
        return objectPath.split('.').reduce((prev, curr) => (prev ? prev[curr] : null), obj);
    }

    const attributesMap = {
        razaoSocial: { path: 'unidadeConcedente.razaoSocial' },
        cnpj: { path: 'unidadeConcedente.cnpj' },
        setor: { path: 'unidadeConcedente.setor' },
        endereco: { path: 'unidadeConcedente.endereco' },
        cep: { path: 'unidadeConcedente.cep' },
        cidade: { path: 'unidadeConcedente.cidade' },
        fone: { path: 'unidadeConcedente.fone' },
        representanteLegal: { path: 'unidadeConcedente.representanteLegal' },
        nomeSupervisor: { path: 'unidadeConcedente.supervisor.nome' },
        cargoSupervisor: { path: 'unidadeConcedente.supervisor.cargo' },
        emailSupervisor: { path: 'unidadeConcedente.supervisor.email' },
        estagiarioNome: { path: 'estagiario.name' },
        estagiarioRg: { path: 'estagiario.rg' },
        estagiarioCpf: { path: 'estagiario.login', mask: new StringMask('000.000.000-00') },
        estagiarioMatricula: { path: 'estagiario.matricula' },
        estagiarioNomeMae: { path: 'estagiario.mae' },
        estagiarioFone: { path: 'estagiario.fone' },
        estagiarioEndereco: { path: 'estagiario.endereco' },
        estagiarioCidade: { path: 'estagiario.cidade' },
        estagiarioUf: { path: 'estagiario.uf' },
        estagiarioCurso: { path: 'estagiario.course' },
        estagiarioSemestre: { path: 'estagiario.semestre' },
        estagiarioEmail: { path: 'estagiario.email' },
        orientadorNome: { path: 'orientador.name' },
        orientadorSiape: { path: 'orientador.login' },
        estagioDataInicio: { path: 'estagio.dataInicio' },
        estagioDataFim: { path: 'estagio.dataFim' },
        estagioValorBolsa: { path: 'estagio.valorBolsa', mask: new StringMask('R$ #.##0,00', { reverse: true }) },
        estagioValorAuxilio: { path: 'estagio.valorAuxilioTransporte', mask: new StringMask('R$ #.##0,00', { reverse: true }) },
        estagioCargaHoraria: { path: 'estagio.cargaHorariaSemanal' },
        estagioComponenteCurricular: { path: 'estagio.componenteCurricular' },
        atividadesPrevistas: { path: 'estagio.atividadesPrevistas' },
        tceData: { value: new Date(Date.now()) },
    };

    const horariosTurnos = ['Manha', 'Tarde', 'Noite'];
    for (let i = 0; i < 6; i += 1) {
        horariosTurnos.forEach((turno) => {
            attributesMap[`horarioDia${i + 1}${turno}`] = { path: `estagio.horarios.${i}.${turno.toLowerCase()}` };
        });
    }

    const tceParams = {};

    Object.keys(attributesMap).forEach((placeHolder) => {
        const attributePath = attributesMap[placeHolder].path;
        const attributeMask = attributesMap[placeHolder].mask;
        let value;

        if (attributePath) {
            value = resolvePath(attributePath, tce);
        } else {
            value = attributesMap[placeHolder].value;
        }

        if (value instanceof Date) {
            value = moment(value).utc(false).format('DD/MM/YYYY');
        } else if (value && attributeMask) {
            if (typeof value === 'number') {
                value *= 100;
            }

            value = attributeMask.apply(value);
        }

        tceParams[placeHolder] = value || '';
    });

    return tceParams;
}

function generateTceFromTemplate(doc, tce) {
    if (!doc) {
        throw new Error('It was not possible to initialize the TCE template');
    }

    const tceParams = getTceParams(tce);

    doc.render(tceParams);

    return doc.getZip().generate({
        type: 'nodebuffer',
        compression: 'DEFLATE',
    });
}

async function convertTceToHtml(docxBuffer) {
    const result = await mammoth.convertToHtml({
        buffer: docxBuffer,
    });

    if (!result) {
        throw new Error('It was not possible to convert the TCE to HTML.');
    }

    return result.value;
}

async function convertTceToPdf(tceHtml) {
    const headerContent = fs.readFileSync(TCE_HEADER_PATH).toString();
    const browser = await puppeteer.launch({
        args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });
    const page = await browser.newPage();

    await page.setContent(tceHtml);
    await page.addStyleTag({
        path: TCE_CSS_PATH,
    });

    const tcePdfBuffer = await page.pdf({
        printBackground: true,
        format: 'A4',
        displayHeaderFooter: true,
        headerTemplate: headerContent,
        margin: {
            top: '90px',
            bottom: '8px',
        },
    });

    await browser.close();

    return tcePdfBuffer;
}

async function generateTceAsPDF(tce) {
    const doc = initializeDocxTemplater();
    const tceDocxBuffer = generateTceFromTemplate(doc, tce);
    const tceHtml = await convertTceToHtml(tceDocxBuffer);

    return convertTceToPdf(tceHtml);
}

module.exports = {
    generateTceAsPDF,
};
