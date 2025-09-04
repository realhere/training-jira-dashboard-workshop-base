# Use the .NET SDK image, which contains all necessary tools for development
FROM mcr.microsoft.com/dotnet/sdk:8.0
WORKDIR /app

# Copy csproj and restore as distinct layers to leverage Docker cache
COPY *.csproj ./
RUN dotnet restore

# Copy the rest of the application files
COPY . ./

