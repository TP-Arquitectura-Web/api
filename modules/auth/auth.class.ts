import * as express from "express";
import * as mongoose from "mongoose";
import * as passport from "passport";
import * as passportJWT from "passport-jwt";
import * as jwt from "jsonwebtoken";
import * as configPrivate from "./../../config.private";
import { removeDiacritics } from "./../../utils/utils";

export declare type ObjectId = string;

export class Auth {
    /**
     *  TTL JWT Token
     *  @var expiresIn {number}
     *
     * @memberOf Auth
     */

    static expiresIn = '12h'; /* 12 horas */
    static expiresAPP = 60 * 60 * 24 * 180; /* 10 días */

    /**
     * Version de token para APP's
     *
     */

    static generateAppToken(
        nombre: string,
        organizacion: ObjectId = null,
        permisos?
    ): any {
        // Crea el token con los datos de sesión
        const token: any = {
            nombre: removeDiacritics(nombre),
            organizacion,
            permisos,
            type: "app-token",
        };
        return jwt.sign(token, configPrivate.auth.jwtKey, {
            expiresIn: this.expiresAPP,
        });
    }

    /**
     * Version dos del token. Con menos datos.
     * Solo posee el username y la organización.
     */

    static generateUserToken2(
        username: any,
        data: any,        
        nombreCompleto: string        
    ): any {
        // Crea el token con los datos de sesión
        const token: any = {
            id: new mongoose.Types.ObjectId(),
            usuario: username,
            nombreCompleto: removeDiacritics(nombreCompleto),            
            email: data.email,            
            type: "user-token-2",
        };
        console.log('Tokennnnn: ', token)
        return jwt.sign(token, configPrivate.auth.jwtKey, {
            expiresIn: this.expiresIn,
        });
    }

    /**
     * Autentica la ejecución de un middleware
     *
     * @static
     * @returns Middleware de Express.js
     *
     * @memberOf Auth
     */
    static authenticate() {
        return [
            passport.authenticate("jwt", { session: false }),
            this.appTokenProtected(),
            this.extractToken(),
            this.recovertPayloadMiddleware(),
        ];
    }

    /**
     * Middleware para controlar los apps token.
     * Controla que el token esta almacenado en la DB.
     * @memberOf Auth
     */
    static appTokenProtected() {
        return async (req, res, next) => {
            //  console.log(req.user);
            if (req.user.type === "app-token") {
                let token;
                if (req.headers && req.headers.authorization) {
                    token = req.headers.authorization.substring(4);
                } else if (req.query.token) {
                    token = req.query.token;
                } else {
                    next(403);
                }
            } else {
                next();
            }
        };
    }

    /**
     * Extrack token middleware
     */

    static extractToken() {
        return (req, _res, next) => {
            if (req.headers && req.headers.authorization) {
                req.token = req.headers.authorization.substring(4);
            } else if (req.query.token) {
                req.token = req.query.token;
            }
            next();
        };
    }

    /**
     * A partir de un token cargar el payload en el request asi sigue la Aplicaicon como corresponde.
     * Cargar permisos, usuarios, organizacion, profesional, etc.
     */
    static recovertPayloadMiddleware() {
        return async (req, res, next) => {
            if (req.user.type === "user-token-2" && req.user.organizacion) {
                const { getTokenPayload } = require("./controller/auth.controller");
                const payload = await getTokenPayload(req.token, req.user);
                console.log('Payload: ', payload)
                req.user = {
                    id: req.user.id,
                    type: req.user.type,
                    account_id: req.user.account_id,
                    foto: req.user.foto,
                    email: req.user.email,
                    usuario: payload.usuario,
                    profesional: payload.profesional,
                    permisos: payload.permisos,
                    organizacion: payload.organizacion,
                };
                return next();
            } else {
                return next();
            }
        };
    }

    /**
     * Inicializa el middleware de auditoría para JSON Web Token
     *
     * @static
     * @param {express.Express} app aplicación de Express
     *
     * @memberOf Auth
     */
    static initialize(app: express.Express) {
        // Configura passport para que utilice JWT
        passport.use(
            new passportJWT.Strategy(
                {
                    secretOrKey: configPrivate.auth.jwtKey,
                    jwtFromRequest: passportJWT.ExtractJwt.fromExtractors([
                        passportJWT.ExtractJwt.fromAuthHeaderWithScheme("jwt"),
                        passportJWT.ExtractJwt.fromUrlQueryParameter("token"),
                    ]),
                },
                (jwt_payload, done) => {
                    done(null, jwt_payload);
                }
            )
        );

        // Inicializa passport
        app.use(passport.initialize());
    }
}
