import { eventbus } from "@/util/event-bus";
import { Category, Color, Size } from "@prisma/client";
import { VariantSave } from "@/schema/product/variant-schema";

export type Options = {
  sizes: Size[];
  colors: Color[];
};

export const productEventChannel = eventbus<{
  onSubmitStarted: () => void;

  onVariantsSend: (payload: VariantSave[]) => void;
  onCategoriesSend: (payload: Category[]) => void;
  onOptionsChanged: (payload: Options) => void;
}>();
