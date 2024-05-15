async function buildLoginUrl() {
	// Construct the URL to redirect the user to eBird's login page
	const loginUrl = 'https://secure.birds.cornell.edu/cassso/login';
	// Set the service parameter to a callback URL where eBird will redirect after login
	const callbackUrl = encodeURIComponent(
		'http://localhost:8080/auth/callback'
	);
	return `${loginUrl}?service=${callbackUrl}`;
}

module.exports = {
	buildLoginUrl
};
