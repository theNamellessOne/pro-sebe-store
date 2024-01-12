import { HeaderIcons } from "./header-icons";
import { HeaderLinks } from "./header-links";
import { HeaderLogo } from "./header-logo";

export function Header() {
  return (
    <header className="bg-[#55585c] flex">
      <HeaderLinks />
      <HeaderLogo />
      <HeaderIcons />
    </header>
  );
}
