export default `
query getStats {
  getStats {
    ideas {
      today
      week
      month
      total
    }    
    users {
      today
      week
      month
      total
    }    
    shares {
      today
      week
      month
      total
    }
  }
}`
