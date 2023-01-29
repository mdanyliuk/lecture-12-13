import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import examplesActions from '../actions/examples';
import Button from '@material-ui/core/Button';

class Examples extends React.Component {
  render() {
    const {
      actionFetchExamples,
      examplesList,
      isLoading,
      isError,
    } = this.props;
    return (
      <div>
        <Button
          variant="outlined"
          onClick={() => actionFetchExamples({
            examplesCount: 5,
          })}
        >
          Get examples from back-end  
        </Button>
        {isLoading && (
          <div>
            Loading...    
          </div>    
        )}
        {isError && (
          <div>
            Error     
          </div>    
        )}
        {!isLoading && !isError && (
          <div style={{
            display: 'flex',
            flexDirection: 'column',
          }}>
            {examplesList.map(example => (
              <div>
                {example}
              </div>  
            ))}
          </div>  
        )}
      </div>      
    );
  }  
}

const mapReduxStateToProps = reduxState => ({
  ...reduxState,  
});

const mapDispatchToProps = (dispatch) => {
  const {
    fetchExamples,
  } = bindActionCreators(examplesActions, dispatch);

  return ({
    actionFetchExamples: fetchExamples,
  });

};

export default connect(mapReduxStateToProps, mapDispatchToProps)(Examples);