export default `
mutation toggleEmailNotifications( $enabled: Boolean! ) {
  toggleEmailNotifications( enabled: $enabled ) {    
    state
  }
}`
