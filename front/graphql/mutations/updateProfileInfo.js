export default `
mutation updateProfileInfo( $bio: String, $name: String!) {
  updateProfileInfo( name: $name, bio: $bio) {    
      result {
        ok
        error
      }
      updatedInfo {
        name
        bio
        slug
      }
  }
}`
