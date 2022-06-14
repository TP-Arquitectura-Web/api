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
        
        return jwt.sign(token, configPrivate.auth.jwtKey, {
            expiresIn: this.expiresIn,
        });
    }

    static initialize(app: express.Express) {        
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
