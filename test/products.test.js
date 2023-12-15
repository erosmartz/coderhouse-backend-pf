import chai from 'chai'
import supertest from 'supertest'

// Test setup
const expect = chai.expect
const request = supertest('http://localhost:8080')

describe('Products Router', () => {
	// Test for getting a list of products
	it('should return a list of products', async () => {
		const response = await request.get('/products')
		expect(response.status).to.equal(200) // Check if status code is 200 OK
		expect(response.body).to.be.an('array') // Check if response body is an array
	})

	// Test for creating a new product
	it('should create a new product', async () => {
		const newProduct = { name: 'New Product', price: 9.99 }
		const response = await request.post('/products').send(newProduct)
		expect(response.status).to.equal(201) // Check if status code is 201 Created
		expect(response.body).to.include(newProduct) // Check if response includes the new product data
	})

	// Test for updating an existing product
	it('should update an existing product', async () => {
		const updatedProduct = { name: 'Updated Product', price: 12.99 }
		const response = await request.put('/products/1').send(updatedProduct)
		expect(response.status).to.equal(200) // Check if status code is 200 OK
		expect(response.body).to.include(updatedProduct) // Check if response includes the updated product data
	})
})
