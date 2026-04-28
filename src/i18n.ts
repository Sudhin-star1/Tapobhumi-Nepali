import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import en from "@/locales/en.json";
import hi from "@/locales/hi.json";

const STORAGE_KEY = "lang";

const saved = localStorage.getItem(STORAGE_KEY);
const fallbackLng = "en";
const initialLng = saved === "hi" || saved === "en" ? saved : fallbackLng;

i18n.use(initReactI18next).init({
  resources: {
    en: { translation: en },
    hi: { translation: hi },
  },
  lng: initialLng,
  fallbackLng,
  interpolation: { escapeValue: false },
});

i18n.on("languageChanged", (lng) => {
  localStorage.setItem(STORAGE_KEY, lng);
});

export default i18n;

