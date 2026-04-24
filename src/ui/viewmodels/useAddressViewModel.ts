// ui/viewmodels/useAddressViewModel.ts
import { ref } from "vue";

export type AddressType = "home" | "work" | "favorite";

export type Address = {
  id: string | number;
  label: string;
  type: AddressType;
  street: string;
  number: string | number;
  floor?: string;
  apartment?: string;
  city: string;
  province: string;
  postalCode: string;
  isPrimary: boolean;
};

export type AddressPayload = Omit<Address, "id">;

export function useAddressViewModel() {
  // ========== ESTADO ==========
  const addresses = ref<Address[]>([]);
  const isLoading = ref(false);
  const isLoadingAction = ref<string | number | null>(null);

  // ========== DATOS MOCK PARA PRUEBAS ==========
  const mockAddresses: Address[] = [
    {
      id: 1,
      label: "Casa",
      type: "home",
      street: "Av. Libertador",
      number: 1234,
      floor: "5",
      apartment: "B",
      city: "Buenos Aires",
      province: "CABA",
      postalCode: "1425",
      isPrimary: true,
    },
    {
      id: 2,
      label: "Oficina",
      type: "work",
      street: "San Martín",
      number: 456,
      floor: "",
      apartment: "",
      city: "Rosario",
      province: "Santa Fe",
      postalCode: "2000",
      isPrimary: false,
    },
    {
      id: 3,
      label: "Casa de Abuela",
      type: "favorite",
      street: "Belgrano",
      number: 789,
      floor: "",
      apartment: "",
      city: "Córdoba",
      province: "Córdoba",
      postalCode: "5000",
      isPrimary: false,
    },
  ];

  // ========== MÉTODOS ==========
  const fetchAddresses = async () => {
    isLoading.value = true;
    // Simular carga desde API
    await new Promise((resolve) => setTimeout(resolve, 800));
    addresses.value = [...mockAddresses];
    isLoading.value = false;
  };

  const addAddress = async (payload: AddressPayload) => {
    isLoading.value = true;
    // Simular llamada API
    await new Promise((resolve) => setTimeout(resolve, 800));

    const newAddress: Address = {
      ...payload,
      id: Date.now(),
      number: String(payload.number),
    };

    // Si la nueva dirección es principal, quitar principal de las demás
    if (payload.isPrimary) {
      addresses.value = addresses.value.map((addr) => ({
        ...addr,
        isPrimary: false,
      }));
    }

    addresses.value.push(newAddress);
    isLoading.value = false;
  };

  const updateAddress = async (id: string | number, payload: AddressPayload) => {
    isLoadingAction.value = id;
    // Simular llamada API
    await new Promise((resolve) => setTimeout(resolve, 800));

    const index = addresses.value.findIndex((addr) => addr.id === id);
    if (index !== -1) {
      // Si esta dirección pasa a ser principal, quitar principal de las demás
      if (payload.isPrimary) {
        addresses.value = addresses.value.map((addr) => ({
          ...addr,
          isPrimary: addr.id === id ? true : false,
        }));
      } else {
        addresses.value[index] = {
          ...addresses.value[index],
          ...payload,
          number: String(payload.number),
          id,
        };
      }
    }

    isLoadingAction.value = null;
  };

  const deleteAddress = async (id: string | number) => {
    isLoadingAction.value = id;
    // Simular llamada API
    await new Promise((resolve) => setTimeout(resolve, 800));
    addresses.value = addresses.value.filter((addr) => addr.id !== id);
    isLoadingAction.value = null;
  };

  const setAsPrimary = async (id: string | number) => {
    isLoadingAction.value = id;
    // Simular llamada API
    await new Promise((resolve) => setTimeout(resolve, 800));

    addresses.value = addresses.value.map((addr) => ({
      ...addr,
      isPrimary: addr.id === id,
    }));

    isLoadingAction.value = null;
  };

  return {
    // Estado
    addresses,
    isLoading,
    isLoadingAction,
    // Métodos
    fetchAddresses,
    addAddress,
    updateAddress,
    deleteAddress,
    setAsPrimary,
  };
}
