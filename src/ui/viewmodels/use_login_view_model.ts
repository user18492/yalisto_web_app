import { reactive, ref, type Ref } from "vue";
import { auth_service, type LoginUserPayload } from "@/data/services/auth_service";

type FormData = {
  email: string;
  password: string;
  remember_me: boolean;
};

type Errors = Partial<Record<keyof FormData, string>>;

type LoginViewModel = {
  form_data: FormData;
  errors: Errors;
  is_loading: Ref<boolean>;
  show_password: Ref<boolean>;
  toggle_show_password: () => void;
  validate_form: () => boolean;
  submit_form: () => Promise<void>;
};

const email_regex: RegExp = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function use_login_view_model(): LoginViewModel {
  const form_data = reactive<FormData>({
    email: "",
    password: "",
    remember_me: false,
  });

  const errors = reactive<Errors>({});
  const is_loading = ref(false);
  const show_password = ref(false);

  function toggle_show_password(): void {
    show_password.value = !show_password.value;
  }

  function validate_form(): boolean {
    const validation_errors: Errors = {};
    const error_keys: Array<keyof Errors> = ["email", "password"];

    if (form_data.email.trim() === "") {
      validation_errors.email = "El correo electronico es obligatorio";
    } else if (!email_regex.test(form_data.email)) {
      validation_errors.email = "El correo electronico es invalido";
    }

    if (form_data.password.trim() === "") {
      validation_errors.password = "La contrasena es obligatoria";
    }

    for (const key of error_keys) {
      errors[key] = validation_errors[key] ?? "";
    }

    return Object.keys(validation_errors).length === 0;
  }

  async function submit_form(): Promise<void> {
    const is_form_valid: boolean = validate_form();

    if (!is_form_valid) {
      return;
    }

    const payload: LoginUserPayload = {
      email: form_data.email,
      password: form_data.password,
    };

    is_loading.value = true;

    try {
      await auth_service.login_user(payload);
    } finally {
      is_loading.value = false;
    }
  }

  return {
    form_data,
    errors,
    is_loading,
    show_password,
    toggle_show_password,
    validate_form,
    submit_form,
  };
}

export { use_login_view_model };
