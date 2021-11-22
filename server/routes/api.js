const express = require('express')
const router = express.Router()
var urllib = require('urllib');
const DREAM_TEAM_SIZE = 5

class Player {
    constructor(obj) {
        this.fname = obj.firstName
        this.lname = obj.lastName
        this.number = obj.jersey
        this.active = obj.isActive
        this.teamId = obj.teamId
        this.pos = obj.pos
        this.id = obj.personId
        this.url = `https://nba-players.herokuapp.com/players/${this.lname}/${this.fname}`
    }

    isSamePlayer(player) {
        if (this.id === player.personId) {
            return true
        }
        return false
    }

    isSameName(first, last) {
        if (this.fname == first && this.lname == last)
            return true
        return false
    }

    get getName() {
        return `${this.fname} , ${this.lname}`
    }
}

const teamToIDs = {
    "lakers": "1610612747",
    "warriors": "1610612744",
    "heat": "1610612748",
    "suns": "1610612756"
}

let allPlayersArray = []

const dreamTeam = []


urllib.request('http://data.nba.net/10s/prod/v1/2018/players.json', function (err, data, res) {
    let newData = JSON.parse(data.toString()).league.standard
    for (let player of newData)
        allPlayersArray.push(player)
})


router.get('/teams/:teamName', function (req, response) {
    let playersArray = []
    if (teamToIDs.hasOwnProperty(req.params.teamName)) {

        // urllib.request('http://data.nba.net/10s/prod/v1/2018/players.json', function (err, data, res) {
        // let newData = JSON.parse(data.toString()).league.standard
        for (let p of allPlayersArray) {

            if (p.teamId === teamToIDs[req.params.teamName] && p.pos) {
                playersArray.push(new Player(p))
            }
        }

        response.send(playersArray)
        // })
    } else {
        response.send([])
    }
})


router.put('/team/:teamName/:teamId', function (req, res) {
    const data = { teamName: req.params.teamName, teamId: req.params.teamId }

    teamToIDs[data.teamName] = data.teamId
    console.log(data);
    res.end()
})

router.get('/dreamTeam', function (req, res) {
    res.send(dreamTeam)
})


router.post('/addPlayer', function (request, response) {
    let fullName = request.body.player.split(' ')
    let firstName = fullName[0],
        lastName = fullName[1]

    for (let p of allPlayersArray) {
        if (p.firstName === firstName &&
            p.lastName === lastName &&
            dreamTeam.length < DREAM_TEAM_SIZE) {

            //check if the player is saved already
            for (let player of dreamTeam)
                if (player.isSamePlayer(p)) {
                    // deletePlayer(player.fname, player.lname)
                    return
                }

            dreamTeam.push(new Player(p))
            response.send({ stat: 'ok' })
            break
        }
    }
})

router.delete('/dreamTeam/:last/:first', function (req, res) {
    const data = { last: req.params.last, first: req.params.first }
    for (let i = 0; i < dreamTeam.length; i++) {
        if (dreamTeam[i].isSameName(data.first, data.last)) {
            console.log('its same');
            dreamTeam.splice(i, 1)
        }
    }
    res.end()
})

module.exports = router