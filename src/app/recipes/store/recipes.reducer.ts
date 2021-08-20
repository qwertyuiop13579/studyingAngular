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
        default:
            return state;
    }

}