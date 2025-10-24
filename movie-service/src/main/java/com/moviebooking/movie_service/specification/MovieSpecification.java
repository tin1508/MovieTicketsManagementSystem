package com.moviebooking.movie_service.specification;

import com.moviebooking.movie_service.entity.Genre;
import com.moviebooking.movie_service.entity.Movie;
import com.moviebooking.movie_service.enums.AgeRating;
import com.moviebooking.movie_service.enums.MovieStatus;
import jakarta.persistence.criteria.Expression;
import jakarta.persistence.criteria.Join;
import jakarta.persistence.criteria.JoinType;
import org.springframework.data.jpa.domain.Specification;

public class MovieSpecification {
    // Tìm phim có title chứa một từ khóa (keyword)
    // Tương đương: Where movie.title LIKE %KeyWord%
    public static Specification<Movie> relaseAfterOn(Integer year){
        return (root, query, criteriaBuilder) -> {
            if (year == null) return criteriaBuilder.conjunction();

            Expression<Integer> yearExpression = criteriaBuilder.function(
                    "YEAR",
                    Integer.class,
                    root.get("releaseDate")
            );

            return criteriaBuilder.greaterThanOrEqualTo(yearExpression, year);
        };
    }

    public static Specification<Movie> hasStatus (MovieStatus movieStatus){
        return (root, query, criteriaBuilder) -> {
            if(movieStatus == null) return criteriaBuilder.conjunction();

            return criteriaBuilder.equal(root.get("movieStatus"), movieStatus);
        };
    }

    public static Specification<Movie> hasKeyword(String keyword){
        return (root, query, criteriaBuilder) -> {
            if (keyword == null || keyword.isEmpty()) return criteriaBuilder.conjunction();

            var titlePredicate = criteriaBuilder.like(
                    criteriaBuilder.lower(root.get("description")),
                    "%" + keyword.toLowerCase() + "%");

            var descriptionPredicate = criteriaBuilder.like(
                    criteriaBuilder.lower(root.get("title")),
                    "%" + keyword.toLowerCase() + "%");

            return criteriaBuilder.or(titlePredicate, descriptionPredicate);
        };
    }

    public static Specification<Movie> hasGenre(Long genreId){
        return (root, query, criteriaBuilder) -> {
            if (genreId == null) return criteriaBuilder.conjunction();

            query.distinct(true);

            Join<Movie, Genre> genreJoin = root.join("genres", JoinType.INNER);

            return criteriaBuilder.equal(genreJoin.get("id"),genreId);
        };
    }

    public static Specification<Movie> hasAgeRating(AgeRating ageRating){
        return (root, query, criteriaBuilder) -> {
            if (ageRating == null) return criteriaBuilder.conjunction();

            return criteriaBuilder.equal(root.get("ageRating"), ageRating);
        };
    }

    public static Specification<Movie> ratingBetween(Double minRating, Double maxRating){
        return (root, query, criteriaBuilder) -> {
            if (minRating == null && maxRating == null) return criteriaBuilder.conjunction();

            if (minRating != null && maxRating != null) {
                return criteriaBuilder.between(root.get("rating"), minRating, maxRating);
            }

            if (minRating != null){
                return criteriaBuilder.greaterThanOrEqualTo(root.get("rating"), minRating);
            }

            return  criteriaBuilder.lessThanOrEqualTo(root.get("rating"), maxRating);
        };
    }

    public static Specification<Movie> isActive() {
        return (root, query, criteriaBuilder) ->
                criteriaBuilder.isTrue(root.get("isActive"));
    }

}
