import { Component, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';

import { Ingredient } from '../shared/ingredient.model';
import { ShoppingListService } from './shopping-list.service';
import * as fromShoppingList from './store/shopping-list.reducer';
@Component({
  selector: 'app-shopping-list',
  templateUrl: './shopping-list.component.html',
  styleUrls: ['./shopping-list.component.css'],
})
export class ShoppingListComponent implements OnInit, OnDestroy {
  ingredients: Observable<{ ingredients: Ingredient[] }>;
  // ingredientChangedSubscription: Subscription
  constructor(private shoppingListSrvice: ShoppingListService,
    private store: Store<fromShoppingList.AppState>) { }

  ngOnInit(): void {
    this.ingredients = this.store.select('shoppingList');
    // this.store.select('shoppingList').subscribe();
    // this.ingredients = this.shoppingListSrvice.getIngredients();
    // this.ingredientChangedSubscription = this.shoppingListSrvice.ingredientsChanged.subscribe((ingredients: Ingredient[]) => {
    //   this.ingredients = ingredients;
    // }); 
  }

  ngOnDestroy() {
    // this.ingredientChangedSubscription.unsubscribe();
  }
  onEditIngredient(index: number) {
    this.shoppingListSrvice.StartEdit.next(index);
  }
}
