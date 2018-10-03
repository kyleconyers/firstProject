var state;
var year;

var stateCarbonEmissionsByYear = [];
var yearRange = ["2007", "2008", "2009", "2010", "2011", "2012", "2013", "2014"];
var yearNums = [1, 2, 3, 4, 5, 6, 7];
var popByYear = {};
var responseData = {};

// USAGE:
// abbrState('ny', 'name');
// --> 'New York'
// abbrState('New York', 'abbr');
// --> 'NY'

function abbrState(input, to) {

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

    if (to == 'abbr') {
        input = input.replace(/\w\S*/g, function (txt) { return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase(); });
        for (i = 0; i < states.length; i++) {
            if (states[i][0] == input) {
                return (states[i][1]);
            }
        }
    } else if (to == 'name') {
        input = input.toUpperCase();
        for (i = 0; i < states.length; i++) {
            if (states[i][1] == input) {
                return (states[i][0]);
            }
        }
    }
}
// Function to empty any array
function emptyArray(arr) {
    arr.length = 0;
    console.log("Working");
    console.log(stateCarbonEmissionsByYear);
}

// Function that takes the id of a table and empty its children
function emptyTable(tableId) {
    $('#' + tableId + ' > tbody').empty();
}

function emptyBarGraph() {
    debugger;
    $("#bar-graph").selectAll("rect").remove();
}

var nationalCarbonEmissionsByYear = [
    6238.54,
    6041.10,
    5607.00,
    5809.28,
    5671.61,
    5444.05,
    5583.95,
    5634.84,
]; // for 2007 - 2014

var nationalPopulationByYear = []; // for 2007 - 2014

// D3 BAR CHART CONSTRUCTOR
function createBarGraph(data) {

    // vars to set the dimensions
    var svgWidth = 500;
    var svgHeight = 300;
    var maxHeight = Math.max(...data);

    var svg = d3.select('#bar-graph')
        // here we are setting the attributes of the svg we just selected
        .attr("width", svgWidth)
        .attr("height", svgHeight)
        .attr("class", "bar-chart");

    var dataset = data; // this is perhaps a bit redundant, but possibly more useful for more complex datasets
    var barPadding = 5;
    var barWidth = (svgWidth / dataset.length);

    var barChart = svg.selectAll("rect")
        .data(dataset)
        .enter()
        .append("rect")
        // can add .style() with callbak to set conditional formatting for each bar, although it's easier to set them with classes via .attr()
        .attr("y", function (d) {
            return 100 - (d / 1000) * 100 + "%";
        })
        .attr("height", function (d) {
            return (d / 1000) * 100 + "%"; // perhaps set the height to the max datapoint minus 10%. define them as variables above
        })
        .attr("width", barWidth - barPadding)
        .attr("transform", function (d, i) {
            //translate() is what sets the position. it can take x and y parameters
            var translate = [barWidth * i, 0];
            return "translate(" + translate + ")";
        })
        .attr("fill", "navy");
    svg.selectAll("text")
        .data(dataset)
        .enter()
        .append("text")
        .attr("y", (d, i) => (100 - (d / 1000) * 100) - 4 + "%")
        .text((d) => d.toFixed(2))
        .attr("transform", function (d, i) {
            //translate() is what sets the position. it can take x and y parameters
            var translate = [(barWidth * i) + 3, 0];
            return "translate(" + translate + ")";
        })
        .attr("text-align", "center")
};

// CREATE USA MAP WITH CLICKABLE STATES, CONTAINS EVENT HANDLER THAT TRIGGERS API CALLS
var map = new Datamap({ // INITIALIZES THE MAP OF THE USA ON TO THE PAGE
    element: document.getElementById('container'),
    scope: 'usa',
    responsive: true,
    done: function (datamap) {
        datamap.svg.selectAll('.datamaps-subunit').on('click', function (geography) {
            state = geography.id;
            var stateFullName = abbrState(state, 'name');
            emptyArray(stateCarbonEmissionsByYear);
            emptyTable('state-data');
            if ($("#bar-graph").children().length > 0) {
                emptyBarGraph();
            }
            // Updates the state name on click in the table header
            $('#state-name').text(state);

            ///// KH // TABLE DATA VARIABLES
            var carbonEmission;
            var year;

            var tableRow = function (carbon, year) {
                var newRow = $("<tr>");
                var carbonEmissionDom = $("<td>").text(carbon);
                var yearDom = $("<td>").text(year);
                newRow.append(carbonEmissionDom, yearDom);
                $("#state-data > tbody").append(newRow);
            }

            // EIA DOCUMENTATION FOR API QUERY CONSTRUCTION: https://www.eia.gov/opendata/qb.php
            var api_key = "08e47fd145ef2607fce2a1442928469e";
            var stateQueryURL = "https://api.eia.gov/series/?api_key=" + api_key + "&series_id=EMISS.CO2-TOTV-TT-TO-" + state + ".A";

            //// KGC // API QUERY FOR POPULATION STATISTICS
            yearNums.forEach(function (year) {
                var popQueryURL = "https://api.census.gov/data/2017/pep/population?get=POP,GEONAME&for=state" + "&DATE=" + year;
                $.ajax({
                    url: popQueryURL,
                    method: "GET"
                }).then(function (response) {
                    popByYear[2006 + year] = response[1][0];
                    responseData = response;
                    console.log(popQueryURL)
                    console.log(response)
                });
            })

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
                        carbonEmission = value[1];
                        year = results[index][0];
                        tableRow(carbonEmission, year);
                        stateCarbonEmissionsByYear.push(value[1]);
                        return index < 7;
                    });
                    createBarGraph(stateCarbonEmissionsByYear);
                });

        });
    }
});

///// AS // QUERY FUNCTION BASED ON DROP-DOWN SELECTION
$("#submit-button").on("click", function () {
    event.preventDefault();
    state = $("#state").val().trim();

    var queryURL = "https://api.eia.gov/series/?api_key=08e47fd145ef2607fce2a1442928469e&series_id=EMISS.CO2-TOTV-TT-TO-" + state + ".A";
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
            $.each(results, function (index, value) {
                console.log(index + ": " + value);
                var newRow = $("<tr>");
                var carbonEmission = $("<td>").text(value[1]);
                var year = $("<td>").text(results[index][0]);
                newRow.append(carbonEmission, year);
                $("tbody").append(newRow);
            });
        });
})

////// KH // Sets the size of the map responsive to the browser window
$(window).on('resize', function () {
    map.resize();
});


////// KGC // POPULATION API QUERY FUNCTION TESTING
yearNums.forEach(function (year) {
    var popQueryURL = "https://api.census.gov/data/2017/pep/population?get=POP,GEONAME&for=state" + "&DATE=" + year;
    $.ajax({
        url: popQueryURL,
        method: "GET"
    }).then(function (response) {
        popByYear[2006 + year] = response[1][0];
        responseData = response;
        console.log(popQueryURL)
        console.log(response)
    });

})