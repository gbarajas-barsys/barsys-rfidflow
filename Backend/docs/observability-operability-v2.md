# Barsys RFIDFlow - Observabilidad y Operación Empresarial v2

## Objetivo

Agregar capacidad operativa empresarial desde el backend base:

- Logs estructurados con Serilog.
- Correlation ID para trazabilidad por request.
- Auditoría operativa HTTP.
- OpenTelemetry para métricas y trazas.
- Health checks de proceso y PostgreSQL.
- Métricas específicas de RFID, activos e inventario.
- Endpoint Prometheus `/metrics`.
- Docker Compose con Seq y OpenTelemetry Collector.

## Endpoints operativos

```text
/health/live
/health/ready
/metrics
/v2/system/health
/v2/system/version
```

## Headers soportados

```text
X-Correlation-Id
X-Tenant-Id
```

Si `X-Correlation-Id` no viene en la solicitud, el middleware genera uno y lo devuelve en la respuesta.

## Métricas de negocio iniciales

```text
rfid_read_events_accepted_total
rfid_read_events_rejected_total
rfid_batch_size
assets_created_total
inventory_movements_created_total
```

## Ejecutar localmente

```bash
docker compose up --build
```

Abrir:

```text
API: http://localhost:8080/swagger
Prometheus scrape endpoint: http://localhost:8080/metrics
Seq: http://localhost:5341
PostgreSQL: localhost:5432
```

## Producción

Para producción se recomienda:

- Enviar OTLP a Azure Monitor, Grafana Cloud, Datadog, New Relic o collector administrado.
- Activar sampling de trazas.
- Usar secretos para conexión PostgreSQL.
- Enmascarar datos sensibles en logs.
- Crear alertas sobre readiness, tasa de errores, latencia p95 y rfid_read_events_rejected_total.
