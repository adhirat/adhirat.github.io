# Adhirat Technologies

Adhirat Technologies is a modern, responsive website template designed for tech companies and digital agencies. Built with a focus on performance, aesthetics, and maintainability.

## Features

- **Modern UI/UX**: Clean, glassmorphic design with subtle animations.
- **Responsive Layout**: Fully responsive grid system ensuring perfect rendering on all devices.
- **Dark Mode**: Built-in dark mode support with a toggle switch.
- **Modular Architecture**: HTML partials for Header, Footer, and Mobile Menu for easy maintenance.
- **Tailwind CSS**: Utility-first CSS framework for rapid styling.

## Technology Stack

- **HTML5**: Semantic markup.
- **Tailwind CSS**: For styling and responsive design.
- **Vanilla JavaScript**: For lightweight interactivity (theme toggle, mobile menu, dynamic loading).

## Project Structure

```
├── assets/
│   ├── css/
│   │   └── styles.css       # Custom styles and overrides
│   ├── images/
│   │   └── logo.svg         # Site logo
│   └── js/
│       └── app.js           # Bundled JavaScript (Config, Main logic, Loader)
├── global/
│   ├── header.html          # Reusable header component
│   ├── footer.html          # Reusable footer component
│   └── mobile-menu.html     # Reusable mobile menu component
├── index.html               # Main entry point
└── README.md                # Project documentation
```

## Setup & Usage

Since this project uses `fetch()` to load HTML partials dynamically, it **cannot** be run directly by opening the `index.html` file in a browser (due to CORS restrictions).

### Prerequisites
- Python 3.x (or any other local server tool like Node.js `http-server` or VS Code Live Server).

### Running Locally

1.  **Clone the repository**:
    ```sh
    git clone https://github.com/adhirat/adhirat.github.io.git
    cd adhirat.github.io
    ```

2.  **Start a local server**:
    Using Python:
    ```sh
    python3 -m http.server
    ```

3.  **Access the site**:
    Open your browser and navigate to `http://localhost:8000`.

## Customization

- **Theme**: Update tailwind configuration in the source or `app.js` to change colors.
- **Content**: Edit `index.html` for main page content.
- **Partials**: Edit files in `global/` to update Header, Footer, or Menu globally.

## License

© 2024 Adhirat Technologies. All rights reserved.