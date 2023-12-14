import createUserDTO from '../DTO/userDTO.js'
export default class UserRepository {
	constructor(dao) {
		this.dao = dao
	}
	createUser = (user) => {
		return this.dao.create(user)
	}
	getAllUsers = () => {
		return this.dao.getAll()
	}
	getAllUsersWithDTO = () => {
		const allUsers = this.dao.getAll()
		const userDTOs = allUsers.map((users) => createUserDTO(users))
		return userDTOs
	}
	getUserById = (uid) => {
		return this.dao.getById(uid)
	}
	getUserIdByEmail = (email) => {
		return this.dao.getByIdFromEmail(email)
	}
	getDataUserByEmail = (email) => {
		return this.dao.getDataByEmail(email)
	}
	updateIdCartInUser = (user) => {
		return this.dao.updateIdCart(user)
	}
	updateUser = (uid, newRole) => {
		return this.dao.update(uid, newRole)
	}
	uploadProfileUser = (uid, imagePath) => {
		return this.dao.upAvatar(uid, imagePath)
	}
	uploadDocument = (uid, documentType, filePath) => {
		return this.dao.upDocument(uid, documentType, filePath)
	}
	getAvatar = (uid) => {
		return this.dao.avatar(uid)
	}
	deleteUser = (uid) => {
		return this.dao.delete(uid)
	}
}
