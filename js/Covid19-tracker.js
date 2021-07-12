// implement a button to toggle between showing the increasing data and showing per day data (disable sampled data in the former)
//   -> implemented the feature, need to implement the button/switch
//   -> done! - a little awkward scaling is used because of the font dimension values, may cause issues when the font is not loaded

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

// now, why the heck is the data value lesser than the one before (total)
// moreover, metadata.total and data[last].total doesn't match
//   -> because I have used Math.round(... / 2);
//   -> why am I getting doubled????

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

var graphs = {
  'confirmed': new Graph(casesConfiguration, 'p5Graph-confirmed'),
  'vaccinated1': new Graph(vaccination1Configuration, 'p5Graph-vaccinated1'),
  'vaccinatedd2': new Graph(vaccination2Configuration, 'p5Graph-vaccinated2'),
  'recovered': new Graph(recoveryConfiguration, 'p5Graph-recovered'),
  'deceased': new Graph(deathsConfiguration, 'p5Graph-died')
};

// set the darkMode, remove the dummy text elements put in place of the graphs, as a placeholder
(() => {
  let dummyTextElements = document.getElementsByClassName('dummy-text');

  while (dummyTextElements.length) {
    dummyTextElements[0].remove();
  }
})();

function setDarkMode() {
  if (darkMode) {
    document.getElementsByTagName('body')[0].classList.add('dark-mode');
  }
  else {
    document.getElementsByTagName('body')[0].classList.remove('dark-mode');
  }
}
