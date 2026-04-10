package com.moviebooking.movie_service.service;

import com.moviebooking.movie_service.dto.request.SeatTypeCreationRequest;
import com.moviebooking.movie_service.dto.request.SeatTypeUpdateRequest;
import com.moviebooking.movie_service.dto.response.SeatTypeResponse;
import com.moviebooking.movie_service.entity.SeatType;
import com.moviebooking.movie_service.exception.AppException;
import com.moviebooking.movie_service.exception.ErrorCode;
import com.moviebooking.movie_service.mapper.SeatTypeMapper;
import com.moviebooking.movie_service.repository.SeatTypeRepository;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class SeatTypeService {
    SeatTypeRepository seatTypeRepository;
    SeatTypeMapper seatTypeMapper;

    public SeatTypeResponse createSeatType(SeatTypeCreationRequest request){
        SeatType toSeatType = seatTypeMapper.toSeatType(request);
        return seatTypeMapper.toSeatTypeResponse(seatTypeRepository.save(toSeatType));
    }
    public SeatTypeResponse updateSeatType(Long id, SeatTypeUpdateRequest request){
        SeatType seatType = seatTypeRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.SEAT_TYPE_NOTFOUND));
        seatTypeMapper.updateSeatType(seatType, request);
        return seatTypeMapper.toSeatTypeResponse(seatTypeRepository.save(seatType));
    }
    public void deleteSeatType(Long id){
        SeatType seatType = seatTypeRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.SEAT_TYPE_NOTFOUND));
        seatTypeRepository.deleteById(seatType.getId());
    }
    public SeatTypeResponse getSeatTypeById(Long id){
        SeatType seatType = seatTypeRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.SEAT_TYPE_NOTFOUND));
        return seatTypeMapper.toSeatTypeResponse(seatType);
    }
    public List<SeatTypeResponse> getSeatTypes(){
        return seatTypeRepository.findAll().stream().map(seatTypeMapper::toSeatTypeResponse).toList();
    }
}