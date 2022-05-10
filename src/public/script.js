//----------------------------()--------------------------------
const supers = document.getElementById('supers');
const searchBar = document.getElementById('search'); 
const loc_List = document.getElementById('locations-dropdown')
const city = document.getElementById('location')
  
document.addEventListener('click', (Event) => console.log(Event.target))

const intervals = document.querySelectorAll('#info-at')
const timelineHrs = document.querySelectorAll('.time')

const oldChildren = loc_List.children;
//----------------------------Clock--------------------------------
const week = ["Sun", "Mon", "Tues", "Wed", "Thurs", "Fri", "Sat"];
const month = ['01', '02', "03", "04", "05","06", "07", "08", "09", "10", "11", "12"];

//----------------------------Data For UI--------------------------------

const apiComm = { 
    suggestArr: [], 
    placesArr: [],
    nineHour_Info: [],
    long: () =>  localStorage.getItem('Coords').split(',', 2)[0],
    lat: () => localStorage.getItem('Coords').split(',', 2)[1],
    convention: 'imperial',
    currentCondition: '',
    weather_code: ''
}

const displayFields = {
    chosenPlace: '',
    currentTemp: '',
    currentApparent: '',
    locality: () => localStorage.getItem('chosenPlace').split(',', 2)[0],
    state: () => localStorage.getItem('chosenPlace').split(',', 2)[1],
    timelineHrs: [],
    dawnHour: '',
    duskHour: ''
}

//------------------------Weather Attributes----------------------------
const degree = document.getElementById('temperature');
const apparent = document.getElementById('apparent');

const percipProbEl = document.getElementById('percipProb');
const humid = document.getElementById('humid');
const vis = document.getElementById('visibility');
const windSpeedEl = document.getElementById('windSpeed');
//------------------------------------------------------------

// Third API to be consumed after data from US-Cities JSON managed
// async function getPhoto(){
//         const response = await fetch(/**Unsplash URI &Authentication key */);
//         const data = await response.json();
//         const photosOf = ;
//     }

/*
    Convert node list to array and rearrange the node 
    list if the value of arr[0] is not the intended array 
*/

const assessWeatherCond = (codeNum) => {
    const currHour = new Date().getHours();
    const sunrise = new Date(apiComm.nineHour_Info[0].sunriseTime).getHours()
    const sunset = new Date(apiComm.nineHour_Info[0].sunsetTime).getHours()

    displayFields.dawnHour = sunrise
    displayFields.duskHour = sunset

    const code = codeNum.toString();
    const condition = {
        condNow: '',
        condSuffix: ''
    }
    const firstNum = (code[0] === '6' || code[0] === '8') ? code[0] : false;

    //Needs day and night distinctions 
    switch (firstNum || code) {
        case '1100':
        case '1101': 
        case '1103': 
        case '2101': 
        case '2102': 
        case '2106': 
        case '2107':
        case '1102': 
        case '2103': 
        case '2108':
            condition.condNow = 'Partly Cloudy'
            break;

        case '1001':
            condition.condNow = 'Cloudy'
            break;

        case '4000': 
        case '4200': 
        case '4203': 
        case '4204': 
        case '4205': 
        case '4213': 
        case '4214': 
        case '4215':
            condition.condNow = 'Drizzling'
            break;

        case '4001': 
        case '4201': 
        case '4209': 
        case '4208': 
        case '4210': 
        case '4211': 
        case '4202': 
        case '4212':
            condition.condNow = 'Raining'
            break;

        case '5001': 
        case '5100': 
        case '5115': 
        case '5116': 
        case '5117': 
        case '5102': 
        case '5103': 
        case '5104':
            condition.condNow = 'Flurries'
            break;

        case '5000': 
        case '5101': 
        case '5105': 
        case '5106': 
        case '5107': 
        case '5119': 
        case '5120': 
        case '5121':
            condition.condNow = 'Snowing'
            break;

        case '6':
        case '7105':
        case '7115':
        case '7117':
        case '7106':
        case '7103':
            condition.condNow = 'Freezing Rain'
            break;
        
        case '8':
            condition.condNow = 'Thunderstorm'

        default:
            condition.condNow = 'Clear'
        break;
    }

    const codeSuffix = (((currHour >= sunset) && (currHour <= 23)) || ((currHour >= 0) && (currHour < sunrise)))
    ? true
    : false

    return displayFields.currentCondition = ((condition.condNow === 'Clear' || condition.condNow === 'Partly Cloudy') && (codeSuffix)) 
    ? condition.condNow + 'Night' 
    : condition.condNow
}

