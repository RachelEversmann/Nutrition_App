import React, {Component} from 'react';
import _ from 'lodash';
import {
  FormGroup,
  ControlLabel,
  FormControl,
  Button,
  Glyphicon,
} from 'react-bootstrap';
import axios from 'axios';

class SearchForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      fields: [{nutrient: '', qty: []}],
    };
  }
  addField = () => {
    let fields = this.state.fields.slice();
    const obj = {
      nutrient: '',
      qty: [],
    };
    fields.push(obj);
    this.setState({fields});
  };
  handleNutrient = (index, value) => {
    let fields = this.state.fields.slice();
    fields[index].nutrient = value;
    this.setState({fields});
  };
  handleQTY = (index, value) => {
    let fields = this.state.fields.slice();
    fields[index].qty.push(value);
    this.setState({fields});
  };
  handleSubmit = e => {
    e.preventDefault();
    axios
      .get('/foods', {
        params: this.state.fields,
      })
      .then(res => {
        this.props.handleResults(res.data.results);
      })
      .catch(err => console.log(err));
  };
  render() {
    return (
      <form onSubmit={this.handleSubmit}>
        <Button type="submit" className="Search">
          <Glyphicon glyph="search" />
          <span> Seach Foods </span>
        </Button>
        {_.map(this.state.fields, (el, index) => {
          return (
            <FormGroup controlId="formBasicText" key={index}>
              <ControlLabel>Nutrient</ControlLabel>
              <FormControl
                className="Nutrient"
                componentClass="select"
                placeholder="---"
                onChange={e => this.handleNutrient(index, e.target.value)}>
                <option value="select">select</option>
                {_.map(this.props.nutrients, (nutrient, key) => (
                  <option value={key} key={key}>
                    {nutrient.name}
                  </option>
                ))}
              </FormControl>
              {el.nutrient !== '' ? (
                <div>
                  <ControlLabel>QTY (select multiple)</ControlLabel>
                  <FormControl componentClass="select" className="QTY" multiple>
                    {_.map(this.props.nutrients[el.nutrient].qty, (num, i) => (
                      <option
                        value={num}
                        key={i}
                        onClick={() => this.handleQTY(index, num)}>
                        {num}
                      </option>
                    ))}
                  </FormControl>
                </div>
              ) : (
                <div />
              )}
            </FormGroup>
          );
        })}
        <Button type="button" onClick={this.addField}>
          <Glyphicon glyph="plus" />
          <span> Add Nutrient </span>
        </Button>
      </form>
    );
  }
}
export default SearchForm;
