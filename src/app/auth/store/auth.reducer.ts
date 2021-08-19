import { User } from "../user.model";
import * as fromAuthActions from "./auth.actions";

export interface UserState {
    user: User,
    authError: string,
    isLoading: boolean
}

const InitialState: UserState = {
    user: null,
    authError: null,
    isLoading: false,
}

export function authReducer(state = InitialState, action: fromAuthActions.AuthActions) {
    switch (action.type) {
        case fromAuthActions.AUTHENTICATE: return {
            ...state,
            user: new User(action.payload.email, action.payload.userId, action.payload.token, action.payload.expirationDate),
            authError: null,
            isLoading: false
        };
        case fromAuthActions.LOGOUT: return {
            ...state,
            user: null,
            authError: null,
        };
        case fromAuthActions.LOGIN_START: return {
            ...state,
            authError: null,
            isLoading: true,
        }
        case fromAuthActions.SIGNUP_START: return {
            ...state,
            authError: null,
            isLoading: true,
        }
        case fromAuthActions.AUTHENTICATE_FAILED: return {
            ...state,
            user: null,
            authError: action.payload,
            isLoading: false
        }
        case fromAuthActions.CLEAR_ERROR: return {
            ...state,
            authError: null,
        }
        default:
            return state;
    }
}