using RFIDFlow.API.Models;
using RFIDFlow.API.Services;
using RFIDFlow.API.Services.Readers;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers();

builder.Services.AddEndpointsApiExplorer();

builder.Services.AddSwaggerGen();

builder.Services.AddSingleton<RFIDReadBuffer>();

builder.Services.AddSingleton<PresenceService>();

builder.Services.AddHttpClient();

builder.Services.AddHttpClient<BarsysApiClient>();

builder.Services.AddSingleton<
    MultiReaderProvider>();

builder.Services.AddSingleton<
    IRFIDReaderProvider,
    ImpinjR700Provider>();

builder.Services.AddHostedService<
    ReaderHostedService>();

builder.Services.Configure<RFIDOptions>(
    builder.Configuration.GetSection(
        "RFID"
    )
);

builder.Services.AddSingleton<
    ReaderRegistry>();

builder.Services.AddSingleton<
    ReaderFactory>();

builder.Services.AddCors(options =>
{
    options.AddPolicy(
        "AllowFrontend",
        policy =>
        {
            policy
                .AllowAnyOrigin()
                .AllowAnyHeader()
                .AllowAnyMethod();
        });
});

var app = builder.Build();

app.UseSwagger();

app.UseSwaggerUI();

app.UseCors("AllowFrontend");

app.UseHttpsRedirection();

app.MapControllers();

app.Run();