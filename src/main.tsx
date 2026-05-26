import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";

import { ThemeProvider } from "@/components/ui/theme";
import { createHashRouter, RouterProvider } from "react-router";
import Page from "./pages/app";
import CharacterEditPage from "./pages/character/page";



const router = createHashRouter([
    {
        path: "/",
        element: <Page />,
    },
    {
        path: "/character/:id",
        element: <CharacterEditPage />,
    },
]);

createRoot(document.getElementById("root")!).render(
    <StrictMode>
        <ThemeProvider>
            <RouterProvider router={router}></RouterProvider>
        </ThemeProvider>
    </StrictMode>
);
