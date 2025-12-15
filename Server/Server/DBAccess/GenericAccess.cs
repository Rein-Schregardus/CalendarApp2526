
namespace Server.DBAccess
{
    public class GenericAccess<T, IdT> : IRepository<T, IdT>
    {
        public T Create(T entity)
        {
            throw new NotImplementedException();
        }

        public T Delete(T entity)
        {
            throw new NotImplementedException();
        }

        public T[] GetAll()
        {
            throw new NotImplementedException();
        }

        public T GetById(IdT id)
        {
            throw new NotImplementedException();
        }

        public IQueryable GetQueryable()
        {
            throw new NotImplementedException();
        }

        public T Update(T entity)
        {
            throw new NotImplementedException();
        }
    }
}
