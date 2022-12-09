const { Types } = require('mongoose');
const Tce = require('../models/tce');
const Process = require('../models/process');
const tceGenerator = require('../utils/tceGenerator');
const permissionUtils = require('../utils/permissionUtils');

exports.uploadDocumentation = async function uploadDocumentation(req, res) {
    try {
        const { id } = req.userData;
        const process = await Process.findOne({ student: Types.ObjectId(id) });

        if (!process) {
            return res.status(404).json({
                success: false,
                message: 'Não foi possível localizar o processo do usuário atual.',
            });
        }

        const result = await process.setDocumentPath(req.file);

        return res.json(result);
    } catch (e) {
        return res.status(400).json({
            success: false,
            message: e.message,
        });
    }
};

exports.getTce = async function getTce(req, res) {
    try {
        let tce = await Tce.getTceFromCurrentUser(req);

        if (!tce) {
            const newTce = await Tce.createTceForCurrentUser(req);

            await newTce.save();

            const process = await Process.getProcessFromCurrentUser(req, true);

            if (process) {
                process.set({ tce: newTce.id });
                await process.save();
            }
        }

        tce = await Tce.getTceFromCurrentUser(req);

        res.json(tce);
    } catch (e) {
        res.status(400).json({
            success: false,
            message: e.message,
        });
    }
};

exports.saveTce = async function saveTce(req, res) {
    try {
        const { tceId } = req.params;
        const tce = await Tce.findById(tceId);

        if (!tce) {
            return res.status(404).json({
                success: false,
                message: 'Não foi possível localizar o TCE informado.',
            });
        }

        const isResourceOwner = permissionUtils.isResourceOwner(
            req.userData.id,
            tce.estagiario.user,
        );

        if (!isResourceOwner) {
            return res.status(403).json({
                success: false,
                message: 'Usuário não possui permissão para modificar o TCE informado.',
            });
        }

        const updatedTce = await tce.updateTce(req);
        const isSuccesfullyUpdated = !!updatedTce;

        return res.status(isSuccesfullyUpdated ? 200 : 400).json({
            success: isSuccesfullyUpdated,
            message: isSuccesfullyUpdated ? undefined : 'Houve um erro ao tentar atualizar o TCE.',
        });
    } catch (error) {
        return res.status(400).json({
            message: error.message,
        });
    }
};

exports.generateTce = async function generateTce(req, res) {
    const tce = await Tce.getTceFromCurrentUser(req);

    const fileContents = await tceGenerator.generateTceAsPDF(tce);
    const fileName = 'termo-de-compromisso-de-estagio-obrigatorio.pdf';

    res.set('Content-disposition', `attachment; filename=${fileName}`);
    res.send(fileContents);
};

exports.getProcess = async (req, res) => {
    try {
        let process = await Process.getProcessFromCurrentUser(req);

        if (!process) {
            const newProcess = await Process.createProcessForCurrentUser(req);

            await newProcess.save();
        }

        process = await Process.getProcessFromCurrentUser(req);

        res.json(process);
    } catch (e) {
        res.status(400).json({
            success: false,
            message: e.message,
        });
    }
};

exports.getAllProcesses = async (req, res) => {
    try {
        const { id } = req.userData;
        const processes = await Process
            .find({ coordinator: Types.ObjectId(id) })
            .populate('student', 'name course')
            .populate('messages.author', 'name');

        res.json({
            success: true,
            processes,
        });
    } catch (e) {
        res.status(400).json({
            success: false,
            message: e.message,
        });
    }
};

exports.confirmSigaaRegistration = async (req, res) => {
    try {
        const { id } = req.userData;
        const process = await Process.findOne({ student: Types.ObjectId(id) });

        if (!process) {
            return res.status(404).json({
                success: false,
                message: 'Não foi possível localizar o processo do usuário atual.',
            });
        }

        const result = await process.confirmSigaaRegistration();

        return res.json(result);
    } catch (e) {
        return res.status(400).json({
            success: false,
            message: e.message,
        });
    }
};

exports.setInternshipType = async (req, res) => {
    try {
        const { id } = req.userData;
        const { internshipType } = req.body;
        const process = await Process.findOne({ student: Types.ObjectId(id) });

        if (!process) {
            return res.status(404).json({
                success: false,
                message: 'Não foi possível localizar o processo do usuário atual.',
            });
        }

        const result = await process.setInternshipType(internshipType);

        return res.json(result);
    } catch (e) {
        return res.status(400).json({
            success: false,
            message: e.message,
        });
    }
};

exports.approveDocumentation = async (req, res) => {
    try {
        const { processId } = req.params;

        const process = await Process.findById(processId);

        if (!process) {
            return res.status(404).json({
                success: false,
                message: 'Não foi possível localizar o processo informado.',
            });
        }

        if (!process.isResourceOwner(req)) {
            return res.status(403).json({
                success: false,
                message: 'Usuário não possui permissão para modificar o processo informado.',
            });
        }

        const result = await process.approveDocumentation();

        return res.json(result);
    } catch (error) {
        return res.status(400).json({
            message: error.message,
        });
    }
};

exports.search = async (req, res) => {
    try {
        const { currentStep, isReadyToReview } = req.query;
        const filterOptions = {
            coordinator: Types.ObjectId(req.userData.id),
        };

        if (isReadyToReview) {
            filterOptions['steps.currentStep.isReadyToReview'] = isReadyToReview === 'true';
        }

        if (currentStep) {
            filterOptions['steps.currentStep.step'] = currentStep;
        }

        const processes = await Process
            .find(filterOptions)
            .populate('student', 'name course');

        return res.json({
            success: true,
            processes,
        });
    } catch (error) {
        return res.status(400).json({
            message: error.message,
        });
    }
};

exports.postNewMessage = async (req, res) => {
    try {
        const { message } = req.body;
        const { processId } = req.params;

        const process = await Process.findById(processId);

        if (!process) {
            return res.status(404).json({
                success: false,
                message: 'Não foi possível localizar o processo informado.',
            });
        }

        if (!process.isResourceOwner(req)) {
            return res.status(403).json({
                success: false,
                message: 'Usuário não possui permissão para modificar o processo informado.',
            });
        }

        const result = await process.postNewMessage(req, message);

        return res.json(result);
    } catch (error) {
        return res.status(400).json({
            message: error.message,
        });
    }
};

exports.getAllUnreadCoordinatorMessages = async (req, res) => {
    try {
        const processes = await Process.getAllUnreadCoordinatorMessages(req.userData.id);

        return res.json({
            success: true,
            processes,
        });
    } catch (error) {
        return res.status(400).json({
            message: error.message,
        });
    }
};
