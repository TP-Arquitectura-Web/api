import * as mongoose from "mongoose";

export const EnvioSchema = new mongoose.Schema(
    {
        nroEnvio: { type: String },
        retiro: new mongoose.Schema({
            nombreRetiro: { type: String, lowercase: true, required: true },
            apellidoRetiro: { type: String, lowercase: true, required: true },
            direccionRetiro: { type: String, lowercase: true, required: true },
            emailRetiro: { type: String, lowercase: true, required: true },
            telefonoRetiro: { type: String, required: true },
            notasRetiro: { type: String, lowercase: true }
        }),
        entrega: new mongoose.Schema({
            nombreEntrega: { type: String, lowercase: true, required: true },
            apellidoEntrega: { type: String, lowercase: true, required: true },
            direccionEntrega: { type: String, lowercase: true, required: true },
            emailEntrega: { type: String, lowercase: true, required: true },
            telefonoEntrega: { type: String, required: true },
            notasEntrega: { type: String, lowercase: true }
        }),
        servicio: { type: String, lowercase: true, required: true },
        estado: {
            id: String,
            nombre: { type: String, lowercase: true },
        }
    },
    {
        timestamps: true,
    }
);

export let envio = mongoose.model("Envio", EnvioSchema, "envios");
