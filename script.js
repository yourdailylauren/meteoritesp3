const ctx = document.getElementById('myChart');

// Get data from json file
fetch("meteorite_1983_2023.json")
.then(function(response){
  if(response.ok == true){
    return response.json();
  }
})
.then(function(data){
  console.log(data);
  // createChart(data, 'bar');
  aggregateData(data);
});

function aggregateData(rawData){
  var yearArray=rawData.map(obs=>obs['year']);
  var countObj={}
  yearArray.forEach(function(oneYear){
    if (countObj[oneYear]){
      countObj[oneYear]++;
    } else {
      countObj[oneYear]=1
    }
  })
  // console.log(countObj);
  countArray=Object.keys(countObj).map(function(year){
    return {'year': year, 'numberOfMeteorites': countObj[year]}
  });
  // console.log(countArray);
  createChart(countArray, 'bar');
}

// Create the chart to display
function createChart(data, type){
new Chart(ctx, {
  type: type,
  data: {
    labels: data.map(row => row.year),
    datasets: [{
      label: 'Number of Meteorites Per Year',
      data: data.map(row => row.numberOfMeteorites),
      borderWidth: 1
    }]
  },
  options: {
    scales: {
      y: {
        beginAtZero: true
      }
    }
  }
}
)};