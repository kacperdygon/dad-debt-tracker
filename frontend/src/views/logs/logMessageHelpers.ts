import {ActionType, type IActionResponse} from "shared/dist";

export function constructLogMessage(action: IActionResponse): string {
    let logMessage = '';
    logMessage += action.authId.role;
    switch (action.actionType) {
        case ActionType.AddEntry:
            logMessage += ' added entry '

            break;
        case ActionType.UpdateEntry:
            logMessage += ' updated entry '

            break;
        case ActionType.RemoveEntry:
            logMessage += ' removed entry '

            break;
        case ActionType.ChangeEntryStatus:
            logMessage += ' changed status of entry '

            break;

    }

    logMessage += `with id ${action.targetId}`;

    return logMessage;

}