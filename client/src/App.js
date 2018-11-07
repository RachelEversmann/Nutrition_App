import React, {Component} from 'react';
import axios from 'axios';
import {SearchForm, Results} from './components';
import './App.css';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      nutrients: '',
      view: 'search',
      foods: [],
    };
  }
  componentDidMount() {
    axios
      .get('/all_nutrients')
      .then(res => {
        this.setState({nutrients: res.data.nutrients});
      })
      .catch(error => console.log('error in get nutrients'));
  }
  handleResults = data => {
    this.setState({view: 'results', foods: data});
  };
  changeView = () => {
    this.setState({view: 'search'});
  };
  render() {
    return (
      <div className="App">
        {this.state.view === 'search' ? (
          <SearchForm
            nutrients={this.state.nutrients}
            handleResults={this.handleResults}
          />
        ) : (
          <Results changeView={this.changeView} foods={this.state.foods} />
        )}
      </div>
    );
  }
}
export default App;
