import chai from 'chai'
import supertest from 'supertest'

// Test setup
const expect = chai.expect
const request = supertest('http://localhost:8080')
const userId = 1

describe('Carts Router', () => {
	// Test for retrieving a user's cart
	it("should return a user's cart", async () => {
		const response = await request.get(`/carts/${userId}`)
		expect(response.status).to.equal(200) // Check if status code is 200 OK
		expect(response.body).to.be.an('object') // Check if response body is an object
	})

	// Test for adding a product to the cart
	it('should add a product to the cart', async () => {
		const productToAdd = { productId: 1, quantity: 2 }
		const response = await request
			.post(`/carts/${userId}/add`)
			.send(productToAdd)
		expect(response.status).to.equal(200) // Check if status code is 200 OK
		expect(response.body).to.include(productToAdd) // Check if response includes the added product
	})

	// Test for removing a product from the cart
	it('should remove a product from the cart', async () => {
		const productToRemove = { productId: 1 }
		const response = await request
			.delete(`/carts/${userId}/remove`)
			.send(productToRemove)
		expect(response.status).to.equal(200) // Check if status code is 200 OK
		expect(response.body).to.not.include(productToRemove) // Check if response doesn't include the removed product
	})
})
