const router = require('express').Router();

const Users = require('./users-model.js');
const restricted = require('../auth/restricted-middleware.js');

router.get('/', (req, res) => {
	Users.find()
		.then((users) => {
			res.json(users);
		})
		.catch((err) => res.send(err));
});

router.post('/login', (req, res) => {
	const { username, password } = req.body;

	Users.findBy({ username })
		.then(([user]) => {
			if (user && bycrpt.compareSync(password, user.password)) {
				res.status(200).json({ message: 'welcome!' });
			} else {
				res.status(401).json({ message: 'invalid creds' });
			}
		})
		.catch((err) => {
			res.status(500).json({ message: 'problem with the db', error: err });
		});
});

module.exports = router;
