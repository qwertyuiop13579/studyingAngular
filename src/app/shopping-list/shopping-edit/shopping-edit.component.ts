import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Ingredient } from 'src/app/shared/ingredient.model';
import { ShoppingListService } from '../shopping-list.service';

@Component({
  selector: 'app-shopping-edit',
  templateUrl: './shopping-edit.component.html',
  styleUrls: ['./shopping-edit.component.css']
})
export class ShoppingEditComponent implements OnInit {
  @ViewChild('nameInput',{static:false}) NameInputRef:ElementRef;
  @ViewChild('amountInput',{static:false}) AmountInputRef:ElementRef;

  constructor(private slService:ShoppingListService) { }

  ngOnInit(): void {
  }
  onAddItem(){
    const ingName= this.NameInputRef.nativeElement.value;
    const ingAmount= this.AmountInputRef.nativeElement.value;
    this.slService.addIngredient(new Ingredient(ingName,ingAmount));
  }

}
