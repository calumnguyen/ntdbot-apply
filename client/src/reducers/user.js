import {

  USER_LOADING,
  USER_DELETED,
  GET_USER,
  USERS_ERROR,
  USER_UPDATED,
  USER_SAVED,
  GET_USERS,
  PASSWORD_ERROR,
  PASSWORD_UPDATED,
  CODE_VERIFIED,
  VERIFCATION_ERROR,
  PASSWORD_CONFIRMATION
} from "../actions/types";

const initialState = {
  token: localStorage.getItem("token"),
  profile: null,
  users: null,
  loading: false,
  error: {},
  saved: false,
  user: null,
  resetToken: null,
  passwordUpdated: false,
  codeverified:false
};

export default function (state = initialState, action) {
  const { type, payload } = action;

  switch (type) {
    case USER_LOADING:
      return {
        ...state,
        loading: true,
        saved: false,
        passwordUpdated: false

      };
    case GET_USERS:
      return {
        ...state,
        users: payload,
        loading: false,
        saved: false,

      };
    case GET_USER:
      return {
        ...state,
        profile: payload,
        loading: false,
        saved: false,
        passwordUpdated: false

      };

    case USER_SAVED:
      return {
        ...state,
        user: payload,
        saved: true,
        loading: false,

      }

    case USERS_ERROR:
      return {
        ...state,
        error: payload,
        loading: false,
        saved: false,
        codeverified:false,
        passwordUpdated: false,
        passwordConfirmed:false
      };


    case USER_UPDATED:
      return {
        ...state,
        // users: payload,
        loading: false,
        // passwordUpdated: true,
        saved: true
      };
    case USER_DELETED:
      return {
        ...state,
        loading: false,
      };
    case PASSWORD_ERROR:
      return {
        ...state,
        error: payload,
        loading: false,
        passwordUpdated: false
      };
    case PASSWORD_UPDATED:
      return {
        ...state,
        // users: payload,
        loading: false,
        passwordUpdated: true,
      };
     case CODE_VERIFIED:
      return{
        ...state,
        loading: false,
        codeverified:true
      };
      case VERIFCATION_ERROR:
        return{
          ...state,
          loading: false,
          codeverified:false
        }
      case PASSWORD_CONFIRMATION:
        return {
          ...state,
          loading:false,
          passwordConfirmed:true
        }
    default:
      return state;
  }
}