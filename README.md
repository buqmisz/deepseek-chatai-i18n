DeepSeek Chat AI
DeepSeek Chat AI is a multilingual chatbot application built with Next.js, Next-Intl for internationalization, and a modern UI. It allows users to interact with a chatbot in multiple languages, manage chat history, and switch between different locales seamlessly.

Features
Multilingual Support: Supports multiple languages (e.g., English, Arabic) using next-intl.

Chatbot Interface: Interactive chatbot with a sidebar for managing chat history.

Local Storage: Saves chat history in the browser's local storage.

Responsive Design: Built with a responsive layout for desktop and mobile devices.

Dynamic Locale Switching: Users can switch between languages (e.g., /en for English, /ar for Arabic).

Technologies Used
Next.js: A React framework for server-rendered applications.

Next-Intl: For internationalization (i18n) and localization.

Tailwind CSS: For styling and responsive design.

React: For building the user interface.

TypeScript: For type-safe development.

Getting Started
Prerequisites
Node.js (v18 or higher)

npm or yarn

Installation
Clone the repository:

bash
Copy
git clone https://github.com/your-username/deepseek-chatai-i18n.git
cd deepseek-chatai
Install dependencies:

bash
Copy
npm install

# or

yarn install
Set up translation files:

Create a messages directory.

Add translation files for each supported locale (e.g., en.json, ar.json).

Start the development server:

bash
Copy
npm run dev

# or

yarn dev
Open your browser and navigate to:

http://localhost:3000/en for English.

http://localhost:3000/ar for Arabic.

Scripts
npm run dev: Start the development server.

npm run build: Build the application for production.

npm run start: Start the production server.

npm run lint: Run ESLint to check for code issues.

Contributing
Contributions are welcome! If you'd like to contribute, please follow these steps:

Fork the repository.

Create a new branch for your feature or bugfix.

Commit your changes and push to the branch.

Submit a pull request.

License
This project is licensed under the MIT License. See the LICENSE file for details.

Acknowledgments
Next.js Documentation

Next-Intl Documentation

Tailwind CSS Documentation

Enjoy using DeepSeek Chat AI! 🚀
