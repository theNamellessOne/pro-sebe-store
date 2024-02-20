import { eventbus } from "@/util/event-bus";

export const filterEventChannel = eventbus<{
  onSearchChange: () => void;
}>();
