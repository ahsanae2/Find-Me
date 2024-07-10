export default  getRecipientEmails = (users, userLoggedIn) => (
    users?.filter(user => user.email !== userLoggedIn?.email)
)