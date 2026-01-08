// ==========================
// Weather Alerts Lab - Final Submission Version
// index.js
// ==========================

// DOM Elements
const stateInput = document.getElementById("state-input");
const getAlertsBtn = document.getElementById("get-alerts");
const alertsDiv = document.getElementById("alerts-display");
const errorDiv = document.getElementById("error-message");
const loadingDiv = document.getElementById("loading");

// Show/hide error
function displayError(message) {
  errorDiv.textContent = message;
  errorDiv.classList.remove("hidden");
}

function clearError() {
  errorDiv.textContent = "";
  errorDiv.classList.add("hidden");
}

// Loading spinner
function showLoading() { loadingDiv.style.display = "block"; }
function hideLoading() { loadingDiv.style.display = "none"; }

// Display alerts
function displayAlerts(data) {
  alertsDiv.innerHTML = ""; // Clear previous alerts

  const count = data.features.length;

  const title = document.createElement("h2");
  title.textContent = `Weather Alerts: ${count}`;
  alertsDiv.appendChild(title);

  const ul = document.createElement("ul");
  data.features.forEach(alert => {
    const li = document.createElement("li");
    li.textContent = alert.properties.headline;
    ul.appendChild(li);
  });
  alertsDiv.appendChild(ul);
}

// Fetch weather alerts
function fetchWeatherAlerts(state) {
  if (!state) {
    displayError("Please enter a state abbreviation.");
    return;
  }

  if (!/^[A-Z]{2}$/.test(state)) {
    displayError("State code must be two capital letters.");
    return;
  }

  // Clear input immediately
  stateInput.value = "";
  showLoading();

  fetch(`https://api.weather.gov/alerts/active?area=${state}`)
    .then(response => {
      if (!response.ok) throw new Error("Failed to fetch weather alerts.");
      return response.json();
    })
    .then(data => {
      clearError(); // Clear error only on success
      displayAlerts(data);
    })
    .catch(error => {
      displayError(error.message); // Display the error
      // ✅ DON'T re-throw the error - just handle it
    })
    .finally(() => hideLoading());
}

// Button click
getAlertsBtn.addEventListener("click", () => {
  const state = stateInput.value.trim().toUpperCase();
  fetchWeatherAlerts(state);
});