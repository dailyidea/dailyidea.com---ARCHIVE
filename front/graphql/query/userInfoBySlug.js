export default `
query userInfoBySlug($slug: String!) {
  userInfoBySlug(slug: $slug) {
    result {
      ok
      error
    }
    userInfo {
      userId
      name
      slug
      bio
      avatar
      followersCount
      followeesCount
      ideasCreated
      interestedInTags
    }    
  }
}`
