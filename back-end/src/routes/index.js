const express = require('express');

const router = express.Router();
const package = require('../../package.json');

router.get('/api/v1', (req, res) => {
    res.status(200).send({
        success: true,
        version: package.version
    });
})

module.exports = router;
