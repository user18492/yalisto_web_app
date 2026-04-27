import { reactive, ref, type Ref } from "vue";
import { auth_service, type RegisterUserPayload } from "@/data/services/auth_service";
import { use_auth_store } from "@/stores/use_auth_store";

type FormData = {
  name: string;
  last_name: string;
  email: string;
  password: string;
  confirm_password: string;
  accept_terms: boolean;
};

type Errors = Partial<Record<keyof FormData, string>>;

type RegisterViewModel = {
  form_data: FormData;
  errors: Errors;
  is_loading: Ref<boolean>;
  show_password: Ref<boolean>;
  show_confirm_password: Ref<boolean>;
  toggle_show_password: () => void;
  toggle_show_confirm_password: () => void;
  check_accept_terms: () => void;
  submit_form: () => Promise<void>;
};

const email_regex: RegExp = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function use_register_view_model(): RegisterViewModel {
  const auth_store = use_auth_store();

  const form_data = reactive<FormData>({
    name: "",
    last_name: "",
    email: "",
    password: "",
    confirm_password: "",
    accept_terms: false,
  });

  const errors = reactive<Errors>({});
  const is_loading = ref(false);
  const show_password = ref(false);
  const show_confirm_password = ref(false);

  function toggle_show_password(): void {
    show_password.value = !show_password.value;
  }

  function toggle_show_confirm_password(): void {
    show_confirm_password.value = !show_confirm_password.value;
  }

  function check_accept_terms(): void {
    form_data.accept_terms = !form_data.accept_terms;
  }

  function validate_form(): boolean {
    const validation_errors: Errors = {};
    const error_keys: Array<keyof FormData> = [
      "name",
      "last_name",
      "email",
      "password",
      "confirm_password",
      "accept_terms",
    ];

    if (form_data.name.trim() === "") {
      validation_errors.name = "El nombre es obligatorio";
    }

    if (form_data.last_name.trim() === "") {
      validation_errors.last_name = "El apellido es obligatorio";
    }

    if (form_data.email.trim() === "") {
      validation_errors.email = "El correo electronico es obligatorio";
    } else if (!email_regex.test(form_data.email)) {
      validation_errors.email = "El correo electronico es invalido";
    }

    if (form_data.password.trim() === "") {
      validation_errors.password = "La contrasena es obligatoria";
    }

    if (form_data.confirm_password.trim() === "") {
      validation_errors.confirm_password = "La confirmacion de contrasena es obligatoria";
    }

    if (!form_data.accept_terms) {
      validation_errors.accept_terms = "Debe aceptar los terminos y condiciones";
    }

    for (const key of error_keys) {
      errors[key] = validation_errors[key] ?? "";
    }

    return Object.keys(validation_errors).length === 0;
  }

  async function submit_form(): Promise<void> {
    if (!validate_form()) {
      return;
    }

    const payload: RegisterUserPayload = {
      ...form_data,
    };

    is_loading.value = true;

    try {
      const response = await auth_service.register_user(payload);

      if (response.success && response.data !== undefined) {
        auth_store.save_token(response.data.token);
      }
    } finally {
      is_loading.value = false;
    }
  }

  return {
    form_data,
    errors,
    is_loading,
    show_password,
    show_confirm_password,
    toggle_show_password,
    toggle_show_confirm_password,
    check_accept_terms,
    submit_form,
  };
}
