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
      followersCount
      followeesCount
      ideasCreated
      isFollowingByMe
      followsMe
    }    
  }
}`
