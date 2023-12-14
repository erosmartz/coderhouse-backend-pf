import mongoose from 'mongoose'

const ticketCollection = 'tickets'
const ticketSchema = new mongoose.Schema({
	code: {
		type: String,
		unique: true,

		required: true,
	},
	purchaser: {
		type: String,
		required: true,
	},
	purchase_datetime: {
		type: Date,
		default: Date.now,
	},
	amount: {
		type: Number,
		required: true,
	},
})

const Ticket = mongoose.model(ticketCollection, ticketSchema)

export default Ticket
