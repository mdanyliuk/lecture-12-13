const initialState = {
  isLoading: false,
  isError: false,
  examplesList: [],
  name: "Examples list",
}

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case 'ERROR_RECEIVE_EXAMPLES': {
      return {
        ...state,
        isLoading: false,
        isError: true,
        examplesList: [],
      };
    }
    case 'REQUEST_EXAMPLES': {
      return {
        ...state,
        isLoading: true,
        isError: false,
        examplesList: [],
      };
    }
    case 'RECEIVE_EXAMPLES': {
      const {
        examples,
      } = action;
      return {
        ...state,
        isLoading: false,
        isError: false,
        examplesList: examples,
      };
    }
    default: return state;
  }
};

export default reducer;