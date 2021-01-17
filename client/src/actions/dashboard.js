import axios from "axios";
import {
    DASHBOARD_LOADING,
    DASHBOARD_LOADED,
    DASHBOARD_ERROR,
} from "./types";
import { setAlert } from "./alert";

// changeShopStatus
export const changeShopStatus = (status) => async (dispatch) => {
    dispatch({ type: DASHBOARD_LOADING });
    
    try {
      const res = await axios.get(`/api/dashboard/changeStatus/${status}`);
  
      dispatch({
        type: DASHBOARD_LOADED,
        payload: res.data,
      });
      dispatch(setAlert(res.data.msg, "success"));
  
    } catch (err) {
      if(err && err.response) {
        const errors = err.response.data.errors;
        if (errors) {
          errors.forEach((error) => dispatch(setAlert(error.msg, "danger")));
        }
      }
      dispatch({
        type: DASHBOARD_ERROR,
      });
      
    }
  };