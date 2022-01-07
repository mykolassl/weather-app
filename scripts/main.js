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
let data = {};

// Set time and date based on utc offset

function setTime(offset) {
    let date = new Date();
    let offsetDate = new Date(date.getTime() + (offset * 1000));

    localTime.innerText = `${offsetDate.getUTCHours()}:${offsetDate.getUTCMinutes() < 10 ? '0' + offsetDate.getUTCMinutes() : offsetDate.getUTCMinutes()}`;
    localDate.innerText = offsetDate.toLocaleDateString(undefined, options);
}

async function getCoordinates(city) {
    const res = await fetch(`https://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=1&appid=${token}`);
    return res.json();
}

async function getWeatherData(lat, lon) {
    const res = await fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&units=metric&exclude=minutely,alerts&appid=${token}`);
    return res.json();
}

function displayForecast({ time, image, temp, feelTemp, windSpeed, windGust, pressure, humidity, cloudiness }) {
    let newContainer = document.createElement('div');
    newContainer.classList.add('weather');

    let fTimeCont = document.createElement('div');
    let fTime = document.createElement('span');
    let wIcon = document.createElement('img');
    wIcon.classList.add('weather-icon');
    wIcon.src = image;
    fTime.innerText = `${time.getUTCMonth() + 1}-${time.getUTCDate()}, ${time.getUTCHours()}:${time.getUTCMinutes() < 10 ? '0' + time.getUTCMinutes() : time.getUTCMinutes()}`;
    fTimeCont.append(fTime, wIcon);

    let tCont = document.createElement('div');
    let tHead = document.createElement('span');
    let t = document.createElement('span');
    tHead.innerText = 'Temperature';
    t.innerText = `${temp}C`;
    tCont.append(tHead, t);

    let ftCont = document.createElement('div');
    let ftHead = document.createElement('span');
    let ft = document.createElement('span');
    ftHead.innerText = 'Feels like';
    ft.innerText = `${feelTemp}C`;
    ftCont.append(ftHead, ft);

    let wsCont = document.createElement('div');
    let wsHead = document.createElement('span');
    let ws = document.createElement('span');
    wsHead.innerText = 'Wind speed';
    ws.innerText = `${windSpeed}m/s`;
    wsCont.append(wsHead, ws);

    let wgCont = document.createElement('div');
    let wgHead = document.createElement('span');
    let wg = document.createElement('span');
    wgHead.innerText = 'Wind gust';
    wg.innerText = `${windGust}m/s`;
    wgCont.append(wgHead, wg);

    let pCont = document.createElement('div');
    let pHead = document.createElement('span');
    let p = document.createElement('span');
    pHead.innerText = 'Pressure';
    p.innerText = `${pressure}hPa`;
    pCont.append(pHead, p);

    let hCont = document.createElement('div');
    let hHead = document.createElement('span');
    let h = document.createElement('span');
    hHead.innerText = 'Humidity';
    h.innerText = `${humidity}%`;
    hCont.append(hHead, h);

    let cCont = document.createElement('div');
    let cHead = document.createElement('span');
    let c = document.createElement('span');
    cHead.innerText = 'Cloudiness';
    c.innerText = `${cloudiness}%`;
    cCont.append(cHead, c);

    newContainer.append(fTimeCont, tCont, ftCont, wsCont, wgCont, pCont, hCont, cCont);

    return newContainer
}

function clearWeatherContainer() {
    let weatherContainer = document.getElementsByClassName('weather-container')[0];

    while(weatherContainer.firstChild) {
        weatherContainer.removeChild(weatherContainer.firstChild)
    }
}

// Set the default position and time

cityName.innerText = 'Vilnius';
countryName.innerText = 'Lithuania';
setTime(7200);

// Form submission

submitBtn.addEventListener('click', async (e) => {
    e.preventDefault();

    if(cityInput.value == '') return;

    try {
        // Get information about location
        let [{ lat, lon, country, name }] = await getCoordinates(cityInput.value);
        cityName.innerText = name;
        countryName.innerText = regionNames.of(country);

        data = await getWeatherData(lat, lon);
        setTime(data.timezone_offset);

        // Setting weather data for location and displaying it
        clearWeatherContainer();

        let date = new Date(data.current.dt * 1000);
        let time = new Date(date.getTime() + (data.timezone_offset * 1000));

        let weatherInfo = {
            time: time,
            image: `http://openweathermap.org/img/wn/${data.current.weather[0].icon}@2x.png`,
            temp: Math.round(data.current.temp),
            feelTemp: Math.round(data.current.feels_like),
            windSpeed: data.current.wind_speed,
            windGust: data.current.wind_gust ?? 0,
            pressure: data.current.pressure,
            humidity: data.current.humidity,
            cloudiness: data.current.clouds
        };
        
        let weatherContainer = document.getElementsByClassName('weather-container')[0];
        weatherContainer.appendChild(displayForecast(weatherInfo));

        cityInput.value = ''; 
    } catch {
        return alert('City not found');
    }

})


