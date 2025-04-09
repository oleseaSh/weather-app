const API_KEY = '01a3a80c80c58bf6c161964f9556e365';
        const BASE_URL = 'https://api.openweathermap.org/data/2.5/';
        const MAX_CITIES = 5;
        const STORAGE_KEY = 'weatherCities';
        let userCities = [];

        document.addEventListener('DOMContentLoaded', () => {
            userCities = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [{ name: 'Milan', country: 'IT' }];
            initSelect2();
            renderTabs();
            loadWeather(userCities[0]);
        });

        function initSelect2() {
            $('#citySelect').select2({
                placeholder: 'Введите город',
                minimumInputLength: 2,
                language: 'ru',
                ajax: {
                    url: params => `https://api.openweathermap.org/geo/1.0/direct?q=${params.term}&limit=5&appid=${API_KEY}`,
                    dataType: 'json',
                    processResults: data => ({
                        results: data.map(city => ({
                            id: city.name,
                            text: `${city.name}, ${city.country}`,
                            name: city.name,
                            country: city.country
                        }))
                    })
                }
            });

            document.getElementById('addCityBtn').addEventListener('click', () => {
                const selected = $('#citySelect').select2('data')[0];
                if (!selected) return;

                const newCity = { name: selected.name, country: selected.country };

                // Удаляем дубликаты
                userCities = userCities.filter(c => !(c.name === newCity.name && c.country === newCity.country));
                userCities.unshift(newCity);
                userCities = userCities.slice(0, MAX_CITIES);
                saveCities();
                renderTabs();
                loadWeather(newCity);
                $('#citySelect').val(null).trigger('change');
            });
        }

        function saveCities() {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(userCities));
        }

        function renderTabs() {
            const container = document.getElementById('cityTabs');
            container.innerHTML = '';
            userCities.forEach(city => {
                const btn = document.createElement('button');
                btn.className = 'city-tab';
                btn.textContent = city.name;
                btn.onclick = () => loadWeather(city);
                container.appendChild(btn);
            });
        }

        async function loadWeather(city) {
            const weatherBox = document.querySelector('.weather-content');
            weatherBox.innerHTML = `<p>Загрузка погоды для ${city.name}...</p>`;
            try {
                const response = await fetch(`${BASE_URL}weather?q=${city.name},${city.country}&appid=${API_KEY}&units=metric&lang=ru`);
                if (!response.ok) throw new Error('Не удалось загрузить');

                getCityBackground(city.name);

                const data = await response.json();

                weatherBox.innerHTML = `
            <h3>${data.name}, ${data.sys.country}</h3>
            <p>${Math.round(data.main.temp)}°C, ${data.weather[0].description}</p>
            <img src="https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png" alt="">
            <p>💨 Ветер: ${data.wind.speed} м/с</p>
            <p>💧 Влажность: ${data.main.humidity}%</p>
            <p>🔽 Давление: ${data.main.pressure} гПа</p>
        `;
            } catch (err) {
                weatherBox.innerHTML = `<p class="text-danger">Ошибка загрузки: ${err.message}</p>`;
            }
        }

        async function getCityBackground(cityName) {
            const accessKey = 'iIfYply2vee8dt-igpTkVuVOBFyy37qZwkSd07FbcIA';
            try {
                const response = await fetch(`https://api.unsplash.com/search/photos?query=${cityName}&client_id=${accessKey}`);
                const data = await response.json();

                if (data.results.length === 0) {
                    // 👉 Фон не найден — ставим дефолтный
                    document.querySelector('.weather-content').style.backgroundImage = 'url("images/lago.jpg")';
                    return;
                }

                // Если найден — используем картинку
                const imageUrl = data.results[0].urls.regular;
                document.querySelector('.weather-content').style.backgroundImage = `url(${imageUrl})`;
            } catch (error) {
                console.error('Ошибка загрузки фона:', error);
                // 👉 В случае ошибки тоже ставим дефолтный
                document.querySelector('.weather-content').style.backgroundImage = 'url("images/lago.jpg")';
            }
        }

