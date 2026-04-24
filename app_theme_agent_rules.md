# Reglas de Vista para el Sistema de Gestión de Pedidos - YaListo

## General
- **Tema:** Colores cálidos.
  - Color primario: naranja (`#orange` o similar).
  - Background: clarito, blanco (`#ffffff` o `#fafafa`).
  - **No usar gradients** en botones ni fondos.
  - **Usar shadows** (sombras) en botones y efectos hover.
- **Navbar:** Fijada al hacer scroll (up/down). Contiene:
  - Logo o texto "YaListo" en color naranja.
  - Avatar del cliente (default si no hay `avatar_url`).
  - Ícono de carrito.
  - Ícono de logout (puerta con flecha hacia afuera).
- **Footer:** Minimalista. Incluye enlaces a: Términos y condiciones, Contacto, etc.

---

## 1. Home
- **Buscador:** Campo de texto para buscar productos o restaurantes.
- **Listado de restaurantes (destacados):**
  - Límite: 5 restaurantes.
  - Título del listado seguido de un enlace "Ver todos".
- **Listado de categorías globales:** Explora por categorías (ej. bebidas, postres, fast food, healthy).

---

## 2. Login
- Formulario con campos:
  - Email
  - Password
  - Checkbox: "Recordarme"
- Botón de envío.

---

## 3. Register
- Formulario con campos:
  - Nombre
  - Apellido
  - Email
  - Password
  - Confirmar Password
  - Checkbox: "Acepto términos y condiciones"
- Botón de registro.

---

## 4. Profile
- **Cambiar datos de usuario** (nombre, apellido, email, avatar).
- **Cambiar contraseña** (campos: password actual, nueva password, confirmar nueva).
- **Eliminar cuenta** (botón con confirmación).

---

## 5. Restaurantes
- Listado completo de restaurantes.
- Cada restaurante muestra:
  - Listado de categorías (ej. bebidas, fast food, healthy).
  - Cada categoría tiene un listado de productos.
- **Producto (por cada item):**
  - Imagen de la comida
  - Nombre
  - Descripción
  - Precio
  - Botón "Agregar al carrito" o "Agregar"

---

## 6. Cart
- Listado de `cart items` del usuario.
- Por cada item:
  - Cantidad modificable (selector + / - o input numérico)
  - Botón "Quitar"
- Resumen del carrito:
  - Subtotal
  - Costo de envío
  - Total
- Botón **"Confirmar pedido"** (redirige a checkout — flujo pendiente de pago).
- Botón **"Vaciar carrito"** (icono clear/empty, ubicado arriba).

---

## 7. Pedidos
- Listado de **pedidos activos**.
- **Al hacer clic en un pedido:** Vista de seguimiento con:
  - Nombre del restaurante
  - Tiempo estimado
  - Hora estimada de entrega
  - Estados del pedido: `pending`, `confirmed`, `preparing`, `delivering`, `delivered`, `cancelled`
  - **Dirección de entrega** (modificable):
    - `delivery_street`
    - `delivery_house_number`
    - `delivery_floor`
    - `delivery_apartment`
    - `delivery_notes`
    - `delivery_city`
    - `delivery_province`
    - `delivery_postal_code`