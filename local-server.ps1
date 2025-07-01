# PowerShell Simple HTTP Server for negi-lab.com testing
# Usage: Run this script from the project root directory

param(
    [int]$Port = 8000
)

$ErrorActionPreference = "Stop"

Write-Host "Starting simple HTTP server on port $Port..." -ForegroundColor Green
Write-Host "Open your browser and navigate to: http://localhost:$Port" -ForegroundColor Yellow
Write-Host "Press Ctrl+C to stop the server" -ForegroundColor Gray

try {
    Add-Type -AssemblyName System.Web
    
    $listener = New-Object System.Net.HttpListener
    $listener.Prefixes.Add("http://localhost:$Port/")
    $listener.Start()
    
    Write-Host "Server started successfully!" -ForegroundColor Green
    
    while ($listener.IsListening) {
        $context = $listener.GetContext()
        $request = $context.Request
        $response = $context.Response
        
        # Get requested path
        $path = $request.Url.LocalPath
        Write-Host "$(Get-Date -Format 'HH:mm:ss') - $($request.HttpMethod) $path" -ForegroundColor Cyan
        
        # Default to index.html for root path
        if ($path -eq "/" -or $path -eq "") {
            $path = "/index.html"
        }
        
        # Construct full file path
        $fullPath = Join-Path (Get-Location) $path.TrimStart('/')
        
        try {
            if (Test-Path $fullPath -PathType Leaf) {
                # Read file content
                $content = [System.IO.File]::ReadAllBytes($fullPath)
                
                # Set content type based on extension
                $ext = [System.IO.Path]::GetExtension($fullPath).ToLower()
                $contentType = switch ($ext) {
                    ".html" { "text/html; charset=utf-8" }
                    ".js"   { "application/javascript; charset=utf-8" }
                    ".css"  { "text/css; charset=utf-8" }
                    ".json" { "application/json; charset=utf-8" }
                    ".png"  { "image/png" }
                    ".jpg"  { "image/jpeg" }
                    ".jpeg" { "image/jpeg" }
                    ".gif"  { "image/gif" }
                    ".svg"  { "image/svg+xml" }
                    ".ico"  { "image/x-icon" }
                    default { "application/octet-stream" }
                }
                
                # Send response
                $response.ContentType = $contentType
                $response.ContentLength64 = $content.Length
                $response.StatusCode = 200
                $response.OutputStream.Write($content, 0, $content.Length)
                
                Write-Host "  -> 200 OK ($($content.Length) bytes)" -ForegroundColor Green
            }
            else {
                # File not found
                $errorMessage = "404 - File Not Found: $path"
                $errorBytes = [System.Text.Encoding]::UTF8.GetBytes($errorMessage)
                
                $response.StatusCode = 404
                $response.StatusDescription = "Not Found"
                $response.ContentType = "text/plain; charset=utf-8"
                $response.ContentLength64 = $errorBytes.Length
                $response.OutputStream.Write($errorBytes, 0, $errorBytes.Length)
                
                Write-Host "  -> 404 Not Found" -ForegroundColor Red
            }
        }
        catch {
            # Internal server error
            $errorMessage = "500 - Internal Server Error: $($_.Exception.Message)"
            $errorBytes = [System.Text.Encoding]::UTF8.GetBytes($errorMessage)
            
            $response.StatusCode = 500
            $response.StatusDescription = "Internal Server Error"
            $response.ContentType = "text/plain; charset=utf-8"
            $response.ContentLength64 = $errorBytes.Length
            $response.OutputStream.Write($errorBytes, 0, $errorBytes.Length)
            
            Write-Host "  -> 500 Error: $($_.Exception.Message)" -ForegroundColor Red
        }
        finally {
            $response.OutputStream.Close()
        }
    }
}
catch {
    Write-Host "Error starting server: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}
finally {
    if ($listener -and $listener.IsListening) {
        $listener.Stop()
        Write-Host "Server stopped." -ForegroundColor Yellow
    }
}
