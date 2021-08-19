import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Subscription } from 'rxjs';
import { Store } from '@ngrx/store';

import { Ingredient } from 'src/app/shared/ingredient.model';
import { ShoppingListService } from '../shopping-list.service';
import * as ShoppingListActions from '../store/shopping-list.actions';
import * as fromShoppingList from '../store/shopping-list.reducer';

@Component({
  selector: 'app-shopping-edit',
  templateUrl: './shopping-edit.component.html',
  styleUrls: ['./shopping-edit.component.css']
})
export class ShoppingEditComponent implements OnInit, OnDestroy {
  @ViewChild('f') slForm: NgForm;
  startEditSubscription: Subscription;
  editMode = false;
  editedItemIndex: number;
  editedItem: Ingredient;

  constructor(private slService: ShoppingListService, private store: Store<fromShoppingList.AppState>) { }

  ngOnInit(): void {
    this.startEditSubscription = this.slService.StartEdit.subscribe(
      (index: number) => {
        this.editMode = true;
        this.editedItemIndex = index;
        this.editedItem = this.slService.getIngredientByIndex(index);
        this.slForm.setValue({
          name: this.editedItem.name,
          amount: this.editedItem.amount
        });
      }
    );
  }
  onSubmit(form: NgForm) {
    const value = form.value;
    const newIngr = new Ingredient(value.name, value.amount);
    if (this.editMode) {
      //this.slService.UpdateIngredient(this.editedItemIndex, newIngr);
      this.store.dispatch(new ShoppingListActions.UpdateIngredient({ index: this.editedItemIndex, newIngr: newIngr }))
    }
    else {
      // this.slService.addIngredient(newIngr);
      this.store.dispatch(new ShoppingListActions.AddIngredient(newIngr));
    }
    this.editMode = false;
    form.reset();
  }

  onClear() {
    this.editMode = false;
    this.slForm.reset();
  }

  onDelete() {
    //this.slService.DeleteIngredient(this.editedItemIndex);
    this.store.dispatch(new ShoppingListActions.DeleteIngredient(this.editedItemIndex));
    this.editMode = false;
    this.slForm.reset();
  }

  ngOnDestroy() {
    this.startEditSubscription.unsubscribe();
  }

}
