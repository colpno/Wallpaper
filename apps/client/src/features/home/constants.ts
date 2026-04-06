import {
  Decor1,
  Decor2,
  Fashion1,
  Fashion2,
  Food1,
  Food2,
  Nail1,
  Nail2,
  Tattoo1,
  Tattoo2,
} from "@/assets/images";
import { ROUTES } from "@/constants/common";

export const heroContents = [
  { text: "cozy home decor", images: [Decor1, Decor2] },
  { text: "weeknight dinner", images: [Food1, Food2] },
  { text: "effortless outfits", images: [Fashion1, Fashion2] },
  { text: "classic nail art", images: [Nail1, Nail2] },
  { text: "statement tattoos", images: [Tattoo1, Tattoo2] },
];

export const footerMenu = [
  {
    label: "Get the app",
    items: [
      { label: "IOS", link: "#" },
      { label: "Android", link: "#" },
    ],
  },
  {
    label: "Quick links",
    items: [
      { label: "Explore", link: ROUTES.IDEAS() },
      { label: "Shop", link: "#" },
      { label: "Users", link: "#" },
      { label: "Collections", link: "#" },
      { label: "Shopping", link: "#" },
      { label: "Help Center", link: "#" },
    ],
  },
  {
    label: "Policies",
    items: [
      { label: "Terms of service", link: "#" },
      { label: "Privacy policy", link: "#" },
      { label: "Non-user notice", link: "#" },
    ],
  },
];
