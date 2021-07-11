// implement a button to toggle between showing the increasing data and showing per day data (disable sampled data in the former)
//   -> implemented the feature, need to implement the button/switch

// implement a function to draw a box with given content (strings) to show it attached to the current user point
//   -> done!

// save delta values in parseJSON(...)
//   -> done!

// add dark mode, make use of DOM `onclick` method

// perform spline interpolation of the data
//   -> done!

// create sections of screen size so that the graphs are neither under-scaled nor over-scaled

// use colors specific to the data category?
//   -> done!

// add a retry option when data couldn't be fetched (reset dataError to false)
//   -> done!

// prevent the interpolated values from getting negative
//   -> done!

// use origin at the bottom-left intersection?
//   -> forget about it!

// drawing frames only when there is need
//   -> done!

// perform data segmentation, sampling - cannot show all the data if it can't be seen
//   -> done!

// save sampled data, process only once
//   -> done!

// remove mobile anti-scroll option (buggy)
//   -> done!

// fetch data one for all graphs
//   -> done!

// why is all the data double in value??
//   -> added a quick fix for now (... / 2)

var casesConfiguration = {
  color: '#FF0000FF',
  title: 'Confirmed Cases',
  message: 'confirmed cases: ',
  key: 'confirmed'
};

var recoveryConfiguration = {
  color: '#0000FFFF',
  title: 'People Recovered',
  message: 'people recovered: ',
  key: 'recovered'
};

var vaccination1Configuration = {
  color: '#00FF00FF',
  title: 'First vaccination dose',
  message: 'first dose taken: ',
  key: 'vaccinated1'
};

var vaccination2Configuration = {
  color: '#00FF00FF',
  title: 'Second vaccination dose',
  message: 'second dose taken: ',
  key: 'vaccinated2'
};


var deathsConfiguration = {
  color: '#000000FF',
  title: 'People Died',
  message: 'people died: ',
  key: 'deceased'
};

var graph1 = new Graph(casesConfiguration, 'p5Graph-confirmed'),
  graph2 = new Graph(vaccination1Configuration, 'p5Graph-vaccinated1'),
  graph3 = new Graph(vaccination2Configuration, 'p5Graph-vaccinated2'),
  graph4 = new Graph(recoveryConfiguration, 'p5Graph-recovered'),
  graph5 = new Graph(deathsConfiguration, 'p5Graph-died');
