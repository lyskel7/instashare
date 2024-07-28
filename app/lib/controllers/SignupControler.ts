import { AxiosResponse } from "axios";
import { EAuthType } from "../enums";
// import { ICredentials } from "../interfaces/ICredentials";
import { TUser } from "../types";
import AxiosWrapper from "../wrappers/AxiosWrapper";

export class SignupController extends AxiosWrapper {
  private static _SignupControllerInstance: SignupController;

  constructor(authType: EAuthType) {
    super(authType);
  }

  public static getSignupControllerInstance(authType: EAuthType): SignupController {
    if (!this._SignupControllerInstance) {
      SignupController._SignupControllerInstance = new SignupController(authType);
    }
    return this._SignupControllerInstance;
  }

  // async fetchUsers(): Promise<IUser[]> {
  //   const response: AxiosResponse<IUser[]> = await this.axiosInstance.get<IUser[]>('api/users');
  //   return response.data;
  // };

  async signup(user: TUser): Promise<boolean> {
    try {
      const response: AxiosResponse<boolean> =
        await this.axiosInstance.post<boolean>('/auth/signup', user);
      return response.data;
    } catch (error) {
      return Promise.reject(error);
    }
  }

  // async signin(credentials: ICredentials): Promise<ITokenProfile> {
  //   try {
  //     const response: AxiosResponse<ITokenProfile> =
  //       await this.axiosInstance.post<ITokenProfile>('/auth/signin', credentials);
  //     return response.data;
  //   } catch (error) {
  //     return Promise.reject(error);
  //   }
  // }

  // async logout(): Promise<number> {
  //   try {
  //     const response: AxiosResponse<number> = await this.axiosInstance.post('/auth/logout');
  //     return response.data;
  //   } catch (error) {
  //     return Promise.reject(error);
  //   }
  // }

  // async deleteUser(id: string): Promise<IUser> {
  //   const response: AxiosResponse<IUser> = await this.axiosInstance.delete<IUser>(
  //     `api/users/${id}`
  //   );
  //   return response.data;
  // }

  // async updateCategory(partialCategory: IUserToUpdate): Promise<boolean> {
  //   const stringifyData = JSON.stringify(partialCategory);
  //   const response: AxiosResponse<IUserToUpdate> = await this.axiosInstance.patch<IUserToUpdate>(
  //     `api/categories/${partialCategory.id}`,
  //     stringifyData
  //   );
  //   return !!response.data;
  // }  
}