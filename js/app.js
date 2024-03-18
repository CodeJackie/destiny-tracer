const apiKey = ''
const membershipId = '4611686018429542541'
const characterId = '2305843009269811326'
let activities = []
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
}


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