// ui/viewmodels/useNavbarViewModel.ts
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";

export function useNavbarViewModel() {
  const router = useRouter();

  // ========== ESTADO ==========
  const isAuthenticated = ref(false);
  const userAvatar = ref<string | null>(null);

  // ========== MÉTODOS ==========

  // Verificar si hay sesión activa (desde localStorage u otro origen)
  const checkAuthStatus = () => {
    const token = localStorage.getItem("authToken");
    isAuthenticated.value = !!token;

    // Si hay sesión, intentar cargar avatar del usuario
    if (isAuthenticated.value) {
      const savedAvatar = localStorage.getItem("userAvatar");
      if (savedAvatar) {
        userAvatar.value = savedAvatar;
      } else {
        // Avatar por defecto (iniciales o icono)
        userAvatar.value = null;
      }
    } else {
      userAvatar.value = null;
    }
  };

  // Cerrar sesión
  const logout = async () => {
    // Limpiar localStorage
    localStorage.removeItem("authToken");
    localStorage.removeItem("userAvatar");
    localStorage.removeItem("user");

    // Actualizar estado
    isAuthenticated.value = false;
    userAvatar.value = null;

    // Redirigir al login
    await router.push("/login");

    // Opcional: recargar la página para limpiar todos los estados
    // window.location.href = '/login'
  };

  // ========== SETUP INICIAL ==========
  onMounted(() => {
    checkAuthStatus();

    // Opcional: escuchar cambios en localStorage (si otra pestaña cierra sesión)
    window.addEventListener("storage", (event) => {
      if (event.key === "authToken") {
        checkAuthStatus();
      }
    });
  });

  return {
    isAuthenticated,
    userAvatar,
    logout,
  };
}
