export const getEntriesFromLocalStorage = () => {
    const storedEntries = localStorage.getItem('entries');
    let parsedStoredEntries;
    if (storedEntries) {
        parsedStoredEntries = JSON.parse(storedEntries);
    }
    else {
        parsedStoredEntries = [];
    }
    return parsedStoredEntries;
};
export const saveEntries = (entries) => {
    localStorage.setItem('entries', JSON.stringify(entries));
};
