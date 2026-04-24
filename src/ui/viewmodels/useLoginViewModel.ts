// viewmodels/useLoginViewModel.ts
import { reactive, ref } from "vue";

export function useLoginViewModel() {
  // Form data
  const formData = reactive({
    email: "",
    password: "",
    rememberMe: false,
  });

  // Errors por campo
  const errors = reactive({
    email: "",
    password: "",
  });

  // Estado de carga
  const isLoading = ref(false);

  // Mostrar/ocultar password
  const showPassword = ref(false);

  // Toggle para mostrar/ocultar password
  const toggleShowPassword = () => {
    showPassword.value = !showPassword.value;
  };

  // Submit mínimo (solo simula validación básica)
  const submit = async () => {
    // Limpiar errores previos
    errors.email = "";
    errors.password = "";

    // Validaciones mínimas
    let hasError = false;

    if (!formData.email) {
      errors.email = "El correo electrónico es obligatorio";
      hasError = true;
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = "Ingrese un correo electrónico válido";
      hasError = true;
    }

    if (!formData.password) {
      errors.password = "La contraseña es obligatoria";
      hasError = true;
    } else if (formData.password.length < 6) {
      errors.password = "La contraseña debe tener al menos 6 caracteres";
      hasError = true;
    }

    if (hasError) return;

    // Simular carga
    isLoading.value = true;

    // Simular llamada a API
    await new Promise((resolve) => setTimeout(resolve, 1500));

    // Aquí normalmente iría la llamada al servicio de login
    console.log("Login exitoso:", {
      email: formData.email,
      password: formData.password,
      rememberMe: formData.rememberMe,
    });

    isLoading.value = false;

    // Opcional: redirigir o emitir evento
    // router.push('/dashboard')
  };

  return {
    formData,
    errors,
    isLoading,
    showPassword,
    toggleShowPassword,
    submit,
  };
}
