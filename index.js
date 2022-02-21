const express = require("express");
const axios = require("axios");
const cheerio = require("cheerio");
const { response } = require("express");
const { all } = require("express/lib/application");
const { replaceWith } = require("cheerio/lib/api/manipulation");
const app = express();

const PORT = process.env.PORT || 6969;

function getAddressNoFilter(season, category) {
    return 'https://formula1.com/en/results.html/' + season + '/' + category + '.html';
}

function getAddressFilter(season, category, filter) {
    if (category === "races") {

    } else if (category === "drivers") {
        const allNames = filter.split('-');
        const nameCode = allNames[0].toUpperCase().slice(0, 3) + allNames[allNames.length - 1].toUpperCase().slice(0, 3) + "01";
        return 'https://formula1.com/en/results.html/' + season + '/' + category + '/' + nameCode + '/' + filter + '.html';

    } else if (category === "team") {
        const teamNameWords = filter.split('-')
        const newTeamCode = teamNameWords.join('_')
        return 'https://formula1.com/en/results.html/' + season + '/' + category + '/' + newTeamCode + '.html';
    }

}

app.get('/', (req, res) => {
    res.json("Welcome to my Formula 1 web API")
})

app.get('/:season/:category/all', (req, res) => {
    const result = [];
    axios.get(getAddressNoFilter(req.params.season, req.params.category))
        .then(response => {
            const html = response.data
            const $ = cheerio.load(html)

            let index = 0;
            $('tr').each(function () {
                let data = $(this).text();

                data = data.trim();
                data = data.replace(/\s\s+/g, " ");
                data = data.split(" ");

                if (index == 0) {

                }
                else {

                    if (req.params.category === "drivers") {

                        let teamName = "";
                        for (let i = 0; i < data.length; i++) {
                            if (i > 4 && i < (data.length - 1)) {
                                teamName += data[i] + " ";
                            }
                        }

                        result.push({
                            pos: data[0],
                            driver: data[1] + " " + data[2],
                            nationality: data[4],
                            team: teamName.trim(),
                            pts: data[data.length - 1]
                        });

                    }
                    else if (req.params.category === "races") {

                        let gpName = "";
                        let teamName = "";

                        if(data[6][1] != data[6][1].toUpperCase()){
                            gpName = data[0] + " " + data[1];
                            for(let i = 0; i < data.length; i++){
                                if(i > 7 && i < data.length - 2){
                                    teamName += data[i] + " ";
                                }
                            }
                        }
                        else{
                            gpName = data[0];
                            for(let i = 0; i < data.length; i++){
                                if(i > 6 && i < data.length - 2){
                                    teamName += data[i] + " ";
                                }
                            }
                        }

                        result.push({
                            grandPrix: gpName,
                            date: data[gpName.split(" ").length] + " " + data[gpName.split(" ").length + 1] + " " + data[gpName.split(" ").length + 2],
                            driver: data[gpName.split(" ").length + 3] + " " + data[gpName.split(" ").length + 4],
                            team: teamName.trim(),
                            laps: data[data.length - 2],
                            raceTime: data[data.length - 1]
                        });

                    }
                    else if (req.params.category === "team") {

                        let teamName = "";
                        for (let i = 0; i < data.length; i++) {
                            if (i > 0 && i < (data.length - 1)) {
                                teamName += data[i] + " ";
                            }
                        }

                        result.push({
                            pos: data[0],
                            team: teamName.trim(),
                            pts: data[data.length - 1]
                        });

                    }
                    else if (req.params.category === "fastest-laps") {

                        let gpName = "";
                        let teamName = "";

                        if(data[3][1] != data[3][1].toUpperCase()){
                            gpName = data[0] + " " + data[1];
                            for(let i = 0; i < data.length; i++){
                                if(i > 4 && i < data.length - 1){
                                    teamName += data[i] + " ";
                                }
                            }
                        }
                        else{
                            gpName = data[0];
                            for(let i = 0; i < data.length; i++){
                                if(i > 3 && i < data.length - 1){
                                    teamName += data[i] + " ";
                                }
                            }
                        }
                        console.log(data)

                        result.push({
                            grandPrix: gpName,
                            driver: data[gpName.split(' ').length] + " " + data[gpName.split(' ').length + 1],
                            team: teamName.trim(),
                            lapTime: data[data.length - 1]
                        });


                    }

                }

                index++;
            })

            res.json(result)
        }).catch(err => console.log(err))
})

app.get('/:season/:category/:filter', (req, res) => {
    const result = [];
    axios.get(getAddressFilter(req.params.season, req.params.category, req.params.filter))
        .then(response => {
            const html = response.data
            const $ = cheerio.load(html)

            let index = 0;
            $('tr').each(function () {
                let data = $(this).text();

                data = data.trim();
                data = data.replace(/\s\s+/g, " ");
                data = data.split(" ");

                if (index == 0) {

                }
                else {
                    if (req.params.category === "drivers") {

                        let gpName = "";
                        let teamName = "";

                        if(data[3][1] != data[3][1].toUpperCase()){
                            gpName = data[0] + " " + data[1];
                            for(let i = 0; i < data.length; i++){
                                if(i > 4 && i < data.length - 2){
                                    teamName += data[i] + " ";
                                }
                            }
                        }
                        else{
                            gpName = data[0];
                            for(let i = 0; i < data.length; i++){
                                if(i > 3 && i < data.length - 2){
                                    teamName += data[i] + " ";
                                }
                            }
                        }

                        result.push({
                            grandPrix: gpName,
                            date: data[gpName.split(" ").length] + " " + data[gpName.split(" ").length + 1] + " " + data[gpName.split(" ").length + 2],
                            team: teamName.trim(),
                            pos: data[data.length - 2],
                            pts: data[data.length - 1]
                        });

                    }
                    else if (req.params.category === "races") {

                        

                    }
                    else if (req.params.category === "team") {

                        let gpName = "";
                        for (let i = 0; i < data.length; i++) {
                            if (i < data.length - 4) {
                                gpName += data[i] + " ";
                            }
                        }

                        result.push({
                            grandPrix: gpName.trim(),
                            date: data[data.length - 4] + " " + data[data.length - 3] + " " + data[data.length - 2],
                            pts: data[data.length - 1]
                        });

                    }
                }

                index++;
            })

            res.json(result)
        }).catch(err => console.log(err))
})

app.listen(PORT, () => console.log('Listening on port 6969'));