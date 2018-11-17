export const getErrorMessage = e => {
  let err
  if (e.response && e.response.data && e.response.data.message) {
    err = e.response.data.message
  } else {
    err = e
  }
  return err
}
