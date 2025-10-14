#!/usr/bin/env pwsh
#Requires -Version 5.1

<#
.SYNOPSIS
    SpecKit Implementation Engine - Execute development tasks
.DESCRIPTION
    Implements features based on specification, plan, and task breakdown
.PARAMETER Json
    Output results as JSON
.PARAMETER Task
    Specific task ID to implement (optional, runs all if not specified)
.EXAMPLE
    .\implement.ps1 -Json
    .\implement.ps1 -Task T001 -Json
#>

param(
    [switch]$Json,
    [string]$Task
)

# Import common functions
. "$PSScriptRoot\common.ps1"

function Main {
    try {
        Write-Host "🚀 SpecKit Implementation Engine v1.0.0" -ForegroundColor Cyan
        Write-Host "Starting implementation phase..." -ForegroundColor Yellow
        
        # Check prerequisites
        $spec = Get-SpecificationPath
        $plan = Get-PlanPath
        $tasks = Join-Path (Split-Path $spec) "tasks.md"
        
        if (-not (Test-Path $spec)) {
            throw "Specification not found: $spec"
        }
        
        if (-not (Test-Path $plan)) {
            throw "Plan not found: $plan"
        }
        
        if (-not (Test-Path $tasks)) {
            throw "Tasks not found: $tasks"
        }
        
        Write-Host "✓ All prerequisites verified" -ForegroundColor Green
        
        # Start implementation
        if ($Task) {
            Write-Host "Implementing specific task: $Task" -ForegroundColor Cyan
            Implement-SpecificTask -TaskId $Task
        } else {
            Write-Host "Starting Phase 1: Foundation Setup" -ForegroundColor Cyan
            Start-Implementation
        }
        
        if ($Json) {
            $result = @{
                success = $true
                phase = "Foundation Setup"
                message = "Implementation started successfully"
            }
            Write-Output ($result | ConvertTo-Json -Depth 3)
        }
        
    } catch {
        Write-Host "✗ Error: $($_.Exception.Message)" -ForegroundColor Red
        
        if ($Json) {
            $result = @{
                success = $false
                error = $_.Exception.Message
            }
            Write-Output ($result | ConvertTo-Json -Depth 3)
        }
        
        exit 1
    }
}

function Start-Implementation {
    Write-Host "🔨 Beginning Task T001: Initialize Project Structure" -ForegroundColor Yellow
    
    # Create project structure
    Initialize-ProjectStructure
    
    Write-Host "✓ Phase 1 Task T001 completed" -ForegroundColor Green
    Write-Host "Ready to continue with T002: Base HTML Structure" -ForegroundColor Cyan
}

function Initialize-ProjectStructure {
    # Create src directory structure
    $srcDir = "src"
    $directories = @("css", "js", "images", "components")
    
    if (-not (Test-Path $srcDir)) {
        New-Item -ItemType Directory -Path $srcDir | Out-Null
        Write-Host "Created src/ directory" -ForegroundColor Green
    }
    
    foreach ($dir in $directories) {
        $fullPath = Join-Path $srcDir $dir
        if (-not (Test-Path $fullPath)) {
            New-Item -ItemType Directory -Path $fullPath | Out-Null
            Write-Host "Created $fullPath/ directory" -ForegroundColor Green
        }
    }
    
    # Create package.json for dependency management
    Create-PackageJson
    
    # Update .gitignore if needed
    Update-GitIgnore
}

function Create-PackageJson {
    $packageJsonPath = "package.json"
    
    if (-not (Test-Path $packageJsonPath)) {
        $packageContent = @{
            name = "crafty-fox-web"
            version = "1.0.0"
            description = "Modern, responsive landing page for Crafty Fox Publishing"
            main = "index.html"
            scripts = @{
                dev = "npx live-server --port=8080"
                build = "echo Static site - no build required"
                lint = "npx htmlhint index.html"
                test = "echo Tests will be added later"
            }
            repository = @{
                type = "git"
                url = "git+https://github.com/Marc-Reynolds/CraftyFoxWeb.git"
            }
            keywords = @("publishing", "books", "authors", "landing-page", "responsive")
            author = "Crafty Fox Publishing"
            license = "MIT"
            bugs = @{
                url = "https://github.com/Marc-Reynolds/CraftyFoxWeb/issues"
            }
            homepage = "https://github.com/Marc-Reynolds/CraftyFoxWeb#readme"
            devDependencies = @{
                "live-server" = "^1.2.2"
                "htmlhint" = "^1.1.4"
                "stylelint" = "^15.10.0"
                "stylelint-config-standard" = "^34.0.0"
            }
        } | ConvertTo-Json -Depth 4
        
        Set-Content -Path $packageJsonPath -Value $packageContent
        Write-Host "Created package.json" -ForegroundColor Green
    }
}

function Update-GitIgnore {
    $gitignorePath = ".gitignore"
    $additionalEntries = @(
        "# Development tools",
        ".vscode/settings.json",
        "",
        "# Temporary files", 
        "*.tmp",
        "*.temp"
    )
    
    if (Test-Path $gitignorePath) {
        $currentContent = Get-Content $gitignorePath
        $newEntries = $additionalEntries | Where-Object { $_ -notin $currentContent }
        
        if ($newEntries.Count -gt 0) {
            Add-Content -Path $gitignorePath -Value "`n$($newEntries -join "`n")"
            Write-Host "Updated .gitignore with development entries" -ForegroundColor Green
        }
    }
}

function Implement-SpecificTask {
    param([string]$TaskId)
    
    switch ($TaskId) {
        "T001" { Initialize-ProjectStructure }
        "T002" { Create-BaseHtml }
        "T003" { Setup-CssArchitecture }
        default { throw "Task $TaskId not implemented yet" }
    }
}

# Run main function
Main