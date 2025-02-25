import express from 'express';
const router = express.Router();

router.get("/", (req, res) => {
    res.send("Dog... bark!! bark!!");
});


//exports
export { router as dogRouter };
