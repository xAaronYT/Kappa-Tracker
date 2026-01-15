# Kappa Tracker Ultimate (v1.7)

A dedicated, high-performance desktop application for tracking progress toward the "Collector" quest and Lightkeeper milestones in Escape from Tarkov. Built with Electron for a native Windows experience.

## 🚀 Key Features (v1.7)

* **Triple-Bar Progress Tracking**: 
    * **Global Quests**: Overall completion of the Tarkov quest database.
    * **Kappa Tracker**: Specifically tracks the ~260 quests required for the Collector.
    * **Lightkeeper Access**: Monitor your path to the lighthouse.
* **Persistent Save System**: Progress is automatically saved to the Windows `%AppData%` folder, ensuring your data survives application updates and folder moves.
* **Industrial UI Overhaul**: 
    * **Grayscale-to-Color Logic**: Traders and items remain grayscale until unlocked or found.
    * **Pure CSS UI**: High-performance geometric dropdown arrows (no font-encoding issues).
    * **Tarkov Aesthetic**: Deep charcoal palette with "Trader Gold" accents.
* **Advanced Filtering**: One-click toggles to hide completed tasks or focus strictly on remaining Kappa/Lightkeeper requirements.
* **Integrated Wiki Access**: Direct links to the official Tarkov Wiki for every quest.

## 🛠️ Tech Stack

* **Framework**: Electron (v30+)
* **Frontend**: HTML5, CSS3 (Custom Variables), JavaScript (Vanilla)
* **Build Tool**: Electron Forge
* **Data Source**: Dynamic JSON Quest Database

## 📦 Installation (Standalone .exe)

1. Download the latest `Kappa.Tracker.Setup.exe` from the [Releases](https://github.com/xAaronYT/Kappa-Tracker/releases) page.
2. Run the installer.
3. Launch the application from your desktop or start menu.

## 💻 Development & Building

If you wish to build the project from source:

```powershell
# Install dependencies
npm install

# Run in development mode
npm start

# Create a standalone Windows Installer
npm run make
