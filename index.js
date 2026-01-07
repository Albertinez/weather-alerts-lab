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
  // ✅ Match the test exactly
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
    return Promise.reject(new Error("Please enter a state abbreviation."));
  }

  if (!/^[A-Z]{2}$/.test(state)) {
    displayError("State code must be two capital letters.");
    return Promise.reject(new Error("State code must be two capital letters."));
  }

  // Clear input & error immediately for Jest tests
  stateInput.value = "";
  clearError();
  showLoading();

  return fetch(`https://api.weather.gov/alerts/active?area=${state}`)
    .then(response => {
      if (!response.ok) throw new Error("Failed to fetch weather alerts.");
      return response.json();
    })
    .then(data => {
      displayAlerts(data);
      return data; // return data for Jest
    })
    .catch(error => {
      displayError(error.message);
      throw error; // re-throw for Jest
    })
    .finally(() => hideLoading());
}

// Button click
getAlertsBtn.addEventListener("click", () => {
  const state = stateInput.value.trim().toUpperCase();
  fetchWeatherAlerts(state);
});
