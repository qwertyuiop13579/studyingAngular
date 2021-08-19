import { User } from "../user.model";
import * as fromAuthActions from "./auth.actions";

export interface UserState {
    user: User
}

const InitialState: UserState = {
    user: null,
}

export function authReducer(state = InitialState, action: fromAuthActions.AuthActions) {
    switch (action.type) {
        case fromAuthActions.LOGIN: return {
            ...state,
            user: new User(action.payload.email, action.payload.userId, action.payload.token, action.payload.expirationDate)
        }
        case fromAuthActions.LOGOUT: return {
            ...state,
            user: null,
        }
        default:
            return state;
    }
}