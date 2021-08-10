import {  EventEmitter } from '@angular/core';

import { Recipe } from "./recipe.model";

export class RecipeService{
    public selectedRecipe=new EventEmitter<Recipe>();
    private recipes:Recipe[]=[
        new Recipe('Test recipe','Test description','https://imagesvc.meredithcorp.io/v3/mm/image?url=https%3A%2F%2Fimages.media-allrecipes.com%2Fuserphotos%2F7782449.jpg'),
        new Recipe('Test recipe2','Test description2','https://imagesvc.meredithcorp.io/v3/mm/image?url=https%3A%2F%2Fimages.media-allrecipes.com%2Fuserphotos%2F7782449.jpg'),
      ];

      getRecipes(){
          return this.recipes.slice();
      }
}