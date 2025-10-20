package com.moviebooking.movie_service.repository.specification;

import com.moviebooking.movie_service.entity.Movie;
import jakarta.persistence.criteria.Expression;
import org.springframework.data.jpa.domain.Specification;

public class MovieSpecification {
    // Tìm phim có title chứa một từ khóa (keyword)
    // Tương đương: Where movie.title LIKE %KeyWord%
    public static Specification<Movie> titleContains(String keyword){
        return (root, query, criteriaBuilder) -> {
           if (keyword == null || keyword.isEmpty()){
               return criteriaBuilder.disjunction();
           }

           return criteriaBuilder.like(
                   criteriaBuilder.lower(root.get("title")),
                   "%" + keyword.toLowerCase() + "%"
           );
        };
    }

    public static Specification<Movie> relaseAfterOn(Integer year){
        return (root, query, criteriaBuilder) -> {
            if (year == null) return criteriaBuilder.disjunction();

            Expression<Integer> yearExpression = criteriaBuilder.function(
                    "YEAR",
                    Integer.class,
                    root.get("realeaseData")
            );

            return criteriaBuilder.greaterThanOrEqualTo(yearExpression, year);
        };
    }
}
