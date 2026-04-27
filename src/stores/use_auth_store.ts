import { computed, ref } from "vue";
import { defineStore } from "pinia";

type AuthToken = string | null;

const auth_token_storage_key: string = "auth_token";

export const use_auth_store = defineStore("auth", () => {
  const auth_token = ref<AuthToken>(null);

  const is_authenticated = computed<boolean>(() => {
    return auth_token.value !== null && auth_token.value.trim() !== "";
  });

  function save_token(token: string): void {
    auth_token.value = token;
    localStorage.setItem(auth_token_storage_key, token);
  }

  function load_token(): void {
    const stored_token: string | null = localStorage.getItem(auth_token_storage_key);
    auth_token.value = stored_token !== null && stored_token.trim() !== "" ? stored_token : null;
  }

  function clear_token(): void {
    auth_token.value = null;
    localStorage.removeItem(auth_token_storage_key);
  }

  return {
    auth_token,
    is_authenticated,
    save_token,
    load_token,
    clear_token,
  };
});
