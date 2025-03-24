import { Auth, IAuthDocument } from '../models/authModel';

export async function getRoleByPin (pin: string | undefined): Promise<string | null> {
  try {
    const user = await getUserByPin(pin);
    if (!user) {
      return null;
    }
    return user.role;
  } catch (error) {
    throw new Error("Error: " + error);
  }
}

export async function getUserByPin (pin: string | undefined): Promise<IAuthDocument | null> {
  if (!pin) return null;
  try {
  const existingDoc = await Auth.findOne({ pin }) as IAuthDocument;
  if (!existingDoc) {
    return null;
  } else {
    return existingDoc;
  }
  } catch (error) {
    throw new Error("Error: " + error);
  }
}