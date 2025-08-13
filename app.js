const modal = document.getElementById("weatherModal");
const openBtn = document.getElementById("searchBtn");
const closeBtn = document.querySelector(".closeBtn");
const modalSearch = document.getElementById("modalSearchBtn");
const cityInput = document.getElementById("cityInput");
const cityName = document.getElementById("cityName");
const temp = document.getElementById("temp");
const tempF = document.getElementById("tempF");
const clearEl = document.getElementById("clear");
const humidity = document.getElementById("humidity");
const windSpeed = document.getElementById("windSpeed");
const windDirection = document.getElementById("windDirection");
const realFeel = document.getElementById("realFeel");
const pressure = document.getElementById("pressure");
const rainchance = document.getElementById("rain-chance");
const sunrise = document.getElementById("sunrise");
const sunset = document.getElementById("sunset");

const weatherImages = {
  day: {
    clouds: "https://images.unsplash.com/photo-1536244636800-a3f74db0f3cf?q=80&w=792&auto=format&fit=crop",
    sunny: "https://images.unsplash.com/photo-1476673160081-cf065607f449?q=80&w=872&auto=format&fit=crop",
    rain: "https://images.unsplash.com/photo-1534274988757-a28bf1a57c17?q=80&w=435&auto=format&fit=crop",
    snow: "https://images.unsplash.com/photo-1483664852095-d6cc6870702d?q=80&w=870&auto=format&fit=crop"
  },
  night: {
    clouds: "https://images.unsplash.com/photo-1572162522099-7a0c28d7691b?q=80&w=870&auto=format&fit=crop",
    clear: "https://images.unsplash.com/photo-1528353518104-dbd48bee7bc4?q=80&w=1032&auto=format&fit=crop",
    rain: "https://images.unsplash.com/photo-1548232979-6c557ee14752?q=80&w=871&auto=format&fit=crop",
    snow: "https://images.unsplash.com/photo-1542601098-8fc114e148e2?q=80&w=870&auto=format&fit=crop"
  }
};

openBtn.onclick = () => modal.style.display = "flex";
closeBtn.onclick = () => modal.style.display = "none";
window.onclick = e => { if (e.target === modal) modal.style.display = "none"; }
window.onkeydown = e => { if (e.key === "Escape") modal.style.display = "none"; }

async function fetchWeather(city) {
  try {
    const res = await fetch(`https://wttr.in/${encodeURIComponent(city)}?format=j1`);
    if (!res.ok) throw new Error("Failed to fetch");
    const data = await res.json();
    const curr = data.current_condition[0];
    const weatherDesc = curr.weatherDesc[0].value.toLowerCase();

    cityName.textContent = city;
    temp.textContent = `${curr.temp_C} °C`;
    tempF.textContent = `${curr.temp_F} °F`;
    clearEl.textContent = `${curr.weatherDesc[0].value} ${data.weather[0].maxtempC}° / ${data.weather[0].mintempC}°`;
    humidity.textContent = `${curr.humidity} %`;
    windSpeed.textContent = `${curr.windspeedKmph} km/h`;
    windDirection.textContent = `${curr.winddirDegree}°`;
    realFeel.textContent = `${curr.FeelsLikeC} °C`;
    pressure.textContent = `${curr.pressure} mb`;
    rainchance.textContent = Math.max(...data.weather[0].hourly.map(h => +h.chanceofrain)) + " %";
    sunrise.textContent = data.weather[0].astronomy[0].sunrise;
    sunset.textContent = data.weather[0].astronomy[0].sunset;

    const dayOrNight = new Date().getHours() >= 6 && new Date().getHours() < 18 ? "day" : "night";
    let key = weatherDesc.includes("cloud") ? "clouds" :
      weatherDesc.includes("rain") ? "rain" :
        weatherDesc.includes("snow") ? "snow" : "sunny";
    if (dayOrNight === "night" && key === "sunny") key = "clear";

    const bgUrl = weatherImages[dayOrNight][key];
    document.body.style.backgroundImage = `url(${bgUrl})`;
    document.body.style.backgroundSize = "cover";
    document.body.style.backgroundRepeat = "no-repeat";
    document.body.style.backgroundPosition = "center";
    document.body.style.transition = "background-image 0.5s ease-in-out";

    const tempcon = document.querySelector('.temp-con');
    const wind = document.querySelector('.wind');
    const main = document.querySelectorAll('.main');
    const sun = document.querySelector('.sun');

    if (dayOrNight === "day" && (key === "sunny" || key === "snow")) {
      tempcon.style.color = "black";
      wind.style.color = "black";
      sun.style.color = "black";
      main.forEach(main => main.style.color = "black");
      
    } else {
      tempcon.style.color = "white";
      wind.style.color = "white";
      sun.style.color = "white";
      main.forEach(main => main.style.color = "white");
    }


  } catch (err) {
    alert("Error: " + err.message);
  }
}

modalSearch.onclick = () => {
  const city = cityInput.value.trim();
  if (city) { fetchWeather(city); modal.style.display = "none"; }
  else alert("Enter a city name");
}

if (navigator.geolocation) {
  navigator.geolocation.getCurrentPosition(async pos => {
    const lat = pos.coords.latitude;
    const lon = pos.coords.longitude;
    try {
      const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&accept-language=en`);
      const geo = await res.json();
      const city = geo.address.city || geo.address.town || geo.address.village || "Unknown";
      fetchWeather(city);
    } catch (e) { console.log(e); }
  });
}