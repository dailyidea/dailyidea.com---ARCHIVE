export default `
query userInfo($userId: String!) {
  userInfo(userId: $userId) {
    result {
      ok
      error
    }
    userInfo {
      userId
      name
      slug
      bio
      followersCount
      followeesCount
      ideasCreated
      isFollowingByMe
      followsMe
    }    
  }
}`
