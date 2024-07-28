
export enum ERole {
  ADMIN = 'ADMIN',
  USER = 'USER'
}

export enum EAuthType {
  BEARER = 'BEARER',
  OTHER = 'OTHER',
  NONE = 'NONE'
}

// export enum EAction {
//   LOGIN = 'LOGIN',
//   LOGOUT = 'LOGOUT'
// }

export enum EHttpStatusCode {
  OK = 200,
  BAD_REQUEST = 400,
  CONFLICT = 409,
  UNAUTHORIZED = 401,
  FORBIDDEN = 403,
  NOT_FOUND = 404,
  INTERNAL_SERVER_ERROR = 500,
}