<div align="center">
 <img width="524" src="https://github.com/user-attachments/assets/73daa1c3-8cf0-4e02-adae-427b36a924a1" />
</div>


## [Lumitech](https://lumitech.co/) Next.js Template ⚡
The Lumitech Next.js Template provides a powerful and modern starting point for building fast, scalable, and maintainable web applications. With a clean architecture and pre-configured best practices, this template ensures that your development process is efficient and the project is production-ready.

### About Lumitech
[Lumitech](https://lumitech.co/) is a global custom software development company helping tech businesses build successful teams and innovative products. With a 600% growth since 2022, our team of engineers, AI/ML specialists, and product managers delivers high-quality software using the latest technologies.

### Why Use This Template? <br>
This template is designed to accelerate and simplify development by providing modern technologies, a well-structured architecture, and ready-to-use examples:

⚡ **Uses the latest and most modern technologies** – ```Zustand```, ```Tailwind```, ```TanStack Query```, ```Zod```, ```React Hook Form```, and more. <br>
📂 **Clear folder architecture (FSD)** – no need to think about where to place files; everything is structured and ready to use. <br>
📖 **Ready-to-use code examples** – quickly learn how to use key technologies with practical code snippets included in the template. <br>
⚙️ **Typed env file** – prevents errors with strict validation of environment variables. <br>
🖌️ **Smart Tailwind class merging** – automatically resolves style conflicts and simplifies working with dynamic classes. <br>
🖼️ **Built-in SVG support with SVGR** – import SVGs as React components and style them dynamically. <br>
📝 **Commitizen support** – makes writing commit messages easier and faster by guiding you through the process. <br>
🔗 **Clean import rules** – alias-based imports keep your code clean and eliminate long relative paths. <br>

Just grab it and start developing! 🚀



## 🛠️ Tech Stack
- [Typescript](https://www.typescriptlang.org/)
- [React](https://react.dev/)
- [Next.js](https://nextjs.org/docs)
- [Tailwind](https://tailwindcss.com/)
- [TanStack Query](https://tanstack.com/query/)
- [Zod](https://zod.dev/?id=basic-usage)
- [Zustand](https://zustand.docs.pmnd.rs/getting-started/introduction)
- [Axios](https://axios-http.com/docs/intro)
- [React Hook Forms](https://react-hook-form.com/)


## 📚 Getting Started
### 1. Install dependencies:
```bash
yarn install
```
### 2. Create a .env file:
```bash
cp .env.example .env
```
### 3. Run the development server:
```bash
yarn dev
```
</br>
You will have server running at:
- App - http://localhost:3000



## 📁 Project structure
```
├── public/
|     └── icons/                # Stores static assets like app icons (SVG files, etc.)
└── src/
    ├── app/                    # Contains the core application logic and structure
    |    ├── layout.tsx
    |    ├── page.tsx
    |    └── styles/            # Global application styles (CSS/SCSS)
    |          └── global.css   # Global styles applied across the app
    ├── widgets/
    ├── entities/
    ├── features/
    ├── shared/
    |      ├── constants/       # App-wide constants (e.g., enums, configuration values)
    |      ├── providers/       # Context providers and dependency injection
    |      ├── store/           # State management (e.g., Redux, Zustand)
    |      ├── hooks/           # Reusable React hooks
    |      ├── icons/           # Stores dynamic app icons (could be React components)
    |      ├── types/           # Shared TypeScript types and interfaces
    |      ├── lib/             # Utility functions and reusable helper libraries
    |      └── ui/              # UI components shared across the app
    └── env.ts                  # Configuration and validation of environment variables
```



## Guidelines
### 📝 Commits format
Commitlint is used to check if your commit messages meet the [conventional commit format](https://www.conventionalcommits.org/en/v1.0.0/). This format helps create a consistent, structured commit history, making it easier to understand the project’s development over time, automate changelog generation, and manage versioning.
The commit message format follows the pattern:
```
type(scope?): subject
```
#### Breakdown of Each Part:
- **type**: The type of change being made. It should be one of the defined commit types (see below).
- **scope** *(optional)*: A small context or part of the project that is being affected by the commit (e.g., `api`, `ui`, `auth`). This is optional but helps to narrow down the area of change.
- **subject**: A short and concise description of what the commit does.
#### Real world examples can look like this:
```
chore: run tests on travis ci
```
```
fix(stepper): update button actions
```
```
feat(passenger): add comment section
```
Common types according to [commitlint-config-conventional](https://github.com/conventional-changelog/commitlint/tree/master/@commitlint/config-conventional#type-enum) can be:
* **build**: Changes related to the build system or external dependencies.
* **ci**: Updates to the continuous integration configuration or scripts.
* **chore**: Routine tasks, maintenance, or general updates.
* **docs**: Changes to documentation.
* **feat**: Introduces a new feature for the user or customer.
* **fix**: Resolves a bug or fixes an issue.
* **perf**: Improvements related to performance.
* **refactor**: Code restructuring that does not change its external behavior.
* **revert**: Reverts a previous commit.
* **style**: Changes that do not affect the code's logic (e.g., formatting).
* **test**: Adds or modifies tests.
#### Use Commitizen to Commit
Once you’ve installed all the required libraries, run ```yarn install```. After everything is set up, when you run ```git commit```, Commitizen will automatically trigger and ask you to choose the type of commit, enter a scope (if applicable), and provide a subject for your commit.
</br>
To start the commit redactor, simply run:
```
git add .
git commit
```
#### What Happens During the Commit Process:
- **Commit Type**: You will be prompted to select the type of change (e.g., feat, fix, chore, etc.).
- **Scope** (optional): You will be asked to provide a scope (e.g., auth, ui, etc.).
- **Subject**: Finally, you'll be asked to enter a short description of what the commit does.

<br>

### 🌍🖼️ Nextjs External Images
Next.js has built-in support for optimizing images using the next/image component. However, by default, Next.js blocks external images unless explicitly allowed. This guide explains how to configure Next.js to permit images from external domains.
#### Configuration
To enable images from external sources, modify your ```next.config.mjs``` file and add the ```images``` configuration with ```remotePatterns```.
#### Steps:
1. Open your Next.js project.
2. Locate the next.config.mjs file (or create one if it doesn't exist).
3. Add or modify the images configuration to allow remote sources.
#### Example Configuration
```
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'firebasestorage.googleapis.com',
        pathname: '/v0/b/**',
      },
    ],
  },
  ...
};
```
#### Explanation
* ```images.remotePatterns``` defines an array of allowed remote image sources.
* Each entry consists of:
    * **protocol**: Allowed protocol (e.g., ```https```).
    * **hostname**: External domain where images are hosted.
    * **pathname**: Path pattern for image URLs.
#### Usage Example
Once configured, you can use external images with the ```next/image``` component:
```
<Image
  src="https://firebasestorage.googleapis.com/v0/b/example-bucket/o/image.jpg"
  width={500}
  height={300}
  alt="Example Image"
/>
```
#### Troubleshooting
* If images do not load, ensure the domain is correctly added in ```remotePatterns```.
* If running locally, restart the Next.js server after modifying ```next.config.mjs```.

<br>

### 🖼️ Using SVGs
Our template supports using SVGs as React components with SVGR.
#### 🚀 Using SVG as React Components
You can store SVG icons inside the ```shared/icons``` folder and import them as components.
##### 📁 Folder Structure
```
├── src/
|     └── shared/
|           └── icons/
|                 └──test-icon.svg
```
##### ✅ How to Use
```
import { TestIcon } from "shared/icons";

const ExampleComponent = () => {
  return (
    <TestIcon width={50} height={50} color="red" />
  );
};

export default ExampleComponent;
```
##### 📌 When to Use This
* When you need to style SVGs with Tailwind or props (```width```, ```color```, ```fill```).
* When using SVGs as inline components in React.
* When you want flexibility with dynamic styling.

This setup ensures flexibility, allowing you to choose the best method depending on your use case. 🚀

<br>

### 🖌️ Tailwind CSS Class Merging Guide
When working with dynamic classes in Tailwind CSS, class merging helps avoid conflicts and simplifies styling. We use ```clsx``` and ```tailwind-merge``` to efficiently combine classes, ensuring cleaner and more maintainable code.

#### Example
##### ❌ Without Merging Classes
```
const Button = ({ primary, disabled }: { primary: boolean, disabled: boolean }) => {
  return (
    <button className={`px-4 py-2 ${primary ? 'bg-blue-500' : 'bg-gray-500'} ${disabled ? 'bg-gray-300 cursor-not-allowed' : 'hover:bg-opacity-80'}`}>
      Click me
    </button>
  );
};
```

##### ✅ With Class Merging

```
const Button = ({ primary, disabled }: { primary: boolean, disabled: boolean }) => {
  return (
    <button className={cn(
      'px-4 py-2 rounded-lg text-white',
      primary ? 'bg-blue-500' : 'bg-gray-500',
      disabled && 'bg-gray-300 cursor-not-allowed',
      !disabled && 'hover:bg-opacity-80'
    )}>
      Click me
    </button>
  );
};
```

<br>

### ⚙️ Typed Environment Configuration with Example
This setup uses typed environment variables to validate configuration, reducing runtime errors by ensuring all required variables are provided and preventing issues with non-existent variables.

**Example:**
```
import { createEnv } from '@t3-oss/env-nextjs';
import { z } from 'zod';

const env = createEnv({
  client: {
    // Client-side variables must be prefixed with NEXT_PUBLIC_ to be exposed to the browser
    NEXT_PUBLIC_API_URL: z.string(),
    NEXT_PUBLIC_NODE_ENV: z.enum(['production', 'development', 'test']),
  },
  server: {
    NEXT_AUTH_SESSION_EXPIRED: z.string(),
  },
  runtimeEnv: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
    NEXT_PUBLIC_NODE_ENV: process.env.NEXT_PUBLIC_NODE_ENV,
    NEXT_AUTH_SESSION_EXPIRED: process.env.NEXT_AUTH_SESSION_EXPIRED,
  },
});

export { env };
```

**Example of how to access an environment variable**
```
const apiUrl = env.NEXT_PUBLIC_API_URL; // Access client-side variable
const sessionExpired = env.NEXT_AUTH_SESSION_EXPIRED; // Access server-side variable
```

<br>

### 🔗 Properly Using Import Aliases in Your Project
In this template, import aliases are preconfigured for you, so you don’t need to worry about setting them up. You can use these aliases to simplify your imports, making the code cleaner and more maintainable.

How to Use Import Aliases:
Once the alias configuration is set up, you can start using them in your imports right away.

**Basic Import:** With the aliases, you can import modules using simple, clear paths:
```
import { UserModel } from 'entities';
import { LoginButton } from 'features';
import { fetchData } from 'shared/utils';
```
**Avoid Deep Imports:** Keep your imports at the high-level feature or domain folder to maintain modularity. Don’t reference deep subdirectories.
```
// ✅ Good: import from a high-level alias
import { LoginForm } from 'features';

// ❌ Avoid: deep imports from specific subdirectories
import { LoginForm } from 'features/auth/login/LoginForm';
```

We provide predefined aliases like ```entities```, ```features```, ```widgets```, ```shared/constants```, ```shared/hooks```, ```shared/lib```, ```shared/ui```, ```shared/icons```, ```shared/types```, ```shared/providers```, and ```shared/store``` to keep your imports clean and structured. <br>
Instead of writing long relative paths like ```../../../shared/ui/button```, you can simply use ```shared/ui```. 
This makes the code easier to read, more modular, and consistent across the project.

If needed, you can modify or add aliases in ```.eslintrc.js``` under the ```no-restricted-imports``` rule.
