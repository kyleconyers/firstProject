var state;
var year;
var states = [
    ['Arizona', 'AZ'],
    ['Alabama', 'AL'],
    ['Alaska', 'AK'],
    ['Arizona', 'AZ'],
    ['Arkansas', 'AR'],
    ['California', 'CA'],
    ['Colorado', 'CO'],
    ['Connecticut', 'CT'],
    ['Delaware', 'DE'],
    ['Florida', 'FL'],
    ['Georgia', 'GA'],
    ['Hawaii', 'HI'],
    ['Idaho', 'ID'],
    ['Illinois', 'IL'],
    ['Indiana', 'IN'],
    ['Iowa', 'IA'],
    ['Kansas', 'KS'],
    ['Kentucky', 'KY'],
    ['Kentucky', 'KY'],
    ['Louisiana', 'LA'],
    ['Maine', 'ME'],
    ['Maryland', 'MD'],
    ['Massachusetts', 'MA'],
    ['Michigan', 'MI'],
    ['Minnesota', 'MN'],
    ['Mississippi', 'MS'],
    ['Missouri', 'MO'],
    ['Montana', 'MT'],
    ['Nebraska', 'NE'],
    ['Nevada', 'NV'],
    ['New Hampshire', 'NH'],
    ['New Jersey', 'NJ'],
    ['New Mexico', 'NM'],
    ['New York', 'NY'],
    ['North Carolina', 'NC'],
    ['North Dakota', 'ND'],
    ['Ohio', 'OH'],
    ['Oklahoma', 'OK'],
    ['Oregon', 'OR'],
    ['Pennsylvania', 'PA'],
    ['Rhode Island', 'RI'],
    ['South Carolina', 'SC'],
    ['South Dakota', 'SD'],
    ['Tennessee', 'TN'],
    ['Texas', 'TX'],
    ['Utah', 'UT'],
    ['Vermont', 'VT'],
    ['Virginia', 'VA'],
    ['Washington', 'WA'],
    ['West Virginia', 'WV'],
    ['Wisconsin', 'WI'],
    ['Wyoming', 'WY'],
];
var stateCarbonEmissionsByYear = [];
var yearRange = ["2007", "2008", "2009", "2010", "2011", "2012", "2013", "2014"];

// Function to empty any array
function emptyArray(arr) {
    arr.length = 0;
    console.log("Working");
    console.log(stateCarbonEmissionsByYear);
}

