const AuthService = require('../services/authService');

const adminUser = {
	username: 'admin',
	password: 'password123'
};

async function handleLogin(req, res) {
	const { username, password } = req.body;
	if (username !== adminUser.username && password !== adminUser.password) {
		res.status(401).json({ message: 'Unauthorized' });
	}
	const redirectUrl = await AuthService.buildLoginUrl();
	// Redirect the user to eBird's login page
	return res.redirect(redirectUrl);
}

async function handleLoginRedirect(req, res) {
	// Extract session information from the query parameters
	const session = req.query.EBIRD_SESSIONID;
	if (session === undefined) {
		// Redirect to home page if session ID is undefined
		return res.redirect('http://localhost:3000/');
	}
	// Output the session information to the browser
	res.send(`Session ID: ${session}`);
	//res.redirect('/home');
}

module.exports = {
	handleLogin,
	handleLoginRedirect
};
