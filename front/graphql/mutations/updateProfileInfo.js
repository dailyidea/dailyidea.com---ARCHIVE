export default `
mutation updateProfileInfo( $bio: String, $name: String!, $interestedInTags: [String]) {
  updateProfileInfo( name: $name, bio: $bio, interestedInTags: $interestedInTags) {    
      result {
        ok
        error
      }
      updatedInfo {
        name
        bio
        slug
        interestedInTags
      }
  }
}`
