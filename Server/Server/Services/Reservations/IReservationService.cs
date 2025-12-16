namespace Server.Services.RoomReservations
{
    using Server.Dtos.RoomReservation;

    public interface IReservationService
    {
        public Task<ReadReservationDto?> GetById(long id);
        public Task<ReadReservationDto[]> GetAll();
        public Task<ReadReservationDto?> Create(WriteReservationDto entity);
        public Task<ReadReservationDto?> Update(long id, WriteReservationDto entity);
        public Task<bool> Delete(long id);
        public Task<(bool, string)> IsReservationLegal(WriteReservationDto entity, long? id = null);
    }
}
