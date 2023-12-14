export default class UserDTO {
	constructor(user) {
		this.first_name = user.first_name
		this.last_name = user.last_name
		this.email = user.email
		this.role = user.role
	}
}

export function createUserDTO(reqUser) {
	// Check if the required fields are present
	if (!reqUser || !reqUser.first_name || !reqUser.email) {
		return null // Return null if required fields are missing
	}

	const userDTO = new UserDTO(reqUser) // Create a new UserDTO instance
	return userDTO // Return the created UserDTO instance
}
