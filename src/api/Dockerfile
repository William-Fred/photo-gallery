# Build application
# Use .net sdk image
FROM mcr.microsoft.com/dotnet/sdk:10.0 AS build
WORKDIR /app

# Copy csproj and restore as distinct layers
COPY ["src/api/api.csproj", "src/api/"]
RUN dotnet restore "src/api/api.csproj"

# Copy everything else and build
COPY src/api/. src/api/
WORKDIR "/app/src/api"
RUN dotnet publish "api.csproj" -c Release -o /app/publish

# Runtime image
FROM mcr.microsoft.com/dotnet/aspnet:10.0 AS runtime
WORKDIR /app
COPY --from=build /app/publish .
ENTRYPOINT ["dotnet", "api.dll"]