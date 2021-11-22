function handle(data) {
    const source = $('#players-template').html()
    const template = Handlebars.compile(source)
    let newHtml = template({ players: data })
    $('#results').append(newHtml)
}