const receiveExamples = examples => ({
  examples,
  type: 'RECEIVE_EXAMPLES'
});

const requestExamples = () => ({
  type: 'REQUEST_EXAMPLES'
});

const errorReceiveExamples = () => ({
  type: 'ERROR_RECEIVE_EXAMPLES'
});

const getExamples = (examplesCount) => {
  return fetch('http://localhost:8080/math/examples?count='
    .concat(examplesCount))
    .then(res => res.json());
};

const fetchExamples = ({ examplesCount }) => (dispatch) => {
  dispatch(requestExamples());

  return getExamples(examplesCount)
    .then(examples => dispatch(receiveExamples(examples)))
    .catch(() => dispatch(errorReceiveExamples()));
};

const action = {
  fetchExamples,
};

export default action;