using IdleSdk.Core.Data;

namespace IdleSdk.Core.Tests.Data;

public class DataPackValidatorTests
{
    [Fact]
    public async Task ValidateJson_ReturnsErrors_WhenInvalid()
    {
        var schemaJson = """
        {
          "$schema": "https://json-schema.org/draft/2020-12/schema",
          "type": "object",
          "properties": {
            "name": { "type": "string" },
            "version": { "type": "string" }
          },
          "required": ["name", "version"],
          "additionalProperties": false
        }
        """;

        var validator = await DataPackValidator.FromSchemaJsonAsync(schemaJson);
        var result = validator.ValidateJson("{\"name\":123}");

        Assert.False(result.IsValid);
        Assert.NotEmpty(result.Errors);
    }

    [Fact]
    public async Task ValidateJson_Succeeds_WhenValid()
    {
        var schemaJson = """
        {
          "$schema": "https://json-schema.org/draft/2020-12/schema",
          "type": "object",
          "properties": {
            "name": { "type": "string" },
            "version": { "type": "string" }
          },
          "required": ["name", "version"],
          "additionalProperties": false
        }
        """;

        var validator = await DataPackValidator.FromSchemaJsonAsync(schemaJson);
        var result = validator.ValidateJson("{\"name\":\"pack\",\"version\":\"1\"}");

        Assert.True(result.IsValid);
        Assert.Empty(result.Errors);
    }

      [Fact]
      public async Task FromSchemaJsonAsync_Rejects_Empty_Schema()
      {
        await Assert.ThrowsAsync<ArgumentException>(() => DataPackValidator.FromSchemaJsonAsync(""));
      }

      [Fact]
      public async Task FromSchemaPathAsync_Loads_Schema_File()
      {
        var path = Path.Combine(Path.GetTempPath(), $"schema-{Guid.NewGuid():N}.json");
        File.WriteAllText(path, """
        {
          "$schema": "https://json-schema.org/draft/2020-12/schema",
          "type": "object",
          "properties": {
          "name": { "type": "string" }
          },
          "required": ["name"]
        }
        """);

        try
        {
          var validator = await DataPackValidator.FromSchemaPathAsync(path);
          var result = validator.ValidateJson("{\"name\":\"pack\"}");

          Assert.True(result.IsValid);
        }
        finally
        {
          if (File.Exists(path))
          {
            File.Delete(path);
          }
        }
      }
}
