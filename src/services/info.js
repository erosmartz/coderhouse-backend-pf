/**
 * Generates error information for incomplete or invalid product properties.
 * @param {Object} product - The product object
 * @returns {string} - Error information
 */
export const generateProductErrorInfo = (product) => {
	return `One or more properties were incomplete or not valid.
    List of required properties:
    * Name: must be a string, received ${product.name}
    * Description: must be a string, received ${product.description}
    * Price: must be a number, received ${product.price}
    * Category: must be a string, received ${product.category}
    * Availability: must be a number, received ${product.availability}`
}

/**
 * Generates error information for incomplete or invalid cart properties.
 * @param {Object} cart - The cart object
 * @returns {string} - Error information
 */
export const updateCartErrorInfo = (cart) => {
	return `One or more properties were incomplete or not valid.
    List of required properties:
    * Products: must be an array of objects, received ${typeof cart.products}
    * Each product should have the following properties:
      - Product: should be a valid product reference
      - Quantity: must be a number greater than 0`
}
