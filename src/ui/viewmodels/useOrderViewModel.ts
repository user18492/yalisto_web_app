import { computed, reactive, ref } from "vue";

export type OrderStatus =
  | "pending"
  | "confirmed"
  | "preparing"
  | "delivering"
  | "delivered"
  | "cancelled";

export interface Order {
  id: number;
  userId: number;
  restaurantName?: string;
  restaurantId?: number;
  deliveryStreet: string;
  deliveryHouseNumber: string;
  deliveryFloor: string;
  deliveryApartment: string;
  deliveryNotes: string;
  deliveryCity: string;
  deliveryProvince: string;
  deliveryPostalCode: string;
  total: number;
  status: OrderStatus;
  createdAt: string;
  updatedAt: string;
  estimatedDeliveryStart?: string;
  estimatedDeliveryEnd?: string;
}

export interface TimelineStep {
  key: string;
  label: string;
  status: "completed" | "current" | "pending";
  timestamp?: string;
}

type DeliveryForm = {
  deliveryStreet: string;
  deliveryHouseNumber: string;
  deliveryFloor: string;
  deliveryApartment: string;
  deliveryNotes: string;
  deliveryCity: string;
  deliveryProvince: string;
  deliveryPostalCode: string;
};

const mockOrders: Order[] = [
  {
    id: 10492,
    userId: 1,
    restaurantName: "La Hamburgueseria",
    deliveryStreet: "Av. del Libertador",
    deliveryHouseNumber: "2341",
    deliveryFloor: "4",
    deliveryApartment: "B",
    deliveryNotes: "Dejar en recepcion por favor. Tocar timbre 4B si no hay nadie.",
    deliveryCity: "Ciudad Autonoma",
    deliveryProvince: "CABA",
    deliveryPostalCode: "C1425",
    total: 2450,
    status: "preparing",
    createdAt: "2024-01-15T13:45:00",
    updatedAt: "2024-01-15T13:48:00",
    estimatedDeliveryStart: "14:30",
    estimatedDeliveryEnd: "14:45",
  },
  {
    id: 10490,
    userId: 1,
    restaurantName: "Sushi Express",
    deliveryStreet: "Calle Humboldt",
    deliveryHouseNumber: "550",
    deliveryFloor: "",
    deliveryApartment: "",
    deliveryNotes: "Porteria principal del edificio.",
    deliveryCity: "Palermo",
    deliveryProvince: "Buenos Aires",
    deliveryPostalCode: "C1414",
    total: 1980,
    status: "confirmed",
    createdAt: "2024-01-15T12:20:00",
    updatedAt: "2024-01-15T12:28:00",
    estimatedDeliveryStart: "13:10",
    estimatedDeliveryEnd: "13:25",
  },
  {
    id: 10488,
    userId: 1,
    restaurantName: "Pizzeria Napoli",
    deliveryStreet: "Av. del Libertador",
    deliveryHouseNumber: "2341",
    deliveryFloor: "5",
    deliveryApartment: "B",
    deliveryNotes: "",
    deliveryCity: "Ciudad Autonoma",
    deliveryProvince: "CABA",
    deliveryPostalCode: "C1425",
    total: 3120,
    status: "delivered",
    createdAt: "2024-01-14T20:15:00",
    updatedAt: "2024-01-14T20:52:00",
  },
];

const statusOrder: OrderStatus[] = [
  "pending",
  "confirmed",
  "preparing",
  "delivering",
  "delivered",
];

const createEmptyDeliveryForm = (): DeliveryForm => ({
  deliveryStreet: "",
  deliveryHouseNumber: "",
  deliveryFloor: "",
  deliveryApartment: "",
  deliveryNotes: "",
  deliveryCity: "",
  deliveryProvince: "",
  deliveryPostalCode: "",
});

