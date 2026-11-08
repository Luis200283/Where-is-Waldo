import { createContext } from "react";

export const ActiveContext = createContext({
  active: false,
  toggleActive: (_toggle: boolean) => {},
  showGameTime: (_time: string) => {},
});
