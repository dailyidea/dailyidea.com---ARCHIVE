export default `
mutation updateEmailNotificationsSettings( $state: EmailNotificationsInput! ) {
  updateEmailNotificationsSettings( state: $state ) {    
    ideaReminders
    hotStreaks
    dailyDigests
    weeklyDigests
  }
}`
