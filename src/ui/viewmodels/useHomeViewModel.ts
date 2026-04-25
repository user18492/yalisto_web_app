import { computed, reactive, ref } from "vue";

export interface Category {
  id: number | string;
  name: string;
  slug: string;
  icon: string;
}

export interface Restaurant {
  id: number | string;
  name: string;
  description: string;
  rating: number;
  deliveryTime: string;
  categorySlug: string;
  imageUrl?: string;
}

type RatingStar = "full" | "half" | "empty";

const createPlaceholderImage = (title: string, colorA: string, colorB: string) => {
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 360">
      <defs>
        <linearGradient id="g" x1="0" x2="1" y1="0" y2="1">
          <stop offset="0%" stop-color="${colorA}" />
          <stop offset="100%" stop-color="${colorB}" />
        </linearGradient>
      </defs>
      <rect width="600" height="360" fill="url(#g)" />
      <circle cx="500" cy="65" r="82" fill="rgba(255,255,255,0.12)" />
      <circle cx="115" cy="295" r="95" fill="rgba(255,255,255,0.08)" />
      <text
        x="50%"
        y="50%"
        fill="white"
        font-family="Segoe UI, Arial, sans-serif"
        font-size="36"
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

export function useHomeViewModel() {
  const searchQuery = ref("");
  const selectedCategory = ref<string | null>(null);

  const categories = reactive<Category[]>([
    { id: 1, name: "Bebidas", slug: "bebidas", icon: "drink" },
    { id: 2, name: "Postres", slug: "postres", icon: "dessert" },
    { id: 3, name: "Comida Rapida", slug: "comida-rapida", icon: "burger" },
    { id: 4, name: "Saludable", slug: "saludable", icon: "healthy" },
  ]);

  const restaurants = reactive<Restaurant[]>([
    {
      id: 1,
      name: "La Pizzeria de Barrio",
      description: "Italiana, Pizzas, Bebidas",
      rating: 4.8,
      deliveryTime: "20-30 min",
      categorySlug: "comida-rapida",
      imageUrl: createPlaceholderImage("Pizzeria", "#ca6a1e", "#452615"),
    },
    {
      id: 2,
      name: "Burger Master",
      description: "Comida Rapida, Hamburguesas",
      rating: 4.5,
      deliveryTime: "15-25 min",
      categorySlug: "comida-rapida",
      imageUrl: createPlaceholderImage("Burger", "#d98a18", "#31353d"),
    },
    {
      id: 3,
      name: "Vida Sana Bowls",
      description: "Saludable, Ensaladas, Vegano",
      rating: 4.9,
      deliveryTime: "25-40 min",
      categorySlug: "saludable",
      imageUrl: createPlaceholderImage("Bowls", "#7ab96b", "#d6a44e"),
    },
    {
      id: 4,
      name: "Sakura Sushi",
      description: "Japonesa, Sushi, Asiatica",
      rating: 4.7,
      deliveryTime: "30-45 min",
      categorySlug: "bebidas",
      imageUrl: createPlaceholderImage("Sushi", "#1d2732", "#8b4b23"),
    },
  ]);

  const normalizedSearch = computed(() => searchQuery.value.trim().toLowerCase());

  const filteredCategories = computed(() => {
    if (!normalizedSearch.value) {
      return categories;
    }

    return categories.filter((category) =>
      category.name.toLowerCase().includes(normalizedSearch.value),
    );
  });

  const filteredRestaurants = computed(() => {
    return restaurants.filter((restaurant) => {
      const matchesCategory =
        !selectedCategory.value || restaurant.categorySlug === selectedCategory.value;

      if (!matchesCategory) {
        return false;
      }

      if (!normalizedSearch.value) {
        return true;
      }

      const haystack = `${restaurant.name} ${restaurant.description}`.toLowerCase();
      return haystack.includes(normalizedSearch.value);
    });
  });

  const hasResults = computed(
    () => filteredCategories.value.length > 0 || filteredRestaurants.value.length > 0,
  );

  const setSelectedCategory = (categorySlug: string) => {
    selectedCategory.value = selectedCategory.value === categorySlug ? null : categorySlug;
  };

  const clearSearch = () => {
    searchQuery.value = "";
    selectedCategory.value = null;
  };

  const getCategoryIcon = (icon: string) => {
    const icons: Record<string, string> = {
      drink: "drink",
      dessert: "dessert",
      burger: "burger",
      healthy: "healthy",
    };

    return icons[icon] ?? "default";
  };

  const getRatingStars = (rating: number) => {
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

  return {
    searchQuery,
    categories,
    restaurants,
    filteredCategories,
    filteredRestaurants,
    selectedCategory,
    hasResults,
    setSelectedCategory,
    clearSearch,
    getCategoryIcon,
    getRatingStars,
  };
}
