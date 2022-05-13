const axios = require('axios')
const path = require('path')
const fs = require('fs');

const publicPath = path.join(__dirname, '../../public')

const express = require('express')
const app = express()
app.use(express.static(publicPath))
app.use(express.json());

require('dotenv').config()
const PORT = process.env.PORT ||  5500;
const weatherKEY = process.env.tmIO_KEY;
const geocodeKEY = process.env.geoKEY;
const photoKEY = process.env.photoKEY; 

//placeholder values 
const weatherAppParams = {
    lat: 43,
    long: 74,
    unit: 'imperial'
}

const weatherAPI = { 
    weatherInfo: [] 
}

const placesAPI = { 
    placeData: [] 
}

//------------------//---------Routes---------//------------------//

app.post('/input', (req, res) =>{
    const search = req.body.input

    const geocode = async () => {
        try {
            const response = await axios.get(`https://api.mapbox.com/geocoding/v5/mapbox.places/${search}.json?country=us&limit=8&types=postcode%2Cregion%2Clocality%2Cplace%2Cneighborhood&language=en&access_token=${geocodeKEY}`);
            const locations = response.data.features;

            placesAPI.placeData = locations.map(location => {
                return {
                    matchedPlace: location.place_name,
                    coord: location.center
                }
            })

        } catch (error) {
            console.error(error);
        }
        res.json(placesAPI)
        console.log('Places Sent');
    }
    geocode();
})

app.post('/weather', (req, res) => {
    const coords = req.body.geolocation
    weatherAppParams.unit = req.body.unit
    
    weatherAppParams.lat = coords[0]
    weatherAppParams.long = coords[1]
    const {lat, long, unit} = weatherAppParams

    const getWeather = async () => {
        try {
            const response = await axios.get(`https://api.tomorrow.io/v4/timelines?location=${lat},${long}&fields=sunriseTime&fields=sunsetTime&fields=weatherCode&fields=temperatureApparent&fields=windSpeed&fields=temperature&fields=precipitationType&fields=precipitationProbability&fields=visibility&fields=humidity&timesteps=1d&units=${unit}&apikey=${weatherKEY}`)
            const intervalArr = response.data.data.timelines[0].intervals

            for(let i = 0; i < 9; i++){
                weatherAPI.weatherInfo[i] = intervalArr[i].values
            }

        } catch (error) { 
            console.log(error) 
        } 
        res.json(weatherAPI)
        // console.log(coords);
    }
    getWeather()
})

app.post('/photo', (req, res) => {
    const photo = { urlPhoto:'' }
    const { state } = req.body;

    const getPhoto = async() => {
        try {
            const response = await axios.get(`https://api.unsplash.com/photos/random?query=${state}&client_id=${photoKEY}`);
            photo.urlPhoto = response.data.urls.regular;
        } catch (error) {
            console.log(error);
        }
        res.json(photo);
        console.log('Photo sent');
    }
    getPhoto();
})



app.post('/code', (req, res) => {
    const { currCondition: unaltered } = req.body;
    const condition = unaltered.replace(/\s+/g, '').toLowerCase();

    const IconFileManip = async () => {
        try {
            const myCurrPath = 'conditions_icon/' //condition.svg
            const dirOfTarget = '../../public/media/' //displayed.svg

            const files = await fs.promises.readdir(myCurrPath);
            const targetDir = await fs.promises.readdir(dirOfTarget)

            const targetFile = targetDir.find(file => file === 'displayed.svg')
            const fileToCopy = files.find(file => {
                return condition === file.split('.', 1).toString().toLowerCase()
            })

            const target = path.join(dirOfTarget, targetFile)
            const copyFrom = path.join(myCurrPath, fileToCopy)

            console.log(files)
            console.log(condition)
            console.log(targetFile)
            
            fs.copyFile(copyFrom, target, err => console.log('Error:',err))   

          } catch (error){
              console.log(error);
          }
          res.json({msg: 'response end'})
    }
    IconFileManip();
})

app.listen(PORT, console.log('Listening on port ' + PORT));