import { Ingredient } from "../../shared/ingredient.model";
import * as ShoppingListActionsImport from "./shopping-list.actions";

export interface ShoppingListState {
    ingredients: Ingredient[],
    editedIngredient: Ingredient,
    editedIngredientIndex: number,
}

export interface AppState {
    shoppingList: ShoppingListState
}

const initialState: ShoppingListState = {
    ingredients: [
        new Ingredient('Apples', 5),
        new Ingredient('Tomatoes', 4),
    ],
    editedIngredient: null,
    editedIngredientIndex: -1,
};

export function shoppingListReducer(state: ShoppingListState = initialState, action: ShoppingListActionsImport.ShoppingListActions) {
    switch (action.type) {
        case ShoppingListActionsImport.ADD_INGREDIENT:
            return {
                ...state,
                ingredients: [...state.ingredients, action.payload]
            };
        case ShoppingListActionsImport.ADD_INGREDIENTS:
            return {
                ...state,
                ingredients: [...state.ingredients, ...action.payload]
            };
        case ShoppingListActionsImport.UPDATE_INGREDIENT:
            const ingredient = state.ingredients[action.payload.index];
            const updatedIngredient = {
                ...ingredient,
                ...action.payload.newIngr,   //overwrite 
            };
            const updatedIngredients = [...state.ingredients];
            updatedIngredients[action.payload.index] = updatedIngredient;
            return {
                ...state,
                ingredients: updatedIngredients
            };
        case ShoppingListActionsImport.DELETE_INGREDIENT:
            return {
                ...state,
                ingredients: state.ingredients.filter((ingr, index) => {
                    return index !== action.payload;
                })
            };
        default:
            return state;
    }
}