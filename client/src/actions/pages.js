import {CHANGE_PAGE} from './types';

export const changePage = (pageName) => dispatch => {
    dispatch({type: CHANGE_PAGE, payload: pageName});
}