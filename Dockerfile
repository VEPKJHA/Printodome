# Build Stage
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /app

# Copy solution and csproj files for layer caching
COPY Printodome.sln ./
COPY src/Printodome.Domain/Printodome.Domain.csproj src/Printodome.Domain/
COPY src/Printodome.Application/Printodome.Application.csproj src/Printodome.Application/
COPY src/Printodome.Infrastructure/Printodome.Infrastructure.csproj src/Printodome.Infrastructure/
COPY src/Printodome.Api/Printodome.Api.csproj src/Printodome.Api/
COPY tests/Printodome.Tests/Printodome.Tests.csproj tests/Printodome.Tests/

RUN dotnet restore Printodome.sln

# Copy the rest of the source code and build
COPY src/ src/
COPY tests/ tests/
WORKDIR /app/src/Printodome.Api
RUN dotnet publish -c Release -o /app/publish

# Runtime Stage
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS runtime
WORKDIR /app
COPY --from=build /app/publish .

ENV ASPNETCORE_URLS=http://+:8080
ENV ASPNETCORE_ENVIRONMENT=Production
EXPOSE 8080

ENTRYPOINT ["dotnet", "Printodome.Api.dll"]

