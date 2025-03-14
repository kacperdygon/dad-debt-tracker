import { Router } from 'express'

const router = Router();

router.get('/', (req, res) => {
  res.json({ message: "Entry list" });
})

router.post('/', (req, res) => {
  res.json({ message: "Added entry" });
})

export default router;