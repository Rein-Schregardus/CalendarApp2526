namespace Server.DBAccess
{
    public interface IRepository<T, IdT>
    {
        public Task<T?> GetById(IdT id);
        public Task<T[]> GetAll();
        public Task<T?> Create(T entity);
        public Task<T?> Update(T entity);
        public Task<bool> Delete(IdT id);
        public IQueryable GetQueryable();
    }
}
