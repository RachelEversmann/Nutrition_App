const express = require('express');
const bodyParser = require('body-parser');
const _ = require('lodash');
const data = require('./data.json');
const app = express();
const PORT = process.env.PORT || 5000;

/* Sorts Data into useful groups */

/* Has just raw foods */
const foods = data.report.foods;
/* List all the nutrients and their qty */
let nutrients = {};

_.forEach(foods, food => {
  let nutrients_ids = [];
  _.forEach(food.nutrients, el => {
    let value = parseFloat(el.value);
    if (value > 0) {
      if (el.value === '--') {
        value = 0.001;
      }
      if (nutrients[el.nutrient_id] === undefined) {
        nutrients[el.nutrient_id] = {
          name: el.nutrient,
          qty: [value],
        };
      } else {
        if (!_.includes(nutrients[el.nutrient_id].qty, value)) {
          nutrients[el.nutrient_id].qty.push(value);
        }
      }
      nutrients[el.nutrient_id].qty.sort((a, b) => {
        return a - b;
      });
      nutrients_ids.push(el.nutrient_id);
    }
  });
});
/***********************************/

app.get('/raw_data', (req, res) => {
  res.send({raw_data: data});
});

app.get('/foods_data', (req, res) => {
  res.send({foods: foods});
});

app.get('/all_nutrients', (req, res) => {
  res.send({nutrients: nutrients});
});

/* params */
/* array with objects shape of */
/* {id: nutrient, qty: [#] } */
app.get('/foods', (req, res) => {
  let results = [];
  const data = _.map(req.query, el => {
    return JSON.parse(el);
  });
  const requirements = _.map(data, nutrient => {
    return _.map(nutrient.qty, val => {
      return {
        nutrient_id: nutrient.nutrient,
        value: val.toString(),
      };
    });
  });
  let perm = [];
  _.forEach(requirements, requirement => {
    let temp = [];
    if (perm.length === 0) {
      temp = _.map(requirement, el => {
        return [el];
      });
    } else {
      _.forEach(perm, group => {
        temp = _.map(requirement, el => {
          return _.concat(group,el);
        });
      });
    }
    perm = temp;
  });
  _.forEach(perm, group => {
    _.forEach(foods, food => {
      let found = true;
      _.forEach(group, el => {
        if (found) {
          found = _.find(food.nutrients, el) !== undefined ? true : false;
        }
      });
      if (found) {
        results.push(food);
      }
    });
  });
  res.send({results: results});
});
/***********************************/
/* Used to deploy to Heroku */
if (process.env.NODE_ENV === 'production') {
  // Serve any static files
  app.use(express.static(path.join(__dirname, 'client/build')));
  // Handle React routing, return all requests to React app
  app.get('*', function(req, res) {
    res.sendFile(path.join(__dirname, 'client/build', 'index.html'));
  });
}

app.listen(PORT, () => console.log(`Listening on port ${PORT}`));
