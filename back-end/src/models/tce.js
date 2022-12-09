/* eslint-disable no-underscore-dangle */
const moment = require('moment');
const { Schema, Types, model } = require('mongoose');
const User = require('./user');
const Roles = require('../utils/roles.json');

const horariosSchema = new Schema({
    diaSemana: { type: Number },
    manha: { type: String },
    tarde: { type: String },
    noite: { type: String },
    _id: false,
});

const estagioSchema = new Schema({
    dataInicio: { type: Date, default: () => new Date() },
    dataFim: { type: Date, default: () => moment(new Date()).add(4, 'months').toDate() },
    valorBolsa: { type: Number, default: 0 },
    valorAuxilioTransporte: { type: Number, default: 0 },
    cargaHorariaSemanal: { type: Number, default: 20 },
    componenteCurricular: { type: String, default: '' },
    horarios: { type: [horariosSchema], default: () => ([]) },
    atividadesPrevistas: { type: String, default: '' },
    _id: false,
});

const estagiarioSchema = new Schema({
    user: { type: Schema.Types.ObjectId, ref: 'User' },
    rg: { type: String, default: '' },
    matricula: { type: String, default: '' },
    mae: { type: String, default: '' },
    fone: { type: String, default: '' },
    endereco: { type: String, default: '' },
    cidade: { type: String, default: '' },
    uf: { type: String, default: '' },
    semestre: { type: String, default: '' },
    _id: false,
});

const supervisorSchema = new Schema({
    nome: { type: String, default: '' },
    cargo: { type: String, default: '' },
    email: { type: String, default: '' },
    _id: false,
});

const unidadeConcedenteSchema = new Schema({
    razaoSocial: { type: String, default: '' },
    cnpj: { type: String, default: '' },
    setor: { type: String, default: '' },
    endereco: { type: String, default: '' },
    cep: { type: String, default: '' },
    cidade: { type: String, default: '' },
    fone: { type: String, default: '' },
    uf: { type: String, default: '' },
    representanteLegal: { type: String, default: '' },
    supervisor: { type: supervisorSchema, default: {} },
    _id: false,
});

const tceSchema = new Schema({
    unidadeConcedente: { type: unidadeConcedenteSchema, default: {} },
    estagiario: { type: estagiarioSchema, default: {} },
    orientador: { type: Schema.Types.ObjectId, ref: 'User' },
    estagio: { type: estagioSchema, default: {} },
}, {
    timestamps: true,
});

tceSchema.methods.updateTce = async function updateTce(req) {
    const tce = this;
    const tceData = {
        ...req.body,
    };

    delete tceData.orientador;

    tceData.estagiario.user = Types.ObjectId(req.userData.id);
    tceData.estagio.cargaHorariaSemanal = typeof tceData.estagio.cargaHorariaSemanal === 'string'
        ? Number(tceData.estagio.cargaHorariaSemanal.replace(' h', '')) : tceData.estagio.cargaHorariaSemanal;

    tce.set(tceData);

    return tce.save();
};

tceSchema.methods.getPojoSchema = async function getPojoSchema() {
    const tce = this.toObject();

    if (tce.estagiario) {
        // Move user attributes to estagiario root object
        tce.estagiario = {
            ...tce.estagiario.user,
            ...tce.estagiario,
        };

        // Transform course to single value
        if (tce.estagiario.course && tce.estagiario.course.length) {
            [tce.estagiario.course] = tce.estagiario.course;
        }

        if (tce.estagiario.fone) {
            tce.estagiario.fone = tce.estagiario.fone.replace(/\D+/g, '');
        }

        delete tce.estagiario.user;
    }

    if (tce.estagio) {
        if (tce.estagio.dataInicio) {
            tce.estagio.dataInicio = moment(tce.estagio.dataInicio).format('YYYY-MM-DD');
        }

        if (tce.estagio.dataFim) {
            tce.estagio.dataFim = moment(tce.estagio.dataFim).format('YYYY-MM-DD');
        }

        if (tce.estagio.horarios && tce.estagio.horarios.length) {
            // eslint-disable-next-line no-param-reassign
            tce.estagio.horarios.forEach((horario) => delete horario._id);
        }
    }

    delete tce.createdAt;
    delete tce.updatedAt;
    delete tce.__v;

    // eslint-disable-next-line no-underscore-dangle
    tce.id = tce._id;

    ['createdAt', 'updatedAt', '__v', '_id'].forEach((attribute) => {
        tce[attribute] = undefined;
    });

    return tce;
};

tceSchema.statics.createTceForCurrentUser = async function createTceForCurrentUser(req) {
    const Tce = this;
    const { course } = req.userData;
    const courseCoordinator = await User.findOne({
        course,
        roles: Roles.COORDINATOR,
    });

    const tceData = {
        estagiario: {
            user: Types.ObjectId(req.userData.id),
        },
        orientador: courseCoordinator && courseCoordinator.id,
        estagio: {
            horarios: [],
        },
    };

    for (let i = 1; i <= 6; i += 1) {
        tceData.estagio.horarios.push({
            diaSemana: i,
            manha: '',
            tarde: '',
            noite: '',
        });
    }

    return new Tce(tceData);
};

tceSchema.statics.getTceFromCurrentUser = async function getTceFromCurrentUser(req) {
    const { id } = req.userData;
    const tce = await this
        .findOne({ 'estagiario.user': Types.ObjectId(id) })
        .populate('orientador', 'login name')
        .populate('estagiario.user', 'name login course email');

    if (!tce) {
        return null;
    }

    return tce.getPojoSchema();
};

const Tce = model('TCE', tceSchema);

module.exports = Tce;
