// Logic for changing user role when a button is clicked
document.querySelectorAll('.change-role-button').forEach((button) => {
	button.addEventListener('click', moveToChangeRole)
})

function moveToChangeRole(event) {
	event.preventDefault()
	const userId = event.target.id

	fetch(`/api/users/admin/${userId}`, {
		method: 'GET',
		headers: {
			'Content-Type': 'application/json',
		},
	})
		.then((response) => {
			if (response.ok) {
				window.location.href = `/api/users/admin/${userId}`
			} else {
				throw new Error('Error while trying to change role')
			}
		})
		.catch((error) => {
			alert(error.message)
		})
}

// Logic for handling the user role change form submission
const changeUserForm = document.getElementById('update-role-user-form')

changeUserForm &&
	changeUserForm.addEventListener('submit', async (event) => {
		event.preventDefault()
		const newRole = document.getElementById('newRole').value.toString()
		const userEmail = document.getElementById('userEmail').value

		try {
			const response = await fetch(`/api/users/byemail/${userEmail}`, {
				method: 'GET',
				headers: {
					'Content-Type': 'application/json',
				},
			})

			if (response.ok) {
				const userId = await response.json()

				const updateResponse = await fetch(`/api/users/admin/${userId}`, {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
					},
					body: JSON.stringify({ newRole }),
				})

				if (updateResponse.ok) {
					console.log('User role updated successfully', newRole)
					document.getElementById('newRole').value = ''
					document.getElementById('userEmail').value = ''
				} else {
					console.error('Error updating user role:', updateResponse.statusText)
				}
			} else {
				console.error('Error obtaining user ID:', response.statusText)
			}
		} catch (error) {
			console.error('Network error:', error)
		}
	})

// Logic for the admin to delete a user
document.querySelectorAll('.button-delete-user').forEach((button) => {
	button.addEventListener('click', deleteUser)
})

function deleteUser(event) {
	event.preventDefault()
	const userId = event.target.id

	fetch(`/api/users/${userId}`, {
		method: 'DELETE',
		headers: {
			'Content-Type': 'application/json',
		},
	})
		.then((response) => {
			if (!response.ok) {
				throw new Error('Error deleting user')
			}
			return response.json()
		})
		.then((data) => {
			console.log('User deleted')
			window.location.reload()
		})
		.catch((error) => {
			console.error('Error:', error)
		})
}
