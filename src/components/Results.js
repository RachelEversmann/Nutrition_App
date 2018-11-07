import React from 'react';
import _ from 'lodash';
import {Button} from 'react-bootstrap';

const Results = props => (
  <div>
    {props.foods.length === 0 ? (
      <div> No Food Matched </div>
    ) : (
      <div>
        {_.map(props.foods, (food, i) => (
          <div className="Food" key={i}>
            <h3 className="Title">
              {food.name}({food.ndbno})
            </h3>
            <span className="Info"> Weight: {food.weight} </span>
            <span className="Info"> Measure: {food.measure} </span>
            <div className="Nutrients">
              <h4 className="Title"> Nutrients </h4>
              {_.map(food.nutrients, (nutrient, i) => (
                <div key={i} className="NutrientResult">
                  <h5 className="Title">
                    <u>
                      {nutrient.nutrient}({nutrient.nutrient_id})
                    </u>
                  </h5>
                  <div>
                    {' '}
                    Value: {nutrient.value}
                    <i>{nutrient.unit}</i>
                  </div>
                  <div> GM: {nutrient.gm} </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    )}
    <Button onClick={props.changeView}>
      {' '}
      <div> {'<-- Back To Search'}</div>{' '}
    </Button>
  </div>
);

export default Results;
