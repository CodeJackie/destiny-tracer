const apiKey = ''
const membershipId = '4611686018429542541'
const characterId = '2305843009269811326'
/*let activities = []
let KDAs = []

fetch(`https://stats.bungie.net/Platform/Destiny2/1/Account/${membershipId}/Character/${characterId}/Stats/Activities/`, {
    method: 'GET',
    headers: {
        'X-API-Key': `${apiKey}`,
    },
})
.then((response) => response.json())
.then((response) => {
    activities = response.Response.activities
    console.log('Activities of CodeJackie: ')
    console.log(activities)
    console.log('Latest Game')
    console.log(activities[0].values.killsDeathsAssists.basic.displayValue)

    
    getKDAs(activities)
    
})

async function getKDAs(activities) {
    // First, filter activities by game mode
    const filteredActivities = activities.filter(activity => activity.activityDetails.mode === 73);

    // Next, map over the filtered activities to extract KDA values
    const KDAs = filteredActivities.map(game => parseFloat(game.values.killsDeathsAssists.basic.displayValue));

    console.log(KDAs);

    // Calculate the average KDA
    if (KDAs.length > 0) {
        const sum = KDAs.reduce((accumulator, currentValue) => accumulator + currentValue, 0);
        const average = sum / KDAs.length;
                
        let KDArep = Number(average.toFixed(2))
        const KDAval = document.querySelector('#kda-value'); 
        KDAval.innerHTML = `${KDArep}`
        
        return average

    } else {
        console.log('No values to calculate the average');
    }
} */

// Generic function to fetch data (assuming async operation like an API call)
async function fetchData(url, headers) {
  const response = await fetch(url, { headers });
  const data = await response.json();
  return data;
}

// Generic function to filter activities based on a condition
function filterActivities(activities, condition) {
  return activities.filter(condition);
}

// Generic function to extract stats and convert them to numbers
function mapAndParseStats(activities, statKey) {
  return activities.map(activity => parseFloat(activity.values[statKey].basic.displayValue));
}

// Generic function to calculate average of an array of numbers
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



const apiUrl = `https://stats.bungie.net/Platform/Destiny2/1/Account/${membershipId}/Character/${characterId}/Stats/Activities/`;

const kdaStatKey = 'killsDeathsAssists';
const opponentsDefeatedStatKey = 'opponentsDefeated'; // Ensure this key matches the API's exact key
const efficiencyStatKey = 'efficiency'; // Ensure this key matches the API's exact key

const mode = activity => activity.activityDetails.mode === 73;

(async () => {
    const kdaAverage = await processStat(apiUrl, apiKey, kdaStatKey, mode)
    .then(averageKda => {
      displayStatToDOM('kdaStat', `${averageKda.toFixed(2)}`)
    })
   
    const opponentsAverage = await processStat(apiUrl, apiKey, opponentsDefeatedStatKey, mode)
    .then(averageOpponents => {
      displayStatToDOM('oppStat', `${averageOpponents.toFixed(2)}`)
    })

    const efficiencyAverage = await processStat(apiUrl, apiKey, efficiencyStatKey, mode)
    .then(averageEff => {
      displayStatToDOM('effStat', `${averageEff.toFixed(2)}`)
    })
})();


/*-------------Charts.js---------------*/
google.charts.load("current", {packages:["corechart"]});
      google.charts.setOnLoadCallback(drawChart);
      function drawChart() {
        var data = google.visualization.arrayToDataTable([
          ['Pac Man', 'Percentage'],
          ['', 30],
          ['', 20],
          ['', 50]
        ]);

        var options = {
          backgroundColor: '#101010',
          legend: 'none',
          pieHole: '.7',
          pieSliceBorderColor: 'transparent',
          pieSliceText: 'none',
          pieStartAngle: 270,
          tooltip: { trigger: 'none' },
          slices: {
            0: { color: 'yellow' },
            1: { color: '#ddd' },
            2: { color: 'transparent'}
          }
        };

        var chart = new google.visualization.PieChart(document.getElementById('pacman'));
        chart.draw(data, options);
      }