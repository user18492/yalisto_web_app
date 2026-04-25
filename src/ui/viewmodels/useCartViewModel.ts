import { computed, reactive, ref } from "vue";

export interface CartItem {
  id: number | string;
  name: string;
  description: string;
  price: number;
  quantity: number;
  imageUrl?: string;
}

const createPlaceholderImage = (title: string, colorA: string, colorB: string) => {
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 240 240">
      <defs>
        <radialGradient id="g" cx="35%" cy="35%" r="70%">
          <stop offset="0%" stop-color="${colorA}" />
          <stop offset="100%" stop-color="${colorB}" />
        </radialGradient>
      </defs>
      <rect width="240" height="240" rx="28" fill="#101010" />
      <circle cx="120" cy="120" r="84" fill="url(#g)" />
      <text
        x="50%"
        y="90%"
        fill="#ffffff"
        font-family="Segoe UI, Arial, sans-serif"
        font-size="20"
        font-weight="700"
        text-anchor="middle"
      >
        ${title}
      </text>
    </svg>
  `;

  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
};

export function useCartViewModel() {
  const cartItems = reactive<CartItem[]>([
    {
      id: 1,
      name: "Naranjas Organicas Premium",
      description: "Malla de 2kg",
      price: 45,
      quantity: 2,
      imageUrl: createPlaceholderImage("Naranjas", "#ffb347", "#ff6a00"),
    },
    {
      id: 2,
      name: "Pan de Masa Madre",
      description: "Hogaza rustica grande",
      price: 65,
      quantity: 1,
      imageUrl: createPlaceholderImage("Pan", "#ffdca8", "#d87a1c"),
    },
    {
      id: 3,
      name: "Ensalada de la Casa",
      description: "Porcion individual",
      price: 85,
      quantity: 1,
      imageUrl: createPlaceholderImage("Ensalada", "#9ad17b", "#4f8c4a"),
    },
  ]);

  const deliveryCost = ref(35);

  const subtotal = computed(() =>
    cartItems.reduce((accumulator, item) => accumulator + item.price * item.quantity, 0),
  );

  const total = computed(() => subtotal.value + deliveryCost.value);

  const itemCount = computed(() =>
    cartItems.reduce((accumulator, item) => accumulator + item.quantity, 0),
  );

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value);

  const getItemSubtotal = (productId: number | string) => {
    const item = cartItems.find((cartItem) => cartItem.id === productId);
    return item ? item.price * item.quantity : 0;
  };

  const updateQuantity = (productId: number | string, newQuantity: number) => {
    const item = cartItems.find((cartItem) => cartItem.id === productId);
    if (!item) return;

    if (newQuantity <= 0) {
      removeItem(productId, false);
      return;
    }

    item.quantity = newQuantity;
  };

  const removeItem = (productId: number | string, askConfirmation = true) => {
    const itemIndex = cartItems.findIndex((cartItem) => cartItem.id === productId);
    if (itemIndex === -1) return;

    if (askConfirmation) {
      const confirmed = window.confirm("Desea quitar este producto del carrito?");
      if (!confirmed) return;
    }

    cartItems.splice(itemIndex, 1);
  };

  const clearCart = () => {
    if (!cartItems.length) return;

    const confirmed = window.confirm("Desea vaciar todo el carrito?");
    if (!confirmed) return;

    cartItems.splice(0, cartItems.length);
  };

  const confirmOrder = () => {
    if (!cartItems.length) return;

    window.alert("Pedido confirmado. Continuaremos con el proceso de pago.");
    console.log("Pedido confirmado", {
      items: cartItems,
      subtotal: subtotal.value,
      deliveryCost: deliveryCost.value,
      total: total.value,
    });
  };

  return {
    cartItems,
    subtotal,
    deliveryCost,
    total,
    itemCount,
    updateQuantity,
    removeItem,
    clearCart,
    confirmOrder,
    formatCurrency,
    getItemSubtotal,
  };
}
