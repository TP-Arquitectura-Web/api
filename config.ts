// import { Auth } from "./modules/auth/auth.class";

// const appMiddleware = [Auth.authenticate()];

// Habilita/deshabilita módulos de la API
export const modules = {
    auth: {
        active: true,
        path: "./modules/auth/routes",
        route: "/modules/auth",
    },
    llamada: {
        active: true,
        path: "./modules/llamada/routes",
        route: "/modules/llamada",
    }
};

// Cotas de consumo de APIs
export const defaultLimit = 50;
export const maxLimit = 1000;
