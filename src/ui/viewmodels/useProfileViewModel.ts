// ui/viewmodels/useProfileViewModel.ts
import { reactive, ref } from "vue";

type SectionId = "personal-data" | "addresses" | "security" | "danger-zone";
type ActionKey = "personal" | "address" | "password" | "delete";

export interface NavigationItem {
  id: SectionId;
  label: string;
  isDanger?: boolean;
}

export function useProfileViewModel() {
  // ========== DATOS DEL FORMULARIO ==========
  const userData = reactive({
    name: "María",
    lastName: "González",
    email: "maria.g@ejemplo.com",
    avatar: "", // URL o base64
  });

  const addressData = reactive({
    street: "Av. del Libertador",
    number: 2341,
    floor: "",
    apartment: "",
    city: "CABA",
    province: "Buenos Aires",
    postalCode: "1425",
  });

  const passwords = reactive({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  // ========== ERRORES ==========
  const errors = reactive({
    // Personal data
    name: "",
    lastName: "",
    email: "",
    avatar: "",
    // Address
    street: "",
    number: "",
    floor: "",
    apartment: "",
    city: "",
    province: "",
    postalCode: "",
    // Password
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  // ========== ESTADO UI ==========
  const isLoading = ref(false);
  const activeSection = ref<SectionId>("personal-data");
  const activeAction = ref<ActionKey | null>(null);

  // ========== NAVEGACIÓN ==========
  const navigationItems: NavigationItem[] = [
    { id: "personal-data", label: "Datos Personales" },
    { id: "addresses", label: "Direcciones" },
    { id: "security", label: "Seguridad y Contraseña" },
    { id: "danger-zone", label: "Eliminar cuenta", isDanger: true },
  ];

  // Scroll suave a categoría
  const scrollToCategory = (categoryId: SectionId) => {
    activeSection.value = categoryId;
    const element = document.getElementById(categoryId);
    element?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  // Detectar qué sección está visible en scroll
  const updateVisibleSection = () => {
    const offsets = navigationItems
      .map(({ id }) => {
        const element = document.getElementById(id);
        if (!element) return null;
        return {
          id,
          distance: Math.abs(element.getBoundingClientRect().top - 140),
        };
      })
      .filter((item): item is { id: SectionId; distance: number } => item !== null)
      .sort((a, b) => a.distance - b.distance);

    if (offsets[0]) {
      activeSection.value = offsets[0].id;
    }
  };

  // ========== ACCIONES CON LOADING ==========
  const runAction = async (action: ActionKey, callback: () => Promise<unknown>) => {
    activeAction.value = action;
    try {
      await callback();
    } finally {
      activeAction.value = null;
    }
  };

  // ========== MÉTODOS DEL VIEWMODEL ==========
  const updatePersonalData = async () => {
    // Limpiar errores previos
    errors.name = "";
    errors.lastName = "";
    errors.email = "";

    let hasError = false;

    if (!userData.name) {
      errors.name = "El nombre es obligatorio";
      hasError = true;
    }
    if (!userData.lastName) {
      errors.lastName = "El apellido es obligatorio";
      hasError = true;
    }
    if (!userData.email) {
      errors.email = "El correo es obligatorio";
      hasError = true;
    } else if (!/\S+@\S+\.\S+/.test(userData.email)) {
      errors.email = "Ingrese un correo válido";
      hasError = true;
    }

    if (hasError) return;

    isLoading.value = true;
    await new Promise((resolve) => setTimeout(resolve, 1000)); // Simular API
    console.log("Datos personales actualizados:", userData);
    isLoading.value = false;
  };

  const updateAddress = async () => {
    errors.street = "";
    errors.number = "";
    errors.city = "";
    errors.province = "";
    errors.postalCode = "";

    let hasError = false;

    if (!addressData.street) {
      errors.street = "La calle es obligatoria";
      hasError = true;
    }
    if (!addressData.number) {
      errors.number = "El número es obligatorio";
      hasError = true;
    }
    if (!addressData.city) {
      errors.city = "La ciudad es obligatoria";
      hasError = true;
    }

    if (hasError) return;

    isLoading.value = true;
    await new Promise((resolve) => setTimeout(resolve, 1000));
    console.log("Dirección actualizada:", addressData);
    isLoading.value = false;
  };

  const changePassword = async () => {
    errors.currentPassword = "";
    errors.newPassword = "";
    errors.confirmPassword = "";

    let hasError = false;

    if (!passwords.currentPassword) {
      errors.currentPassword = "Ingrese su contraseña actual";
      hasError = true;
    }
    if (!passwords.newPassword) {
      errors.newPassword = "Ingrese una nueva contraseña";
      hasError = true;
    } else if (passwords.newPassword.length < 6) {
      errors.newPassword = "La contraseña debe tener al menos 6 caracteres";
      hasError = true;
    }
    if (passwords.newPassword !== passwords.confirmPassword) {
      errors.confirmPassword = "Las contraseñas no coinciden";
      hasError = true;
    }

    if (hasError) return;

    isLoading.value = true;
    await new Promise((resolve) => setTimeout(resolve, 1000));
    console.log("Contraseña cambiada");
    // Limpiar campos de contraseña después del cambio
    passwords.currentPassword = "";
    passwords.newPassword = "";
    passwords.confirmPassword = "";
    isLoading.value = false;
  };

  const deleteAccount = async () => {
    const confirm = window.confirm(
      "¿Estás seguro de eliminar tu cuenta? Esta acción no se puede deshacer.",
    );
    if (!confirm) return;

    isLoading.value = true;
    await new Promise((resolve) => setTimeout(resolve, 1500));
    console.log("Cuenta eliminada");
    isLoading.value = false;
    // Redirigir al login o home
    // router.push('/')
  };

  // ========== CICLO DE VIDA (scroll listener) ==========
  const setupScrollListener = () => {
    window.addEventListener("scroll", updateVisibleSection, { passive: true });
    updateVisibleSection();
  };

  const cleanupScrollListener = () => {
    window.removeEventListener("scroll", updateVisibleSection);
  };

  return {
    // Datos
    userData,
    addressData,
    passwords,
    errors,
    navigationItems,
    // Estado UI
    isLoading,
    activeSection,
    activeAction,
    // Navegación
    scrollToCategory,
    // Acciones wrapper (para loading)
    runAction,
    // Métodos principales
    updatePersonalData,
    updateAddress,
    changePassword,
    deleteAccount,
    // Lifecycle helpers
    setupScrollListener,
    cleanupScrollListener,
  };
}
