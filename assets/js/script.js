const apiKey = "ac0263fabd8a4137b5161847250201";
const baseUrl = "https://api.weatherapi.com/v1";
let searchbox = document.getElementById("location_input");
const backgroundVideo = document.getElementById("background_video");
const videoApiKey = "woY8cyahcVhkuHTAz0PRe0dqvecOg7xIPVNDVglm6czJlr1Sn6SV3IZg"; // Replace with your Pexels API key

// Helper to simplify weather condition
function getSimplifiedQuery(condition) {
  const lowerCondition = condition.toLowerCase();
  if (lowerCondition.includes("rain")) return "rain shower";
  if (lowerCondition.includes("shower")) return "shower";
  if (lowerCondition.includes("thunder")) return "thunder";
  if (lowerCondition.includes("snow")) return "snow";
  if (lowerCondition.includes("cloudy")) return "rain clouds";
  if (lowerCondition.includes("sunny")) return "sunny";
  if (lowerCondition.includes("mist")) return "mist";
  if (lowerCondition.includes("sleet")) return "sleet";
  if (lowerCondition.includes("clear")) return "clear weather";
  if (lowerCondition.includes("overcast")) return "overcast weather";
  if (lowerCondition.includes("fog")) return "foggy weather";

  return "weather"; // Fallback category
}

// Set a fallback video
function setFallbackVideo() {
  backgroundVideo.setAttribute("src", "fallback-weather.mp4");
  backgroundVideo.play(); // Ensure video starts playing
}

// Fetch and update background video based on condition
function updateBackgroundVideo(condition) {
  const simplifiedQuery = getSimplifiedQuery(condition);
  console.log("Video Query Based on Condition:", simplifiedQuery);

  const videoUrl = `https://api.pexels.com/videos/search?query=${encodeURIComponent(
    simplifiedQuery
  )}&per_page=1`;

  fetch(videoUrl, {
    headers: { Authorization: videoApiKey },
  })
    .then((response) => {
      if (!response.ok) throw new Error("Failed to fetch video data.");
      return response.json();
    })
    .then((videoData) => {
      const videoLink = videoData?.videos?.[0]?.video_files?.[0]?.link;

      if (videoLink) {
        console.log("Video Link for Condition:", videoLink);
        backgroundVideo.setAttribute("src", videoLink);
        backgroundVideo.load(); // Reload the video
        backgroundVideo.play(); // Ensure the video starts playing
      } else {
        console.warn("No relevant video found. Using fallback.");
        setFallbackVideo();
      }
    })
    .catch((error) => {
      console.error("Error fetching video data:", error.message);
      setFallbackVideo();
    });
}

// Fetch weather data and update video
function getResults(area) {
  const url = `${baseUrl}/forecast.json?key=${apiKey}&q=${area}&aqi=yes&alerts=yes&days=7`;

  fetch(url)
    .then((response) => {
      if (!response.ok) throw new Error("Failed to fetch weather data.");
      return response.json();
    })
    .then((data) => {
      try {
        dataFill(data);

        // Update video based on current weather condition
        const currentCondition = data?.current?.condition?.text;
        if (currentCondition) {
          updateBackgroundVideo(currentCondition);
        } else {
          console.warn("No current condition found.");
          setFallbackVideo();
        }
      } catch (error) {
        console.error("Error processing weather data:", error);
        alert("Error displaying weather data.");
      }
    })
    .catch((error) => {
      console.error("Error fetching weather data:", error.message);
      alert("Could not fetch weather data. Please try again.");
    });
}

// Window load event
window.onload = () => {
  getResults("Contai"); // Default location
};

let debounceTimeout;

// Prevent page reload when Enter is pressed
searchbox.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    e.preventDefault(); // Prevent form submission and page reload
  }
});

searchbox.addEventListener("keyup", (e) => {
  const location = searchbox.value.trim();

  // Clear the previous timeout (if any) to reset the debounce delay
  clearTimeout(debounceTimeout);

  // Set a new timeout to call the getResults function after 500ms
  debounceTimeout = setTimeout(() => {
    if (!location) {
      alert("Please enter a location!");
      return;
    }
    getResults(location); // Fetch weather for the entered location
  }, 1800); // 1800ms delay after the last key press
});

