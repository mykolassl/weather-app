let localTime = document.getElementById("local-time");
let localDate = document.getElementById("local-date");

let cityName = document.getElementById("city-name");
let countryName = document.getElementById("country-name");

const cityInput = document.getElementById('city-input');
const submitBtn = document.getElementById('search-button');

const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };

// Form submission

submitBtn.addEventListener('click', (e) => {
    e.preventDefault();
    console.log(cityInput.value);
})

// Placeholder code

cityName.innerText = 'Vilnius';
countryName.innerText = "Lithuania";

setInterval(() => {
    const date = new Date();

    localTime.innerText = `${date.getHours()}:${date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()}`;
    localDate.innerText = date.toLocaleDateString(undefined, options);
}, 800)
