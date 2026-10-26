const weatherApi = "https://api.weather.gov/alerts/active?area=";

const stateInput = document.getElementById("state-input");
const fetchButton = document.getElementById("fetch-alerts");
const alertsDisplay = document.getElementById("alerts-display");
const errorMessage = document.getElementById("error-message");

async function fetchAlerts() {
  const state = stateInput.value.trim().toUpperCase();

  // Clear previous results and errors
  alertsDisplay.innerHTML = "";
  errorMessage.textContent = "";
  errorMessage.classList.add("hidden");

  // Clear the input field
  stateInput.value = "";

  try {
    if (!state) {
      throw new Error("Please enter a state abbreviation.");
    }

    if (!/^[A-Z]{2}$/.test(state)) {
      throw new Error("Please enter a valid two-letter state abbreviation.");
    }

    const response = await fetch(`${weatherApi}${state}`);

    if (!response.ok) {
      throw new Error(`Request failed with status ${response.status}`);
    }

    const data = await response.json();
    const features = data.features || [];

    // Display the summary
    const summary = document.createElement("h2");
    summary.textContent = `${data.title}: ${features.length}`;
    alertsDisplay.append(summary);

    // Display the alert headlines
    const alertList = document.createElement("ul");

    features.forEach((alert) => {
      const listItem = document.createElement("li");
      listItem.textContent =
        alert.properties?.headline || "No headline available";
      alertList.append(listItem);
    });

    alertsDisplay.append(alertList);
  } catch (error) {
    errorMessage.textContent = error.message;
    errorMessage.classList.remove("hidden");
  }
}

fetchButton.addEventListener("click", fetchAlerts);