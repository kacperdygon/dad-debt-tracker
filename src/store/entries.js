var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { defineStore } from 'pinia';
import { computed, ref } from 'vue';
import { addEntryToFirestore, deleteEntryFromFirestore, editEntryFromFirestore, getEntriesFromFirestore } from '@/lib/database.ts';
export const useEntryStore = defineStore('entry', () => {
    const entries = ref([]);
    function fetchEntries() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                entries.value = yield getEntriesFromFirestore();
            }
            catch (error) {
                console.error('Error fetching entries:', error);
            }
        });
    }
    const lastEntries = computed(() => {
        return [...entries.value].sort((a, b) => new Date(b.timestamp.toDate()).getTime() - new Date(a.timestamp.toDate()).getTime());
    });
    const totalDebt = computed(() => {
        let totalDebt = 0;
        for (const entry of entries.value) {
            totalDebt += entry.balanceChange;
        }
        return totalDebt;
    });
    function addEntry(newEntry) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!newEntry) {
                return;
            }
            if (!(newEntry.timestamp && newEntry.balanceChange && newEntry.title)) {
                return;
            }
            const newEntryId = yield addEntryToFirestore(newEntry);
            entries.value.push(Object.assign(Object.assign({}, newEntry), { id: newEntryId }));
        });
    }
    function editEntry(entryId, newEntry) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!newEntry) {
                return;
            }
            if (!(newEntry.timestamp && newEntry.balanceChange && newEntry.title)) {
                return;
            }
            yield editEntryFromFirestore(entryId, newEntry);
            const index = entries.value.findIndex((entry) => entry.id === entryId);
            if (index !== -1) {
                entries.value[index] = Object.assign(Object.assign({}, newEntry), { id: entryId });
            }
        });
    }
    function deleteEntry(entryId) {
        return __awaiter(this, void 0, void 0, function* () {
            yield deleteEntryFromFirestore(entryId);
            const index = entries.value.findIndex((entry) => entry.id === entryId);
            if (index !== -1) {
                entries.value.splice(index, 1);
            }
        });
    }
    return { entries, lastEntries, totalDebt, addEntry, editEntry, deleteEntry, fetchEntries };
});
