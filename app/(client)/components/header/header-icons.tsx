import { Instagram, ShoppingCart } from "lucide-react";

export function HeaderIcons() {
  return (
    <div className="flex">
      <Instagram href="https://www.instagram.com/pro.sebe.store/" target="_blank" className="w-full h-full"/>
      <ShoppingCart className="w-full h-full"/>
    </div>
  );
}
