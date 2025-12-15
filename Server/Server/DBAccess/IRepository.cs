namespace Server.DBAccess
{
    public interface IRepository<T, IdT>
    {
        public T GetById(IdT id);
        public T[] GetAll();
        public T Create(T entity);
        public T Update(T entity);
        public T Delete(T entity);
        public IQueryable GetQueryable();
    }
}
