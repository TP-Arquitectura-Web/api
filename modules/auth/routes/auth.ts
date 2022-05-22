import * as express from "express";
import { findUser, updateUserLogin, generateTokenPayload, register } from "./../controller/auth.controller";
import { Auth } from "./../auth.class";
import { AuthUsers } from "./../schemas/authUsers";

const bcrypt = require("bcrypt");

const sha1Hash = require("sha1");
const router = express.Router();

router.post("/login", async (req, res, next) => {
    console.log("Entra login", req.body);
    
    const login = async (user) => {
        let nombreCompleto =
            user.datosPersonales.nombres + " " + user.datosPersonales.apellido;
        
            console.log("Hace login: ", nombreCompleto)

        res.json({
            foto: user.foto,
            token: Auth.generateUserToken2(user.usuario, user, nombreCompleto),
        });
    };

    if (!req.body.usuario || !req.body.password) {
        return next(403);
    }

    try {
        const userResponse = await findUser(req.body.usuario);
        console.log("Usuario: ", userResponse)

        if (userResponse) {
            console.log("Entra: ", )
            const { user }: any = userResponse;
            const passwordSha1 = await bcrypt.compare(
                req.body.password,
                user.password
            );

            console.log("Pass status: ", passwordSha1)
            if (passwordSha1) {
                console.log("Pass OK: ")
                return login(user);
            }
        }
        return next(403);
    } catch (error) {
        return next(403);
    }
});

router.post("/register", async (req, res, next) => {
    let usuarioNuevo = await register(req, res);
    res.json(usuarioNuevo);
});

/**
 * Obtiene el user de la session
 * @get /api/auth/sesion
 */

router.get("/sesion", Auth.authenticate(), (req, res) => {
    res.json((req as any).user);
});

router.get("/usuarios", Auth.authenticate(), async (req, res, next) => {
    let data = await AuthUsers.find();
    res.json(data);
});

export = router;
