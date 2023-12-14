// Function to attach event listeners to elements with class 'cart-button'
function attachCartButtonListeners() {
	document.querySelectorAll('.cart-button').forEach((button) => {
		button.addEventListener('click', moveToCart)
	})
}

// Function to move to the cart when a button is clicked
function moveToCart(event) {
	event.preventDefault()
	const cartId = event.target.id

	// Fetch cart data based on ID
	fetch(`/api/carts/${cartId}`, {
		method: 'GET',
		headers: {
			'Content-Type': 'application/json',
		},
	})
		.then((response) => {
			if (response.ok) {
				// Redirect to the cart
				window.location.href = `/api/carts/${cartId}`
			} else {
				throw new Error('Error navigating to cart')
			}
		})
		.catch((error) => {
			alert(error.message)
		})
}

// Function to attach event listeners to elements with class 'button-remove-product'
function attachRemoveProductListeners() {
	document.querySelectorAll('.button-remove-product').forEach((button) => {
		button.addEventListener('click', removeOneProduct)
	})
}

// Function to remove a single product from the cart
function removeOneProduct(event) {
	event.preventDefault()
	const cartId = event.target.getAttribute('data-cart-id')
	const productId = event.target.id

	// Remove a product from the cart based on cart and product IDs
	fetch(`/api/carts/${cartId}/${productId}`, {
		method: 'PUT',
		headers: {
			'Content-Type': 'application/json',
		},
	})
		.then((response) => {
			if (!response.ok) {
				throw new Error('Error removing the product')
			}
			return response.json()
		})
		.then((data) => {
			window.location.href = `/api/carts/${cartId}`
		})
		.catch((error) => {
			alert(error.message)
		})
}

// Function to attach event listeners to elements with class 'button-empty-cart'
function attachEmptyCartListeners() {
	document.querySelectorAll('.button-empty-cart').forEach((button) => {
		button.addEventListener('click', emptyCart)
	})
}

// Function to empty the entire cart
function emptyCart(event) {
	event.preventDefault()
	const cartId = event.target.id

	// Empty the cart based on its ID
	fetch(`/api/carts/${cartId}`, {
		method: 'PUT',
		headers: {
			'Content-Type': 'application/json',
		},
	})
		.then((response) => {
			if (!response.ok) {
				throw new Error('Error emptying the cart')
			}
			return response.json()
		})
		.then((data) => {
			window.location.reload()
		})
		.catch((error) => {
			alert(error.message)
		})
}

// Function to attach event listeners to elements with class 'button-decrease-quantity'
function attachDecreaseQuantityListeners() {
	document.querySelectorAll('.button-decrease-quantity').forEach((button) => {
		button.addEventListener('click', decreaseQuantity)
	})
}

// Function to decrease the quantity of a product in the cart
function decreaseQuantity(event) {
	event.preventDefault()
	const cartId = event.target.getAttribute('data-cart-id')
	const productId = event.target.id

	// Decrease the quantity of a product in the cart based on IDs
	fetch(`/api/carts/${cartId}/${productId}/decrease`, {
		method: 'PUT',
		headers: {
			'Content-Type': 'application/json',
		},
	})
		.then((response) => {
			if (!response.ok) {
				throw new Error('Error decreasing the quantity of the product')
			}
			return response.json()
		})
		.then((data) => {
			window.location.reload()
		})
		.catch((error) => {
			alert(error.message)
		})
}

// Function to attach event listeners to elements with class 'button-increase-quantity'
function attachIncreaseQuantityListeners() {
	document.querySelectorAll('.button-increase-quantity').forEach((button) => {
		button.addEventListener('click', increaseQuantity)
	})
}

// Function to increase the quantity of a product in the cart
function increaseQuantity(event) {
	event.preventDefault()
	const cartId = event.target.getAttribute('data-cart-id')
	const productId = event.target.id

	// Increase the quantity of a product in the cart based on IDs
	fetch(`/api/carts/${cartId}/${productId}/increase`, {
		method: 'PUT',
		headers: {
			'Content-Type': 'application/json',
		},
	})
		.then((response) => {
			if (!response.ok) {
				throw new Error('Error increasing the quantity of the product')
			}
			return response.json()
		})
		.then((data) => {
			window.location.reload()
		})
		.catch((error) => {
			alert(error.message)
		})
}

// Attach event listeners to different buttons
attachCartButtonListeners()
attachRemoveProductListeners()
attachEmptyCartListeners()
attachDecreaseQuantityListeners()
attachIncreaseQuantityListeners()
