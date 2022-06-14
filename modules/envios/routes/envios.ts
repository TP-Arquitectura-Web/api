import * as express from 'express'
import * as envioSchema from '../schemas/envios';
import { numeroEnvio } from '../controllers/envioCtrl';

const router = express.Router()

router.get('/envios', async (req: any, res) => {
  try {

    let envios = await envioSchema.envio.find()

    return res.status(200).send(envios)
  } catch (err) {
    return res.status(403).send({ status: 'error', data: err })
  }
});

router.get('/envios/:id', async (req, res) => {
  try {
    let envio = await envioSchema.envio.find({ _id: req.params.id })
    return res.status(200).send({ status: 'success', data: envio[0] })
  } catch (err) {
    return res.status(403).send({ status: 'error', data: err })
  }
});

router.post('/envios', async (req: any, res) => {
  try {
    let envioNuevo = new envioSchema.envio(req.body);
    envioNuevo.nroEnvio = numeroEnvio();

    await envioNuevo.save()

    return res.status(200).send(envioNuevo)
  } catch (err) {
    return res.status(403).send({ status: 'error', data: err })
  }
});

router.put("/envios/:id", async (req, res) => {
  try {
    let enviosUpdate = await envioSchema.envio.findByIdAndUpdate(req.params.id, req.body, { new: true });
    return res.status(200).send(enviosUpdate);
  } catch (err) {
    return res.status(403).send(err);
  }
});

export = router
