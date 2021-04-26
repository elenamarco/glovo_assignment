const cocktailApi = require('./cocktailApi')

class CocktailReader {
    constructor() {
        this.completeCocktailList = []
        this.cocktailWithMoreThan4Ingredients = []
    }
    async getCocktailInfo() {
        const cocktails = await this.getCompleteCocktailList()
        console.log(`Cocktails Beginning with G: `)
        console.log(cocktails)

        this.getCocktailsWithMoreThan4Ingredients()
        console.log(`\n Cocktails with more than 4 ingredients:`)
        this.cocktailWithMoreThan4Ingredients.forEach(drink => console.log(drink.strDrink))

        const parsedCocktailList = this.parseCocktailList()
        console.log(`\n Cocktails with just id/name/ingredients:`)
        console.log(parsedCocktailList)

        const updatedList = this.addIngredientInfo(parsedCocktailList)
        console.log(`\n Cocktails with ingredient quantities:`)
        console.log(JSON.stringify(updatedList, null, 4))

        const splittedList = this.splitByAlcoholicOrNonAlcoholic(updatedList)
        console.log(`\n Alcoholic / Non-alcoholic cocktails:`)
        console.log(JSON.stringify(splittedList, null, 4))
    }
    async getCompleteCocktailList() {
        const { drinks } = await cocktailApi.readCocktailsByFirstLetter('g')
        this.completeCocktailList = drinks
    
        const cocktails = {
            Total : drinks.length,
            Names : []
        }
        drinks.forEach(cocktail => cocktails['Names'].push(cocktail.strDrink))
        return cocktails
    }
    getCocktailsWithMoreThan4Ingredients() {
        for (let drink of this.completeCocktailList) {
            if (drink.strIngredient5){
                this.cocktailWithMoreThan4Ingredients.push(drink)
            } 
        }
    }
    parseCocktailList() {
        const parsedList = []
        for (let drink of this.cocktailWithMoreThan4Ingredients) {
            const parsedCocktail = {
                name: drink.strDrink,
                id: drink.idDrink,
                ingredients: []
            }
            for (let ingredient = 1; ingredient <= 15; ingredient++) {
                if (drink[`strIngredient${ingredient}`]){
                    parsedCocktail.ingredients.push(drink[`strIngredient${ingredient}`])
                } 
                else break
            }
            parsedList.push(parsedCocktail)
        }
        return parsedList
    }
    addIngredientInfo(cocktailList) {
        let updatedList = []
        for (let i = 0; i < this.cocktailWithMoreThan4Ingredients.length; i++) {
            updatedList.push({
                name: cocktailList[i].name,
                id: cocktailList[i].id,
                ingredients: []
            })
            for (let j = 1; j <= cocktailList[i].ingredients.length; j++) {
                updatedList[i].ingredients.push({
                    name: this.cocktailWithMoreThan4Ingredients[i][`strIngredient${j}`],
                    quantity: this.cocktailWithMoreThan4Ingredients[i][`strMeasure${j}`]
                })
            }
        }
        return updatedList
    }
    splitByAlcoholicOrNonAlcoholic(parsedList) {
        const splitted = {
            Alcoholic: [],
            Non_alcoholic: []
        }
        for (let i = 0; i < this.cocktailWithMoreThan4Ingredients.length; i++) {
            const drink = this.cocktailWithMoreThan4Ingredients[i]
            if (drink.strAlcoholic === 'Alcoholic') splitted.Alcoholic.push(parsedList[i])
            else if (drink.strAlcoholic === 'Optional alcohol') splitted.Non_alcoholic.push(parsedList[i])
        }
        return splitted
    }

}
module.exports = CocktailReader