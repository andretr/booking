package com.incae.booking.IBookingInit;

import com.incae.booking.Entities.Booking;
import com.incae.booking.Entities.Campus;

public interface IBookingService {

    public void initCampuses();

    public void initAulas();

    public void initAsientos();

    public void initClases();

    public void initBookings();

    public void initReservas();

    public void initReserva(Booking booking);

    public void randomInitAulasCampus(Campus campus, Boolean init);
}
