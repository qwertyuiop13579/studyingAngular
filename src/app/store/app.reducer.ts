import * as fromShoppingList from '../shopping-list/store/shopping-list.reducer'
import * as fromAuth from '../auth/store/auth.reducer'
import * as fromRecipes from '../recipes/store/recipes.reducer';
import { ActionReducerMap } from '@ngrx/store'


export interface AppState {
    shoppingList: fromShoppingList.ShoppingListState;
    auth: fromAuth.UserState;
    recipes: fromRecipes.RecipesState;
}

export const AppReducer: ActionReducerMap<AppState> = {
    shoppingList: fromShoppingList.shoppingListReducer,
    auth: fromAuth.authReducer,
    recipes: fromRecipes.RecipesReducer,
};