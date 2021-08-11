import { EventEmitter } from '@angular/core';
import { Subject } from 'rxjs';

import { Ingredient } from "../shared/ingredient.model";

export class ShoppingListService {
    //ingredientsChanged = new EventEmitter<Ingredient[]>();
    ingredientsChanged = new Subject<Ingredient[]>();
    private ingredients: Ingredient[] = [
        new Ingredient('Apples', 5),
        new Ingredient('Tonatoes', 4),
    ];
    getIngredients() {
        return this.ingredients.slice();
    }

    addIngredient(ingredient: Ingredient) {
        this.ingredients.push(ingredient);
        this.ingredientsChanged.next(this.ingredients.slice());
    }

    addIngredients(ingredients: Ingredient[]) {
        // for (let ingr of ingredients)
        // {
        //     this.ingredients.push(ingr);
        // }
        // this.ingredientsChanged.emit(this.ingredients.slice());
        this.ingredients.push(...ingredients);                    //ES6 feature spread
        this.ingredientsChanged.next(this.ingredients.slice());
    }

}