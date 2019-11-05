export default `
mutation toggleEmailNotifications( $state: EmailNotificationsState! ) {
  toggleEmailNotifications( state: $state ) {    
    state
  }
}`
