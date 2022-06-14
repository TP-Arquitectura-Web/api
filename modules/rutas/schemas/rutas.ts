import * as mongoose from "mongoose";

export const RutasSchema = new mongoose.Schema(
    {
        envio: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Envio"
        },
        driver: { type: String, lowercase: true, required: true },
        estado: { type: String, lowercase: true, required: true },
        notas: { type: String, lowercase: true, required: true }
    },
    {
        timestamps: true,
    }
);

export let ruta = mongoose.model("Ruta", RutasSchema, "rutas");
