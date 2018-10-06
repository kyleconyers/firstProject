var state;
var year;
var stateCarbonEmissionsByYear = [];
var yearRange = ["2007", "2008", "2009", "2010", "2011", "2012", "2013", "2014"];
var yearNums = [1, 2, 3, 4, 5, 6, 7, 8];
var statePops = [];
var popByYear = {};
var responseData = {};
var states = {
    'AL': 'Alabama',
    'AK': 'Alaska',
    'AS': 'American Samoa',
    'AZ': 'Arizona',
    'AR': 'Arkansas',
    'CA': 'California',
    'CO': 'Colorado',
    'CT': 'Connecticut',
    'DE': 'Delaware',
    'DC': 'District Of Columbia',
    'FM': 'Federated States Of Micronesia',
    'FL': 'Florida',
    'GA': 'Georgia',
    'GU': 'Guam',
    'HI': 'Hawaii',
    'ID': 'Idaho',
    'IL': 'Illinois',
    'IN': 'Indiana',
    'IA': 'Iowa',
    'KS': 'Kansas',
    'KY': 'Kentucky',
    'LA': 'Louisiana',
    'ME': 'Maine',
    'MH': 'Marshall Islands',
    'MD': 'Maryland',
    'MA': 'Massachusetts',
    'MI': 'Michigan',
    'MN': 'Minnesota',
    'MS': 'Mississippi',
    'MO': 'Missouri',
    'MT': 'Montana',
    'NE': 'Nebraska',
    'NV': 'Nevada',
    'NH': 'New Hampshire',
    'NJ': 'New Jersey',
    'NM': 'New Mexico',
    'NY': 'New York',
    'NC': 'North Carolina',
    'ND': 'North Dakota',
    'MP': 'Northern Mariana Islands',
    'OH': 'Ohio',
    'OK': 'Oklahoma',
    'OR': 'Oregon',
    'PW': 'Palau',
    'PA': 'Pennsylvania',
    'PR': 'Puerto Rico',
    'RI': 'Rhode Island',
    'SC': 'South Carolina',
    'SD': 'South Dakota',
    'TN': 'Tennessee',
    'TX': 'Texas',
    'UT': 'Utah',
    'VT': 'Vermont',
    'VI': 'Virgin Islands',
    'VA': 'Virginia',
    'WA': 'Washington',
    'WV': 'West Virginia',
    'WI': 'Wisconsin',
    'WY': 'Wyoming'
};

// FUNCTION TO SWAP ABBREVIATIONS AND FULL STATE NAMES 
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

    var ab = "WY"
    states[ab]

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

//// AS // Function to empty any array
function emptyArray(arr) {
    arr.length = 0;
}

//// AS // Function that takes the id of a table and empty its children
function emptyTable(tableId) {
    $('#' + tableId + ' > tbody').empty();
}

//// KH // function to reset bar graph
function emptyBarGraph() {
    $("#bar-graph").empty();
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

//// KH //  D3 BAR CHART CONSTRUCTOR
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

    var dataset = data.reverse();
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
        .attr("fill", "navy")
        .attr("class", "bar");

    svg.selectAll("text")
        .data(dataset)
        .enter()
        .append("text")
        .attr("y", (d, i) => (100 - (d / 1000) * 100) - 4 + "%")
        .text((d) => d.toFixed(2))
        .attr("transform", function (d, i) {
            //translate() is what sets the position. it can take x and y parameters
            var translate = [(barWidth * i) + 6, 0];
            return "translate(" + translate + ")";
        })
        .attr("font-family", "monospace")
        .attr("font-size", ".8rem")
        .attr("fill", "red");
};

///// KH // REFACTOR TO MERGE DATA RETURNS INTO ONE FUNCTION THAT IS INVOKED THE SAM FROM THE MAP AND THE DROPDOWN
function dataReturn() {
    var stateFullName = states[state];
    emptyArray(stateCarbonEmissionsByYear);
    emptyArray(statePops)
    emptyTable('state-data');
    if ($("#bar-graph").children().length > 0) {
        emptyBarGraph();
    }

    $('#state-name').text(state);

    ///// KH // TABLE DATA VARIABLES
    var carbonEmission;
    var year;
    Object.values(popByYear).map(function (year) {
        year.map(function (state) {
            if (state[1] === stateFullName) {
                // console.log(state[0])
                statePops.push(state[0])
            }
        })
    })

    var tableRow = function (carbon, year) {
        var newRow = $("<tr>");
        var carbonEmissionDom = $("<td>").text(carbon.toFixed(2));
        var yearPopulation = statePops[year - 2007];
        yearPopulation = $("<td>").text(parseFloat(yearPopulation).toLocaleString('en'));
        var popPerCapita = (carbon * 1000000) / (statePops[year - 2007]);
        popPerCapita = $("<td>").text(popPerCapita.toFixed(2));
        var yearDom = $("<td>").text(year);
        newRow.append(yearDom, yearPopulation, carbonEmissionDom, popPerCapita);
        $("#state-data > tbody").append(newRow);
    }

    // EIA DOCUMENTATION FOR API QUERY CONSTRUCTION: https://www.eia.gov/opendata/qb.php
    var api_key = "08e47fd145ef2607fce2a1442928469e";
    var stateQueryURL = "https://api.eia.gov/series/?api_key=" + api_key + "&series_id=EMISS.CO2-TOTV-TT-TO-" + state + ".A";

    $.ajax({
        url: stateQueryURL,
        method: "GET"
    })
        .then(function (response) {
            var results = response.series[0].data;
            $.each(results, function (index, value) {
                carbonEmission = value[1];
                year = results[index][0];
                tableRow(carbonEmission, year);
                stateCarbonEmissionsByYear.push(value[1]);
                return index < 7;
            });
            createBarGraph(stateCarbonEmissionsByYear);
        });
}

// CREATE USA MAP WITH CLICKABLE STATES, CONTAINS EVENT HANDLER THAT TRIGGERS API CALLS
var map = new Datamap({ // INITIALIZES THE MAP OF THE USA ON TO THE PAGE
    element: document.getElementById('container'),
    scope: 'usa',
    responsive: true,
    done: function (datamap) {
        datamap.svg.selectAll('.datamaps-subunit').on('click', function (geography) {
            state = geography.id;
            // console.log(states[state])
            dataReturn();
        });
    }
});

///// AS // QUERY FUNCTION BASED ON DROP-DOWN SELECTION
$("#submit-button").on("click", function (event) {
    event.preventDefault();
    entered = $("#state").val().trim();
    state = abbrState(entered, 'abbr');
    dataReturn()
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
        popByYear[year] = response;
        responseData = response;
    });
})
