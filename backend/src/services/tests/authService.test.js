const chai = require('chai');
const chaiHttp = require('chai-http');
const AuthService = require('../authService');

chai.use(chaiHttp);

describe('Auth Service', () => {
	describe('buildLoginUrl', () => {
		it('builds the correct login url', async () => {
			const url = await AuthService.buildLoginUrl();
			const redirectTo = 'http://localhost:8080/auth/callback';
			const expected = `https://secure.birds.cornell.edu/cassso/login?service=${encodeURIComponent(
				redirectTo
			)}`;
			chai.assert.equal(url, expected);
		});
	});
});
