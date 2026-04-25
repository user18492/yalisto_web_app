import { reactive, ref } from "vue";

export interface Dish {
  id: number | string;
  name: string;
  price: number;
  description?: string;
  imageUrl?: string;
}

export interface Restaurant {
  id: number | string;
  name: string;
  description: string;
  rating: number;
  imageUrl?: string;
  tags: string[];
  featuredDishes: Dish[];
}

type RatingStar = "full" | "half" | "empty";

const createPlaceholderImage = (title: string, colorA: string, colorB: string) => {
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 360">
      <defs>
        <linearGradient id="g" x1="0" x2="1" y1="0" y2="1">
          <stop offset="0%" stop-color="${colorA}" />
          <stop offset="100%" stop-color="${colorB}" />
        </linearGradient>
      </defs>
      <rect width="640" height="360" rx="24" fill="url(#g)" />
      <circle cx="520" cy="70" r="92" fill="rgba(255,255,255,0.12)" />
      <circle cx="100" cy="310" r="110" fill="rgba(255,255,255,0.08)" />
      <text
        x="50%"
        y="54%"
        fill="white"
        font-family="Segoe UI, Arial, sans-serif"
        font-size="38"
        font-weight="700"
        text-anchor="middle"
        dominant-baseline="middle"
      >
        ${title}
      </text>
    </svg>
  `;

  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
};

const createDishPlaceholder = (title: string, colorA: string, colorB: string) => {
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120">
      <defs>
        <linearGradient id="g" x1="0" x2="1" y1="0" y2="1">
          <stop offset="0%" stop-color="${colorA}" />
          <stop offset="100%" stop-color="${colorB}" />
        </linearGradient>
      </defs>
      <rect width="120" height="120" rx="18" fill="url(#g)" />
      <circle cx="60" cy="42" r="23" fill="rgba(255,255,255,0.26)" />
      <text
        x="50%"
        y="88"
        fill="white"
        font-family="Segoe UI, Arial, sans-serif"
        font-size="14"
        font-weight="700"
        text-anchor="middle"
      >
        ${title}
      </text>
    </svg>
  `;

  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
};

export function useRestaurantViewModel() {
  const isLoading = ref(false);

  const restaurants = reactive<Restaurant[]>([
    {
      id: 1,
      name: "El Asador Criollo",
      description: "Especialistas en cortes de carne premium y comida tradicional.",
      rating: 4.8,
      imageUrl: createPlaceholderImage("Asador", "#5b3927", "#1f1816"),
      tags: ["Carnes", "Bebidas", "Tradicional"],
      featuredDishes: [
        {
          id: 1,
          name: "Bife de Chorizo",
          price: 24,
          imageUrl: createDishPlaceholder("Bife", "#8f3c2c", "#2d1a16"),
        },
        {
          id: 2,
          name: "Ensalada de la Casa",
          price: 8.5,
          imageUrl: createDishPlaceholder("Ensalada", "#7ab96b", "#315f2f"),
        },
      ],
    },
    {
      id: 2,
      name: "Pizzeria Napoli",
      description: "Autentica pizza al horno de lena e ingredientes frescos.",
      rating: 4.6,
      imageUrl: createPlaceholderImage("Napoli", "#b44a28", "#1d2631"),
      tags: ["Comida Rapida", "Italiana"],
      featuredDishes: [
        {
          id: 3,
          name: "Pizza Margherita",
          price: 14,
          imageUrl: createDishPlaceholder("Pizza", "#d87f32", "#8b2c1d"),
        },
        {
          id: 4,
          name: "Te Helado con Limon",
          price: 3.5,
          imageUrl: createDishPlaceholder("Te", "#f1a34b", "#244a67"),
        },
      ],
    },
    {
      id: 3,
      name: "Vida Verde",
      description: "Opciones nutritivas y deliciosas para cuidar su bienestar diario.",
      rating: 4.9,
      imageUrl: createPlaceholderImage("Vida Verde", "#2f4c38", "#121619"),
      tags: ["Saludable", "Vegano"],
      featuredDishes: [
        {
          id: 5,
          name: "Bowl de Quinoa",
          price: 12,
          imageUrl: createDishPlaceholder("Bowl", "#72a86b", "#3c5d46"),
        },
        {
          id: 6,
          name: "Smoothie Detox",
          price: 5.5,
          imageUrl: createDishPlaceholder("Detox", "#7db47d", "#3a7d57"),
        },
      ],
    },
  ]);

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value);

  const getRestaurantRating = (rating: number) => {
    const stars: RatingStar[] = [];

    for (let index = 1; index <= 5; index += 1) {
      if (rating >= index) {
        stars.push("full");
      } else if (rating >= index - 0.5) {
        stars.push("half");
      } else {
        stars.push("empty");
      }
    }

    return stars;
  };

  const addToCart = (restaurantId: number | string, dishId: number | string) => {
    const restaurant = restaurants.find((item) => item.id === restaurantId);
    if (!restaurant) return;

    const dish = restaurant.featuredDishes.find((item) => item.id === dishId);
    if (!dish) return;

    const cartItem = {
      id: `${restaurant.id}-${dish.id}`,
      name: dish.name,
      price: dish.price,
      quantity: 1,
      restaurantName: restaurant.name,
    };

    console.log(`Agregado: ${cartItem.name} - ${formatCurrency(cartItem.price)}`, cartItem);
  };

  return {
    restaurants,
    isLoading,
    addToCart,
    getRestaurantRating,
    formatCurrency,
  };
}
