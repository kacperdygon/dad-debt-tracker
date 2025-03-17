import { type Request, type Response} from "express";
import { getRoleByPin } from '@/backend/api/lib/auth';

export const signIn = async (req: Request, res: Response) => {
  const { pin } = req.body;

  if (!pin) {
    res.status(400).json({ message: 'Invalid json body' });
  }

  try {

    const role = await getRoleByPin(pin);

    if (!role) {
      return res.status(401).json({ message: 'Incorrect pin' });
    }

    return res.status(200).json({ message: `Logged in as ${role}`, role: role });

  } catch (error) {
    console.error('MongoDB error:', error);
    return res.status(500).json({ message: 'Server error' });
  }
};

export const verifySession = async (req: Request, res: Response) => {
  const pin = req.cookies['pin'];
  if (!pin) {
    return res.status(401).json({ message: 'No pin' });
  }
  const role = await getRoleByPin(pin);
  if (!role) {
    return res.status(401).json({ message: 'Invalid pin' });
  } else {
    return res.status(200).json({ message: `Valid pin`, role: role });
  }
}