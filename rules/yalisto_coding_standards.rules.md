# YaListo - Coding Standards

## Naming

- Archivos, funciones y variables: `snake_case`
- Types: `PascalCase`

---

## Estructura de archivos

### Orden obligatorio

1. Imports
2. Types
3. Constantes
4. Estado (reactive/ref)
5. Computed
6. Watchers
7. Funciones
8. Export

---

## Imports

- Orden:
  1. Librerías externas (vue, pinia, etc.)
  2. Módulos internos (services, models, etc.)
  3. Estilos (si aplica)

- No usar imports innecesarios
- No duplicar imports

---

## Funciones

- Todas las funciones deben tener:
  - tipo de parámetros
  - tipo de retorno

```ts
const get_user_data = async (): Promise<User> => {};
```

- Evitar funciones largas
- Una función = una responsabilidad

---

## Variables

- Siempre tipadas explícitamente (cuando no sea inferencia obvia)

```ts
const user_name: string = "";
```

- Evitar mutaciones innecesarias

---

## Tipos

- Definir tipos en el ViewModel (excepto models)
- Usar `type` por defecto
- Evitar duplicación de tipos

---

## Manejo de null / undefined

- Manejar explícitamente

```ts
if (!user) return;
```

- No asumir valores definidos

---

## Async / Await

- Usar siempre `async/await`
- No usar `.then()`

---

## Condicionales

- Evitar anidaciones profundas
- Usar early returns

```ts
if (!form_valid) return;
```

---

## Vue (Composition API)

- Usar `setup` con Composition API
- Separar claramente:
  - estado
  - lógica
  - efectos

---

## Reactividad

- Usar:
  - `ref` para primitivos
  - `reactive` para objetos

- No mezclar sin necesidad

---

## Formularios

- Tipar `FormData`
- Tipar `Errors`

---

## Comentarios

- Solo cuando sea necesario
- Explicar “por qué”, no “qué”

---

## Código limpio

- No dejar:
  - console.log
  - código comentado innecesario
  - variables sin uso

---

## Consistencia

- Mantener mismo estilo en todo el archivo
- No mezclar estilos

---

## Restricciones

- No usar `any`
- No usar funciones sin tipo
- No usar lógica compleja inline

---

## Modo de ejecución

- Modo: estricto

El agente debe:

- respetar estas convenciones
- no improvisar estilos
- mantener consistencia total en el archivo generado
