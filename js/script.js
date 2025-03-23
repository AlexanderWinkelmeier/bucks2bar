window.onload = () => {
  const usernameInput = document.getElementById("username");
  const downloadButton = document.getElementById("download");
  const chartTab = document.getElementById("chart-tab");
  const chartCanvas = document.getElementById("myChart");

  usernameInput.addEventListener("input", () => {
    const username = usernameInput.value;
    const regex = /^(?=.*[A-Z])(?=.*[!@#$&*~])(?=.*[0-9]).{8,}$/;
    usernameInput.style.borderColor = regex.test(username) ? "green" : "red";
  });

  downloadButton.addEventListener("click", () => {
    const image = chartCanvas.toDataURL("image/png");
    const link = document.createElement("a");
    link.href = image;
    link.download = "chart.png";
    link.click();
  });

  const ctx = chartCanvas.getContext("2d");
  const myChart = new Chart(ctx, {
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

  chartTab.addEventListener("click", () => {
    const getMonthlyValues = (type) => {
      const months = [
        "jan",
        "feb",
        "mar",
        "apr",
        "may",
        "jun",
        "jul",
        "aug",
        "sep",
        "oct",
        "nov",
        "dec",
      ];
      return months.map((month) => {
        const input = document.getElementById(`${month}-${type}`);
        return input ? parseFloat(input.value) || 0 : 0;
      });
    };

    const incomeData = getMonthlyValues("income");
    const expensesData = getMonthlyValues("expenses");

    myChart.data.datasets[0].data = incomeData;
    myChart.data.datasets[1].data = expensesData;

    myChart.update();
  });
};