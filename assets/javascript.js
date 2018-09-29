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

// INITIALIZES THE MAP OF THE USA ON TO THE PAGE
var map = new Datamap({
    element: document.getElementById('container'),
    scope: 'usa',
    done: function (datamap) {
        datamap.svg.selectAll('.datamaps-subunit').on('click', function (geography) {
            console.log(geography.id);
            state = geography.id;
            var queryURL = "http://api.eia.gov/series/?api_key=08e47fd145ef2607fce2a1442928469e&series_id=EMISS.CO2-TOTV-TT-TO-" + state + ".A";
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
})

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
