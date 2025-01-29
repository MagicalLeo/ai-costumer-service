
export type State = {
    displayNavigation: boolean;
    themeMode: "dark" | "light";
}

export enum ActionType {
  UPDATE = "UPDATE"
}

type UpdateAction = {
    type: ActionType.UPDATE;
    field: string;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    value: any;
}

export type Action = UpdateAction;

export const initialState: State = {
    displayNavigation: true,
    themeMode: "light",
}

export function reducer(state: State, action: Action): State {
    switch (action.type) {
        case ActionType.UPDATE:
            return {
                ...state,
                [action.field]: action.value,
            }
        default:
            throw new Error("Invalid action type");
    }
}