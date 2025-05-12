import type { NextFunction, Request, Response } from 'express';
import { getRoleByPin, getUserByPin } from '@/api/lib/auth';

export const signIn = async (req: Request, res: Response) => {
  const { pin } = req.body;
  if (!pin) {
    return void res.status(400).json({ message: 'Invalid json body' });
  }
  try {
    const currentRole = await getRoleByPin(req.cookies['pin']);
    if (currentRole){
      return void res.status(200).json({ message: 'User already logged in' });
    }
    const role = await getRoleByPin(pin);
    if (!role) {
      return void res.status(401).json({ message: 'Incorrect pin' });
    }
    res.cookie('pin', pin, {
      maxAge: 900000,
      httpOnly: true,
      secure: false,
      sameSite: 'none'
    });
    return void res.status(200).json({ message: `Logged in as ${role}`,  data: {
        role: role
    } });
  } catch (error) {
    console.error('MongoDB error:', error);
    return void res.status(500).json({ message: 'Server error' });
  }
};

//does the same but uses cookies

export const verifySession = async (req: Request, res: Response) => {
  const pin = req.cookies['pin'];
  if (!pin) {
    return void res.status(401).json({ message: 'No pin' });
  }
  try {
    const role = await getRoleByPin(pin);
    if (!role) {
      return void res.status(401).json({ message: 'Invalid pin' });
    } else {
      return void res.status(200).json({ message: `Valid pin`,  data: {
          role: role
        }});
    }
  } catch (error) {
    console.error('MongoDB error:', error);
    return void res.status(500).json({ message: 'Server error' });
  }
};

export const signOut = async (req: Request, res: Response) => {
  const pin = req.cookies['pin'];
  if (!pin) {
    return void res.status(401).json({ message: "You're not logged in" });
  }
  res.cookie('pin', '', { maxAge: 0, httpOnly: true });
  return void res.status(200).json({ message: 'Signed out' });
};

export const validateRequest = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const pin = req.cookies['pin'];
  if (!pin) {
    return void res.status(401).json({ message: 'Not logged in' });
  }
  const result = await getUserByPin(pin);
  if (!result || !result.role) {
    return void res.status(401).json({ message: 'Incorrect pin' });
  }
  req.auth = result;
  next();
}