// Existing dataFill function to update weather details
function dataFill(data) {
  const location = document.getElementById("location");
  location.textContent = data.location.name;

  const country = document.getElementById("country");
  country.textContent = data.location.country;

  const time = document.getElementById("time");
  time.textContent = data.location.localtime.split(" ")[1];

  const dateBox = document.getElementById("day_date");
  const dateToday = new Date(data.forecast.forecastday[0].date);
  const formatter = new Intl.DateTimeFormat("en-GB", {
    weekday: "long",
    day: "numeric",
    month: "short",
  });
  const parts = formatter.formatToParts(dateToday);
  const formattedWithComma = `${
    parts.find((p) => p.type === "weekday").value
  }, ${parts.find((p) => p.type === "day").value} ${
    parts.find((p) => p.type === "month").value
  }`;
  dateBox.textContent = formattedWithComma;

  // for sunrise
  const sunRise = document.getElementById("sun_rise");
  sunRise.textContent = data.forecast.forecastday[0].astro.sunrise;

  // for sunset
  const sunSet = document.getElementById("sun_set");
  sunSet.textContent = data.forecast.forecastday[0].astro.sunset;

  // for current temperature
  const currentTemp = document.getElementById("currentTemp");
  currentTemp.textContent = data.current.temp_c;

  // for current feels like
  const feelsLike = document.getElementById("feelsLike");
  feelsLike.textContent = data.current.feelslike_c;

  // current condition
  const currentConText = document.getElementById("currentConText");
  currentConText.textContent = data.current.condition.text;

  // current conditon image
  const currentConditonImg = document.getElementById("currentConditonImg");
  currentConditonImg.src = data.current.condition.icon;

  // current humidity
  const currentHumidity = document.getElementById("currentHumidity");
  currentHumidity.textContent = data.current.humidity;

  // current wind speed
  const currentWS = document.getElementById("currentWS");
  currentWS.textContent = data.current.wind_kph;

  // current UVI
  const currentUVI = document.getElementById("currentUVI");
  currentUVI.textContent = data.current.uv;

  // day 1 weather condition
  const dayOneText = document.getElementById("dayOneText");
  dayOneText.textContent = data.forecast.forecastday[1].day.condition.text;

  // day 1 icon
  const dayOneImg = document.getElementById("dayOneImg");
  dayOneImg.src = data.forecast.forecastday[1].day.condition.icon;

  // day 1 temp
  const dayOneTemp = document.getElementById("dayOneTemp");
  dayOneTemp.textContent = data.forecast.forecastday[1].day.avgtemp_c;

  // day 1 temp
  const dayOneHighTemp = document.getElementById("dayOneHighTemp");
  dayOneHighTemp.textContent = data.forecast.forecastday[1].day.maxtemp_c;

  // day 1 temp
  const dayOneLowTemp = document.getElementById("dayOneLowTemp");
  dayOneLowTemp.textContent = data.forecast.forecastday[1].day.mintemp_c;

  // Day 2
  // day 2 weather condition
  const dayTwoText = document.getElementById("dayTwoText");
  dayTwoText.textContent = data.forecast.forecastday[2].day.condition.text;

  // day 2 icon
  const dayTwoImg = document.getElementById("dayTwoImg");
  dayTwoImg.src = data.forecast.forecastday[2].day.condition.icon;

  // day 2 temp
  const dayTwoTemp = document.getElementById("dayTwoTemp");
  dayTwoTemp.textContent = data.forecast.forecastday[2].day.avgtemp_c;

  // day 2 temp
  const dayTwoHighTemp = document.getElementById("dayTwoHighTemp");
  dayTwoHighTemp.textContent = data.forecast.forecastday[2].day.maxtemp_c;

  // day 2 temp
  const dayTwoLowTemp = document.getElementById("dayTwoLowTemp");
  dayTwoLowTemp.textContent = data.forecast.forecastday[2].day.mintemp_c;

  // Day 3
  // day 3 weather condition
  const dayThreeText = document.getElementById("dayThreeText");
  dayThreeText.textContent = data.forecast.forecastday[3].day.condition.text;

  // day 3 icon
  const dayThreeImg = document.getElementById("dayThreeImg");
  dayThreeImg.src = data.forecast.forecastday[3].day.condition.icon;

  // day 3 temp
  const dayThreeTemp = document.getElementById("dayThreeTemp");
  dayThreeTemp.textContent = data.forecast.forecastday[3].day.avgtemp_c;

  // day 3 temp
  const dayThreeHighTemp = document.getElementById("dayThreeHighTemp");
  dayThreeHighTemp.textContent = data.forecast.forecastday[3].day.maxtemp_c;

  // day 3 temp
  const dayThreeLowTemp = document.getElementById("dayThreeLowTemp");
  dayThreeLowTemp.textContent = data.forecast.forecastday[3].day.mintemp_c;

  // Day 4
  // day 4 weather condition
  const dayFourText = document.getElementById("dayFourText");
  dayFourText.textContent = data.forecast.forecastday[4].day.condition.text;

  // day 4 icon
  const dayFourImg = document.getElementById("dayFourImg");
  dayFourImg.src = data.forecast.forecastday[4].day.condition.icon;

  // day 4 temp
  const dayFourTemp = document.getElementById("dayFourTemp");
  dayFourTemp.textContent = data.forecast.forecastday[4].day.avgtemp_c;

  // day 4 temp
  const dayFourHighTemp = document.getElementById("dayFourHighTemp");
  dayFourHighTemp.textContent = data.forecast.forecastday[4].day.maxtemp_c;

  // day 4 temp
  const dayFourLowTemp = document.getElementById("dayFourLowTemp");
  dayFourLowTemp.textContent = data.forecast.forecastday[4].day.mintemp_c;

  // Day 5
  // day 5 weather condition
  const dayFiveText = document.getElementById("dayFiveText");
  dayFiveText.textContent = data.forecast.forecastday[5].day.condition.text;

  // day 5 icon
  const dayFiveImg = document.getElementById("dayFiveImg");
  dayFiveImg.src = data.forecast.forecastday[5].day.condition.icon;

  // day 5 temp
  const dayFiveTemp = document.getElementById("dayFiveTemp");
  dayFiveTemp.textContent = data.forecast.forecastday[5].day.avgtemp_c;

  // day 5 temp
  const dayFiveHighTemp = document.getElementById("dayFiveHighTemp");
  dayFiveHighTemp.textContent = data.forecast.forecastday[5].day.maxtemp_c;

  // day 5 temp
  const dayFiveLowTemp = document.getElementById("dayFiveLowTemp");
  dayFiveLowTemp.textContent = data.forecast.forecastday[5].day.mintemp_c;
}
