var state;
var year;
var states;
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
