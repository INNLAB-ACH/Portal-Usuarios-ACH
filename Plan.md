# Plan de Implementacion - Portal de Usuarios ACH

## Objetivo
Implementar un prototipo web componentizado para ACH Colombia con menu lateral y modulos de:
- Inicio (dashboard financiero)
- Transacciones
- Prestamos
- Facturas por pagar
- Seguridad social
- Configuracion

## Stack
- Next.js 16 (App Router)
- TypeScript
- Tailwind CSS
- Shadcn/ui
- Datos mock en cliente

## Estado actual (inicio de implementacion)
1. Proyecto base Next.js creado en carpeta `portal-usuarios-ach-web`.
2. Tema visual alineado a colores ACH (azul principal y turquesa secundario).
3. Login mock funcional con sesion en sessionStorage.
4. Layout protegido con sidebar + topbar.
5. Dashboard con metricas y tabla de ultimas transacciones.
6. Modulo de transacciones con filtros y exportes PDF/CSV.
7. Modulo de prestamos con cupos y wizard de autorizacion de pago.
8. Modulo de facturas con seleccion multiple y wizard de pago.
9. Modulo de seguridad social con planilla, datos base e historial de novedades.
10. Modulo de configuracion inicial.

## Fases siguientes
1. Refinar UI y accesibilidad (estados vacios, focus states, contraste).
2. Completar filtros avanzados (fechas, montos, paginacion real).
3. Consolidar formularios con validaciones mas robustas.
4. Agregar pruebas basicas (unitarias y e2e de flujo principal).
5. Integrar backend/API cuando se defina contrato.

## Entregables inmediatos
- Prototipo navegable de extremo a extremo.
- Estructura componentizada y escalable.
- Base lista para iteraciones funcionales y de negocio.
