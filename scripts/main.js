const options = { 
    weekday: 'long',
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
};
const token = "3ff9685c0123d30c2f1ffaf700e80bcc";

const cityInput = document.getElementById('city-input');
const submitBtn = document.getElementById('search-button');

let localTime = document.getElementById("local-time");
let localDate = document.getElementById("local-date");

let cityName = document.getElementById("city-name");
let countryName = document.getElementById("country-name");

let regionNames = new Intl.DisplayNames(['en'], { type: 'region' });

// Set time and date based on utc offset

function setTime(offset) {
    const date = new Date();
    const offsetDate = new Date(date.getTime() + (offset * 1000));

    localTime.innerText = `${offsetDate.getUTCHours()}:${offsetDate.getUTCMinutes() < 10 ? '0' + offsetDate.getUTCMinutes() : offsetDate.getUTCMinutes()}`;
    localDate.innerText = offsetDate.toLocaleDateString(undefined, options);
}

async function getCoordinates(city) {
    console.log('Fetching data..')
    const res = await fetch(`https://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=1&appid=${token}`);
    return res.json();
}

async function getWeatherData(lat, lon) {
    const res = await fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude=minutely,alerts&appid=${token}`);
    return res.json();
}

// Set the default position and time

cityName.innerText = 'Vilnius';
countryName.innerText = 'Lithuania';
setTime(7200)

// Form submission

submitBtn.addEventListener('click', async (e) => {
    e.preventDefault();
    
    if(cityInput.value == '') return;

    try {
        let [{ lat, lon, country, name }] = await getCoordinates(cityInput.value);
        cityName.innerText = name;
        countryName.innerText = regionNames.of(country);

        const data = await getWeatherData(lat, lon);
        setTime(data.timezone_offset);

        cityInput.value = ''; 
    } catch {
        return alert('City not found');
    }

})

