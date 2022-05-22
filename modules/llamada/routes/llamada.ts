import * as express from "express";
import * as llamadaSchema from "../schemas/llamada";

const router = express.Router();

router.get("/llamadas", async (req, res) => {
    try {
console.log("LLamamda apapa")
        // return res.status(200).send({ status: "success", data: empresasResponse });
    } catch (err) {
        return res.status(403).send({ status: "error", data: err });
    }
});

export = router;
