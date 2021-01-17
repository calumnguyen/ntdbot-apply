import {
    DASHBOARD_LOADING,
    DASHBOARD_LOADED,
    DASHBOARD_ERROR,
    SHOP_LOADING,
    SHOP_LOADED,
    SHOP_ERROR,
  } from "../actions/types";
  
  const initialState = {
    shop: {},
    loading: false,
    error: {},
  };
  
  export default function (state = initialState, action) {
    const { type, payload } = action;
  
    switch (type) {
        case SHOP_LOADING:
        case DASHBOARD_LOADING:
        return {
          ...state,
          loading: true,

        };
        case SHOP_LOADED:
        case DASHBOARD_LOADED:
        return {
            ...state,
            loading: false,
            shop: payload
        };
        case DASHBOARD_ERROR:
        return {
            ...state,
            error: payload,
            loading: false,
        };
        case SHOP_ERROR:
        case DASHBOARD_ERROR:
        return {
            ...state,
            error: payload,
            loading: false,
        };

      default:
        return state;
    }
  }