// import { createContext, useContext, useEffect, useState } from "react";

// type Theme = "light" | "dark" | "system";

// interface ThemeContextType {
//   theme: Theme;
//   setTheme: (theme: Theme) => void;
// }

// const ThemeContext = createContext<ThemeContextType>({
//   theme: "system",
//   setTheme: () => {},
// });

// export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
//   const [theme, setTheme] = useState<Theme>(
//     () => (localStorage.getItem("theme") as Theme) || "system"
//   );

//   useEffect(() => {
//     const root = window.document.documentElement;
//     const systemDark = window.matchMedia(
//       "(prefers-color-scheme: dark)"
//     ).matches;

//     const appliedTheme =
//       theme === "system" ? (systemDark ? "dark" : "light") : theme;
//     root.classList.remove("light", "dark");
//     root.classList.add(appliedTheme);
//     localStorage.setItem("theme", theme);
//   }, [theme]);

//   return (
//     <ThemeContext.Provider value={{ theme, setTheme }}>
//       {children}
//     </ThemeContext.Provider>
//   );
// };

// export const useTheme = () => useContext(ThemeContext);

import { useEffect, useState } from "react";
import { ThemeContext, type Theme } from "./ThemeContext";

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const [theme, setTheme] = useState<Theme>(
    (localStorage.getItem("theme") as Theme) || "dark"
  );

  useEffect(() => {
    const root = window.document.documentElement;
    const systemDark = window.matchMedia(
      "(prefers-color-scheme: dark)"
    ).matches;

    const appliedTheme = systemDark ? "dark" : "light";

    root.classList.remove("light", "dark");
    root.classList.add(appliedTheme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};
