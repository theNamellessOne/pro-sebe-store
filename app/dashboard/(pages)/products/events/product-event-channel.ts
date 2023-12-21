import { eventbus } from "@/util/event-bus";

export const productEventChannel = eventbus<{
  onSubmitStarted: () => void;

  onVariantsSend: (payload: any[]) => void;
  onCategoriesSend: (payload: any[]) => void;
  onOptionsChanged: (payload: any[][]) => void;
}>();
