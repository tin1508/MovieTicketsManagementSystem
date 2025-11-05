package com.groupfour.movietickets.mapper;

import com.groupfour.movietickets.dto.request.ShowtimeSeatCreationRequest;
import com.groupfour.movietickets.dto.request.ShowtimeSeatUpdateRequest;
import com.groupfour.movietickets.dto.response.ShowtimeSeatResponse;
import com.groupfour.movietickets.entity.ShowtimeSeat;
import javax.annotation.processing.Generated;
import org.springframework.stereotype.Component;

@Generated(
    value = "org.mapstruct.ap.MappingProcessor",
    comments = "version: 1.5.5.Final, compiler: javac, environment: Java 21.0.8 (Oracle Corporation)"
)
@Component
public class ShowtimeSeatMapperImpl implements ShowtimeSeatMapper {

    @Override
    public ShowtimeSeat toShowtimeSeat(ShowtimeSeatCreationRequest request) {
        if ( request == null ) {
            return null;
        }

        ShowtimeSeat showtimeSeat = new ShowtimeSeat();

        showtimeSeat.setId( request.getId() );
        showtimeSeat.setStatus( request.getStatus() );

        return showtimeSeat;
    }

    @Override
    public ShowtimeSeatResponse toShowtimeSeatResponse(ShowtimeSeat showtimeSeat) {
        if ( showtimeSeat == null ) {
            return null;
        }

        ShowtimeSeatResponse.ShowtimeSeatResponseBuilder showtimeSeatResponse = ShowtimeSeatResponse.builder();

        showtimeSeatResponse.id( showtimeSeat.getId() );
        showtimeSeatResponse.status( showtimeSeat.getStatus() );

        return showtimeSeatResponse.build();
    }

    @Override
    public void updateShowtimeSeat(ShowtimeSeat showtimeSeat, ShowtimeSeatUpdateRequest request) {
        if ( request == null ) {
            return;
        }

        if ( request.getId() != null ) {
            showtimeSeat.setId( request.getId() );
        }
        if ( request.getStatus() != null ) {
            showtimeSeat.setStatus( request.getStatus() );
        }
    }
}
