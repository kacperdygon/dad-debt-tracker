import Cookies from 'js-cookie';

export async function login(enteredPin: string): Promise<boolean> {

  Cookies.set("pin", enteredPin);

  return true;
}