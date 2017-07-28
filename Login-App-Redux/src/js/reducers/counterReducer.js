export default function reducer(state = {
  email: ""
}, action) {
  switch (action.type) {
    case "UPDATE_EMAIL":
      return {
        ...state,
        email: state.email
      };
    default:
      return {
        ...state
      }
  }
}
