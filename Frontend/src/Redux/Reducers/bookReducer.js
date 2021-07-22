import * as actionTypes from "../Constants/bookConstants";

const reducerInitialState = {
  data: [],
  error: "",
  isLoading: false
};

const bookReducer = (state = reducerInitialState, action) => {
  switch(action.type) {
    case actionTypes.ADD_BOOK_LOADING:
      return {
        ...state,
        error: "",
        isLoading: true
      }
    case actionTypes.ADD_BOOK_FAILURE:
      return {
        ...state,
        isLoading: false,
        error: action.payload
      }
    case actionTypes.ADD_BOOK_SUCCESS:
      return {
        ...state,
        error: "",
        isLoading: false,
        data: [ ...state.data, action.payload ]
      }
    case actionTypes.GET_ALL_BOOKS_LOADING:
      return {
        ...state,
        error: "",
        isLoading: true
      }
    case actionTypes.GET_ALL_BOOKS_FAILURE:
      return {
        ...state,
        isLoading: false,
        error: action.payload
      }
    case actionTypes.GET_ALL_BOOKS_SUCCESS:
      return {
        ...state,
        error: "",
        isLoading: false,
        data: action.payload
      }
    case actionTypes.GET_BOOK_BY_ID_LOADING:
      return {
        ...state,
        error: "",
        isLoading: true
      }
    case actionTypes.GET_BOOK_BY_ID_FAILURE:
      return {
        ...state,
        isLoading: false,
        error: action.payload
      }
    case actionTypes.GET_BOOK_BY_ID_SUCCESS:
      return {
        ...state,
        error: "",
        isLoading: false,
        data: action.payload
      }
    case actionTypes.EDIT_BOOK_LOADING:
      return {
        ...state,
        error: "",
        isLoading: true
      }
    case actionTypes.EDIT_BOOK_FAILURE:
      return {
        ...state,
        isLoading: false,
        error: action.payload
      }
    case actionTypes.EDIT_BOOK_SUCCESS:
      return {
        ...state,
        error: "",
        isLoading: false,
        data: state.data.forEach(book => {
          if(book._id === action.payload.data_id) {
            book = { ...action.payload.data }
          }
        })
      }
    case actionTypes.DELETE_BOOK_LOADING:
      return {
        ...state,
        error: "",
        isLoading: true
      }
    case actionTypes.DELETE_BOOK_FAILURE:
      return {
        ...state,
        isLoading: false,
        error: action.payload
      }
    case actionTypes.DELETE_BOOK_SUCCESS:
      return {
        ...state,
        error: "",
        isLoading: false,
        data: state.data.filter(book => book._id !== action.payload._id)
      }
    default:
      return state;
  }
}

export default bookReducer;