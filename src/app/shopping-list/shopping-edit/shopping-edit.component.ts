import { Component, ElementRef, OnInit, Output, ViewChild,EventEmitter } from '@angular/core';
import { Ingredient } from 'src/app/shared/ingredient.model';

@Component({
  selector: 'app-shopping-edit',
  templateUrl: './shopping-edit.component.html',
  styleUrls: ['./shopping-edit.component.css']
})
export class ShoppingEditComponent implements OnInit {
  @ViewChild('nameInput',{static:false}) NameInputRef:ElementRef;
  @ViewChild('amountInput',{static:false}) AmountInputRef:ElementRef;
  @Output() onAddedIngredient = new EventEmitter<Ingredient>();

  constructor() { }

  ngOnInit(): void {
  }
  onAddItem(){
    const ingName= this.NameInputRef.nativeElement.value;
    const ingAmount= this.AmountInputRef.nativeElement.value;
    this.onAddedIngredient.emit(new Ingredient(ingName,ingAmount));
  }

}
