const API_KEY = "7ac1d77ff630e80916e9aa0d7122967f"; // visible in browser, fine for lab only

async function getweather() {
  const city = document.getElementById("city").value.trim();
  if (!city) return;

  try {
    // free plan = http only
    const url = `http://api.weatherstack.com/current?access_key=${API_KEY}&query=${encodeURIComponent(city)}`;
    const res = await fetch(url);
    const data = await res.json();

    if (data.error) {
      document.getElementById("cityname").textContent = data.error.info;
      return;
    }

    document.getElementById("cityname").textContent = data.location.name;
    document.getElementById("temperature").textContent = "Temperature: " + data.current.temperature + " °C";
    document.getElementById("condition").textContent = "Condition: " + data.current.weather_descriptions[0];
    document.getElementById("humidity").textContent = "Humidity: " + data.current.humidity + "%";
  } catch (err) {
    document.getElementById("cityname").textContent = "Request failed";
  }
}