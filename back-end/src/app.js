const express = require('express');
const path = require('path');
const morgan = require('morgan');
const mongooseConnection = require('./config/mongooseConnection');
const bootstrapSuperAdminUser = require('./config/bootstrapSuperAdminUser');
const corsConfiguration = require('./config/cors');

const app = express();

const index = require('./routes/index');
const userRoutes = require('./routes/user.routes');
const coordinatorRoutes = require('./routes/coordinator.routes');
const processRoutes = require('./routes/process.routes');

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.json({ type: 'application/vnd.api+json' }));
app.use(morgan('dev'));
app.use(corsConfiguration);

app.set('mongoose connection', mongooseConnection);
app.set('set up super admin', bootstrapSuperAdminUser());

app.use(index);
app.use('/api/v1/', userRoutes);
app.use('/api/v1/coordinators', coordinatorRoutes);
app.use('/api/v1/process', processRoutes);
app.use('/api/v1/uploads/documentation', express.static(path.resolve(__dirname, '../uploads/documentation')));
app.use('/templates', express.static(path.resolve(__dirname, 'templates')));

module.exports = app;
