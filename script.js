// текущая дата и время
const currentDate = new Date();

const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
                    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const month = monthNames[currentDate.getMonth()];
const day = currentDate.getDate();
let hours = currentDate.getHours();

const ampm = hours >= 12 ? 'pm' : 'am';
hours = hours % 12;
hours = hours ? hours : 12; 

const minutes = currentDate.getMinutes();
const formattedDateTime = `${month} ${day}, ${hours}:${minutes}${ampm}`;


const dateTimeElement = document.getElementById('dateTime');
dateTimeElement.textContent = formattedDateTime;


// фунция получения погоды по APIKey

const BASE_URL = 'https://api.openweathermap.org/data/2.5/weather?';
const APIKey = '01a3a80c80c58bf6c161964f9556e365';
const cities = ['London', 'Minsk', 'Gdansk', 'Kyiv', 'Bozen'];

function getWeather(cityName) {
    const CityRequest = `q=${cityName}&appid=${APIKey}`;

    const city = document.querySelector('.city-name');
    const temperature = document.querySelector('.temperature');
    const image = document.querySelector('.image');
    const description = document.querySelector('.description');
    const windDirection = document.querySelector('.wind-direction');
    const windSpeed = document.querySelector('.wind-speed');
    const pressure = document.querySelector('.pressure');

    fetch(`${BASE_URL}${CityRequest}`)
        .then((response) => response.json())
        .then((data) => {
            console.log(data);
            city.innerText = `${data.name}, ${data.sys.country}`;
            temperature.innerHTML = `${Math.round(data.main.temp - 273.15)}&deg;C`;
            description.innerText = `${data.weather[0].description}`;
            image.innerHTML = `<img src='https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png' alt='Weather icon' />`;
            windDirection.innerText = `Wind Direction: ${data.wind.deg}°`;
            windSpeed.innerText = `Wind Speed: ${data.wind.speed} m/s`;
            pressure.innerText = `Pressure: ${data.main.pressure} hPa`;
        })
        .catch((error) => {
            console.error('Error fetching weather data:', error);
        });
}


// фунция меняет bg

function setCityBackground(cityName) {
    const container = document.querySelector('.container');
    let imageUrl;

    switch(cityName) {
        case 'Madrid':
            imageUrl = './images/Madrid.jpg';
            break;
        case 'Catania':
            imageUrl = './images/Catania.jpg';
            break;
        case 'Bolzano':
            imageUrl = './images/Bolzano.jpg';
            break;
        case 'Lisbon':
            imageUrl = './images/Lissabon.jpg';
            break;
        default:
            imageUrl = './images/Lissabon.jpg'; // По умолчанию используем фоновое изображение для Лиссабона
            break;
    }

    container.style.backgroundImage = `url("${imageUrl}")`;
}


// Формирование списка select с помощью JavaScript:


const citySelector = document.getElementById('citySelector');

const optionLisbon = document.createElement('option');
optionLisbon.value = 'Lisbon';
optionLisbon.textContent = 'Lisbon';
citySelector.appendChild(optionLisbon);

const optionMadrid = document.createElement('option');
optionMadrid.value = 'Madrid';
optionMadrid.textContent = 'Madrid';
citySelector.appendChild(optionMadrid);

const optionCatania = document.createElement('option');
optionCatania.value = 'Catania';
optionCatania.textContent = 'Catania';
citySelector.appendChild(optionCatania);

const optionBolzano = document.createElement('option');
optionBolzano.value = 'Bolzano';
optionBolzano.textContent = 'Bolzano';
citySelector.appendChild(optionBolzano);



//  меняем bg и погоду при смене города:

document.addEventListener('DOMContentLoaded', function() {
    const citySelector = document.getElementById('citySelector');
    const container = document.querySelector('.container'); 

    citySelector.addEventListener('change', function() {
        const selectedCity = this.value;
        setCityBackground(selectedCity);
        getWeather(selectedCity);
    });

    //  меняем bg и погоду при нажатии на кнопку:

    const labelButton = document.querySelector('.label');
    labelButton.addEventListener('click', function() {
        const selectedIndex = citySelector.selectedIndex; // Получаем индекс текущего выбранного города
        const nextIndex = (selectedIndex + 1) % citySelector.options.length; // Вычисляем индекс следующего города
        citySelector.selectedIndex = nextIndex; // Устанавливаем выбранный город на следующий
        const selectedCity = citySelector.value; // Получаем выбранный город
        getWeather(selectedCity); // Вызываем функцию getWeather для нового выбранного города
        setCityBackground(selectedCity); // Устанавливаем фоновое изображение для нового выбранного города
    });

    // Получаем значение первого города в списке

    const firstCity = citySelector.options[0].value; 
    getWeather(firstCity);
});

