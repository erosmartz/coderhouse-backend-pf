import chai from 'chai'
import supertest from 'supertest'

// Test setup
const expect = chai.expect
const request = supertest('http://localhost:8080')

describe('Sessions Router', () => {
	// Test for creating a new session for a user
	it('should create a new session for a user', async () => {
		const userCredentials = { username: 'user123', password: 'password123' }
		const response = await request.post('/sessions').send(userCredentials)
		expect(response.status).to.equal(200) // Check if status code is 200 OK
		expect(response.body).to.be.an('object') // Check if response body is an object
		expect(response.body).to.have.property('token') // Check if response has a 'token' property
	})

	// Test for returning an error for invalid credentials
	it('should return an error for invalid credentials', async () => {
		const invalidCredentials = {
			username: 'user123',
			password: 'wrongpassword',
		}
		const response = await request.post('/sessions').send(invalidCredentials)
		expect(response.status).to.equal(401) // Check if status code is 401 Unauthorized
	})

	// Test for getting user information after authentication
	it('should get user information after authentication', async () => {
		const token = 'valid_token' // Use a valid token obtained from a successful session
		const response = await request
			.get('/sessions/user')
			.set('Authorization', `Bearer ${token}`) // Set authorization header with token
		expect(response.status).to.equal(200) // Check if status code is 200 OK
		expect(response.body).to.be.an('object') // Check if response body is an object
		expect(response.body).to.have.property('username') // Check if response has a 'username' property
	})
})
