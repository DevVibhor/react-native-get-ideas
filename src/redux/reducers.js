import {SET_EVENT, UPDATE_EVENT, SET_CALENDAR_PERMISSION} from './actions';

const initialState = {
  savedEvents: [],
  calendarPermission: '',
};

function userReducer(state = initialState, actions) {
  switch (actions.type) {
    case SET_EVENT:
      return {...state, savedEvents: [...state.savedEvents, actions?.payload]};
    case SET_CALENDAR_PERMISSION:
      return {...state, calendarPermission: actions?.payload};
    case UPDATE_EVENT:
      return {
        ...state,
        savedEvents: state.savedEvents.filter(
          val => actions.payload !== val.eventID,
        ),
      };
    default:
      return state;
  }
}

export default userReducer;
