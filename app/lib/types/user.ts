import { ERole } from "../enums";

export type TUser = {
  name: string;
  email: string;
  mobile: string;
  password: string;
  role?: ERole;
}