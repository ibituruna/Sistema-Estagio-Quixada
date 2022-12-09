const mongoose = require('mongoose');
const config = require('./config');
const { protocol, username, password, host, port, name } = config.db;

const mongoDbUri = config.isProductionMode ? `${protocol}://${username}:${password}@${host}/${name}` : `${protocol}://${host}:${port}/${name}`;

mongoose
    .connect(mongoDbUri)
    .then(() => {
        console.log("A base de dados foi conectada com sucesso!");
    })
    .catch((err) => {
        console.log(`Erro ao conectar com a Base de Dados...: ${err}`);
        process.exit();
    });
