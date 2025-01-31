import { Message } from "@/types/Chat"

export type State = {
    displayNavigation: boolean
    themeMode: "dark" | "light"
    messageList: Message[]
    streamingId: string
}

export enum ActionType {
    UPDATE = "UPDATE",
    ADD_MESSAGE = "ADD_MESSAGE",
    UPDATE_MESSAGE = "UPDATE_MESSAGE",
}

type MessageAction = {
    type: ActionType.ADD_MESSAGE | ActionType.UPDATE_MESSAGE
    message: Message
}

type UpdateAction = {
    type: ActionType.UPDATE
    field: string
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    value: any
}

export type Action = UpdateAction | MessageAction

export const initState: State = {
    displayNavigation: true,
    themeMode: "light",
    messageList: [],
    streamingId: ""
}

export function reducer(state: State, action: Action) {
    switch (action.type) {
        case ActionType.UPDATE:
            return { ...state, [action.field]: action.value }
        case ActionType.ADD_MESSAGE: {
            const messageList = state.messageList.concat([action.message])
            return { ...state, messageList }
        }
        case ActionType.UPDATE_MESSAGE: {
            const messageList = state.messageList.map((message) => {
                if (message.id === action.message.id) {
                    return action.message
                }
                return message
            })
            return { ...state, messageList }
        }
        default: throw new Error()
    }
}