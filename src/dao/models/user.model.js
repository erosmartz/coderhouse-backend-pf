import mongoose from 'mongoose'

const userCollection = 'users'

const userSchema = new mongoose.Schema({
	first_name: String,
	last_name: String,
	password: String,
	email: { type: String, unique: true },
	role: { type: String, default: 'user' },
	age: Number,
	cart: { type: mongoose.Schema.Types.ObjectId, ref: 'Carts' },
	profileImage: { type: String, default: 'public/image/default-avatar.png' }, // Path to the profile image
	last_connection: { type: Date, default: null },
	documents: [
		{
			name: String,
			reference: String,
		},
	],
})

const User = mongoose.model(userCollection, userSchema)

export default User
