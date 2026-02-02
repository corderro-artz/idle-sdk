param(
    [int]$Port = 1337,
    [string]$Directory = "src/idle-sdk.web"
)
$ErrorActionPreference = "Stop"

python -m http.server $Port --directory $Directory
