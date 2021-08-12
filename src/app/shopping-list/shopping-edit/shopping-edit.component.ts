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
  @ViewChild('f') slForm:NgForm; 
  startEditSubscription: Subscription;
  editMode=false;
  editedItemIndex:number;
  editedItem:Ingredient;

  constructor(private slService: ShoppingListService) { }

  ngOnInit(): void {
    this.startEditSubscription = this.slService.StartEdit.subscribe(
      (index:number)=>{
        this.editMode=true;
        this.editedItemIndex=index;
        this.editedItem=this.slService.getIngredientByIndex(index);
        this.slForm.setValue({
          name:this.editedItem.name,
          amount:this.editedItem.amount
        });
      }
    );
  }
  onAddIngredient(form: NgForm) {
    const value = form.value;
    const newIngr = new Ingredient(value.name, value.amount);
    this.slService.addIngredient(newIngr);
  }
  ngOnDestroy() {
    this.startEditSubscription.unsubscribe();
  }

}
