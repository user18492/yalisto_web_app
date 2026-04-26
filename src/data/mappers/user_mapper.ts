import type { UserModel } from "@/data/models/user_model";

type JsonRecord = Record<string, unknown>;

const is_record = (value: unknown): value is JsonRecord => {
  return typeof value === "object" && value !== null;
};

const from_json = (raw: unknown): UserModel => {
  if (!is_record(raw)) {
    throw new Error("La respuesta del usuario es invalida");
  }

  const { name, last_name, email, password } = raw;

  if (typeof email !== "string") {
    throw new Error("La respuesta del usuario es invalida");
  }

  if (name !== undefined && typeof name !== "string") {
    throw new Error("La respuesta del usuario es invalida");
  }

  if (last_name !== undefined && typeof last_name !== "string") {
    throw new Error("La respuesta del usuario es invalida");
  }

  if (password !== undefined && typeof password !== "string") {
    throw new Error("La respuesta del usuario es invalida");
  }

  return {
    name,
    last_name,
    email,
    password,
  };
};

const to_json = (model: UserModel): unknown => {
  const json: JsonRecord = {
    email: model.email,
  };

  if (model.name !== undefined) {
    json.name = model.name;
  }

  if (model.last_name !== undefined) {
    json.last_name = model.last_name;
  }

  if (model.password !== undefined) {
    json.password = model.password;
  }

  return json;
};

export const UserModelMapper = {
  from_json,
  to_json,
};
