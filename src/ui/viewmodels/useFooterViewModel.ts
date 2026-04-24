import { computed, reactive } from "vue";

export interface FooterLink {
  name: string;
  path: string;
}

export function useFooterViewModel() {
  const footerLinks = reactive<FooterLink[]>([
    { name: "Terms & Conditions", path: "/terms" },
    { name: "Privacy Policy", path: "/privacy" },
    { name: "Contact Us", path: "/contact" },
    { name: "Help Center", path: "/help" },
  ]);

  const currentYear = computed(() => new Date().getFullYear());
  const companyName = "YaListo";

  return {
    footerLinks,
    currentYear,
    companyName,
  };
}
