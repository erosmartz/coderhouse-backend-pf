import { USERDAO, PRODUCTDAO, TICKETDAO, CARTDAO } from '../dao/factory.js'
import UserRepository from './user.repository.js'
import ProductRepository from './product.repository.js'
import TicketRepository from './ticket.repository.js'
import CartRepository from './cart.repository.js'

// Create instances of repository classes using the corresponding DAOs
export const userService = new UserRepository(USERDAO)
export const productService = new ProductRepository(PRODUCTDAO)
export const ticketService = new TicketRepository(TICKETDAO)
export const cartService = new CartRepository(CARTDAO)
