# YaListo - Architecture Rules

## Capas del sistema

El sistema se divide en dos dominios principales:

- **UI Layer**
  - Views
  - ViewModels

- **Data Layer**
  - Models
  - Mappers
  - Services

---

## Flujo de datos (unidireccional)

Flujo descendente (request):

USER → VIEW → VIEWMODEL → SERVICE → BACKEND

Flujo ascendente (response):

BACKEND → SERVICE → MAPPER → MODEL → VIEWMODEL → VIEW → USER

---

## Reglas de dependencia (CRÍTICO)

Dependencias permitidas:

- VIEW → VIEWMODEL (invoca)
- VIEWMODEL → SERVICE (invoca)
- VIEWMODEL → MODEL (usa tipos)
- SERVICE → MAPPER (invoca)
- MAPPER → MODEL (usa tipos)

Dependencias prohibidas:

- VIEW → SERVICE
- VIEW → MODEL
- SERVICE → VIEWMODEL
- SERVICE → VIEW
- MODEL → SERVICE
- MODEL → VIEWMODEL
- MAPPER → SERVICE

---

## Responsabilidades por capa

### VIEW (UI)

- Renderizar UI
- Emitir eventos
- Consumir datos del ViewModel

- No lógica de negocio
- No acceso a services
- No transformación de datos

---

### VIEWMODEL

- Orquestador principal de la UI

Responsable de:

- estado reactivo
- lógica de presentación
- manejo de formularios
- validaciones
- invocación de services

- Puede:
  - usar models
  - usar services

- No hacer HTTP directo
- No acceder a mappers directamente

---

### MODEL

- Representa la estructura de datos (inmutable)

- No lógica
- No transformación
- No dependencias

---

### MAPPER

- Responsable de transformar datos

- Funciones:
  - `from_json`
  - `to_json`

- Convierte:
  - API → Model
  - Model → API

- No lógica de negocio
- No HTTP
- No estado

---

### SERVICE

- Capa de acceso a datos (HTTP)

Responsable de:

- ejecutar requests
- manejar errores
- usar mappers
- devolver datos tipados

- No lógica de negocio
- No estado compartido

---

## Reglas de flujo

- El flujo SIEMPRE debe pasar por:
  - ViewModel → Service → Mapper → Model

- Prohibido:
  - saltarse capas
  - acceder directamente al backend desde ViewModel sin Service
  - mapear datos fuera de los mappers

---

## Organización de carpetas

```text
src/
├── ui/
│   ├── views/
│   └── viewmodels/
│
├── data/
│   ├── models/
│   ├── mappers/
│   └── services/
```

---

## Reglas de escalabilidad

- Cada model debe tener un mapper:
  - 1 model = 1 mapper

- Cada view debe tener un viewmodel:
  - 1 view = 1 viewmodel

- Service por use case:
  - agrupar operaciones relacionadas
  - evitar services genéricos

Ejemplos:

- auth_service (register, login)
- profile_service (change_profile_data, change_password, revoke_current_session, revoke_all_sessions)

- Reutilización:
  - Un service puede ser usado por múltiples viewmodels
  - Un model puede ser usado por múltiples services/viewmodels
  - Un mapper solo transforma su model asociado

- Evitar:
  - archivos genéricos gigantes
  - lógica compartida mal ubicada
  - No crear “shared” o “utils” sin un caso claro

---

# Reglas de consistencia

- SIEMPRE usar from_json al recibir datos
- NO asumir que el backend es confiable
- Mantener separación estricta entre capas

---

# Anti-patrones prohibidos

- lógica de negocio en services
- lógica en views
- transformar datos en viewmodel
- compartir estado global innecesario
- acoplar capas directamente

---

# Modo de ejecución

- Modo: estricto
- El agente debe:
  - respetar la arquitectura definida
  - no saltar capas
  - no simplificar el flujo eliminando componentes

---
