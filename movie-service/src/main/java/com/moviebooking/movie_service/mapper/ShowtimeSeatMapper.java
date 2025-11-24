//package com.moviebooking.movie_service.mapper;
//
//import org.mapstruct.BeanMapping;
//import org.mapstruct.Mapper;
//import org.mapstruct.MappingTarget;
//import org.mapstruct.NullValuePropertyMappingStrategy;
//
//@Mapper(componentModel = "spring")
//public interface ShowtimeSeatMapper {
//    ShowtimeSeat toShowtimeSeat(ShowtimeSeatCreationRequest request);
//    ShowtimeSeatResponse toShowtimeSeatResponse(ShowtimeSeat showtimeSeat);
//    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
//    void updateShowtimeSeat(@MappingTarget ShowtimeSeat showtimeSeat, ShowtimeSeatUpdateRequest request);
//}