const displayHTML = () => {
    const elementArr = [...intervals];
    const { nineHour_Info: nineHour} =  apiComm   
    const displayArr = nineHour.map(object => object.temperature) 

    const curInfo = document.getElementById('current-info')
    const lastInfo = document.getElementById('last-info')

    degree.textContent = `${Math.floor(displayFields.currentTemp)}\u00B0`
    apparent.textContent = `${Math.floor(displayFields.currentApparent)}\u00B0`
    city.textContent = `${displayFields.locality()}, ${displayFields.state()}`

    const { humidity, visibility, precipitationProbability:percipProb, windSpeed } = nineHour[0] 
    curInfo.textContent = `${Math.floor(displayFields.currentTemp)}\u00B0`
    lastInfo.textContent = `${Math.floor(nineHour[8].temperature)}\u00B0`

    const visText = (apiComm.convention === 'imperial') ? `${Math.floor(visibility)}mi`:`${Math.floor(visibility)}km`;
    const windSpeedText = (apiComm.convention === 'imperial') ? `${Math.floor(windSpeed)}mph`: `${Math.floor(windSpeed)}km/h`;

    vis.textContent = visText
    windSpeedEl.textContent = windSpeedText

    humid.textContent = `${Math.floor(humidity)}%`
    percipProbEl.textContent = `${percipProb}%`

    elementArr.forEach((element, index) => {
        const wholeNum = Math.floor(displayArr[index])
        element.textContent = `${wholeNum}\u00B0` // + interpolated variable conatining appended unit
    });

    // console.log('Particular condition:', displayArr)
    console.log('Object Array:', nineHour)
}

const updateList = (paramArr) => {
    const paramArrLength = paramArr.length
    while ((searchBar.value === '' && oldChildren.length > 0) || (paramArrLength === 0 && oldChildren.length > 0)){
        for (let i = 0; i < oldChildren.length; i++) {
            loc_List.removeChild(loc_List.firstChild);
        }
    }

    for(let i = 0; i <= paramArrLength; i++){
        const locationLi = document.createElement('li');
        locationLi.setAttribute('class', 'location');
        locationLi.textContent = paramArr[i];
        loc_List.appendChild(locationLi);

        if (loc_List.children.length > 0) {
            loc_List.replaceChild(locationLi, loc_List.children[i]);
        }
        
        //Get Weather on click location 
        locationLi.addEventListener('click', 
        () => {
            searchBar.value = ''
            displayFields.chosenPlace = locationLi.textContent
            
            const { placesArr } = apiComm
            const { chosenPlace: choice } = displayFields
            const placesData = placesArr.find(place => place.matchedPlace === choice)
            
            localStorage.setItem('chosenPlace', displayFields.chosenPlace)
            localStorage.setItem('Coords', placesData.coord)
            // console.log(localStorage)

            getWeather();
        })
    }  
}

const toggleUnits = () => {
    const Fahr = document.getElementById('Fahr');
    const Cels = document.getElementById('Cels');
    
    if (Fahr.classList.contains('selected') || Cels.classList.contains('selected')){
        Fahr.classList.toggle('selected');
        Fahr.classList.toggle('unselected');
        Cels.classList.toggle('selected');
        Cels.classList.toggle('unselected');
    }  
    apiComm.convention = (Fahr.classList.contains('selected')) ? 'imperial' : 'metric';
    getWeather()
}  

const createTimelineHours = (currTime) => {
    const timelineHours = new Array(9)
    for (let i = 0; i < timelineHours.length; i++) {
        const meridiem = (currTime > 11 && currTime <= 23) ? 'PM' : 'AM';
        const alt_hour = (currTime > 12 && currTime <= 23) ? currTime - 12 : currTime;
        timelineHours[i] = (alt_hour > 23) ? `${alt_hour - 24} ${meridiem}`: `${alt_hour} ${meridiem}`;
        currTime += 1
    }
    return timelineHours
}

