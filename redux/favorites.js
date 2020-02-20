import * as ActionTypes from './ActionTypes';

export const favorites = (state = [], action) => {
  switch (action.type) {
    case ActionTypes.ADD_FAVORITE:
      if (state.includes(action.payload)) {
        return state;
      }

      return state.concat(action.payload);
    default:
      return state;
    case ActionTypes.DELETE_FAVORITE:
      return state.filter(favorite => favorite !== action.payload);
  }
};
