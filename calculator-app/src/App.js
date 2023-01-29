import React from 'react';
import Examples from './pages/Examples';
import { applyMiddleware, createStore } from 'redux';
import thunkMiddleware from 'redux-thunk';
import { Provider } from 'react-redux';
import examplesReducer from './pages/Examples/reducers/examples.js';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';

const store = createStore(
  examplesReducer,
  applyMiddleware(thunkMiddleware)
);
const erDivisionByZero = 'Error! Division by 0';

class Key extends React.Component {
  render() {
    return (
      <Button 
        variant="outlined" size="large"
        onClick={() => this.props.onClick()}
      >
        {this.props.value}
      </Button>
    );
  }
}

class Keyboard extends React.Component {
  renderKey(key) {
    return (
      <Key 
        value={key}
        onClick={() => this.props.onClick(key)}
      />
    );
  }

  render() {
    return (
      <div>
        <div>
          {this.renderKey(7)}
          {this.renderKey(8)}
          {this.renderKey(9)}
        </div>
        <div>
          {this.renderKey(4)}
          {this.renderKey(5)}
          {this.renderKey(6)}
        </div>
        <div>
          {this.renderKey(1)}
          {this.renderKey(2)}
          {this.renderKey(3)}
        </div>
        <div>
          {this.renderKey(0)}
          {this.renderKey(' + ')}
          {this.renderKey(' - ')}
        </div>
        <div>
          {this.renderKey(' * ')}
          {this.renderKey(' / ')}
          {this.renderKey(' = ')}
        </div>
      </div>  
    )    
  }
}

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      expression: '0',
      stageNumber: 0, // 1 - 1st number, 2 - sign, 3 - 2nd number
      history: []
    };
    store.subscribe(() => {
      const storeState = store.getState();
      const examplesList = store.getState().examplesList;
      if (!storeState.isLoading && !storeState.isError && examplesList.length > 0) {
        let history = this.state.history.slice();
        for (let i = 0; i < examplesList.length; i++) {
          let ex = examplesList[i];
          let result = resolveExpression(ex);
          history = history.concat(ex + " = " + result);
          this.setState({
            history: history
          });
        }
      }
    });
  }

  handleClick(key) {
    const signKeys = new Set([' / ', ' * ', ' - ', ' + ', ' = ']);
    let newExpression = this.state.expression;
    let newStageNumber = this.state.stageNumber;
    let history = this.state.history.slice();
    // eslint-disable-next-line
    switch (this.state.stageNumber) {
      case 0:
        if (!signKeys.has(key)) {
          newExpression = '' + key;
          newStageNumber = 1; 
        } else {
          if (newExpression === '0') {
            newExpression = '0'.concat(key);
            newStageNumber = 2;
          }
        }
        break;
      case 1:
        if (key === ' = ') {
            return;
        }
        if (signKeys.has(key)) {
          newStageNumber = 2;
          newExpression = newExpression.concat(key); 
        } else {
          newExpression = newExpression === '0' ? key.toString() : newExpression.concat(key);
        }
        break;
      case 2:
        if (key === ' = ') {
            return;
        }
        if (signKeys.has(key)) {
          newExpression = newExpression.slice(0, newExpression.length - 3); 
        } else {
          newStageNumber = 3;   
        }
        newExpression = newExpression.concat(key);
        break;
      case 3:
        if (signKeys.has(key)) {
          let result = resolveExpression(newExpression);
          history = history.concat(newExpression + " = " + result); 
          if (result === erDivisionByZero) {
            newExpression = erDivisionByZero;
            newStageNumber = 0;
          } else {
            newExpression = key === ' = ' ? result.toString() : result.toString().concat(key);
            newStageNumber = key === ' = ' ? 1 : 2;
          }          
        } else {
          let arr = newExpression.split(' ');
          let number2 = arr[2];
          if (number2 === '0') {
            newExpression = newExpression.slice(0, newExpression.length - 1).concat(key);
          } else {
            newExpression = newExpression.concat(key);    
          }          
        }    
    }   
    
    this.setState({
      expression: newExpression,
      stageNumber: newStageNumber,
      history: history  
    });
  }

  render() {
    let display = this.state.expression;
    let history = this.state.history.slice();
    
    return (
      <div>
        <List>
          {history.map((line) => (
            <ListItem>
              <ListItemText primary={`${line}`} />
            </ListItem>
          ))}          
        </List>
        <Typography sx={{ mt: 2, mb: 1 }} variant="h4" component="div">
          {display}
        </Typography>
        <Keyboard
          onClick={key => this.handleClick(key)}
        />
        <Provider store={store}>
          <Examples />  
        </Provider>        
      </div>      
    );
  }
}

function resolveExpression(expression) {
  let arr = expression.split(' ');
  // eslint-disable-next-line
  switch (arr[1]) {
    case '+':
      return +arr[0] + +arr[2];
    case '-':
      return +arr[0] - +arr[2];
    case '*':
      return +arr[0] * +arr[2];
    case '/':
      if (arr[2] === '0') {
        return erDivisionByZero;
      } else {
        return +arr[0] / +arr[2];
      }
  }
}

export default App;