var nationalCarbonEmissionsByYear = [0, 0, 0, 0, 0, 0, 0, 0]; // for 2007 - 2014
var nationalPopulationByYear = []; // for 2007 - 2014

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
    responsive: true,
    done: function (datamap) {
        datamap.svg.selectAll('.datamaps-subunit').on('click', function (geography) {
            emptyArray(stateCarbonEmissionsByYear);
            nationalCarbonEmissionsByYear = [0, 0, 0, 0, 0, 0, 0, 0];
            console.log(geography.id);
            state = geography.id;
            // EIA DOCUMENTATION FOR API QUERY CONSTRUCTION: https://www.eia.gov/opendata/qb.php
            var api_key = "08e47fd145ef2607fce2a1442928469e";
            var stateQueryURL = "https://api.eia.gov/series/?api_key=" + api_key + "&series_id=EMISS.CO2-TOTV-TT-TO-" + state + ".A";
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
                    console.log(response);
                    var results = response.series[0].data;
                    console.log(response);
                    // LOOP TO MAKE TABLE ROWS AND PUSH TO STATECARBONEMISSIONSBYYEAR
                    $.each(results, function (index, value) {
                        console.log(index + ": " + value);
                        var newRow = $("<tr>");
                        var carbonEmission = $("<td>").text(value[1]);
                        // TODO check to see if the year is a key in popByYear, append it if it exists, otherwise append an empty one
                        var year = $("<td>").text(results[index][0]);
                        newRow.append(carbonEmission, year);
                        $("#state-data > tbody").append(newRow);
                        stateCarbonEmissionsByYear.push(value[1]);
                        return index < 7;
                    });
                });

            /////////////// KH ///////////////// 
            // AJAX CALL FOR NATIONAL NUMBERS
            // LOOP TO TOTAL UP NATIONAL CARBON BY YEAR
            ///// KH // LOOP TO MAKE TABLE ROWS AND PUSH TO NATIONALCARBON EMISSIONABYYEAR
            function getData() {
                return new Promise((resolve, reject) => {
                    states.forEach(function (state) {
                        var stateQueryURL = "https://api.eia.gov/series/?api_key=" + api_key + "&series_id=EMISS.CO2-TOTV-TT-TO-" + state[1] + ".A";
                        $.ajax({
                            url: stateQueryURL,
                            method: "GET"
                        })
                            .then(function (response) {
                                var results = response.series[0].data;
                                var i = 7; // to iterate var yearRange for reference. UGLY HARD-CODING
                                results.forEach(function (item) {
                                    if (item[0] === yearRange[i]) {
                                        nationalCarbonEmissionsByYear[i] += item[1];
                                    }
                                    i--; // THIS IS SOME UGLY HARD-CODING, BUT FOR NOW THIS IS OPERABLE FOR THE LIMITED DATE RANGE WE NEED
                                })
                            })
                    }).done((response) => {
                        resolve(response);
                    }).fail((error) => {
                        resolve(response);
                    });
                });
            }



            function nationalData() {
                nationalCarbonEmissionsByYear.forEach(function (entry) {
                    // debugger;
                    console.log(entry);
                    // var newRow = $("<tr>");
                    // var carbonEmission = $("<td>").text(entry);
                    // var year = $("<td>").text(yearRange[nationalCarbonEmissionsByYear - i]);
                    // newRow.append(carbonEmission, year);
                    // $("#national-data > tbody").append(newRow);  
                })
            }

        printNationalCarbonData();

        // states.forEach(function (state) {
        //     var stateQueryURL = "https://api.eia.gov/series/?api_key=" + api_key + "&series_id=EMISS.CO2-TOTV-TT-TO-" + state[1] + ".A";
        //     $.ajax({
        //         url: stateQueryURL,
        //         method: "GET"
        //     })
        //         .then(function (response) {
        //             var results = response.series[0].data;
        //             var i = 7; // to iterate var yearRange for reference. UGLY HARD-CODING
        //             results.forEach(function (item) {
        //                 if (item[0] === yearRange[i]) {
        //                     nationalCarbonEmissionsByYear[i] += item[1];
        //                 }
        //                 i--; // THIS IS SOME UGLY HARD-CODING, BUT FOR NOW THIS IS OPERABLE FOR THE LIMITED DATE RANGE WE NEED
        //             })
        //         })
        // })

    });
    }
});

////// KH // Sets the size of the map responsive to the browser window
$(window).on('resize', function () {
    map.resize();
});

////// KH // ONLY IN USE WHEN THE DROP-DOWN IS USED. WILL NEED TO BE SET TO MATCH THE SAME EXECUTION AS THE MAP ABOVE
// $("#submit-button").on("click", function () {
//     event.preventDefault();
//     state = $("#state").val().trim();
//     // year = $("#year").val().trim();
//     var queryURL = "https://api.eia.gov/series/?api_key=08e47fd145ef2607fce2a1442928469e&series_id=EMISS.CO2-TOTV-TT-TO-" + state + ".A";
//     var queryURLTwo = "https://api.census.gov/data/2017/pep/population?get=POP,GEONAME&for=state:*&DATE=9"

//     $.ajax({

//         url: queryURL,
//         method: "GET"
//     })
//         .then(function (response) {
//             var results = response.series[0].data;
//             // console.log(results);
//             $.each(results, function (index, value) {
//                 console.log(index + ": " + value);
//                 var newRow = $("<tr>");
//                 var carbonEmission = $("<td>").text(value[1]);
//                 var year = $("<td>").text(results[index][0]);
//                 newRow.append(carbonEmission, year);
//                 $("#state-data > tbody").append(newRow);
//             });
//         });
//     $.ajax({
//         url: queryURLTwo,
//         method: "GET"
//     })
//         .then(function (response) {
//             // var results = response.series[0].data;
//             console.log(response.data);
//             $.each(results, function (index, value) {
//                 console.log(index + ": " + value);
//                 var newRow = $("<tr>");
//                 var carbonEmission = $("<td>").text(value[1]);
//                 var year = $("<td>").text(results[index][0]);
//                 newRow.append(carbonEmission, year);
//                 $("#national-data > tbody").append(newRow);
//             });
//         });
// })

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
