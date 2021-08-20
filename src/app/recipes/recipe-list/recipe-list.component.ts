import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { map } from 'rxjs/operators';

import * as fromApp from 'src/app/store/app.reducer';
import { Recipe } from '../recipe.model';

@Component({
  selector: 'app-recipe-list',
  templateUrl: './recipe-list.component.html',
  styleUrls: ['./recipe-list.component.css']
})
export class RecipeListComponent implements OnInit, OnDestroy {
  recipes: Recipe[];
  RecipesChangedSubscription: Subscription;
  constructor(private route: ActivatedRoute, private router: Router, private store: Store<fromApp.AppState>) { }

  ngOnInit() {
    this.RecipesChangedSubscription = this.store.select('recipes')
      .pipe(map((recipeState) => {
        return recipeState.recipes;
      }))
      .subscribe((recipes: Recipe[]) => {
        this.recipes = recipes;
      });
  }

  onClickNewRecipeBtn() {
    this.router.navigate(['/recipes/new']);
  }
  ngOnDestroy() {
    this.RecipesChangedSubscription.unsubscribe();
  }

}
