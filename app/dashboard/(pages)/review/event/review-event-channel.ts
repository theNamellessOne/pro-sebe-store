import {eventbus} from "@/util/event-bus";

export const reviewEventChannel = eventbus<{
    onReviewUpdate: () => void;
}>();