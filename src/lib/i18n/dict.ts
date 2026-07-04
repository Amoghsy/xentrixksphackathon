import { usePrefs } from "@/stores/prefs";

const en = {
  chat: "Chat Assistant",
  dashboard: "Dashboard",
  network: "Criminal Network",
  map: "Crime Map",
  cases: "Case Search",
  offenders: "Offender Profiles",
  alerts: "Alerts",
  audit: "Audit Log",
  settings: "Settings",
  signIn: "Sign In",
  signOut: "Sign Out",
  search: "Search cases, FIRs, offenders…",
};

const kn: typeof en = {
  chat: "ಚಾಟ್ ಸಹಾಯಕ",
  dashboard: "ಡ್ಯಾಶ್‌ಬೋರ್ಡ್",
  network: "ಅಪರಾಧಿ ಜಾಲ",
  map: "ಅಪರಾಧ ನಕ್ಷೆ",
  cases: "ಪ್ರಕರಣ ಹುಡುಕಾಟ",
  offenders: "ಅಪರಾಧಿ ವಿವರ",
  alerts: "ಎಚ್ಚರಿಕೆಗಳು",
  audit: "ಆಡಿಟ್ ಲಾಗ್",
  settings: "ಸೆಟ್ಟಿಂಗ್‌ಗಳು",
  signIn: "ಪ್ರವೇಶಿಸಿ",
  signOut: "ನಿರ್ಗಮನ",
  search: "ಪ್ರಕರಣ, ಎಫ್‌ಐಆರ್, ಅಪರಾಧಿ ಹುಡುಕಿ…",
};

export type DictKey = keyof typeof en;

export function useT() {
  const lang = usePrefs((s) => s.lang);
  const dict = lang === "kn" ? kn : en;
  return (k: DictKey) => dict[k];
}
