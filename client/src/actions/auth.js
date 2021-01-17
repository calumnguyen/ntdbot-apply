// @access  Private
import axios from 'axios'
import {
  USER_LOADED,
  AUTH_ERROR,
  LOGIN_SUCCESS,
  LOGIN_FAIL,
  LOGOUT,
  AUTH_LOADING,
} from './types'
import { setAlert } from './alert'
import setAuthToken from '../utils/setAuthToken'

// Load user
export const loadUser = () => async (dispatch) => {
  dispatch({
    type: AUTH_LOADING,
  })
  if (localStorage.token) {
    setAuthToken(localStorage.token)
  }

  try {
    const res = await axios.get('/api/auth')
    dispatch({
      type: USER_LOADED,
      payload: res.data,
    })
  } catch (err) {
    dispatch({
      type: AUTH_ERROR,
    })
  }
}

// Login
export const login = (username, password) => async (dispatch) => {
  dispatch({
    type: AUTH_LOADING,
  })
  const config = {
    headers: {
      'Content-Type': 'application/json',
    },
  }

  const body = JSON.stringify({
    username,
    password,
  })

  try {
    const res = await axios.post('/api/auth', body, config)
    dispatch({
      type: LOGIN_SUCCESS,
      payload: res.data,
    })
    //dispatch(loadUser())
  } catch (err) {
    if (err.response) {
      const errors = err.response.data.errors
      if (errors) {
        errors.forEach((error) => dispatch(setAlert(error.msg, 'danger')))
      }
    }
    dispatch({
      type: LOGIN_FAIL,
      payload:err.response.data
    })
  }
}

// Logout / clear profile
export const logout = () => (dispatch) => {
  dispatch({ type: LOGOUT })
}
