import * as mongoose from "mongoose";
const uniqueValidator = require("mongoose-unique-validator");
const bcrypt = require("bcrypt");

export const AuthUsersSchema = new mongoose.Schema(
    {
        usuario: {
            type: String,
            required: true,
            trim: true, //calls .trim() on the value to get rid of whitespace
            unique: true,
        },
        password: {
            type: String,
            required: true,
            minlength: 6,
        },
        activo: {
            type: Boolean,
            required: true,
            default: true,
        },
        fechaAltaUsuario: { type: Date, default: Date.now },
        fechaBajaUsuario: { type: Date },
        email: String,
        foto: String,
        datosPersonales: {
            nombres: { type: String, lowercase: true },
            apellido: { type: String, lowercase: true },
            dni: String,
            fechaNacimiento: { type: String },
            sexo: { type: String, lowercase: true },
            direccion: { type: String },
            ciudad: { type: String, lowercase: true },
            provincia: { type: String, lowercase: true },
            pais: { type: String, lowercase: true },
        },
        lastLogin: Date,
    },
    {
        timestamps: true,
    }
);
//this enforces emails to be unique!
AuthUsersSchema.plugin(uniqueValidator);

//this function will be called before a document is saved
AuthUsersSchema.pre("save", function (next) {
    let user = this;

    if (!user.isModified("password")) {
        return next();
    }

    //we generate the salt using 12 rounds and then use that salt with the received password string to generate our hash
    bcrypt
        .genSalt(12)
        .then((salt) => {
            return bcrypt.hash(user.password, salt);
        })
        .then((hash) => {
            user.password = hash;
            next();
        })
        .catch((err) => next(err));
});

AuthUsersSchema.pre("findOneAndUpdate", function (next) {
    let update: any = { ...this.getUpdate() };

    // Only run this function if password was modified
    if (update.password) {
        bcrypt
            .genSalt(12)
            .then((salt) => {
                return bcrypt.hash(this.getUpdate().values.password, salt);
            })
            .then((hash) => {
                update.password = hash;
                this.setUpdate(update);

                next();
            })
            .catch((err) => next(err));
    }
});

export let AuthUsers = mongoose.model(
    "authUsers",
    AuthUsersSchema,
    "authUsers"
);
