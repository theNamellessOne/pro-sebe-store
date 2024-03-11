"use client";

import {Button} from "@nextui-org/react";
import {Review, ReviewStatus} from "@prisma/client";
import {useState} from "react";
import {ReviewService} from "@/service/review/review-service";
import {reviewEventChannel} from "@/app/dashboard/(pages)/review/event/review-event-channel";
import {toast} from "react-hot-toast";

export function SetStatusButton({id, status}: Review) {
    const [loading, setLoading] = useState(false);

    const handleSetStatus = () => {
        setLoading(true);

        const newStatus = status === ReviewStatus.APPROVED ? ReviewStatus.ON_MODERATION : ReviewStatus.APPROVED;

        ReviewService.instance.setStatus(id, newStatus).then(() => {
            setLoading(false);
            reviewEventChannel.emit("onReviewUpdate");
            toast.success("Статус змінено!");
        });
    };

    return (
        <>
            <Button size={"sm"} variant={"light"} onPress={handleSetStatus} disabled={loading}>
                {loading ? "Зміна статусу..." : "Змінити статус"}
            </Button>
        </>
    )
}