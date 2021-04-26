const CocktailReader = require('../lib/cocktailReader')

async function readCocktailList(){
    const cocktailReader = new CocktailReader()
    await cocktailReader.getCocktailInfo()
}
readCocktailList().then().catch(error => console.log(error))