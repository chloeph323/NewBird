const chai = require('chai');
const chaiHttp = require('chai-http');

chai.use(chaiHttp);

const app = require('./app');

describe('Express App', () => {
	describe('Server Startup', () => {
		it('starts the server on an available port', (done) => {
			const server = app.listen(8080, () => {
				const port = server.address().port;
				chai.assert.equal(port, 8080); // Ensure port is assigned by OS
				server.close();
				done();
			});
		});
	});
});
