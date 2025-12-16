namespace Server.Services.RoomReservations
{
    using System;
    using Server.Db;
    using Server.DBAccess;
    using Server.Dtos.RoomReservation;
    using Server.Entities;

    public class ReservationService
    {
        private IRepository<Reservation, long> _db;

        public ReservationService(AppDbContext dbContext)
        {
            _db = new GenericAccess<Reservation, long>(dbContext);
        }

        public async Task<ReadReservationDto?> GetById(long id)
        {
            var reservation = await _db.GetById(id);
            if (reservation == null) return null;

            var dto = MapToRead(reservation);
            return dto;
        }

        public async Task<ReadReservationDto[]> GetAll()
        {
            var reservations = await _db.GetAll();
            var dtos = new ReadReservationDto[reservations.Length];

            for (int i = 0; i < dtos.Length; i++)
            {
                var reservation = reservations[i];
                var dto = MapToRead(reservation);
            }
            return dtos;
        }

        public async Task<ReadReservationDto?> Create(WriteReservationDto dto)
        {
            var reservation = new Reservation()
            {
                RoomId = dto.LocationId,
                UserId = dto.CreatorId,
                Duration = dto.Duration,
                Start = dto.Start,
                CreatedAt = DateTime.UtcNow,

            };
            var dbResult = await _db.Create(reservation);

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
                UserId = dto.CreatorId,
                Duration = dto.Duration,
                Start = dto.Start,
                CreatedAt = DateTime.UtcNow,
            };
            var dbResult = await _db.Update(reservation);

            if (dbResult == null) return null;

            var readDto = MapToRead(dbResult);

            return readDto;
        }

        public async Task<bool> Delete(long id)
        {
            return await _db.Delete(id);
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
