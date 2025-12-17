namespace Server.Entities
{
    public interface IDbEntity<IdT>
    {
        IdT Id { get; set; }
    }
}
