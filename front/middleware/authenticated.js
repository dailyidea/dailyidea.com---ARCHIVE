export default function({ store, route, redirect }) {
  // If the user is not authenticated
  if (!store.getters['cognito/isLoggedIn']) {
    return redirect('/auth/unathorized', { r: route.path })
  }
}
