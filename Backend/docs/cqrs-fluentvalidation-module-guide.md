# Barsys RFIDFlow - CQRS + FluentValidation Module Guide

## Objetivo

Separar responsabilidades de la API empresarial:

- Controllers: transporte HTTP y códigos de respuesta.
- Commands: operaciones que modifican estado.
- Queries: operaciones de lectura.
- Validators: reglas de entrada por caso de uso.
- Handlers: lógica de aplicación.
- Repositories: persistencia abstraída.
- Domain: entidades y reglas puras.

## Flujo de una operación

```text
HTTP Request
  -> Controller
  -> ISender.Send(command/query)
  -> ValidationBehavior
  -> Validator específico
  -> Handler
  -> Repository / DbContext
  -> Response
```

## Casos de uso generados

### Assets

- `CreateAssetCommand`
- `AssignTagToAssetCommand`
- `GetAssetTimelineQuery`

### RFID

- `IngestRfidReadEventCommand`
- `IngestRfidReadEventBatchCommand`

### Inventory

- `CreateInventoryMovementCommand`
- `CompleteInventoryCountCommand`

### WorkOrders

- `CreateWorkOrderCommand`

## Próximos handlers recomendados

- `CreateInventoryCountCommand`
- `AddInventoryCountLineCommand`
- `CreateRfidSessionCommand`
- `CloseRfidSessionCommand`
- `CreateWebhookSubscriptionCommand`
- `CreateAlertRuleCommand`
- `ExportReportCommand`
- `CreateUserCommand`
- `AssignUserRolesCommand`
