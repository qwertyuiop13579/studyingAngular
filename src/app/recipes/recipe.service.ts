import {   Injectable } from '@angular/core';

import { Ingredient } from '../shared/ingredient.model';
import { ShoppingListService } from '../shopping-list/shopping-list.service';
import { Recipe } from "./recipe.model";

@Injectable()
export class RecipeService{

    private recipes:Recipe[]=[
        new Recipe('Test recipe','Test description',
        'https://imagesvc.meredithcorp.io/v3/mm/image?url=https%3A%2F%2Fimages.media-allrecipes.com%2Fuserphotos%2F7782449.jpg',
        [new Ingredient('bread',1),new Ingredient('milk',100)]),
        new Recipe('Test recipe2','Test description2',
        'https://static.onecms.io/wp-content/uploads/sites/43/2020/07/22/8000900-2000.jpg',
        [new Ingredient('fish',1),new Ingredient('tomato',3)]),
      ];

      constructor(private shopListService:ShoppingListService){

      }

      getRecipes(){
          return this.recipes.slice();
      }

      addIngredientsToShoppingList(ingredients:Ingredient[]){
        this.shopListService.addIngredients(ingredients);
      }

      getRecipeById(id:number){
        return this.recipes.slice()[id];
      }
}