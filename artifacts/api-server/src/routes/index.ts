import { Router, type IRouter } from "express";
import healthRouter from "./health";
import biographyRouter from "./biography";
import downloadProjectRouter from "./download-project";

const router: IRouter = Router();

router.use(healthRouter);
router.use(biographyRouter);
router.use(downloadProjectRouter);

export default router;
