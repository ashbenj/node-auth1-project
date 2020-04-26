const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const session = require('express-session');
const restricted = require('../auth/restricted-middleware');
const knexSessionStore = require('connect-session-knex')(session);

const authRouter = require('../auth/auth-router.js');
const usersRouter = require('../users/users-router.js');

const server = express();

const sessionConfig = {
	name: 'chocolate-chip',
	secret: 'myspeshulsecret',
	cookie: {
		maxAge: 3600 * 1000,
		secure: false, //should be true in production
		httpOnly: true,
	},
	resave: false,
	saveUnitialized: false,

	store: new knexSessionStore({
		knex: require('../database/dbConfig'),
		tablename: 'sessions',
		sidfieldname: 'sid',
		createTable: true,
		clearInterval: 3600 * 1000,
	}),
};

//global middleware
server.use(helmet());
server.use(express.json());
server.use(cors());
server.use(session(sessionConfig));

server.use('/api/auth', authRouter);
server.use('/api/users', restricted, usersRouter);

server.get('/', (req, res) => {
	res.json({ api: 'up' });
});

module.exports = server;
