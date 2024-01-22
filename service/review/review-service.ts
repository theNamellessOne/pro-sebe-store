import {_fetchAllReviews, _fetchReviewById, _fetchReviews} from "@/service/review/impl/review-fetch-service";
import {_saveReview} from "@/service/review/impl/review-write-service";

export class ReviewService {
    public fetchAll = _fetchAllReviews;
    public fetchById = _fetchReviewById;
    public fetchReviews = _fetchReviews;

    public save = _saveReview;

    private static _instance: ReviewService | undefined;

    static get instance() {
        if (!ReviewService._instance) {
            ReviewService._instance = new ReviewService();
        }

        return ReviewService._instance;
    }
}