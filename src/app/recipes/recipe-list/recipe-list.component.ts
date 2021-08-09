import { Component, OnInit, Output,EventEmitter } from '@angular/core';

import { Recipe } from '../recipe.model';

@Component({
  selector: 'app-recipe-list',
  templateUrl: './recipe-list.component.html',
  styleUrls: ['./recipe-list.component.css']
})
export class RecipeListComponent implements OnInit {
  @Output() RecipeSelected= new EventEmitter<Recipe>(); 
  recipes:Recipe[]=[
    new Recipe('Test recipe','Test description','https://imagesvc.meredithcorp.io/v3/mm/image?url=https%3A%2F%2Fimages.media-allrecipes.com%2Fuserphotos%2F7782449.jpg'),
    new Recipe('Test recipe2','Test description2','https://imagesvc.meredithcorp.io/v3/mm/image?url=https%3A%2F%2Fimages.media-allrecipes.com%2Fuserphotos%2F7782449.jpg'),
  ];

  constructor() { }

  ngOnInit(): void {
  }

  onRecipeSelected(selectedRecipe:Recipe){
    this.RecipeSelected.emit(selectedRecipe);
  }
}
