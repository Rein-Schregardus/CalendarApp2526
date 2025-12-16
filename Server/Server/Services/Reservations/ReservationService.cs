namespace Server.Services.RoomReservations
{
    using System;
    using Server.Db;
    using Server.DBAccess;
    using Server.Dtos.RoomReservation;
    using Server.Entities;

    public class ReservationService: IReservationService
    {
        private IRepository<Reservation, long> _reservations;
        private IRepository<Location, long> _locations;

        public ReservationService(AppDbContext dbContext)
        {
            _reservations = new GenericAccess<Reservation, long>(dbContext);
            _locations = new GenericAccess<Location, long>(dbContext);
        }

        public async Task<ReadReservationDto?> GetById(long id)
        {
            var reservation = await _reservations.GetById(id);
            if (reservation == null) return null;

            var dto = MapToRead(reservation);
            return dto;
        }

        public async Task<ReadReservationDto[]> GetAll()
        {
            var reservations = await _reservations.GetAll();
            var dtos = new ReadReservationDto[reservations.Length];

            for (int i = 0; i < dtos.Length; i++)
            {
                var reservation = reservations[i];
                var dto = MapToRead(reservation);
                dtos[i] = dto!;
            }
            return dtos;
        }

        public async Task<ReadReservationDto?> Create(WriteReservationDto dto)
        {
            var reservation = new Reservation()
            {
                RoomId = dto.LocationId,
                UserId = dto.UserId,
                Duration = dto.Duration,
                Start = dto.Start,
                CreatedAt = DateTime.UtcNow,

            };
            var dbResult = await _reservations.Create(reservation);

            if (dbResult == null) return null;

            var readDto = MapToRead(dbResult);
            return readDto;
        }

        public async Task<ReadReservationDto?> Update(long id, WriteReservationDto dto)
        {
            var reservation = new Reservation()
            {
                Id = id,
                RoomId = dto.LocationId,
                UserId = dto.UserId,
                Duration = dto.Duration,
                Start = dto.Start,
                CreatedAt = DateTime.UtcNow,
            };
            var dbResult = await _reservations.Update(reservation);

            if (dbResult == null) return null;

            var readDto = MapToRead(dbResult);

            return readDto;
        }

        public async Task<bool> Delete(long id)
        {
            return await _reservations.Delete(id);
        }

        public async Task<(bool, string)> IsReservationLegal(WriteReservationDto dto, long? id = null)
        {
            if (dto.Duration <= 0)
                return (false, "duration cannot be 0 or negative");
            if (dto.Start < DateTime.UtcNow.AddMinutes(-5))
                return (false, "reservation cannot be for the past");
            var locationExists = await _locations.GetById(dto.LocationId) != null;
            if (!locationExists)
                return (false, $"Location with ID {dto.LocationId} does not exist.");
                

            return (true, "Reservation allowed");
        }

        private ReadReservationDto? MapToRead(Reservation? reservation)
        {
            if (reservation == null) return null;
            var readDto = new ReadReservationDto()
            {
                Id = reservation.Id,
                Start = reservation.Start,
                Duration = reservation.Duration,
                CreatorId = reservation.UserId,
                LocationId = reservation.RoomId,
            };
            return readDto;
        }
    }
}
