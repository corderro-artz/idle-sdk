using IdleSdk.Core.Skills;

namespace IdleSdk.Core.Tests.Skills;

public class LinearXpCurveTests
{
    [Fact]
    public void GetTotalXpForLevel_Computes_Linear_Progression()
    {
        var curve = new LinearXpCurve(100, 50);

        Assert.Equal(0, curve.GetTotalXpForLevel(1));
        Assert.Equal(100, curve.GetTotalXpForLevel(2));
        Assert.Equal(150, curve.GetTotalXpForLevel(3));
        Assert.Equal(200, curve.GetTotalXpForLevel(4));
    }

    [Fact]
    public void Constructor_Rejects_Negative_Values()
    {
        Assert.Throws<ArgumentOutOfRangeException>(() => new LinearXpCurve(-1, 0));
        Assert.Throws<ArgumentOutOfRangeException>(() => new LinearXpCurve(0, -1));
    }

    [Fact]
    public void GetTotalXpForLevel_Rejects_Invalid_Level()
    {
        var curve = new LinearXpCurve(10, 5);

        Assert.Throws<ArgumentOutOfRangeException>(() => curve.GetTotalXpForLevel(0));
    }
}
