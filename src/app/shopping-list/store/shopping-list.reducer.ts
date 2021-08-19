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
            const ingredient = state.ingredients[state.editedIngredientIndex];
            const updatedIngredient = {
                ...ingredient,
                ...action.payload   //overwrite 
            };
            const updatedIngredients = [...state.ingredients];
            updatedIngredients[state.editedIngredientIndex] = updatedIngredient;
            return {
                ...state,
                ingredients: updatedIngredients,
                editedIngredientIndex: -1,
                editedIngredient: null
            };
        case ShoppingListActionsImport.DELETE_INGREDIENT:
            return {
                ...state,
                ingredients: state.ingredients.filter((ingr, index) => {
                    return index !== state.editedIngredientIndex;
                }),
                editedIngredientIndex: -1,
                editedIngredient: null
            };
        case ShoppingListActionsImport.START_EDIT:
            return {
                ...state,
                editedIngredientIndex: action.payload,
                editedIngredient: { ...state.ingredients[action.payload] }

            };
        case ShoppingListActionsImport.STOP_EDIT:
            return {
                ...state,
                editedIngredientIndex: -1,
                editedIngredient: null
            };
        default:
            return state;
    }
}