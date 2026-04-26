// src/viewmodels/use_register_view_model.ts
import { reactive, ref } from "vue";

type FormData = {
  name: string;
  last_name: string;
  email: string;
  password: string;
  confirm_password: string;
  accept_terms: boolean;
};

type Errors = Partial<Record<keyof FormData, string>>;

export function use_register_view_model() {
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

  function toggle_show_password() {
    show_password.value = !show_password.value;
  }

  function toggle_show_confirm_password() {
    show_confirm_password.value = !show_confirm_password.value;
  }

  function check_accept_terms() {
    form_data.accept_terms = !form_data.accept_terms;
  }

  // function validate_form(): boolean {
  // }

  async function submit_form() {}

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
