using Server.Enums;

public class ReadSchedualItem
{
    public long Id { get; init; }
    public string Title { get; init; }
    public DateTime Start {get; init; }
    public int Duration {get; init; }
    public SchedualItemType Type { get; init; }
    public object Payload { get; init; }
}