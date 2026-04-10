package com.moviebooking.movie_service.service;

import com.moviebooking.movie_service.dto.response.UserStatisticsResponse;
import com.moviebooking.movie_service.repository.UserRepository;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.TreeMap;

@Service
@RequiredArgsConstructor
@Slf4j
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class UserStatisticsService {
    UserRepository userRepository;

    public UserStatisticsResponse getUserStatistics(){
        log.info("Getting user statistics");

        long totalUsers = userRepository.count();

        Map<String, Long> newUsersByMonth = getUsersByMonth();

        return UserStatisticsResponse.builder()
                .totalUsers(totalUsers)
                .newUsersByMonth(newUsersByMonth)
                .build();
    }

    public Map<String, Long> getUsersByMonth(){
        List<Object[]> results = userRepository.countUsersByMonth();

        Map<String, Long> usersByMonth = new TreeMap<>();

        for (Object[] result : results){
            if (result[0] != null) {
                String month = result[0].toString();
                Long count = ((Number) result[1]).longValue();
                usersByMonth.put(month, count);
            }
        }

        return usersByMonth;
    }

}