// Selecting weather data time

let links = document.querySelectorAll('.filters ul li a');

links.forEach((el) => {
    el.addEventListener('click', () => {
        if(el.classList.contains('selected')) return;

        let selected = document.getElementsByClassName('selected')[0];
        selected.classList.remove('selected');
        el.classList.add('selected');

        clearWeatherContainer();

        if(el.innerText === 'Day') {
            data.hourly.every((d) => {
                let date = new Date(d.dt * 1000);
                let time = new Date(date.getTime() + (data.timezone_offset * 1000));

                if(time.getUTCHours() === 0) return false;

                let weatherInfo = {
                    time: time,
                    image: `https://openweathermap.org/img/wn/${d.weather[0].icon}@2x.png` ?? '',
                    temp: Math.round(d.temp),
                    feelTemp: Math.round(d.feels_like),
                    windSpeed: d.wind_speed,
                    windGust: d.wind_gust ?? 0,
                    pressure: d.pressure,
                    humidity: d.humidity,
                    cloudiness: d.clouds
                }

                let weatherContainer = document.getElementsByClassName('weather-container')[0];
                weatherContainer.appendChild(displayForecast(weatherInfo));

                return true;
            });
        } else if(el.innerText === 'Week') {
            data.daily.forEach((d) => {
                let date = new Date(d.dt * 1000);
                let time = new Date(date.getTime() + (data.timezone_offset * 1000));

                let weatherInfo = {
                    time: time,
                    image: `https://openweathermap.org/img/wn/${d.weather[0].icon}@2x.png` ?? '',
                    temp: Math.round(d.temp.day),
                    feelTemp: Math.round(d.feels_like.day),
                    windSpeed: d.wind_speed,
                    windGust: d.wind_gust ?? 0,
                    pressure: d.pressure,
                    humidity: d.humidity,
                    cloudiness: d.clouds
                }

                let weatherContainer = document.getElementsByClassName('weather-container')[0];
                weatherContainer.appendChild(displayForecast(weatherInfo));
            });
        } else  {
            let date = new Date(data.current.dt * 1000);
            let time = new Date(date.getTime() + (data.timezone_offset * 1000));
    
            let weatherInfo = {
                time: time,
                image: `http://openweathermap.org/img/wn/${data.current.weather[0].icon}@2x.png`,
                temp: Math.round(data.current.temp),
                feelTemp: Math.round(data.current.feels_like),
                windSpeed: data.current.wind_speed,
                windGust: data.current.wind_gust ?? 0,
                pressure: data.current.pressure,
                humidity: data.current.humidity,
                cloudiness: data.current.clouds
            };
            
            let weatherContainer = document.getElementsByClassName('weather-container')[0];
            weatherContainer.appendChild(displayForecast(weatherInfo));
        }

    })
});
