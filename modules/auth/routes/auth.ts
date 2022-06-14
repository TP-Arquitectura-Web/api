import * as express from "express";
import { findUser } from "./../controller/auth.controller";
import { Auth } from "./../auth.class";

const bcrypt = require("bcrypt");

const sha1Hash = require("sha1");
const router = express.Router();

router.post("/login", async (req, res, next) => {
    const login = async (user) => {
        let nombreCompleto = user.datosPersonales.nombres + " " + user.datosPersonales.apellido;
        res.json({
            foto: user.foto,
            token: Auth.generateUserToken2(user.usuario, user, nombreCompleto),
        });
    };

    if (!req.body.email || !req.body.password) {
        return next(403);
    }

    try {
        const userResponse = await findUser(req.body.email);

        if (userResponse) {
            const { user }: any = userResponse;
            const passwordSha1 = await bcrypt.compare(
                req.body.password,
                user.password
            );

            if (passwordSha1) {
                return login(user);
            }
        }

        return next(403);
    } catch (error) {
        return next(403);
    }
});

export = router;
