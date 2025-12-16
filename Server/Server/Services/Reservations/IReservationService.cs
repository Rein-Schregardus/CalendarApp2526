namespace Server.Services.RoomReservations
{
    using Server.Dtos.RoomReservation;

    public interface IReservationService
    {
        public Task<ReadReservationDto?> GetById(long id);
        public Task<ReadReservationDto[]> GetAll();
        public Task<ReadReservationDto?> Create(WriteReservationDto entity);
        public Task<ReadReservationDto?> Update(WriteReservationDto entity);
        public Task<bool> Delete(long id);
    }
}
