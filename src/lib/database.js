var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import Cookies from 'js-cookie';
export var Role;
(function (Role) {
    Role["Admin"] = "admin";
})(Role || (Role = {}));
export const getEntriesFromFirestore = () => __awaiter(void 0, void 0, void 0, function* () {
});
export const addEntryToFirestore = (entry) => __awaiter(void 0, void 0, void 0, function* () {
});
export const editEntryFromFirestore = (entryId, entry) => __awaiter(void 0, void 0, void 0, function* () {
});
export const deleteEntryFromFirestore = (entryId) => __awaiter(void 0, void 0, void 0, function* () {
});
export function login(enteredPin) {
    return __awaiter(this, void 0, void 0, function* () {
        Cookies.set("pin", enteredPin);
        return true;
    });
}
export function getRole() {
    return __awaiter(this, void 0, void 0, function* () {
        const userPin = Cookies.get('pin');
        if (!userPin) {
            return null;
        }
    });
}
