// const Player = require('../server/routes/api')
// const p = require('../server/routes/api')

$('#search-btn').on('click', function () {
    $('#results').empty()
    let input = $('input').val()

    $.get(`/teams/${input}`, function (data) {
        handle(data)
    })
})

$('#results').on('click', '.player', function () {
    const data = { player: $(this).find('h2').html().trim() }
    let self = this
    let fullName = data.player.split(' ')
    if ($(this).hasClass('trans')) {
        $(this).removeClass('trans')
        $.ajax({
            method: "DELETE",
            url: `/dreamTeam/${fullName[1]}/${fullName[0]}`,
            success: function (res) { }
        })
    } else {
        $.post('/addPlayer', data, function (res) {
            if (res.stat == 'ok') {
                $(self).addClass('trans')
            }
        })
    }

})

$('#dream-btn').on('click', function () {
    $('#results').empty()

    $.get(`/dreamTeam`, function (data) {
        handle(data)
    })
})