import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Subscription } from 'rxjs';
import { Ingredient } from 'src/app/shared/ingredient.model';
import { ShoppingListService } from '../shopping-list.service';

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

  constructor(private slService: ShoppingListService) { }

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
      this.slService.UpdateIngredient(this.editedItemIndex, newIngr);
    }
    else {
      this.slService.addIngredient(newIngr);
    }
    this.editMode = false;
    form.reset();
  }

  onClear() {
    this.editMode = false;
    this.slForm.reset();
  }

  onDelete() {
    this.slService.DeleteIngredient(this.editedItemIndex);
    this.editMode = false;
    this.slForm.reset();
  }

  ngOnDestroy() {
    this.startEditSubscription.unsubscribe();
  }

}
