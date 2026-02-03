export const localStorageHelper = {

    setItem(key: string, value: Object) {

        localStorage.setItem(key, JSON.stringify(value));

    },

    getItem(key: string, fallback: any) {

        const item = localStorage.getItem(key);
        return item ? JSON.parse(item) : fallback;

    }

}
