import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { Subject } from 'rxjs';

import { Ingredient } from '../shared/ingredient.model';
import { Recipe } from "./recipe.model";
import * as ShoppingListActions from '../shopping-list/store/shopping-list.actions';
import * as fromApp from '../store/app.reduser';

@Injectable()
export class RecipeService {

  recipesChanged = new Subject<Recipe[]>();

  // private recipes: Recipe[] = [
  //   new Recipe('Test recipe', 'Test description',
  //     'https://imagesvc.meredithcorp.io/v3/mm/image?url=https%3A%2F%2Fimages.media-allrecipes.com%2Fuserphotos%2F7782449.jpg',
  //     [new Ingredient('bread', 1), new Ingredient('milk', 100)]),
  //   new Recipe('Test recipe2', 'Test description2',
  //     'https://static.onecms.io/wp-content/uploads/sites/43/2020/07/22/8000900-2000.jpg',
  //     [new Ingredient('fish', 1), new Ingredient('tomato', 3)]),
  // ];
  private recipes: Recipe[] = [];

  constructor(private store: Store<fromApp.AppState>) {

  }

  getRecipes() {
    return this.recipes.slice();
  }

  getRecipeById(id: number) {
    return this.recipes.slice()[id];
  }

  setRecipes(recipes: Recipe[]) {
    this.recipes = recipes;
    this.recipesChanged.next(recipes.slice());
  }

  addIngredientsToShoppingList(ingredients: Ingredient[]) {
    this.store.dispatch(new ShoppingListActions.AddIngredients(ingredients));
    //this.shopListService.addIngredients(ingredients);
  }

  addRecipe(recipe: Recipe) {
    this.recipes.push(recipe);
    this.recipesChanged.next(this.recipes.slice());
  }

  updateRecipe(index: number, recipe: Recipe) {
    this.recipes[index] = recipe;
    this.recipesChanged.next(this.recipes.slice());
  }

  deleteRecipe(index: number) {
    this.recipes.splice(index, 1);
    this.recipesChanged.next(this.recipes.slice());
  }
}