import axios from "axios";
import {

  USER_LOADING,
 USER_SAVED,
  USER_ERROR,
  GET_USERS,
  GET_USER,
  USERS_ERROR,
  USERS_LOADING,
  USER_DELETED,
  USER_UPDATED,
  PASSWORD_ERROR,
  PASSWORD_UPDATED,
  CODE_VERIFIED,
  VERIFCATION_ERROR,
  PASSWORD_CONFIRMATION

} from "./types";
import { setAlert } from "./alert";

// Add new user
export const addNewUser = (user) => async (dispatch) => {
    dispatch({ type: USER_LOADING });
  
   const config = {
      headers: {
          'content-type': 'multipart/form-data'
      }
  }
  

  try {
      

      const res = await axios.post("/api/users/add",user, config);
      dispatch({
        type: USER_SAVED,
        payload:res.data
      });
     
      dispatch(setAlert(res.data.msg, "success"));

    } catch (err) {
      const errors = err.response.data.errors;
      if (errors) {
        errors.forEach((error) => dispatch(setAlert(error.msg, "danger")));
      }
      dispatch({
        type: USER_ERROR,
      });
    }
  };

// get All Users
export const getAllUsers = () => async (dispatch) => {
  dispatch({ type: USER_LOADING });
  try {
    const res = await axios.get(`/api/users`);
    if(res.data) {
      dispatch({
        type: GET_USERS,
        payload: res.data,
      });
    }
  } catch (err) {
    dispatch({
      type: USERS_ERROR,
      payload: err.response,
    });
  }
};

  // Find user
  export const findUsers = (searchVal) => async (dispatch) => {
    dispatch({ type: USER_LOADING });
    try {
      const res = await axios.get(`/api/users/search/${searchVal}`);
  
      dispatch({
        type: GET_USERS,
        payload: res.data,
      });
    } catch (err) {
      dispatch({
        type: USERS_ERROR,
        payload: err.response,
      });
    }
  };

// Get User by ID
export const getUser = (id) => async (dispatch) => {
  dispatch({ type: USERS_LOADING });

  try {
    const res = await axios.get(`/api/users/${id}`);
    dispatch({
      type: GET_USER,
      payload: res.data,
    });
  } catch (err) {
    dispatch({
      type: USERS_ERROR,
      payload: err.response,
    });
  }
};

// Update User
export const updateUser = (user, id) => async (dispatch) => {
  dispatch({ type: USERS_LOADING });
  const config = {
    headers: {
        'content-type': 'multipart/form-data'
    }
}
  
  try {
    const res = await axios.post(`/api/users/${id}`, user, config);

    dispatch({
      type: USER_UPDATED,
      payload: res.data,
    });
    dispatch(setAlert(res.data.msg, "success"));
    dispatch(getAllUsers());

  } catch (err) {
    const errors = err.response.data.errors;
    if (errors) {
      errors.forEach((error) => dispatch(setAlert(error.msg, "danger")));
    }
    dispatch({
      type: USERS_ERROR,
    });
  }
};


// Update Password
export const updatePassword = (user, id) => async (dispatch) => {
  dispatch({ type: USER_LOADING })
  const config = {
    headers: {
      "Content-Type": "application/json",
    },
  };

  const body = JSON.stringify(user);
  
  try {
    const res = await axios.post(`/api/users/updatepassword/${id}`, body, config);
    dispatch({
      type: PASSWORD_UPDATED,
      payload: res.data,
    });
    dispatch(setAlert(res.data.msg, "success"));
  } catch (err) {
    const errors = err.response.data.errors;
    if (errors) {
      errors.forEach((error) => dispatch(setAlert(error.msg, "danger")));
    }
    dispatch({
      type:  PASSWORD_ERROR,
    });
  }
};

export const blockUser = (id) => async (dispatch) => {
  dispatch({ type: USERS_LOADING });
  const config = {
    headers: {
      "Content-Type": "application/json",
    }
}
  
  try {
    const res = await axios.post(`/api/users/changestatus/${id}`,  config);

    dispatch({
      type: USER_UPDATED,
      payload: res.data,
    });
    dispatch(setAlert(res.data.msg, "success"));
    dispatch(getAllUsers());

  } catch (err) {
    const errors = err.response.data.errors;
    if (errors) {
      errors.forEach((error) => dispatch(setAlert(error.msg, "danger")));
    }
    dispatch({
      type: USERS_ERROR,
    });
  }
};

  // Delete User
export const deleteUser = (id) => async (dispatch) => {
  dispatch({ type: USERS_LOADING });

   try {

    const res = await axios.delete(`/api/users/${id}`);
    dispatch({
      type: USER_DELETED,
      payload: res.data,
    });
    dispatch(setAlert(res.data.msg, "success"));
    dispatch(getAllUsers());

  } catch (err) {
    const errors = err.response.data.errors;
    if (errors) {
      errors.forEach((error) => dispatch(setAlert(error.msg, "danger")));
    }
    dispatch({
      type: USERS_ERROR,
    });
  }
};


// Load user
export const codeVerify = (code) => async (dispatch) => {
  dispatch({
    type: USER_LOADING,
  })
  
   try {
    const res = await axios.get(`/api/users/verifySalaryCode/${code}`)

    dispatch({
      type: CODE_VERIFIED,
      payload: res.data,
    })
  } catch (err) {
    dispatch({
      type: VERIFCATION_ERROR,
    })
  }
}

export const confirmPassword = (userObj) => async (dispatch) => {
  dispatch({
    type: USER_LOADING,
  })
  const config = {
      headers: {
          'Content-Type': 'application/json'
      }
  }
   try {
     //const body = JSON.stringify(userObj);
    const res = await axios.post(`/api/users/confirmpassword/${userObj.id}`, userObj, config);
    dispatch({
      type: PASSWORD_CONFIRMATION,
      payload: res.data,
    })
  } catch (err) {
    const errors = err.response.data.errors;
    if (errors) {
      errors.forEach((error) => dispatch(setAlert(error.msg, "danger")));
    }
    dispatch({
      type: USERS_ERROR,
    })
  }
}