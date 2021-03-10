const express = require('express');
const bodyParser = require('body-parser')
const got = require('got');
const dotenv = require('dotenv').config();
const app = express();
const port = process.env.PORT || 3330;

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

app.get('/', (req, res) => {
    res.render('index', { data: null, error: null });
})

app.post('/', async (req, res) => {
	try {
        // let city = process.argv[2];
        let apiKey = process.env.API_KEY;
        let { city } = req.body;
        console.log(req.body);
        if (city == undefined) {
            return res.status(403).json({ status: 403, msg: 'Please Enter Your City' })
        }
		else {
            const response = await got(`http://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`);        
            const data = JSON.parse(response.body)
            console.log(data.main);
            if(data.main == undefined) {
            res.render('index', {data: null, error: 'Error, please try again'});
        } else {
            let weatherText = `It's ${data.main.temp} degrees in ${data.name} !`;
            res.render('index', {data: weatherText, error: null});
        }
        console.log(req.body.city);
        }
		
	} catch (error) {
		console.log(error.response.body);
		
	}
});

app.listen(port, () => {
    console.log('Weather app listening on port 3330!');
})