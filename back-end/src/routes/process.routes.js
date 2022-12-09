const express = require('express');
const multer = require('multer');
const path = require('path');
const processController = require('../controllers/process');
const userLoggedIn = require('../middlewares/userLoggedIn');

function checkFileType(req, file, cb) {
    // Update file name
    // eslint-disable-next-line no-param-reassign
    file.originalname = Buffer.from(file.originalname, 'latin1').toString(
        'utf8',
    );
}

const upload = multer({
    storage: multer.diskStorage({
        destination: path.resolve(__dirname, '../../uploads/documentation'),
        fileFilter: checkFileType,
        filename(req, file, callback) {
            // eslint-disable-next-line no-param-reassign
            file.originalname = Buffer.from(file.originalname, 'latin1').toString('utf8');
            const fileName = `${req.userData.id}-${file.originalname}`;

            return callback(null, fileName);
        },
    }),
});
const router = express.Router();

router.get('/', userLoggedIn.validateLoggedIn, userLoggedIn.isStudent, processController.getProcess);
router.get('/all', userLoggedIn.validateLoggedIn, userLoggedIn.isCoordinator, processController.getAllProcesses);
router.get('/search', userLoggedIn.validateLoggedIn, userLoggedIn.isCoordinator, processController.search);
router.get('/messages', userLoggedIn.validateLoggedIn, userLoggedIn.isCoordinator, processController.getAllUnreadCoordinatorMessages);
router.post('/sigaaRegistration/confirm', userLoggedIn.validateLoggedIn, processController.confirmSigaaRegistration);
router.post('/internshipType', userLoggedIn.validateLoggedIn, processController.setInternshipType);
router.post('/documentation', userLoggedIn.validateLoggedIn, upload.single('documentFile'), processController.uploadDocumentation);
router.post('/:processId/message', userLoggedIn.validateLoggedIn, processController.postNewMessage);
router.post('/:processId/documentation/approve', userLoggedIn.validateLoggedIn, userLoggedIn.isCoordinator, processController.approveDocumentation);
router.get('/documentation/tce', userLoggedIn.validateLoggedIn, processController.getTce);
router.get('/documentation/tce/download', userLoggedIn.validateLoggedIn, processController.generateTce);
router.patch('/documentation/tce/:tceId', userLoggedIn.validateLoggedIn, processController.saveTce);

module.exports = router;
