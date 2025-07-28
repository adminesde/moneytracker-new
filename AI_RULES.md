# AI Development Rules for Personal Finance Tracking App

This document outlines the core technologies and specific library usage guidelines for developing this application. Adhering to these rules ensures consistency, maintainability, and optimal performance.

## Tech Stack Overview

*   **React**: The primary JavaScript library for building the user interface.
*   **TypeScript**: A typed superset of JavaScript, used for enhanced code quality and developer experience.
*   **Tailwind CSS**: A utility-first CSS framework for styling, enabling rapid and consistent UI development.
*   **Vite**: The build tool and development server, providing a fast and efficient development workflow.
*   **Shadcn/ui**: A collection of beautifully designed, accessible, and customizable UI components built with Radix UI and Tailwind CSS.
*   **Lucide React**: A library providing a comprehensive set of customizable SVG icons.
*   **jsPDF & jspdf-autotable**: Libraries used for generating dynamic PDF reports directly from the client-side.
*   **React Router**: The standard library for declarative routing within the application.
*   **Local Storage**: Utilized for client-side data persistence, specifically for managing transaction data.

## Library Usage Guidelines

*   **UI Components**:
    *   **Always** prioritize using components from `shadcn/ui` for common UI elements (e.g., buttons, forms, modals, cards).
    *   If a specific `shadcn/ui` component is not available or requires significant customization, create a new, dedicated component file. These custom components should still leverage Radix UI primitives (if applicable) and be styled exclusively with Tailwind CSS.
*   **Styling**:
    *   All styling must be implemented using **Tailwind CSS classes**. Avoid inline styles or separate CSS files unless absolutely necessary for specific third-party library integrations.
    *   Ensure designs are responsive across various screen sizes.
*   **Icons**:
    *   Use `lucide-react` for all icons throughout the application. Import icons directly from this library.
*   **PDF Generation**:
    *   For any functionality requiring PDF report generation, use `jspdf` and `jspdf-autotable`.
*   **Date Manipulation**:
    *   For advanced date formatting, parsing, or manipulation, utilize the `date-fns` library.
*   **Routing**:
    *   Implement all application navigation using `react-router-dom`. All primary routes should be defined and managed within `src/App.tsx`.
*   **State Management**:
    *   Prefer React's built-in `useState` and `useContext` hooks for local and global state management, respectively.
    *   Create custom hooks (e.g., `useTransactions`) for encapsulating reusable stateful logic and side effects.