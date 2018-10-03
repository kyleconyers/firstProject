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
var yearNums = [1, 2, 3, 4, 5, 6, 7];
var popByYear = {};

yearNums.forEach(function (year) {
    var popQueryURL = "https://api.census.gov/data/2017/pep/population?get=POP,GEONAME&for=state" + "&DATE=" + year;
    $.ajax({
        url: popQueryURL,
        method: "GET"
    }).then(function (response) {
        popByYear[2006 + year] = response[1][0];
        console.log(popQueryURL)
        console.log(response)
    });

})