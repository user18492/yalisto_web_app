# YaListo - Agent Rules (Frontend)

## Rol del agente

1. Enfoque: **Desarrollador frontend** (Vue 3 + TypeScript + Bootstrap)
2. Alcance:
   - Implementa **solo lo solicitado**
   - Puede completar lo mínimo necesario para que el código funcione correctamente
   - Puede corregir errores o violaciones de convenciones existentes
   - NO realizar cambios estructurales grandes ni alterar la arquitectura
3. Respuesta:
   - Múltiples archivos en bloques separados
   - Incluir breve explicación clara y completa
   - Código listo para usar (sin placeholders incompletos)

---

## Stack tecnológico obligatorio

- **Framework:** Vue 3 (Composition API)
- **Lenguaje:** TypeScript (strict)
- **Estado global:** Pinia
- **UI:** Bootstrap 5 (CSS + JS permitido)
- **HTTP:** fetch
- **Backend:** CodeIgniter 4 + MySQL (no modificar)

---

## Convenciones de nombres (INGLÉS)

| Elemento            | Convención              | Ejemplo                |
| ------------------- | ----------------------- | ---------------------- |
| Archivos `.vue`     | `snake_case.vue`        | `user_profile.vue`     |
| Funciones/variables | `snake_case`            | `get_user_data()`      |
| Types               | `PascalCase`            | `UserResponse`         |
| ViewModels          | `use_[name]_view_model` | `use_login_view_model` |
| Models              | `[name]_model.ts`       | `user_model.ts`        |
| Services            | `[name]_service.ts`     | `auth_service.ts`      |
| Stores (Pinia)      | `use_[name]_store`      | `use_auth_store`       |
| Rutas               | `snake_case` (path)     | `/user_profile`        |

---

## Arquitectura (flujo unidireccional)

VIEW (.vue)
↓
VIEWMODEL (use_x_view_model)
↓
SERVICES (HTTP)
↓
BACKEND

### Reglas estrictas por capa

### VIEW

- Solo template + binding + eventos
- ❌ No lógica de negocio
- ❌ No fetch / HTTP
- ❌ No transformaciones complejas

### VIEWMODEL

- Maneja:
  - estado reactivo
  - formularios
  - validaciones
  - lógica de presentación
- Puede usar:
  - `computed`
  - `watch`
- Expone datos y funciones a la vista
- Puede consumir services
- Puede usar Pinia SOLO si es necesario

### SERVICES

- Única capa que hace HTTP (fetch)
- Maneja errores con `try/catch`

- Retorna:

```ts
{ success: boolean; message: string; data?: T }
```

- data debe estar tipado explícitamente

- Responsabilidades:
  - Ejecutar requests HTTP
  - Transformar SIEMPRE la respuesta usando mappers:
    - from_json (response → model)
  - Transformar requests cuando corresponda:
    - to_json (model → request)
- No contiene:
  - lógica de negocio
  - estado

---

### MODELS

- Definidos como `type` (inmutables)
- Representan únicamente la estructura de datos

- Ubicación:
  - `src/data/models/[name].model.ts`

- Reglas:
  - No contienen funciones
  - No contienen lógica
  - No contienen transformación

---

### MAPPERS

- Responsables de la transformación de datos

- Ubicación:
  - `src/data/mappers/[name].mapper.ts`

- Funciones obligatorias:
  - `from_json(raw: unknown): Model`
  - `to_json(model: Model): unknown`

- Reglas:
  - SIEMPRE usar `from_json` para datos provenientes del backend
  - Mantener consistencia entre backend/frontend
  - Pueden normalizar, mapear o adaptar estructuras

- No contienen:
  - lógica de negocio
  - llamadas HTTP

- Deben validar tipos básicos del input (`unknown`) antes de mapear

---

## Tipado (TypeScript)

- Tipos definidos dentro del ViewModel
- Uso de `type` por defecto
- Prohibido `any`
- Usar `unknown` si es necesario
- Tipos explícitos en:
  - funciones
  - variables
  - retornos

---

## Formularios

- Manejo desde ViewModel
- La vista usa `v-model` conectado al ViewModel
- Validación:
  - manual en ViewModel

- Estructuras típicas:
  - `FormData`
  - `Errors`

---

## Estado global (Pinia)

- Evitar uso innecesario
- Usar SOLO cuando:
  - estado compartido entre múltiples vistas
  - autenticación
  - sesión global

- Preferir estado local en ViewModel

---

## UI - Bootstrap 5

- Bootstrap debe ser la base de toda la UI
- Permitido:
  - grid system
  - utilities
  - componentes JS
- Permitido CSS custom si es necesario
  - overrides
  - ajustes puntuales
- No reemplazar componentes de Bootstrap con CSS custom
- No usar librerías UI externas
- Si algo no se puede hacer con Bootstrap:
  - NO implementarlo
  - explicar por qué

---

## Routing

- Puede modificar `router/index.ts`
- Rutas en `snake_case`
- Lazy loading obligatorio

Ejemplo:

```ts
{
  path: "/register",
  name: "Register",
  component: () => import("../ui/views/register_view.vue"),
}
```

---

## Internacionalización

- Por defecto: texto en español (hardcoded)
- Puede incluir soporte opcional para múltiples idiomas si se solicita

---

## Restricciones estrictas

- No usar `any`
- No lógica en `<template>`
- No mezclar capas
- No usar librerías externas no autorizadas
- No implementar más de lo solicitado
- No crear archivos fuera del alcance del prompt

---

## Comportamiento inteligente

El agente:

- Puede:
  - agregar imports faltantes
  - corregir errores
  - completar tipos
  - hacer ajustes menores necesarios

- No debe:
  - expandir el alcance funcional
  - inventar features
  - crear services/models si no se solicitaron
  - modificar arquitectura

---

## Formato de respuesta

- Archivos separados en bloques de código
- Indicar ruta del archivo
- Código completo (no fragmentos incompletos)
- Breve explicación final (concisa)

---

## Simplicidad

- Priorizar soluciones simples y directas
- Evitar abstracciones innecesarias
- No crear capas adicionales sin justificación clara

---

## Prioridad de reglas

En caso de conflicto:

1. Este archivo (`yalisto_agent.rules.md`) define el comportamiento del agente
2. `yalisto_arch.rules.md` define la arquitectura
3. `yalisto_coding_standards.rules.md` define estilo de código
4. `yalisto_ui_theme.rules.md` define UI/UX

El agente debe respetar esta prioridad estrictamente.

---

## Modo de ejecución

- Modo: estricto
- Si falta información, el agente debe:
  - inferir lo mínimo necesario
  - no inventar funcionalidades
