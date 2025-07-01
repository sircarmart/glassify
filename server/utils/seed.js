const { Cocktail } = require('../models');
const db = require('../config/connection');

async function seedCocktail () {

    const fetchData = await fetch("https://www.thecocktaildb.com/api/json/v1/1/random.php");
    const data = await fetchData.json();
    const exists = await Cocktail.findOne({name: data.drinks[0].strDrink}) // if we already have this cocktail in the database, we don't want to add it again
    
    if (exists) {

        return;
    }
    let ingArr = [];
    console.log("name: ", data.drinks[0].strDrink);
    console.log("instructions: ", data.drinks[0].strInstructions);
    console.log("alcoholic: ", data.drinks[0].strAlcoholic);
    console.log("glass: ", data.drinks[0].strGlass);
    console.log("image: ", data.drinks[0].strDrinkThumb);
    for(let i = 1; i <= 15; i++) {
        if(data.drinks[0][`strIngredient${i}`] != null) {
            ingArr.push(data.drinks[0][`strIngredient${i}`]);
        }
    }
    console.log("ingredients: ", ingArr);
    const stuff = await Cocktail.create({
        name: data.drinks[0].strDrink,
        alcoholic: data.drinks[0].strAlcoholic,
        glass: data.drinks[0].strGlass,
        instructions: data.drinks[0].strInstructions,
        ingredients: ingArr,
        image: data.drinks[0].strDrinkThumb
    }); 
}
db.once('open', async () => {
    for(let i = 0; i < 50; i++) {

        seedCocktail();
    }
})