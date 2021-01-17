import {CHANGE_PAGE} from '../actions/types';

const initialState = {
    active: "dashboard"
}

export default function(state = initialState, action) {
    switch(action.type) {
        case CHANGE_PAGE:
            return {
                ...state,
                active: action.payload
            }
        default: 
            return state
    }
}