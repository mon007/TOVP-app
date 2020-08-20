import I18n from "react-native-i18n";
import en from "./locales/en";
import russia from "./locales/russia";

I18n.fallbacks = true;

I18n.translations = {
  en,
  russia
};
export default I18n;
