import { eventbus } from "@/util/event-bus";

export const userEventChannel = eventbus<{
  onUserUpdate: () => void;
}>();
