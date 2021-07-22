import * as actionTypes from "../Constants/userConstants";

const reducerInitialState = {
  data: [],
  error: "",
  isLoading: false
};

const userReducer = (state = reducerInitialState, action) => {
  switch(action.type) {
    case actionTypes.SIGNUP_LOADING:
      return {
        ...state,
        data: [],
        error: "",
        isLoading: true
      }
    case actionTypes.SIGNUP_FAILURE:
      return {
        ...state,
        isLoading: false,
        error: action.payload
      }
    case actionTypes.SIGNUP_SUCCESS:
      return {
        ...state,
        error: "",
        isLoading: false,
        data: action.payload
      }
    case actionTypes.LOGIN_LOADING:
      return {
        ...state,
        error: "",
        isLoading: true
      }
    case actionTypes.LOGIN_FAILURE:
      return {
        ...state,
        isLoading: false,
        error: action.payload
      }
    case actionTypes.LOGIN_SUCCESS:
      return {
        ...state,
        data: action.payload,
        isLoading: false,
        error: ""
      }
    default:
      return state;
  }
}

export default userReducer;