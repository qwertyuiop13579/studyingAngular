import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';

import { Ingredient } from '../shared/ingredient.model';
import { ShoppingListService } from './shopping-list.service';
@Component({
  selector: 'app-shopping-list',
  templateUrl: './shopping-list.component.html',
  styleUrls: ['./shopping-list.component.css'],
})
export class ShoppingListComponent implements OnInit, OnDestroy {
  ingredients: Ingredient[];
  ingredientChangedSubscription: Subscription
  constructor(private shoppingListSrvice: ShoppingListService) { }

  ngOnInit(): void {
    this.ingredients = this.shoppingListSrvice.getIngredients();
    this.ingredientChangedSubscription = this.shoppingListSrvice.ingredientsChanged.subscribe((ingredients: Ingredient[]) => {
      this.ingredients = ingredients;
    });
  }

  ngOnDestroy() {
    this.ingredientChangedSubscription.unsubscribe();
  }
}
