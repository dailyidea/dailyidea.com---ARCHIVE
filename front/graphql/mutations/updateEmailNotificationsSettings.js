export default `
mutation updateEmailNotificationsSettings( $state: EmailNotificationsInput! ) {
  updateEmailNotificationsSettings( state: $state ) {
    unsubscribedAt
    ideaReminders
    hotStreaks
    dailyDigests
    weeklyDigests
  }
}`
