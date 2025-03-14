import { Router } from 'express'

const router = Router();

router.post('/', (req, res) => {
  let pin;
  if (req.cookies) {
    pin = req.cookies.get('pin') || undefined;
  }
  else pin = undefined;



  res.json({ authenticated:  });
})

export default router;