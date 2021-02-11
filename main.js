//api параметры
const appid = 'ecbbec048e1f89c9f68cd448e6fe2523'
const exclude = 'current,minutely,hourly,alerts'
const lang = 'ru'
const units = 'metric'
const days = 5

//Элементы ввода информации
const inputSubmitElement = document.querySelector('.inputSubmit')
const inputLatitudeElemnt = document.querySelector('.inputLatitude')
const inpuLongitudeElemnt = document.querySelector('.inpuLongitude')

//Элемент вывода информации о погоде
const weatherElement = document.querySelector('.weather-output-container')

//Объект с информацией о погоде за 5 дней
const weather = {
  timezone: '',
  temperature: [],
  average: 0,
  max: -500,
}

//Событие нажатия на кнопку "Узнать погоду"
inputSubmitElement.addEventListener('click', () => {
  let apiByCity = `https://api.openweathermap.org/data/2.5/onecall?lat=${inputLatitudeElemnt.value}&lon=${inpuLongitudeElemnt.value}&exclude=${exclude}&appid=${appid}&lang=${lang}&units=${units}`
  fetch(apiByCity)
    .then((response) => {
      let data = response.json()
      return data
    })
    .then((data) => {
      weather.timezone = data.timezone

      let sumTemperature = 0

      for (let i = 0; i < days; i++) {
        let todayTemperature = data.daily[i].temp.morn
        sumTemperature += todayTemperature

        //Определение максимальной температуры
        if (weather.max < todayTemperature) {
          weather.max = todayTemperature
        }

        let temperature = {
          time: data.daily[i].dt,
          value: todayTemperature,
          description: data.daily[i].weather[0].description,
          icon: data.daily[i].weather[0].icon,
        }
        weather.temperature.push(temperature)
      }

      //Рассчет средней температуры
      weather.average = (sumTemperature / days).toFixed(2)
    })
    .then(() => displayWeather())
    .catch((error) => console.log(error))
})

//Отобразить Данные о погоде за 5 дней
function displayWeather() {
  //Удалить предыдущие данные
  weatherElement.innerHTML = ''

  //Часовой пояс
  let cityElement = document.createElement('div')
  cityElement.innerHTML = `<p>${weather.timezone}</p>`

  //Погода на каждый из 5-ти дней
  let allDaysElement = document.createElement('div')
  allDaysElement.className = 'all-days-weather'

  for (let i = 0; i < days; i++) {
    let oneDayElement = document.createElement('div')
    oneDayElement.className = 'one-day-weather'

    let dayElement = document.createElement('div')
    dayElement.innerHTML = `<p>${getDayOfWeek(weather.temperature[i].time)}</p>`
    let temperatureElement = document.createElement('div')
    temperatureElement.innerHTML = `<p>${weather.temperature[i].value}° <span>C</span></p>`
    let descriptionElement = document.createElement('div')
    descriptionElement.innerHTML = `<p>${weather.temperature[i].description}</p>`
    let iconElement = document.createElement('div')
    iconElement.innerHTML = `<img src="https://openweathermap.org/img/wn/${weather.temperature[i].icon}@2x.png" alt="icon" />`

    oneDayElement.append(
      dayElement,
      temperatureElement,
      descriptionElement,
      iconElement
    )

    allDaysElement.append(oneDayElement)
  }

  //Средняя температура
  let averageTemperatureElement = document.createElement('div')
  averageTemperatureElement.innerHTML = `<p>Средняя температура: ${weather.average}° C</p>`

  //Максимальная температура
  let maxTemperatureElement = document.createElement('div')
  maxTemperatureElement.innerHTML = `<p>Максимальная температура: ${weather.max}° C</p>`

  weatherElement.append(
    cityElement,
    allDaysElement,
    averageTemperatureElement,
    maxTemperatureElement
  )
}

//Определение дня недели
function getDayOfWeek(time) {
  let daysOfWeek = [
    'Воскресение',
    'Понедельник',
    'Вторник',
    'Среда',
    'Четверг',
    'Пятница',
    'Суббота',
  ]

  return daysOfWeek[new Date(time * 1000).getDay()]
}
