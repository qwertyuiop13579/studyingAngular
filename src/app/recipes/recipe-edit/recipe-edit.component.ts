import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { map } from 'rxjs/operators';

import { Recipe } from '../recipe.model';
import * as fromApp from 'src/app/store/app.reducer';
import * as RecipesActions from '../store/recipes.actions';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-recipe-edit',
  templateUrl: './recipe-edit.component.html',
  styleUrls: ['./recipe-edit.component.css']
})
export class RecipeEditComponent implements OnInit, OnDestroy {
  id: number;
  editMode = false;
  recipeForm: FormGroup;
  private storeSub: Subscription;


  constructor(private route: ActivatedRoute, private router: Router, private store: Store<fromApp.AppState>) { }

  ngOnInit(): void {
    this.route.params.subscribe((params: Params) => {
      this.id = +params['id'];
      this.editMode = params['id'] != null;
      this.initForm();
    });
  }
  private initForm() {

    let recipeName = '';
    let imagePath = '';
    let description = '';
    let Ingredients = new FormArray([]);

    if (this.editMode) {
      this.storeSub = this.store.select('recipes').pipe(map(recipesState => {
        return recipesState.recipes.find((recipe, index) => { return index === this.id });
      })).subscribe(recipe => {
        recipeName = recipe.name;
        imagePath = recipe.imagePath;
        description = recipe.description;
        if (recipe.ingredients.length) {
          for (let ingr of recipe.ingredients) {
            Ingredients.push(
              new FormGroup({
                'name': new FormControl(ingr.name, Validators.required),
                'amount': new FormControl(ingr.amount, [Validators.required, Validators.pattern(/^[1-9]+[0-9]*$/)])
              })
            )
          }
        }
      });
    }

    this.recipeForm = new FormGroup({
      'name': new FormControl(recipeName, Validators.required),
      'description': new FormControl(description, Validators.required),
      'imagePath': new FormControl(imagePath, Validators.required),
      'ingredients': Ingredients,
    });
  }

  onSubmit() {
    const newRecipe = new Recipe(this.recipeForm.value['name'], this.recipeForm.value['description'],
      this.recipeForm.value['imagePath'], this.recipeForm.value['ingredients']);
    if (this.editMode) {
      this.store.dispatch(new RecipesActions.UpdateRecipe({ index: this.id, recipe: newRecipe }));
    }
    else {
      this.store.dispatch(new RecipesActions.AddRecipe(newRecipe));
    }
    this.onCancel();
  }

  onCancel() {
    this.router.navigate(['../'], { relativeTo: this.route });
  }

  get controls() { // a getter!
    return (<FormArray>this.recipeForm.get('ingredients')).controls;
  }

  onAddIngredient() {
    (<FormArray>this.recipeForm.get('ingredients')).push(
      new FormGroup({
        'name': new FormControl(null, Validators.required),
        'amount': new FormControl(null, [Validators.required, Validators.pattern(/^[1-9]+[0-9]*$/)])
      }))
  }

  onDeleteIngredient(index: number) {
    (<FormArray>this.recipeForm.get('ingredients')).removeAt(index);
  }

  ngOnDestroy() {
    if (this.storeSub) {
      this.storeSub.unsubscribe();
    }
  }

}
