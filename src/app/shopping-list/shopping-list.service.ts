import { EventEmitter } from '@angular/core';
import { Subject } from 'rxjs';

import { Ingredient } from "../shared/ingredient.model";

export class ShoppingListService {
    //ingredientsChanged = new EventEmitter<Ingredient[]>();
    ingredientsChanged = new Subject<Ingredient[]>();
    StartEdit = new Subject<number>();
    private ingredients: Ingredient[] = [
        new Ingredient('Apples', 5),
        new Ingredient('Tomatoes', 4),
    ];
    getIngredients() {
        return this.ingredients.slice();
    }

    getIngredientByIndex(index: number) {
        return this.ingredients[index];
    }

    addIngredient(ingredient: Ingredient) {
        this.ingredients.push(ingredient);
        this.ingredientsChanged.next(this.ingredients.slice());
    }

    addIngredients(ingredients: Ingredient[]) {
        this.ingredients.push(...ingredients);                    //ES6 feature spread
        this.ingredientsChanged.next(this.ingredients.slice());
    }

    UpdateIngredient(index: number, newIngr: Ingredient) {
        this.ingredients[index] = newIngr;
        this.ingredientsChanged.next(this.ingredients.slice());
    }

    DeleteIngredient(index: number) {
        this.ingredients.splice(index, 1);
        this.ingredientsChanged.next(this.ingredients.slice());
    }

}