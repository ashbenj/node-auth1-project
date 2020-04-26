const router = require('express').Router();
const bcrypt = require('bcryptjs');

const Users = require('../users/users-model.js');

// for endpoints beginning with /api/auth
router.post('/register', (req, res) => {
	const user = req.body;
	const hash = bcrypt.hashSync(user.password, 10); // 2 ^ n
	//flow of excution of code will stop here until hash is done creating
	//hash the hash of that hash 2 to the 8th power (256 times)
	user.password = hash;

	Users.add(user)
		.then((saved) => {
			res.status(201).json(saved);
		})
		.catch((error) => {
			res.status(500).json(error);
		});
});

router.post('/login', (req, res) => {
	const { username, password } = req.body;

	Users.findBy({ username })
		.then(([user]) => {
			if (user && bcrypt.compareSync(password, user.password)) {
				req.session.user = username;
				res.status(200).json({ message: 'welcome' });
			} else {
				res.status(401).json({ message: 'invalid creds' });
			}
		})
		.catch((err) => {
			res.status(500).json({ message: 'problem with the db', error: err });
		});
});

router.get('logout', (req, res) => {
	req.session.destory((err) => {
		if (err) {
			res.send('unable to logout');
		} else {
			res.send('logged out');
		}
	});
});

module.exports = router;
