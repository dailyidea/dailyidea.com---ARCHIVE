export default `
query getEmailNotificationsSettings {
  getEmailNotificationsSettings {
    unsubscribedAt
    ideaReminders
    hotStreaks
    dailyDigests
    weeklyDigests
    ideaActivity
  }
}`
