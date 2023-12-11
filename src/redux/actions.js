export const SET_EVENT = 'SET_EVENT';
export const UPDATE_EVENT = 'UPDATE_EVENT';
export const SET_CALENDAR_PERMISSION = 'SET_CALENDAR_PERMISSION';

export const saveEvent = response => dispatch => {
  dispatch({
    type: SET_EVENT,
    payload: response,
  });
};

export const setCalendarPermission = response => dispatch => {
  dispatch({
    type: SET_CALENDAR_PERMISSION,
    payload: response,
  });
};

export const updateEvent = response => dispatch => {
  dispatch({
    type: UPDATE_EVENT,
    payload: response,
  });
};