export function useOrderViewModel() {
  const orders = ref<Order[]>([]);
  const selectedOrderId = ref<number | null>(null);
  const isLoading = ref(false);
  const isUpdating = ref(false);
  const showHistory = ref(false);

  const deliveryForm = reactive<DeliveryForm>(createEmptyDeliveryForm());

  const selectedOrder = computed(
    () => orders.value.find((order) => order.id === selectedOrderId.value) ?? null,
  );

  const activeOrders = computed(() =>
    orders.value.filter((order) => !["delivered", "cancelled"].includes(order.status)),
  );

  const completedOrders = computed(() =>
    orders.value.filter((order) => order.status === "delivered"),
  );

  const canEditSelectedOrder = computed(
    () =>
      !!selectedOrder.value &&
      (selectedOrder.value.status === "pending" || selectedOrder.value.status === "confirmed"),
  );

  const syncDeliveryForm = (order: Order | null) => {
    Object.assign(
      deliveryForm,
      order
        ? {
            deliveryStreet: order.deliveryStreet,
            deliveryHouseNumber: order.deliveryHouseNumber,
            deliveryFloor: order.deliveryFloor,
            deliveryApartment: order.deliveryApartment,
            deliveryNotes: order.deliveryNotes,
            deliveryCity: order.deliveryCity,
            deliveryProvince: order.deliveryProvince,
            deliveryPostalCode: order.deliveryPostalCode,
          }
        : createEmptyDeliveryForm(),
    );
  };

  const getStatusText = (status: OrderStatus) => {
    const labels: Record<OrderStatus, string> = {
      pending: "Pendiente",
      confirmed: "Confirmado",
      preparing: "Preparando",
      delivering: "En camino",
      delivered: "Entregado",
      cancelled: "Cancelado",
    };

    return labels[status];
  };

  const getStatusClass = (status: OrderStatus) => {
    const classes: Record<OrderStatus, string> = {
      pending: "text-bg-secondary",
      confirmed: "text-bg-info",
      preparing: "text-bg-warning",
      delivering: "text-bg-primary",
      delivered: "text-bg-success",
      cancelled: "text-bg-danger",
    };

    return classes[status];
  };

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value);

  const formatTime = (value?: string) => {
    if (!value) return "";

    const normalized = value.includes("T") ? new Date(value) : new Date(`2024-01-01T${value}:00`);
    return new Intl.DateTimeFormat("es-AR", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    }).format(normalized);
  };

  const formatHistoryMoment = (value: string) => {
    const date = new Date(value);
    const now = new Date("2024-01-15T23:59:00");
    const diffInMs = now.getTime() - date.getTime();
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

    if (diffInDays === 0) {
      return `Hoy, ${formatTime(value)}`;
    }

    if (diffInDays === 1) {
      return `Ayer, ${formatTime(value)}`;
    }

    return new Intl.DateTimeFormat("es-AR", {
      day: "2-digit",
      month: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    }).format(date);
  };

  const getEstimatedWindow = (order: Order) => {
    if (order.estimatedDeliveryStart && order.estimatedDeliveryEnd) {
      return `Llega ${order.estimatedDeliveryStart} - ${order.estimatedDeliveryEnd}`;
    }

    return formatHistoryMoment(order.createdAt);
  };

  const orderStatusTimeline = computed<TimelineStep[]>(() => {
    if (!selectedOrder.value) return [];

    const currentStatus = selectedOrder.value.status;
    const currentIndex = statusOrder.indexOf(currentStatus);
    const updatedTime = formatTime(selectedOrder.value.updatedAt);

    const baseSteps: Array<{ key: OrderStatus; label: string; timestamp?: string }> = [
      {
        key: "pending",
        label: "Pedido Recibido",
        timestamp: formatTime(selectedOrder.value.createdAt),
      },
      {
        key: "confirmed",
        label: "Confirmado por Restaurante",
        timestamp: currentIndex >= 1 ? updatedTime : undefined,
      },
      {
        key: "preparing",
        label: "Preparando su comida",
        timestamp:
          currentStatus === "preparing"
            ? "Actualmente"
            : currentIndex > 2
              ? updatedTime
              : undefined,
      },
      {
        key: "delivering",
        label: "En camino",
        timestamp:
          currentStatus === "delivering"
            ? "Actualmente"
            : currentStatus === "delivered"
              ? selectedOrder.value.estimatedDeliveryStart
              : undefined,
      },
      {
        key: "delivered",
        label: "Entregado",
        timestamp: currentStatus === "delivered" ? updatedTime : undefined,
      },
    ];

    return baseSteps.map((step) => {
      const stepIndex = statusOrder.indexOf(step.key);

      return {
        key: step.key,
        label: step.label,
        status:
          stepIndex < currentIndex
            ? "completed"
            : stepIndex === currentIndex
              ? "current"
              : "pending",
        timestamp: step.timestamp,
      };
    });
  });

  const selectOrder = (orderId: number) => {
    selectedOrderId.value = orderId;
    syncDeliveryForm(selectedOrder.value);
  };

  const loadOrders = async () => {
    isLoading.value = true;

    await new Promise((resolve) => setTimeout(resolve, 250));
    orders.value = mockOrders.map((order) => ({ ...order }));

    const preferredOrder = orders.value.find(
      (order) => order.status !== "delivered" && order.status !== "cancelled",
    );

    if (preferredOrder) {
      selectOrder(preferredOrder.id);
    } else if (orders.value[0]) {
      selectOrder(orders.value[0].id);
    } else {
      syncDeliveryForm(null);
    }

    isLoading.value = false;
  };

  const updateDeliveryDetails = async (orderId: number, details: DeliveryForm) => {
    const targetOrder = orders.value.find((order) => order.id === orderId);
    if (!targetOrder || !canEditSelectedOrder.value) return;

    isUpdating.value = true;
    await new Promise((resolve) => setTimeout(resolve, 700));

    Object.assign(targetOrder, {
      deliveryStreet: details.deliveryStreet,
      deliveryHouseNumber: details.deliveryHouseNumber,
      deliveryFloor: details.deliveryFloor,
      deliveryApartment: details.deliveryApartment,
      deliveryNotes: details.deliveryNotes,
      deliveryCity: details.deliveryCity,
      deliveryProvince: details.deliveryProvince,
      deliveryPostalCode: details.deliveryPostalCode,
      updatedAt: new Date().toISOString(),
    });

    console.log("Detalles de entrega actualizados", {
      orderId,
      details: { ...details },
    });

    syncDeliveryForm(targetOrder);
    isUpdating.value = false;
  };

  const toggleHistory = () => {
    showHistory.value = !showHistory.value;
  };

  return {
    orders,
    selectedOrder,
    isLoading,
    isUpdating,
    activeOrders,
    completedOrders,
    orderStatusTimeline,
    deliveryForm,
    showHistory,
    canEditSelectedOrder,
    selectOrder,
    updateDeliveryDetails,
    getStatusText,
    getStatusClass,
    loadOrders,
    toggleHistory,
    formatCurrency,
    formatHistoryMoment,
    getEstimatedWindow,
  };
}
