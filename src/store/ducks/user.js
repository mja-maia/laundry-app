// Action Types
export const Types = {
  SET_USER_DATA: 'user/SET_USER_DATA',
};


// Reducer
const initialState = {
  user: {}
};

const user = (state = initialState, action) => {
  switch (action.type) {
    case Types.SET_USER_DATA:
      return {
        ...state,
        user: action.payload.data
      };
    default:
      return state;
  }
};

export default user;


// Action Creators
export const Creators = {
  setUserData: (data) => ({
    type: Types.SET_USER_DATA,
    payload: { data },
  }),
};
