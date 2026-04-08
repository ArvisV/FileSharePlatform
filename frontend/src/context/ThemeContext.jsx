import { createContext, useState } from "react";

export const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {

  const [theme, setTheme] = useState("classic");

  const toggleTheme = () => {
    setTheme(theme === "classic" ? "hacker" : "classic");
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      <div className={theme}>
        {children}
      </div>
    </ThemeContext.Provider>
  );
};