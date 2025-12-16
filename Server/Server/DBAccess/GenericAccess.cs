
using Microsoft.EntityFrameworkCore;
using Server.Db;
using Server.Entities;

namespace Server.DBAccess
{
    public class GenericAccess<T, IdT> : IRepository<T, IdT> where T : class, IDbEntity<IdT> where IdT : IEquatable<IdT>
    {
        AppDbContext _db;

        public GenericAccess(AppDbContext db)
        {
            _db = db;
        }

        public async Task<T?> Create(T entity)
        {
            var trackedobj = (await _db.Set<T>().AddAsync(entity)).Entity;
            await _db.SaveChangesAsync();
            return trackedobj;
        }

        public async Task<bool> Delete(IdT id)
        {
            bool isDeleted = 1 == await _db.Set<T>().Where(e => e.Id.Equals(id)).ExecuteDeleteAsync();
            await _db.SaveChangesAsync();
            return isDeleted;
        }

        public async Task<T[]> GetAll()
        {
            var entities = await _db.Set<T>().ToArrayAsync();
            return entities;
        }

        public async Task<T?> GetById(IdT id)
        {
            var entity = await _db.FindAsync<T>(id);
            return entity;
        }

        public IQueryable GetQueryable()
        {
            return _db.Set<T>().AsQueryable();
        }

        public async Task<T?> Update(T entity)
        {
            var trackedObj = _db.Set<T>().Update(entity);
            await _db.SaveChangesAsync();
            return trackedObj.Entity;
        }
    }
}
