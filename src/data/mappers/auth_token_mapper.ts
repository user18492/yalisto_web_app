import type { AuthTokenModel } from "@/data/models/auth_token_model";

type JsonRecord = Record<string, unknown>;

const is_record = (value: unknown): value is JsonRecord => {
  return typeof value === "object" && value !== null;
};

const from_json = (raw: unknown): AuthTokenModel => {
  if (!is_record(raw)) {
    throw new Error("La respuesta de autenticacion es invalida");
  }

  const { token } = raw;

  if (typeof token !== "string" || token.trim() === "") {
    throw new Error("La respuesta de autenticacion es invalida");
  }

  return {
    token,
  };
};

const to_json = (model: AuthTokenModel): unknown => {
  return {
    token: model.token,
  };
};

export const AuthTokenModelMapper = {
  from_json,
  to_json,
};
