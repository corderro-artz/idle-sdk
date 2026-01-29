using NJsonSchema;

namespace IdleSdk.Core.Data;

public sealed class DataPackValidator
{
    private readonly JsonSchema _schema;

    private DataPackValidator(JsonSchema schema)
    {
        _schema = schema ?? throw new ArgumentNullException(nameof(schema));
    }

    public static async Task<DataPackValidator> FromSchemaJsonAsync(string schemaJson, CancellationToken cancellationToken = default)
    {
        if (string.IsNullOrWhiteSpace(schemaJson))
        {
            throw new ArgumentException("Schema JSON must be provided.", nameof(schemaJson));
        }

        var schema = await JsonSchema.FromJsonAsync(schemaJson, cancellationToken);
        return new DataPackValidator(schema);
    }

    public static Task<DataPackValidator> ForContentPackManifestAsync(CancellationToken cancellationToken = default)
    {
        return FromSchemaJsonAsync(DataPackSchemas.ContentPackManifestSchema, cancellationToken);
    }

    public static async Task<DataPackValidator> FromSchemaPathAsync(string schemaPath, CancellationToken cancellationToken = default)
    {
        if (string.IsNullOrWhiteSpace(schemaPath))
        {
            throw new ArgumentException("Schema path must be provided.", nameof(schemaPath));
        }

        var schemaJson = await File.ReadAllTextAsync(schemaPath, cancellationToken);
        return await FromSchemaJsonAsync(schemaJson, cancellationToken);
    }

    public DataPackValidationResult ValidateJson(string dataPackJson)
    {
        if (string.IsNullOrWhiteSpace(dataPackJson))
        {
            throw new ArgumentException("Data pack JSON must be provided.", nameof(dataPackJson));
        }
        var errors = Array.Empty<NJsonSchema.Validation.ValidationError>();
        try
        {
            errors = _schema.Validate(dataPackJson).ToArray();
        }
        catch (Exception ex) when (ex is System.Text.Json.JsonException || ex is Newtonsoft.Json.JsonReaderException)
        {
            return DataPackValidationResult.Failure(new[]
            {
                new ValidationError(string.Empty, ex.Message)
            });
        }
        if (errors.Length == 0)
        {
            return DataPackValidationResult.Success();
        }

        var mapped = errors.Select(error => new ValidationError(error.Path ?? string.Empty, error.ToString()));
        return DataPackValidationResult.Failure(mapped);
    }
}
