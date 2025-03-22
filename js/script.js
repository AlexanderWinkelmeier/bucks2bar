window.onload = function () {
  // input with id "username" on change
  document.getElementById("username").addEventListener("input", function () {
    var username = document.getElementById("username").value;
    // regex to check if username has at least 1 capital letter, 1 special character, 1 number, and is at least 8 characters long
    var regex = /^(?=.*[A-Z])(?=.*[!@#$&*~])(?=.*[0-9]).{8,}$/;
    if (regex.test(username)) {
      // set the username input border to green
      document.getElementById("username").style.borderColor = "green";
    } else {
      // set the username input border to red
      document.getElementById("username").style.borderColor = "red";
    }
  });

  document.getElementById("download").addEventListener("click", function () {
    var canvas = document.getElementById("myChart");
    var image = canvas.toDataURL("image/png");

    var link = document.createElement("a");
    link.href = image;
    link.download = "chart.png";
    link.click();
  });
  // Get the context of the canvas element we want to select
  var ctx = document.getElementById("myChart").getContext("2d");
  // Create a new Chart object
  var myChart = new Chart(ctx, {
    type: "bar",
    data: {
      labels: [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December",
      ],
      datasets: [
        {
          label: "Income",
          data: [],
          backgroundColor: "rgba(75, 192, 192, 0.2)",
          borderColor: "rgba(75, 192, 192, 1)",
          borderWidth: 1,
        },
        {
          label: "Expenses",
          data: [],
          backgroundColor: "rgba(255, 99, 132, 0.2)",
          borderColor: "rgba(255, 99, 132, 1)",
          borderWidth: 1,
        },
      ],
    },
    options: {
      scales: {
        y: {
          beginAtZero: true,
        },
      },
    },
  });

  document.getElementById("chart-tab").addEventListener("click", function () {
    // Income
    var janIncome = document.getElementById("jan-income").value;
    var febIncome = document.getElementById("feb-income").value;
    var marIncome = document.getElementById("mar-income").value;
    var aprIncome = document.getElementById("apr-income").value;
    var mayIncome = document.getElementById("may-income").value;
    var junIncome = document.getElementById("jun-income").value;
    var julIncome = document.getElementById("jul-income").value;
    var augIncome = document.getElementById("aug-income").value;
    var sepIncome = document.getElementById("sep-income").value;
    var octIncome = document.getElementById("oct-income").value;
    var novIncome = document.getElementById("nov-income").value;
    var decIncome = document.getElementById("dec-income").value;

    // Expenses
    var janExpenses = document.getElementById("jan-expenses").value;
    var febExpenses = document.getElementById("feb-expenses").value;
    var marExpenses = document.getElementById("mar-expenses").value;
    var aprExpenses = document.getElementById("apr-expenses").value;
    var mayExpenses = document.getElementById("may-expenses").value;
    var junExpenses = document.getElementById("jun-expenses").value;
    var julExpenses = document.getElementById("jul-expenses").value;
    var augExpenses = document.getElementById("aug-expenses").value;
    var sepExpenses = document.getElementById("sep-expenses").value;
    var octExpenses = document.getElementById("oct-expenses").value;
    var novExpenses = document.getElementById("nov-expenses").value;
    var decExpenses = document.getElementById("dec-expenses").value;

    // Create arrays of income and expenses
    var incomeData = [
      janIncome,
      febIncome,
      marIncome,
      aprIncome,
      mayIncome,
      junIncome,
      julIncome,
      augIncome,
      sepIncome,
      octIncome,
      novIncome,
      decIncome,
    ].map(Number);
    var expensesData = [
      janExpenses,
      febExpenses,
      marExpenses,
      aprExpenses,
      mayExpenses,
      junExpenses,
      julExpenses,
      augExpenses,
      sepExpenses,
      octExpenses,
      novExpenses,
      decExpenses,
    ].map(Number);

    // Update the datasets in the chart
    myChart.data.datasets[0].data = incomeData;
    myChart.data.datasets[1].data = expensesData;

    // Update the chart to reflect the new data
    myChart.update();
  });
};
