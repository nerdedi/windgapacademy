// Localization (i18n) utility
export const translations = {
  en: { welcome: "Welcome", help: "Help", error: "Error" },
  es: { welcome: "Bienvenido", help: "Ayuda", error: "Error" },
};
export function t(key, lang = "en") {
  return translations[lang][key] || key;
}
