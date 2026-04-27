import { onMounted, onUnmounted, ref, watch, type Ref } from "vue";
import { storeToRefs } from "pinia";
import { useRouter } from "vue-router";
import { use_auth_store } from "@/stores/use_auth_store";

type NavbarViewModel = {
  isAuthenticated: Ref<boolean>;
  userAvatar: Ref<string | null>;
  logout: () => Promise<void>;
};

export function useNavbarViewModel(): NavbarViewModel {
  const router = useRouter();
  const auth_store = use_auth_store();
  const { is_authenticated } = storeToRefs(auth_store);
  const userAvatar = ref<string | null>(null);

  function sync_user_avatar(): void {
    if (is_authenticated.value) {
      const saved_avatar: string | null = localStorage.getItem("userAvatar");
      userAvatar.value = saved_avatar !== null && saved_avatar.trim() !== "" ? saved_avatar : null;
      return;
    }

    userAvatar.value = null;
  }

  async function logout(): Promise<void> {
    auth_store.clear_token();
    localStorage.removeItem("userAvatar");
    localStorage.removeItem("user");
    userAvatar.value = null;

    await router.push("/login");
  }

  function handle_storage_change(event: StorageEvent): void {
    if (event.key === "authToken") {
      auth_store.load_token();
    }

    if (event.key === "authToken" || event.key === "userAvatar") {
      sync_user_avatar();
    }
  }

  watch(is_authenticated, () => {
    sync_user_avatar();
  });

  onMounted(() => {
    sync_user_avatar();
    window.addEventListener("storage", handle_storage_change);
  });

  onUnmounted(() => {
    window.removeEventListener("storage", handle_storage_change);
  });

  return {
    isAuthenticated: is_authenticated,
    userAvatar,
    logout,
  };
}
