export const modules = {
    auth: {
        active: true,
        path: "./modules/auth/routes",
        route: "/modules/auth",
    },
    envios: {
        active: true,
        path: "./modules/envios/routes",
        route: "/modules/envios",
    },
    rutas: {
        active: true,
        path: "./modules/rutas/routes",
        route: "/modules/rutas",
    }
};

// Cotas de consumo de APIs
export const defaultLimit = 50;
export const maxLimit = 1000;
