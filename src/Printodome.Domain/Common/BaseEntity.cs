namespace Printodome.Domain.Common;

/// <summary>
/// Base entity representing the core contract for persisted domain entities.
/// </summary>
public abstract class BaseEntity
{
    public Guid Id { get; protected set; } = Guid.NewGuid();
    public DateTime CreatedAtUtc { get; protected set; } = DateTime.UtcNow;
    public DateTime? UpdatedAtUtc { get; protected set; }

    public void SetUpdated()
    {
        UpdatedAtUtc = DateTime.UtcNow;
    }
}

