const apiKey = ''
const membershipId = '4611686018429542541'
const characterId = '2305843009269811326'

// fetch data 
async function fetchData(url, headers) {
  const response = await fetch(url, { headers });
  const data = await response.json();
  console.log(data)
  return data;
}

// filter activities based on a condition
function filterActivities(activities, condition) {
  return activities.filter(condition);
}

// extract stats and convert them to numbers
function mapAndParseStats(activities, statKey) {
  return activities.map(activity => parseFloat(activity.values[statKey].basic.displayValue));
}

// calculate average of an array of numbers
function calculateAverage(numbers) {
  if (numbers.length === 0) return 0;
  const sum = numbers.reduce((acc, cur) => acc + cur, 0);
  return sum / numbers.length;
}

function displayStatToDOM(selector, finalStat) {
  let val = document.querySelector(`#${selector}`)
  val.innerHTML = `${finalStat}`
}

async function processStat(apiUrl, apiKey, statKey, condition) {
  // Fetch activities data
  const data = await fetchData(apiUrl, { 'X-API-Key': apiKey });
  const activities = data.Response.activities;

  // Filter activities based on a given condition (if applicable)
  const filteredActivities = condition ? filterActivities(activities, condition) : activities;

  // Map and parse the specific stat from activities
  const stats = mapAndParseStats(filteredActivities, statKey);

  // Calculate and return the average of the stat
  return calculateAverage(stats);
}

async function fetchGameData() {
  const response = await fetch(apiUrl, {
    headers: { 'X-API-Key': apiKey }
  });
  const data = await response.json();
  
  if (data.Response && Array.isArray(data.Response.activities)) {
    // Assuming 'mode' is the property you're interested in, and 'targetMode' is the mode you want to filter by
    const targetMode = 73; // Example mode value; adjust as necessary

    const filteredAndMappedData = data.Response.activities
      .filter(activity => activity.activityDetails && activity.activityDetails.mode === targetMode) // Filter by mode
      .map((game, index) => ({
        gameInstance: `Game ${index + 1}`, // Use any other identifier as needed
        opponentsDefeated: game.values.opponentsDefeated.basic.value // Adjust according to actual structure
      }));

    return filteredAndMappedData;
  } else {
    console.error("Unexpected data structure:", data);
    return []; // Return an empty array to handle gracefully
  }
}




const apiUrl = `https://stats.bungie.net/Platform/Destiny2/1/Account/${membershipId}/Character/${characterId}/Stats/Activities/`;

const kdaStatKey = 'killsDeathsAssists';
const opponentsDefeatedStatKey = 'opponentsDefeated'; // Ensure this key matches the API's exact key
const efficiencyStatKey = 'efficiency'; 
const scoreStatKey = 'score'
let kdaData = {
  kdaStat: 'null',
  kdaDif: 'null'
}
let effData = {
  effStat: 'null',
  effDif: 'null'
}
let scoreData = {
  scoreStat: 'null',
  scoreDif: 'null'
}

const mode = activity => activity.activityDetails.mode === 73;

(async () => {
    const kdaAverage = await processStat(apiUrl, apiKey, kdaStatKey, mode)
    .then(averageKda => {
      displayStatToDOM('kdaStat', `${averageKda.toFixed(2)}`)
      kdaData.kdaStat = averageKda / 0.04
      kdaData.kdaDif = 50 - kdaData.kdaStat
      //((averageKda / 2) / 2) * 100 = averageKda / 0.04
      //Dividing averageKda by 2 gives us a percentage of the maximum KDA. Because only half of the pie chart is used, we divide that percentage in two, and then multiply by 100 to get the graphable percentage. A faster way to achieve this is to simply divide averageKda by 0.04.
      
      drawHalfpipe (kdaData.kdaStat, kdaData.kdaDif, 'greenyellow', 'pacman')
    })
    
    const scoreAverage = await processStat(apiUrl, apiKey, scoreStatKey, mode)
    .then(averageScore => {
      displayStatToDOM('scoreStat', `${averageScore.toFixed(2)}`)
      scoreData.scoreStat = ((averageScore / 50) / 2) * 100
      scoreData.scoreDif = 50 - scoreData.scoreStat
      console.log(averageScore)
     
      
      drawHalfpipe (scoreData.scoreStat, scoreData.scoreDif, 'red', 'score')
    })

    const opponentsAverage = await processStat(apiUrl, apiKey, opponentsDefeatedStatKey, mode)
    .then(averageOpponents => {
      displayStatToDOM('oppStat', `${averageOpponents.toFixed(2)}`)
    })
    fetchGameData().then(gameData => {
      drawOpponentsDefeatedChart(gameData);
  });
    

    const efficiencyAverage = await processStat(apiUrl, apiKey, efficiencyStatKey, mode)
    .then(averageEff => {
      displayStatToDOM('effStat', `${averageEff.toFixed(2)}`)
      effData.effStat = averageEff / 0.04
      effData.effDif = 50 - effData.effStat

      drawHalfpipe (effData.effStat, effData.effDif, 'purple', 'effGraph')
    })
})();


function drawHalfpipe (stat, difference, color, element) {
      let data = google.visualization.arrayToDataTable([
        ['Stat Name', 'Percentage'],
        ['', stat],
        ['', difference],
        ['', 50]
      ])
      let options = {
        backgroundColor: '#101010',
        legend: 'none',
        pieHole: '.7',
        pieSliceBorderColor: 'transparent',
        pieSliceText: 'none',
        pieStartAngle: 270,
        tooltip: { trigger: 'none' },
        slices: {
          0: { color: color },
          1: { color: '#ddd' },
          2: { color: 'transparent'}
      }
      
    }
      const chart = new google.visualization.PieChart(document.getElementById(element))
      chart.draw(data, options);
}

function drawOpponentsDefeatedChart(gameData) {
  // Create the data table and add the header row
  var data = new google.visualization.DataTable();
  data.addColumn('string', 'Game Instance'); // X-axis: Game instance
  data.addColumn('number', 'Opponents Defeated'); // Y-axis: Number of opponents defeated

  // Dynamically add rows from gameData
  gameData.forEach(game => {
      data.addRow([game.gameInstance, game.opponentsDefeated]);
  });

  // Set chart options
  var options = {
      title: 'Opponents Defeated per Game',
      curveType: 'function',
      legend: 'none',
      backgroundColor: '#101010',
      labelColor: '#eee',
      hAxis: {
        textStyle: { color: '#fff' } 
    }

  };

  // Draw the chart
  var chart = new google.visualization.LineChart(document.getElementById('opps'));
  chart.draw(data, options);
}


google.charts.load("current", {packages:["corechart"]});

  