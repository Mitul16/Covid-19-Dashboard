// NOTE: cache headers need to be set so that we don't end up using data from disk-cache (older data)
// many forms of client side storage can be put to use to store current data and fetch only new data like `from-date=...&to-date=...`
// this requires a custom backend server

// but this was a just round1 (basic) for WebD-selection, although I have already been selected

const apiURL = "https://api.covid19india.org/v4/min/timeseries.min.json";
const dataSource = "https://api.covid19india.org";

// testing
//const apiURL = './data/timeseries.json';

var dataFetched, dataCrunched, fetchMessage = "", crunchMessage = "", json, data, metadata, dataError, errorMessage, sampledData, samplingAmount = 8, skipLength, emptyData;

const whatToExtract = [
  'confirmed',
  'recovered',
  'vaccinated1',
  'vaccinated2',
  'deceased'
];

fetchAndProcess();

async function fetchData() {
  dataFetched = false;
  
  fetch(apiURL)
    .then(response => response.json())
    .then(result => {
      json = result;
      dataFetched = true;
      
      parseData();
    })
    .catch(err => {
      dataError = true;
      errorMessage = "We couldn't `fetch` this data ( did you `GET` it? )";
      // you `GET` it?
      // .then `POST` it and I will .catch
      // so .finally - you `GET` it or not?
      // Aw snap!! - connection refused!
    });
}

JSON.copy = function(source) {
  return JSON.parse(JSON.stringify(source));
};
  
function parseJSON(json) {
  emptyData = {};
  
  for (let index in whatToExtract) {
    let key = whatToExtract[index];
    
    emptyData[key] = {
      'delta': 0,
      'total': 0
    };
  }

  var temp = {}, d;
  
  for (let state in json) {
    for (let date in json[state].dates) {
      if (!temp[date]) {
        temp[date] = JSON.copy(emptyData);
      }
      
      // use delta7 vice delta for 7-day averaged data
      if (json[state].dates[date].delta) {
        for (let index in whatToExtract) {
          let key = whatToExtract[index];
          
          if (json[state].dates[date].delta[key]) {
            temp[date][key].delta += Math.round(json[state].dates[date].delta[key] / 2);  // don't know why I am getting double data
          }
        }
      }
      
      if (json[state].dates[date].total) {
        for (let index in whatToExtract) {
          let key = whatToExtract[index];
          
          if (json[state].dates[date].total[key]) {
            temp[date][key].total += Math.round(json[state].dates[date].total[key] / 2);  // don't know why I am getting double data
          }
        }
      }
    }
  }
  
  var data = [], dtStat = JSON.copy(emptyData);
  
  for (let date in temp) {
    for (let index in whatToExtract) {
      let key = whatToExtract[index];
      
      dtStat[key].delta = Math.max(dtStat[key].delta, temp[date][key].delta);
      dtStat[key].total += temp[date][key].delta;
    }
    
    const pieces = date.split('-');
    temp[date].date = `${pieces[2]}/${pieces[1]}/${pieces[0]}`;
    
    data.push(temp[date]);
  }
  
  d = {};
  
  for (let index in whatToExtract) {
    let key = whatToExtract[index];
    
    d[key] = {};
    d[key].deltaMax = dtStat[key].delta;
    d[key].total = dtStat[key].total;
  }
  
  // this can be efficiently while processing the JSON data but the benefits are not worth the take
  // sort the data in ascending order of dates
  data.sort((a, b) => {
    const A = a.date.split('/'), B = b.date.split('/');
    return parseInt(A[2] + A[1] + A[0]) - parseInt(B[2] + B[1] + B[0]);
  });
  
  return [
    d,
    data
  ];
}

async function parseData() {
  dataCrunched = false;
  createCrunchMessages();
  
  if (json) {
    [metadata, data] = parseJSON(json);
  }
  else {
    // how dare you API, you just returned nothing
    // hmm? I am coming for you...ouch!! nevermind.
  }
  
  if (data.length == 0) {
    // we couldn't parse the JSON
    dataError = true;
    errorMessage = "No data received!";
  }
  else {
    // plot all the data using least skipLength (= 1)
    skipLength = 1;
    
    // assert samplingAmount <= data.length
    sampledData = [];
    
    var sample = JSON.copy(emptyData);
    
    // this is a mess because of floating point errors
    // 0 becomes -0.00000000000000000000228139723872
    // it becomes -1 when floored and gives TypeError (int -> X <- float)
    for (let i = 0; i < data.length; i++) {
      for (let index in whatToExtract) {
        let key = whatToExtract[index];
        
        if (data[parseInt(Math.max(0, i - samplingAmount / 2))]) {
          sample[key].delta -= data[parseInt(Math.max(0, i - samplingAmount / 2))][key].delta;
          sample[key].total -= data[parseInt(Math.max(0, i - samplingAmount / 2))][key].total;
        }
        
        if (data[parseInt(Math.min(data.length - 1, i + samplingAmount / 2))]) {
          sample[key].delta += data[parseInt(Math.min(data.length - 1, i + samplingAmount / 2))][key].delta;
          sample[key].total += data[parseInt(Math.min(data.length - 1, i + samplingAmount / 2))][key].total;
        }
      }
      
      var average = JSON.copy(sample);
      
      for (let index in whatToExtract) {
        let key = whatToExtract[index];
        
        average[key].delta = sample[key].delta / samplingAmount;
        average[key].total = sample[key].total / samplingAmount;
      }
      
      sampledData.push(average);
    }
  }
  
  dataCrunched = true;
}

async function createFetchMessages() {
  var list = ["almost there!", "it is taking longer than expected"];
  
  fetchMessage = "";
  
  await sleep(400);  
  fetchMessage = list[0];
  
  await sleep(1600);
  fetchMessage = list[1];
}

async function createCrunchMessages() {
  var pieces = ["yum", "..", "yumm", "..", "yummy!!"];
  
  while (!dataCrunched) {
    let i = 0;
    crunchMessage = "";
    await sleep(200);
    
    while (i < pieces.length) {
      crunchMessage += pieces[i];
      i += 1;
      
      await sleep(200);
    }
  }
}

async function fetchAndProcess() {
  dataError = false;
  
  // fetch data from our API in the background
  // in order to get more SEO points... hahahahahahaha...
  
  // does Google crawl into our scripts?
  // Okay Google! Make me some coffee!
  // Stop updating your apps when I have `auto-update` set to `disabled`
  
  fetchData();
  createFetchMessages();
};

function sleep(ms) {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve(true);
    }, ms);
  });
}
