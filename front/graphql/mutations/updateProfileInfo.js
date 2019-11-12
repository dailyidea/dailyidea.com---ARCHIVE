export default `
mutation updateProfileInfo( $name: String! ) {
  updateProfileInfo( name: $name ) {    
    userId
    name
  }
}`
