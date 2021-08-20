import { Statement } from "@angular/compiler";
import { Recipe } from "../recipe.model";
import * as fromRecipesActions from "./recipes.actions";

export interface RecipesState {
    recipes: Recipe[];
}
const initialState: RecipesState = {
    recipes: [],
}


export function RecipesReducer(state: RecipesState = initialState, action: fromRecipesActions.RecipesActions) {
    switch (action.type) {
        case fromRecipesActions.SET_RECIPES:
            return {
                ...state,
                recipes: [...action.payload]
            };
        case fromRecipesActions.ADD_RECIPE:
            return {
                ...state,
                recipes: [...state.recipes, action.payload]
            };
        case fromRecipesActions.UPDATE_RECIPE:
            const updatedRecipe = {
                ...state.recipes[action.payload.index],
                ...action.payload.recipe
            };
            const updatesRecipes = [...state.recipes];
            updatesRecipes[action.payload.index] = updatedRecipe;
            return {
                ...state,
                recipes: updatesRecipes,
            };
        case fromRecipesActions.DELETE_RECIPE:
            return {
                ...state,
                recipes: state.recipes.filter((recipe, index) => {
                    return index !== action.payload;
                })
            };
        default:
            return state;
    }

}