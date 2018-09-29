var state;
var year;
var states;
var stateCarbonEmissionsByYear = [];

// Function to empty any array
function emptyArray (arr) {
    arr.length = 0;
    console.log("Working");
    console.log(stateCarbonEmissionsByYear);
}

var NationalCarbonEmissionsByYear = [] // for 2007 - 2014
var NationalPopulationByYear = [] // for 2007 - 2014

// D3 BAR CHART CONSTRUCTOR
function createBarGraph(data) {
    var svgWidth = 500;
    var svgHeight = 300;

    var svg = d3.select('#bar-graph')
        .attr("width", svgWidth)
        .attr("height", svgHeight)
        .attr("class", "bar-chart");

    var dataset = data;
    var barPadding = 5;
    var barWidth = (svgWidth / dataset.length);

    var barChart = svg.selectAll("rect")
        .data(dataset)
        .enter()
        .append("rect")
        .attr("y", function (d) {
            return svgHeight - d
        })
        .attr("height", function (d) {
            return d;
        })
        .attr("width", barWidth - barPadding)
        .attr("transform", function (d, i) {
            var translate = [barWidth * i, 0];
            return "translate(" + translate + ")";
        });
};

// CREATE USA MAP WITH CLICKABLE STATES, CONTAINS EVENT HANDLER THAT TRIGGERS API CALLS
var map = new Datamap({ // INITIALIZES THE MAP OF THE USA ON TO THE PAGE
    element: document.getElementById('container'),
    scope: 'usa',
    done: function (datamap) {
        datamap.svg.selectAll('.datamaps-subunit').on('click', function (geography) {
            emptyArray(stateCarbonEmissionsByYear);
            console.log(geography.id);
            state = geography.id;
            // EIA DOCUMENTATION FOR API QUERY CONSTRUCTION: https://www.eia.gov/opendata/qb.php
            var api_key = "08e47fd145ef2607fce2a1442928469e";
            var stateQueryURL = "http://api.eia.gov/series/?api_key=" + api_key + "&series_id=EMISS.CO2-TOTV-TT-TO-" + state + ".A";            
            var nationalQueryURL = "http://api.eia.gov/category/?api_key=" + api_key + "&category_id=2251604";
            //



            // var fipsCodes = getFipsCodes();
            // var stateFips = fipsCodes[state];

            // var yearNums = [1, 2, 3, 4, 5, 6, 7];
            // var popByYear = {};
            // yearNums.forEach(function(year){
            //     var popQueryURL = "https://api.census.gov/data/2017/pep/population?get=POP,GEONAME&for=state:" + stateFips + "&DATE=" + year;
            //     $.ajax({
            //         url: popQueryURL,
            //         method: "GET"
            //     }).then(function(response){
            //         popByYear[2006 + year] = response[1][0];
            //     });

            // })
            // var popQueryURL = "https://api.census.gov/data/2017/pep/population?get=POP,GEONAME&for=state:" + stateFips + "&DATE=" + year;
           
           
            $.ajax({
                url: stateQueryURL,
                method: "GET"
            })
                .then(function (response) {
                    var results = response.series[0].data;
                    console.log(results);
                    $.each(results, function (index, value) {
                        console.log(index + ": " + value);
                        var newRow = $("<tr>");
                        var carbonEmission = $("<td>").text(value[1]);
                        // TODO check to see if the year is a key in popByYear, append it if it exists, otherwise append an empty one
                        var year = $("<td>").text(results[index][0]);
                        newRow.append(carbonEmission, year);
                        $("tbody").append(newRow);
                        stateCarbonEmissionsByYear.push(value[1]);
                        return index < 7;
                    });
                });
                var carbonEmissions = [80, 100, 56, 120, 180, 30, 40, 120, 160];
                createBarGraph(carbonEmissions);

                $.ajax({
                    url: nationalQueryURL,
                    method: "GET"
                })
                    .then(function (response) {
                        
                        console.log(response);
                    })
        });
    }
});

$("#submit-button").on("click", function () {
    event.preventDefault();
    state = $("#state").val().trim();
    // year = $("#year").val().trim();
    var queryURL = "http://api.eia.gov/series/?api_key=08e47fd145ef2607fce2a1442928469e&series_id=EMISS.CO2-TOTV-TT-TO-" + state + ".A";
    var queryURLTwo = "https://api.census.gov/data/2017/pep/population?get=POP,GEONAME&for=state:*&DATE=9"

    $.ajax({
        
        url: queryURL,
        method: "GET"
    })
        .then(function (response) {
            var results = response.series[0].data;
            // console.log(results);
            $.each(results, function (index, value) {
                console.log(index + ": " + value);
                var newRow = $("<tr>");
                var carbonEmission = $("<td>").text(value[1]);
                var year = $("<td>").text(results[index][0]);
                newRow.append(carbonEmission, year);
                $("tbody").append(newRow);
            });
        });
        $.ajax({
            url: queryURLTwo,
            method: "GET"
        })
            .then(function (response) {
                // var results = response.series[0].data;
                console.log(response.data);
                $.each(results, function( index, value ) {
                    console.log( index + ": " + value );
                    var newRow = $("<tr>");
                    var carbonEmission = $("<td>").text(value[1]);
                    var year = $("<td>").text(results[index][0]);
                    newRow.append(carbonEmission, year);
                    $("tbody").append(newRow);
                  });
            });    
})

// var url = "http://api.datausa.io/api/?show=geo&sumlevel=state&required=avg_wage";

// d3.json(url, function(json) {

// //   var data = json.data.map(function(data){
// //       console.log(data)
// //     return json.headers.reduce(function(obj, header, i){
// //       obj[header] = data[i];
// //       return obj;
// //     }, {});
// //   });

// });
function display(data) {
    var newRow = $("<tr>");
    var newTrainName = $("<td>").text(data.val().firebaseTrain);
    var newdestination = $("<td>").text(data.val().firebasedestination);
    var newFrequency = $("<td>").text(data.val().firebaseFrequency);
    var newFirstTrainTime = $("<td>").text(data.val().firebaseFirstTrainTime);
    var deleteButton = $("<button>").text("Delete");
    deleteButton.addClass("my-2 delete-button");
    newRow.append(newTrainName, newdestination, newFrequency, newFrequency, newFrequency, deleteButton);
    deleteButton.attr("data-key", newKey);
    newRow.attr("id", newKey);
    $("tbody").append(newRow);
}
