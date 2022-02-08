var casesConfiguration = {
  color  : '#FF0000FF',
  title  : 'Confirmed Cases',
  message: 'confirmed cases: ',
  key    : 'confirmed'
};

var recoveryConfiguration = {
  color  : '#0000FFFF',
  title  : 'People Recovered',
  message: 'people recovered: ',
  key    : 'recovered'
};

var vaccination1Configuration = {
  color  : '#00FF00FF',
  title  : 'First vaccination dose',
  message: 'first dose taken: ',
  key    : 'vaccinated1'
};

var vaccination2Configuration = {
  color  : '#00FF00FF',
  title  : 'Second vaccination dose',
  message: 'second dose taken: ',
  key    : 'vaccinated2'
};

var deathsConfiguration = {
  color  : '#000000FF',
  title  : 'People Died',
  message: 'people died: ',
  key    : 'deceased'
};

var graphs = {
  'confirmed'   : new Graph(casesConfiguration       , 'p5Graph-confirmed'),
  'vaccinated1' : new Graph(vaccination1Configuration, 'p5Graph-vaccinated1'),
  'vaccinatedd2': new Graph(vaccination2Configuration, 'p5Graph-vaccinated2'),
  'recovered'   : new Graph(recoveryConfiguration    , 'p5Graph-recovered'),
  'deceased'    : new Graph(deathsConfiguration      , 'p5Graph-died')
};

// remove the dummy text elements put in place of the graphs, as a placeholder
(() => {
  let dummyTextElements = document.getElementsByClassName('dummy-text');

  while (dummyTextElements.length) {
    dummyTextElements[0].remove();
  }
})();
