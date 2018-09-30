var state;
var year;
var states;


// D3 CHART VARIABLES

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

// function getFipsCodes(){
//     //TODO return an object with state abbrv as key and fips code as value
// }

// INITIALIZES THE MAP OF THE USA ON TO THE PAGE
var map = new Datamap({
    element: document.getElementById('container'),
    scope: 'usa',
    done: function (datamap) {
        datamap.svg.selectAll('.datamaps-subunit').on('click', function (geography) {
            console.log(geography.id);
            state = geography.id;
            var queryURL = "http://api.eia.gov/series/?api_key=08e47fd145ef2607fce2a1442928469e&series_id=EMISS.CO2-TOTV-TT-TO-" + state + ".A";            
            
           


            //BEGIN POPULATION CODE--Kyle

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


                url: queryURL,
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
                    });
                });
                var carbonEmissions = [80, 100, 56, 120, 180, 30, 40, 120, 160];
                createBarGraph(carbonEmissions);
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
// BEGIN POPULATION CODE--Kyle

            // var fipsCodes = getFipsCodes();
            // var stateFips = fipsCodes[state];
            var yearNums = [1, 2, 3, 4, 5, 6, 7];
            var popByYear = {};
            
            // var popQueryURL = "https://api.census.gov/data/2017/pep/population?get=POP,GEONAME&for=state:" + stateFips + "&DATE=" + year;

            yearNums.forEach(function(year){
                var popQueryURL = "https://api.census.gov/data/2017/pep/population?get=POP,GEONAME&for=state:" + "&DATE=" + year;
                $.ajax({
                  url: popQueryURL,
                  method: "GET"
                 }).then(function(response){
                     popByYear[2006 + year] = response[1][0];
                    console.log(popQueryURL)
                    console.log(response)
                 });
        
                 })

      

// var queryURLTwo = "https://api.census.gov/data/2017/pep/population?get=POP,GEONAME&for=state:*&DATE=9"
// console.log(queryURLTwo.data)


// var yearNums = [1, 2, 3, 4, 5, 6, 7];
// var popByYear = {};

// function testajax(){
// var popQueryURL = "https://api.census.gov/data/2017/pep/population?get=POP,GEONAME&for=state:" + "&DATE=" + year;   
//  $.ajax({
//         url: popQueryURL,
//         method: "GET"
//        }).then(function(response){
//            popByYear[2006 + year] = response[1][0];
//           console.log(response)
//        });

//        }

   