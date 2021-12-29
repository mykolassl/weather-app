let localTime = document.getElementById("local-time");
let localDate = document.getElementById("local-date");

let cityName = document.getElementById("city-name");
let countryName = document.getElementById("country-name");

const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };

// Placeholder code

cityName.innerText = 'Vilnius';
countryName.innerText = "Lithuania";

setInterval(() => {
    const date = new Date();

    localTime.innerText = `${date.getHours()}:${date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()}`;
    localDate.innerText = date.toLocaleDateString(undefined, options);
}, 100)
