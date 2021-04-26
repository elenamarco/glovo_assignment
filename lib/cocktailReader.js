const cocktailApi = require('./cocktailApi')

class CocktailReader {
    constructor() {
        this.completeCocktailList = []
        this.cocktailNamesList = {
            Total: 0,
            Names: []
        }
        this.cocktailWithMoreThan4Ingredients = []
        
    }
    async getCocktailInfo() {
        await this.getCocktailNamesList()
        console.log(`Cocktails beginning with G: `)
        console.log(this.cocktailNamesList)

        this.getCocktailsWithMoreThan4Ingredients()
        console.log(`Cocktails with more than 4 ingredients:`)
        this.cocktailWithMoreThan4Ingredients.forEach(drink => console.log(drink.strDrink))

        const parsedCocktailList = this.parseCocktailList()
        console.log(`Cocktails with just id/name/ingredients:`)
        console.log(parsedCocktailList)

        const updatedList = this.addIngredientInfo(parsedCocktailList)
        console.log(`Cocktails with ingredient quantities:`)
        console.log(JSON.stringify(updatedList, null, 4))

        const splittedList = this.splitByAlcoholicOrNonAlcoholic(updatedList)
        console.log(`Alcoholic / Non-alcoholic cocktails:`)
        console.log(JSON.stringify(splittedList, null, 4))


    }
    async getCocktailNamesList() {
        const { drinks } = await cocktailApi.readCompleteCocktailList()
        this.completeCocktailList = drinks
        drinks.forEach(cocktail => this.cocktailNamesList['Names'].push(cocktail.strDrink))
        this.cocktailNamesList.Total = drinks.length
    }
    getCocktailsWithMoreThan4Ingredients() {
        for (let drink of this.completeCocktailList) {
            if (drink.strIngredient5) this.cocktailWithMoreThan4Ingredients.push(drink)
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
            for (let ingredient = 5; ingredient <= 15; ingredient++) {
                if (drink[`strIngredient${ingredient}`]) parsedCocktail.ingredients.push(drink[`strIngredient${ingredient}`])
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
            let j = 1
            for (let ingredient of cocktailList[i].ingredients) {
                updatedList[i].ingredients.push({
                    name: ingredient,
                    quantity: this.cocktailWithMoreThan4Ingredients[i][`strMeasure${j}`]
                })
                j++
            }

        }
        return updatedList
    }
    splitByAlcoholicOrNonAlcoholic(parsedList){
        const splitted = {
            Alcoholic : [],
            Non_alcoholic : []
        }
        for(let i = 0; i< this.cocktailWithMoreThan4Ingredients.length ; i++){
            const drink = this.cocktailWithMoreThan4Ingredients[i]
            if(drink.strAlcoholic === 'Alcoholic') splitted.Alcoholic.push(parsedList[i])
            else if(drink.strAlcoholic === 'Optional alcohol') splitted.Non_alcoholic.push(parsedList[i])
        }
        return splitted
    }

}
module.exports = CocktailReader