import { Auth } from '../models/authModel';

export const getRoleByPin = async (pin: string | undefined): Promise<string | null> => {
  try {
    if (!pin) return null;
    const existingDoc = await Auth.findOne({ pin });
    if (!existingDoc || !existingDoc.role) {
      return null;
    } else {
      return existingDoc.role;
    }
  } catch (error) {
    throw new Error("Error: " + error);
  }

};
