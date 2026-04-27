import { AuthTokenModelMapper } from "@/data/mappers/auth_token_mapper";
import { UserModelMapper } from "@/data/mappers/user_mapper";
import type { AuthTokenModel } from "@/data/models/auth_token_model";
import type { UserModel } from "@/data/models/user_model";

type ApiResponse = {
  success?: unknown;
  message?: unknown;
  data?: unknown;
};

export type RegisterUserPayload = {
  name: string;
  last_name: string;
  email: string;
  password: string;
  confirm_password: string;
  accept_terms: boolean;
};

export type LoginUserPayload = {
  email: string;
  password: string;
};

export type ServiceResponse<T> = {
  success: boolean;
  message: string;
  data?: T;
};

const is_record = (value: unknown): value is Record<string, unknown> => {
  return typeof value === "object" && value !== null;
};

const register_user = async (
  payload: RegisterUserPayload,
): Promise<ServiceResponse<AuthTokenModel>> => {
  try {
    const user_model: UserModel = {
      name: payload.name,
      last_name: payload.last_name,
      email: payload.email,
      password: payload.password,
    };

    const request_body: unknown = UserModelMapper.to_json(user_model);
    const response: Response = await fetch("/api/auth/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(request_body),
    });

    let raw_response: unknown = null;

    try {
      raw_response = await response.json();
    } catch {
      raw_response = null;
    }

    const response_body: ApiResponse = is_record(raw_response) ? raw_response : {};
    const success: boolean =
      typeof response_body.success === "boolean" ? response_body.success : response.ok;
    const message: string =
      typeof response_body.message === "string"
        ? response_body.message
        : success
          ? "Registro exitoso"
          : "No se pudo completar el registro";

    if (response_body.data === undefined || response_body.data === null) {
      return {
        success,
        message,
      };
    }

    const data: AuthTokenModel = AuthTokenModelMapper.from_json(response_body.data);

    return {
      success,
      message,
      data,
    };
  } catch (error: unknown) {
    return {
      success: false,
      message: error instanceof Error ? error.message : "Ocurrio un error al registrar el usuario",
    };
  }
};

const login_user = async (payload: LoginUserPayload): Promise<ServiceResponse<AuthTokenModel>> => {
  try {
    const user_model: UserModel = {
      email: payload.email,
      password: payload.password,
    };

    const request_body: unknown = UserModelMapper.to_json(user_model);
    const response: Response = await fetch("/api/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(request_body),
    });

    let raw_response: unknown = null;

    try {
      raw_response = await response.json();
    } catch {
      raw_response = null;
    }

    const response_body: ApiResponse = is_record(raw_response) ? raw_response : {};
    const success: boolean =
      typeof response_body.success === "boolean" ? response_body.success : response.ok;
    const message: string =
      typeof response_body.message === "string"
        ? response_body.message
        : success
          ? "Inicio de sesion exitoso"
          : "No se pudo iniciar sesion";

    if (response_body.data === undefined || response_body.data === null) {
      return {
        success,
        message,
      };
    }

    const data: AuthTokenModel = AuthTokenModelMapper.from_json(response_body.data);

    return {
      success,
      message,
      data,
    };
  } catch (error: unknown) {
    return {
      success: false,
      message: error instanceof Error ? error.message : "Ocurrio un error al iniciar sesion",
    };
  }
};

export const auth_service = {
  login_user,
  register_user,
};