const clockTime = () => {

    //---------------------------Digital---------------------------//
    const dateIRL = new Date();

    const timeline = createTimelineHours(dateIRL.getHours())
    const digitalClock = document.getElementById('digital');
    
    const unalt_Hour = (dateIRL.getHours() > 12) ? dateIRL.getHours() - 12 : dateIRL.getHours();
    const Hour = (unalt_Hour === 0) ? `12` : unalt_Hour ;
    const Min = dateIRL.getMinutes();
    const Sec = dateIRL.getSeconds(); 

    const meridiem = (dateIRL.getHours() < 12) ? `AM` : `PM`;
    const minuteForm = (Min < 10) ? `0${Min}`: `${Min}`;

    digitalClock.textContent = `${Hour}:${minuteForm} ${meridiem}`;

    //---------------------------Analog---------------------------//
    const minHand = document.querySelector('.min-hand');
    const hourHand = document.querySelector('.hour-hand');
    const secHand = document.querySelector('.sec-hand');

    const secondsDegrees = ((Sec / 60) * 360) + 90;
    secHand.style.transform = `rotate(${secondsDegrees}deg)`;
    
    const minDegrees = ((Min / 60) * 360) + ((Sec/60)*6) + 90;
    minHand.style.transform = `rotate(${minDegrees}deg)`;
    
    const hourDegrees = ((Hour / 12) * 360) + ((Min/60)*30) + 90;
    hourHand.style.transform = `rotate(${hourDegrees}deg)`;

    //------------------------------Date & Time------------------------------//
    const todayDate = (dateIRL.getDate() < 10) ? `0${dateIRL.getDate()}` : `${dateIRL.getDate()}`;
    const nowDay = document.getElementById('day');
    const nowDate = document.getElementById('date');

    nowDay.textContent =`${week[dateIRL.getDay()]} -`
    nowDate.textContent = ` ${month[dateIRL.getMonth()]}/${todayDate}`;
    
    const tl_currentHour = document.getElementById('current-hour-at');
    const tl_lastHour = document.getElementById('last-hour-at');

    if(timeline.includes('0 AM')){
        const exists = timeline.findIndex(time => time === '0 AM')
        timeline[exists] = `12 AM`
    } 
    const timeArr = [tl_currentHour, ...timelineHrs, tl_lastHour]

    timeArr.forEach((timeAt, i) => {
        timeAt.textContent = timeline[i] // + interpolated variable conatining appended unit
    });
}
                        //---------------------------//
//==||==||==||==||==||==|| Server-Side Communication ||==||==||==||==||==||==//
                        //---------------------------//

searchBar.addEventListener('input', async () => {
    const data = { 
        input: searchBar.value 
    }    
    try {
        const response = await fetch('/input', {

            method: 'POST',
            headers: {"Content-Type" : "application/json"},
            body: JSON.stringify(data)

        })
        const loc_Obj = await response.json();
        apiComm.placesArr = loc_Obj.placeData;
        apiComm.suggestArr = loc_Obj.placeData.map(location => location.matchedPlace);
        
        const { suggestArr: suggest } = apiComm;
        updateList(suggest)   
    }
    catch(error) { 
        return error 
    }
    //Server response should be an array of the cities that are generated in the autocomplete
})

const getWeather = async () => {

    const URLparams = {
        unit: apiComm.convention,
        geolocation:[

            apiComm.lat(),
            apiComm.long()

        ]}

    try {
        const response = await fetch('/weather', {
    
            method: 'POST',
            headers: {"Content-Type" : "application/json"},
            body: JSON.stringify(URLparams)
    
        })
        const data = await response.json()

        apiComm.nineHour_Info = data.weatherInfo
        apiComm.weather_code = data.weatherInfo[0].weatherCode
        displayFields.currentTemp = data.weatherInfo[0].temperature
        displayFields.currentApparent = data.weatherInfo[0].temperatureApparent
        
    } catch (error) {
        console.log(error)
    }
    
    getPhoto()
    getCondIcon()
    displayHTML()
}

const getCondIcon = async () => {
    const { weather_code: code } = apiComm;
    const data = { currCondition: assessWeatherCond(code) }

    try {
        const response = await fetch('/code', {
    
            method: 'POST',
            headers: {"Content-Type" : "application/json"},
            body: JSON.stringify(data)
        })
        const info = await response.json();
        console.log(info)
        
    } catch (error) {
        console.log(error)
    }
    document.getElementById('condition-icon').src += '';
}

const getPhoto = async () => {

    const photoParams = {
        state: displayFields.state(),
    }

    try {
        const response = await fetch('/photo', {
    
            method: 'POST',
            headers: {"Content-Type" : "application/json"},
            body: JSON.stringify(photoParams),
            // SameSite:  
    
        })
        const { urlPhoto } = await response.json()
        document.body.style.backgroundImage = `url(${urlPhoto})`;
        // console.log(urlPhoto)

    } catch (error) {
        console.log(error)
    }
}

getWeather()
supers.addEventListener('click', toggleUnits);

setInterval(clockTime, 1000);
clockTime();