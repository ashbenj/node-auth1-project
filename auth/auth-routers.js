const router = require('express').Router();
const bcrypt = require('bcryptjs');

const Users = require('../users/users-model');

router.post('/register', (req, res) => {
	const user = req.body;
	const hash = bcrypt.hashSync(user.password, 8);
	//flow of excution of code will stop here until hash is done creating
	//hash the hash of that hash 2 to the 8th power (256 times)

	Users.add(user)
		.then((saved) => {
			res.status(201).json({ saved });
		})
		.catch((err) => {
			res.status(500).json({ message: 'problem with the db', error: err });
		});
});

module.exports = router;
