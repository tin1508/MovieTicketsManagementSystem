package com.moviebooking.movie_service.mapper;

import com.moviebooking.movie_service.dto.request.RoomCreationRequest;
import com.moviebooking.movie_service.dto.request.RoomUpdateRequest;
import com.moviebooking.movie_service.dto.response.RoomResponse;
import com.moviebooking.movie_service.entity.Room;
import org.mapstruct.*;

@Mapper(componentModel = "spring", uses = {CinemaMapper.class})
public interface RoomMapper {

    Room toRoom(RoomCreationRequest request);

    RoomResponse toRoomResponse(Room room);

    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    void updateRoom(@MappingTarget Room room, RoomUpdateRequest request);
}