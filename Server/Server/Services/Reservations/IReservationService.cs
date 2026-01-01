namespace Server.Services.RoomReservations
{
    using Server.Dtos.RoomReservation;

    public interface IReservationService
    {
        public Task<ReadReservationDto?> GetById(long id);
        public Task<ReadReservationDto[]> GetAll();
        public Task<ReadReservationDto?> Create(long userId, WriteReservationDto entity);
        public Task<bool> CanDeleteReservation (long userId, long reservationId);
        public Task<ReadReservationDto?> Update(long id, long userId, WriteReservationDto entity);
        public Task<bool> Delete(long id);
        public Task<(bool, string)> IsReservationLegal(WriteReservationDto entity, long? id = null);
    }
}
