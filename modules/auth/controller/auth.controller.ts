import { AuthUsers } from "./../schemas/authUsers";
import { Auth } from "./../auth.class";
import { removeDiacritics } from "./../../../utils/utils";

export declare type ObjectId = string;

export async function findUser(email) {
    const pAuth = AuthUsers.findOne({ usuario: email });
    const [auth] = await Promise.all([pAuth]);
    if (auth) {
        return {
            user: auth,
        };
    }
    return null;
}

export async function generateTokenPayload(
    username
) {
    const data = await findTokenData(username);
    if (data.usuario) {
        let nombreCompleto =
            data.usuario.datosPersonales.nombres +
            " " +
            data.usuario.datosPersonales.apellido;

        const tokenPayload = createPayload(data.usuario);
        const token = Auth.generateUserToken2(
            username,
            data,
            removeDiacritics(nombreCompleto)
        );

        return { token, payload: tokenPayload };
    } else {
        return null;
    }
}

export async function findTokenData(username: string) {
    const auth = await AuthUsers.findOne({
        usuario: username
    });

    if (auth) {
        return {
            usuario: auth
        };
    }
    return null;
}

export function createPayload(user) {
    const nombre = user.datosPersonales.nombres;
    const apellido = user.datosPersonales.apellido;

    return {
        usuario: {
            id: user._id,
            nombreCompleto: nombre + " " + apellido,
            nombre,
            apellido
        }
    };
}

export async function getTokenPayload(token, userData) {
    const data = await findTokenData(userData.usuario);
    const tokenPayload = createPayload(data.usuario);

    return tokenPayload;
}

