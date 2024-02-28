import {
  _fetchAllReviews,
  _fetchReview,
  _fetchReviewById,
  _fetchLatest,
  _fetchApprovedReviews,
} from "@/service/review/impl/review-fetch-service";
import {
  _saveReview,
  _setStatus,
  _setStatusMany,
  _setStatusManyById,
} from "@/service/review/impl/review-write-service";
import {
  _deleteManyInIds,
  _deleteManyReviews,
  _deleteReview,
} from "@/service/review/impl/review-delete-service";

export class ReviewService {
  public fetch = _fetchReview;
  public fetchAll = _fetchAllReviews;
  public fetchById = _fetchReviewById;
  public fetchApproved = _fetchApprovedReviews;
  public fetchReviews = _fetchReview;
  public deleteManyByIds = _deleteManyInIds;
  public fetchLatest = _fetchLatest;

  public save = _saveReview;

  public delete = _deleteReview;
  public deleteMany = _deleteManyReviews;
  public setStatus = _setStatus;
  public setStatusMany = _setStatusMany;
  public setStatusManyById = _setStatusManyById;

  private static _instance: ReviewService | undefined;

  static get instance() {
    if (!ReviewService._instance) {
      ReviewService._instance = new ReviewService();
    }

    return ReviewService._instance;
  }
}
