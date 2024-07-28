import axios, { AxiosError, AxiosInstance, AxiosRequestConfig, AxiosResponse, InternalAxiosRequestConfig } from "axios";
import { EAuthType, EHttpStatusCode } from "../enums";

export type TConfigInjector = ((config: InternalAxiosRequestConfig) => InternalAxiosRequestConfig) | null;

export type TInjectorType = 'token' | 'custome' | undefined;

class AxiosWrapper {
  private static instance: AxiosWrapper;
  private _axiosInstance: AxiosInstance;
  private configInjector: TConfigInjector = null;

  protected constructor(authType: EAuthType) {
    if (authType === EAuthType.BEARER) {
      this.configInjector = this.bearerToken
    }
    const api = axios.create({
      baseURL: '/api',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json; charset=utf-8',
      },
      withCredentials: true
    });

    api.interceptors.request.use(this.configInjector, (error) => Promise.reject(error));

    api.interceptors.response.use(
      (response: AxiosResponse) => {
        if (authType === EAuthType.BEARER) {
          const token = localStorage.getItem("some_token");
          if (token === null) localStorage.setItem('some_token', response.data.accessToken);
        }
        return response
      },
      (error: AxiosError) => {
        return this.handleError(error);
      }
    );
    this._axiosInstance = api;
  }

  // Section for several ways of auth
  private bearerToken(config: InternalAxiosRequestConfig): InternalAxiosRequestConfig {
    const token = localStorage.getItem("atb");
    if (token != null) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  };

  // Singlenton instance
  public static getInstance(authType: EAuthType): AxiosWrapper {
    if (!AxiosWrapper.instance) {
      AxiosWrapper.instance = new AxiosWrapper(authType);
    }
    return AxiosWrapper.instance;
  }


  //accessors
  get axiosInstance(): AxiosInstance {
    return this._axiosInstance;
  }

  //axios methods
  request<T = any, R = AxiosResponse<T>>(config: AxiosRequestConfig): Promise<R> {
    return this._axiosInstance.request(config);
  }

  get<T = any, R = AxiosResponse<T>>(url: string, config?: AxiosRequestConfig): Promise<R> {
    return this._axiosInstance.get<T, R>(url, config);
  }

  post<T = any, R = AxiosResponse<T>>(
    url: string,
    data?: T,
    config?: AxiosRequestConfig
  ): Promise<R> {
    return this._axiosInstance.post<T, R>(url, data, config);
  }

  put<T = any, R = AxiosResponse<T>>(
    url: string,
    data?: T,
    config?: AxiosRequestConfig
  ): Promise<R> {
    return this._axiosInstance.put<T, R>(url, data, config);
  }

  patch<T = any, R = AxiosResponse<T>>(
    url: string,
    data?: T,
    config?: AxiosRequestConfig
  ): Promise<R> {
    return this._axiosInstance.patch<T, R>(url, data, config);
  }

  delete<T = any, R = AxiosResponse<T>>(url: string, config?: AxiosRequestConfig): Promise<R> {
    return this._axiosInstance.delete<T, R>(url, config);
  }

  // Handle global app errors
  // We can handle generic app errors depending on the status code
  private handleError(error: AxiosError) {
    if (axios.isAxiosError(error) && error.response) {
      const { status, data }: AxiosResponse = error.response;

      switch (status) {
        case EHttpStatusCode.BAD_REQUEST:
          // console.error('My Bad Request:', data['message']);
          break;
        case EHttpStatusCode.UNAUTHORIZED:
          // console.error('My Unauthorized:', data['message']);
          // window.location.href = '/login';
          // Redirigir a la página de inicio de sesión, por ejemplo
          break;
        case EHttpStatusCode.FORBIDDEN:
          // console.error('My Forbidden:', data['message']);
          break;
        case EHttpStatusCode.NOT_FOUND:
          // console.error('My Not Found:', data['message']);
          break;
        case EHttpStatusCode.CONFLICT:
          // console.error('My Conflict:', data['message']);
          break;
        case EHttpStatusCode.INTERNAL_SERVER_ERROR:
          // console.error('My Internal Server Error:', data['message']);
          break;
        default:
          // console.error('My Unhandled error:', status, data);
          break;
      }
      return Promise.reject(error);
    }
    return Promise.reject(error);
  }
}

export default AxiosWrapper;