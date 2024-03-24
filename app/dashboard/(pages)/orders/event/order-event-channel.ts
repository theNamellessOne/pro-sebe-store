import { eventbus } from "@/util/event-bus";

export const orderEventChannel = eventbus<{
  onOrderUpdate: () => void;
}>();
