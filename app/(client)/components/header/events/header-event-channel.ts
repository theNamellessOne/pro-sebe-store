import { eventbus } from "@/util/event-bus";

export const headerEventChannel = eventbus<{
  onSeachIconPress: () => void;
}>();
