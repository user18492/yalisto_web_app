// src/viewmodels/useRegisterViewModel.ts
import { reactive, ref } from "vue";

type FormData = {
  fullName: string;
  email: string;
  password: string;
  confirmPassword: string;
  acceptTerms: boolean;
};

type Errors = Partial<Record<keyof FormData, string>>;

export function useRegisterViewModel() {
  const formData = reactive<FormData>({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
    acceptTerms: false,
  });

  const errors = reactive<Errors>({});
  const isLoading = ref(false);
  const showPassword = ref(false);
  const showConfirmPassword = ref(false);

  function toggleShowPassword() {
    showPassword.value = !showPassword.value;
  }

  function toggleShowConfirmPassword() {
    showConfirmPassword.value = !showConfirmPassword.value;
  }

  function validate(): boolean {
    return Object.keys(errors).length === 0;
  }

  async function submit() {
    if (!validate()) return;
  }

  return {
    formData,
    errors,
    isLoading,
    showPassword,
    showConfirmPassword,
    toggleShowPassword,
    toggleShowConfirmPassword,
    submit,
  };
}
