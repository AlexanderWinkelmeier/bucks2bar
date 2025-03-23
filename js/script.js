window.onload = () => {
  const usernameInput = document.querySelector("#username");
  const downloadButton = document.querySelector("#download");
  const emailButton = document.querySelector("#send-email");
  const chartTab = document.querySelector("#chart-tab");
  const canvas = document.querySelector("#myChart");
  const emailInput = document.querySelector("#email-address"); // Make sure this ID exists in HTML
  const ctx = canvas.getContext("2d");

  // Username validation
  usernameInput.addEventListener("input", () => {
    const username = usernameInput.value;
    const regex = /^(?=.*[A-Z])(?=.*[!@#$&*~])(?=.*[0-9]).{8,}$/;
    usernameInput.style.borderColor = regex.test(username) ? "green" : "red";
  });

  // Download chart functionality
  downloadButton.addEventListener("click", () => {
    const image = canvas.toDataURL("image/png");
    const link = document.createElement("a");
    link.href = image;
    link.download = "chart.png";
    link.click();
  });

  // Email chart functionality with improved error handling
  emailButton.addEventListener("click", () => {
    if (!emailInput) {
      alert("Error: Email input field not found. Please check the HTML.");
      return;
    }

    const email = emailInput.value;
    if (!email) {
      alert("Please enter an email address");
      return;
    }

    try {
      const image = canvas.toDataURL("image/png");
      console.log("Sending email to:", email);
      console.log("Image data length:", image.length);

      // Validate image data
      if (!image || image.length < 100) {
        alert("Error: Could not generate chart image");
        return;
      }

      // Send email with image
      fetch("http://localhost:3000/send-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, image }),
      })
        .then(response => {
          if (!response.ok) {
            return response.text().then(text => {
              throw new Error(text || "Error sending email");
            });
          }
          return response.text();
        })
        .then(result => {
          alert(result);
          // Optional: clear email field after successful send
          emailInput.value = "";
        })
        .catch(error => {
          console.error("Error:", error);
          alert("Failed to send email: " + error.message);
        });
    } catch (error) {
      console.error("Error preparing email:", error);
      alert("Error preparing email: " + error.message);
    }
  });

  // Initialize chart
  const myChart = new Chart(ctx, {
    type: "bar",
    data: {
      labels: [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
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

  // Update chart data when clicking chart tab
  chartTab.addEventListener("click", () => {
    try {
      const incomeData = [];
      const expensesData = [];
      const months = [
        "jan", "feb", "mar", "apr", "may", "jun",
        "jul", "aug", "sep", "oct", "nov", "dec"
      ];

      months.forEach((month) => {
        const incomeElement = document.querySelector(`#${month}-income`);
        const expensesElement = document.querySelector(`#${month}-expenses`);

        if (!incomeElement || !expensesElement) {
          console.warn(`Elements for month ${month} not found`);
          // Push 0 as fallback to prevent array index issues
          incomeData.push(0);
          expensesData.push(0);
          return;
        }

        incomeData.push(Number(incomeElement.value) || 0);
        expensesData.push(Number(expensesElement.value) || 0);
      });

      myChart.data.datasets[0].data = incomeData;
      myChart.data.datasets[1].data = expensesData;
      myChart.update();
    } catch (error) {
      console.error("Error updating chart:", error);
      alert("Failed to update chart: " + error.message);
    }
  });
};