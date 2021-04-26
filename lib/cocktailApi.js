const fetch = require('node-fetch')

async function readCompleteCocktailList() {
    const firstLetter = 'g'
    const url = `https://www.thecocktaildb.com/api/json/v1/1/search.php?f=${firstLetter}`

    const completeCocktailsList = await fetch(url, { method: 'GET' })
    return await completeCocktailsList.json()
}

module.exports = {readCompleteCocktailList}