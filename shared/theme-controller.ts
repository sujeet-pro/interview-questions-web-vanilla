// Theme Controller
function initThemeController() {
    // Get all theme radio buttons
    const themeRadios =
      document.querySelectorAll<HTMLInputElement>(".theme-controller");
  
    // Get current theme from session storage
    const currentTheme = sessionStorage.getItem("theme") || "default";
    console.log(themeRadios, currentTheme);
    // Set initial checked state
    themeRadios.forEach((radio) => {
      if (radio.value === currentTheme) {
        radio.checked = true;
      }
    });
  
    // Add change listener to handle theme updates
    themeRadios.forEach((radio) => {
      radio.addEventListener("change", (e) => {
        const target = e.target as HTMLInputElement;
        const theme = target.value;
  
        // Update session storage
        sessionStorage.setItem("theme", theme);
  
        // Update root element data-theme
        if (theme === "default") {
          document.documentElement.removeAttribute("data-theme");
        } else {
          document.documentElement.setAttribute("data-theme", theme);
        }
      });
    });
  }
  
  initThemeController()