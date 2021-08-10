import {  EventEmitter, Injectable } from '@angular/core';
import { Ingredient } from '../shared/ingredient.model';
import { ShoppingListService } from '../shopping-list/shopping-list.service';

import { Recipe } from "./recipe.model";

@Injectable()
export class RecipeService{
    public selectedRecipe=new EventEmitter<Recipe>();
    private recipes:Recipe[]=[
        new Recipe('Test recipe','Test description',
        'https://imagesvc.meredithcorp.io/v3/mm/image?url=https%3A%2F%2Fimages.media-allrecipes.com%2Fuserphotos%2F7782449.jpg',
        [new Ingredient('bread',1),new Ingredient('milk',100)]),
        new Recipe('Test recipe2','Test description2',
        'https://imagesvc.meredithcorp.io/v3/mm/image?url=https%3A%2F%2Fimages.media-allrecipes.com%2Fuserphotos%2F7782449.jpg',
        [new Ingredient('bread',1),new Ingredient('milk',100)]),
      ];

      constructor(private shopListService:ShoppingListService){

      }

      getRecipes(){
          return this.recipes.slice();
      }

      addIngredientsToShoppingList(ingredients:Ingredient[]){
        this.shopListService.addIngredients(ingredients);
      }
}