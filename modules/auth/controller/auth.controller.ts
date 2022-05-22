import { AuthUsers } from "./../schemas/authUsers";
import { Auth } from "./../auth.class";
import { Cache } from "./../cache";
import { removeDiacritics } from "./../../../utils/utils";

export let AuthCache: Cache;


export declare type ObjectId = string;

export async function register(req: any, res) {
    // if (typeof password !== 'string') {
    // 	throw new Error('Password must be a string.');
    // }

    const user = new AuthUsers(req.body.data);

    const persistedUser = await user.save();

    return persistedUser;
}
/**
 * Recupera los datos necesarios de un Usuario.
 * User
 */

export async function findUser(username) {
    const pAuth = AuthUsers.findOne({ usuario: username });
    const [auth] = await Promise.all([pAuth]);
    if (auth) {
        return {
            user: auth,
        };
    }
    return null;
}

export async function updateUserLogin(documento) {
    return await AuthUsers.findOneAndUpdate(
        { usuario: documento },
        { lastLogin: new Date() }
    );
}

/**
 * Genera el payload de session y lo cachea.
 */

export async function generateTokenPayload(
    username,
    organizacion: ObjectId,
    idDependencia: ObjectId,
    account_id
) {
    const data = await findTokenData(username, organizacion);
    if (data.usuario) {
        let nombreCompleto =
            data.usuario.datosPersonales.nombres +
            " " +
            data.usuario.datosPersonales.apellido;

        const tokenPayload = createPayload(
            data.usuario,
            data.organizacion,
            idDependencia
        );
        const token = Auth.generateUserToken2(
            username,
            data,
            removeDiacritics(nombreCompleto)
        );

        await AuthCache.set(token, tokenPayload, 60 * 60 * 24);

        return { token, payload: tokenPayload };
    } else {
        return null;
    }
}

/**
 * Busca las collecciones necesarias para generar el payload de session.
 */
export async function findTokenData(username: string, organizacion: ObjectId) {
    const auth = await AuthUsers.findOne({
        usuario: username
    });

    if (auth) {
        const authOrganizacion = auth.organizaciones.find(
            (item) => String(item._id) === String(organizacion)
        );
        return {
            usuario: auth,
            organizacion: authOrganizacion,
        };
    }
    return null;
}

/**
 * Genera los datos de sesion de un usuarios.
 * Son los que antes viajaban en el token.
 */

export function createPayload(user, authOrg, idDependencia) {
    const nombre = user.datosPersonales.nombres;
    const apellido = user.datosPersonales.apellido;

    let modulos = authOrg.dependencias
        .filter((d) => d.idDependencia == idDependencia)
        .map((m) => {
            return m.modulos;
        });

    return {
        usuario: {
            id: user._id,
            nombreCompleto: nombre + " " + apellido,
            nombre,
            apellido,
            foto: user.foto,
            email: user.email,
            username: user.usuario,
            documento: user.usuario,
        },
        organizacion: {
            _id: authOrg._id,
            id: authOrg._id,
            nombre: authOrg.nombre,
            permisos: authOrg.permisos,
            perfiles: authOrg.perfiles,
            modulos: modulos[0],
        },
        // permisos: [ ...user.permisosGlobales, ...authOrg.permisos ]
    };
}

/**
 * Recupera los datos extras del TOKEN. Utiliza la cache para rápido acceso.
 */

export async function getTokenPayload(token, userData) {
    const payload = await AuthCache.get(token);
    if (payload) {
        return payload;
    }
    const data = await findTokenData(userData.usuario, userData.organizacion);
    const tokenPayload = createPayload(data.usuario, data.organizacion, null);

    return tokenPayload;
}

