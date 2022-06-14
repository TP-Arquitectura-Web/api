import * as express from 'express'
import * as rutasSchema from '../schemas/rutas';

const router = express.Router()

router.get('/rutas', async (req: any, res) => {
    try {

        let rutas = await rutasSchema.ruta.find().populate('envio');
        console.log("Rutasssss: ", rutas)

        return res.status(200).send(rutas)
    } catch (err) {
        return res.status(403).send({ status: 'error', data: err })
    }
});

router.get('/rutas/:id', async (req, res) => {
    try {
        let ruta = await rutasSchema.ruta.find({ _id: req.params.id })
        return res.status(200).send({ status: 'success', data: ruta[0] })
    } catch (err) {
        return res.status(403).send({ status: 'error', data: err })
    }
});

router.post('/rutas', async (req: any, res) => {
    try {
        let rutaNuevo = new rutasSchema.ruta(req.body);

        await rutaNuevo.save()

        return res.status(200).send(rutaNuevo)
    } catch (err) {
        return res.status(403).send({ status: 'error', data: err })
    }
});

router.put("/rutas/:id", async (req, res) => {
    try {
        let rutasUpdate = await rutasSchema.ruta.findByIdAndUpdate(req.params.id, req.body, { new: true });
        return res.status(200).send(rutasUpdate);
    } catch (err) {
        return res.status(403).send(err);
    }
});

export = router
