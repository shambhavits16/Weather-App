const timeEl = document.getElementById('time');
const dateEl = document.getElementById('date');
const currentWeatherItemsEl = document.getElementById('currweatheritems');
const timezone = document.getElementById('timezone');
const countryEl = document.getElementById('country');
const weatherForecastEl = document.getElementById('weatherforecast');
const currentTempEl = document.getElementById('currtemp');

const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

const API_Key = 'c44746e369212115969487373652f74d';

setInterval(() => {
    const time = new Date();
    const month = time.getMonth();
    const date = time.getDate();
    const day = time.getDay();
    const hour = time.getHours();
    const hoursIn12HrFormat = hour >= 13 ? hour %12: hour
    const minutes = time.getMinutes();
    const ampm = hour >=12 ? 'PM' : 'AM'

    timeEl.innerHTML = (hoursIn12HrFormat < 10? '0'+hoursIn12HrFormat : hoursIn12HrFormat) + ':' + (minutes < 10? '0'+minutes: minutes)+ ' ' + `<span id="ampm">${ampm}</span>`

    dateEl.innerHTML = days[day] + ', ' + date+ ' ' + months[month]

}, 1000);

getWeatherData()
function getWeatherData () {
    navigator.geolocation.getCurrentPosition((success) => {
        
        let {latitude, longitude} = success.coords;

        fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${latitude}&lon=${longitude}&exclude=hourly,minutely&units=metric&appid=${API_Key}`).then(res => res.json()).then(data => {

        console.log(data)
        showWeatherData(data);
        })

    })
}

function showWeatherData (data){
    let {humidity, pressure, sunrise, sunset, wind_speed} = data.current;

    timezone.innerHTML = data.timezone;
    countryEl.innerHTML = data.lat + 'N' + data.lon + 'E'

    currentWeatherItemsEl.innerHTML = 
    `<div class="weatheritem">
        <div>Humidity</div>
        <div>${humidity}%</div>
    </div>
    <div class="weatheritem">
        <div>Pressure</div>
        <div>${pressure}</div>
    </div>
    <div class="weatheritem">
        <div>Wind Speed</div>
        <div>${wind_speed}</div>
    </div>

    <div class="weatheritem">
        <div>Sunrise</div>
        <div>${window.moment(sunrise*1000).format('HH:mm a')}</div>
    </div>
    <div class="weatheritem">
        <div>Sunset</div>
        <div>${window.moment(sunset*1000).format('HH:mm a')}</div>
    </div>
    
    `;

    let otherDayForcast = ''
    data.daily.forEach((day,idx) => {
        if(idx == 0){
            currentTempEl.innerHTML = `
            <img src=" https://openweathermap.org/img/wn/${day.weather[0].icon}@2x.png" alt="weather icon" class="wicon">
            <div class="other">
                <div class="day">${window.moment(day.dt*1000).format('ddd')}</div>
                <div class="temp">Night - ${day.temp.night}&#176; C</div>
                <div class="temp">Day - ${day.temp.day}&#176; C</div>
            </div>
            `
        }else{
            otherDayForcast += `
            <div class="weatherforecastitem">
            <div class="day">${window.moment(day.dt*1000).format('ddd')}</div>
            <img src=" https://openweathermap.org/img/wn/${day.weather[0].icon}@2x.png" alt="weather icon" class="wicon">
            <div class="temp">Night - ${day.temp.night}&#176; C</div>
            <div class="temp">Day - ${day.temp.day}&#176; C</div>
        </div>
            
            `
        }
    })

    weatherForecastEl.innerHTML = otherDayForcast;

}