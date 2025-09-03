import { storageItems } from "./constants/storage-item-names";
import { getDateFromWarsaw } from "./date";
export function setStorageItem(name, value) {
  localStorage.setItem(name, JSON.stringify(value));
}

export function pushStorageArray(name, value) {
  const arr = localStorage.getItem(name)
    ? JSON.parse(localStorage.getItem(name))
    : [];
  arr.push(value);
  setStorageItem(name, arr);
}

export function resetStorageAndSetUpNewPlayDate() {
  Object.values(storageItems).forEach((item) => localStorage.removeItem(item));
  localStorage.setItem(storageItems.PLAY_DATE, getDateFromWarsaw());
}
