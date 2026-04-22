# Plan de Implementacion - Portal de Usuarios ACH

## Objetivo
Construir un prototipo web componentizado para ACH Colombia con foco en:
- Operacion financiera integral del usuario.
- Pagos, prestamos, facturas y seguridad social en un solo canal.
- Base tecnica lista para evolucionar a integracion con backend.

## Stack y Arquitectura
- Next.js 16 (App Router, export estatico)
- TypeScript
- Tailwind CSS + Shadcn/ui
- Recharts para visualizacion
- jsPDF y PapaParse para exportes
- Estado en cliente con useState/useMemo/useEffect
- Persistencia local con localStorage/sessionStorage

## Estado Real de Implementacion (actualizado)

### 1) Fundacion de la app
1. Proyecto Next.js inicializado en subcarpeta portal-usuarios-ach-web.
2. Tema visual ACH aplicado (tokens, paleta, superficies, sombras, tipografia).
3. Layout protegido con autenticacion mock y sesion.
4. Sidebar responsive + topbar con navegacion por modulos.

### 2) Modulos funcionales implementados
1. Inicio (Dashboard):
- KPIs financieros (incluyendo "Proximos pagos" en lugar de "Deudas proximas").
- Ultimas transacciones con popup de detalle y descarga de comprobante PDF por transaccion.
- Bloque de pagos pendientes con accion de pago.
- Menu por tarjeta (3 puntos) con ver detalle y programar autopago.
- Popup de detalle y popup de autopago con seleccion de cuenta.

2. Cuentas:
- Gestion de cuentas bancarias locales e internacionales.
- Tipos: ahorros, corriente, deposito de bajo monto.
- Paises: Colombia, Espana, Estados Unidos, Mexico y otros.
- Marcacion de cuenta principal.
- Persistencia de cuentas en localStorage para reutilizacion en otros modulos.
- Boton "Agregar cuenta" en encabezado del listado abre popup modal (formulario fuera de la vista principal).

3. Transacciones:
- Tabla con filtros colapsables (texto, tipo, fecha, montos) bajo boton "Filtrar".
- Chips de tipo siempre visibles fuera del panel de filtros.
- Paginacion.
- Exportes CSV y PDF.
- Bloque inferior de pagos automaticos programados con tabla (concepto, frecuencia, cuenta, proximo cobro, monto, estado, acciones editar/cancelar).

4. Prestamos:
- KPIs de cupo aprobado, usado y disponible.
- Dashboard analitico con graficos:
	- Deuda en el tiempo (area chart).
	- Deuda por tienda (bar chart).
- Layout 75/25 bajo graficas:
	- Izquierda (75%): creditos activos por pagar con acciones por credito:
		- Pagar ahora (abre PaymentWizard).
		- Programar pago (popup con cuenta de debito y dia de cobro, persistido en estado local).
		- Ver cupos en tienda.
	- Derecha (25%): ofertas de credito por tiendas y categorias con cupo preaprobado y tasa de referencia.

5. Facturas:
- Chips de tipo (Todas, Activas, Futuras, Pasadas) siempre visibles.
- Filtros avanzados colapsables bajo boton "Filtrar".
- Facturas activas para pago como bloque principal.
- Facturas futuras en panel lateral derecho con tarjetas resumidas.
- Tarjetas futuras con icono de servicio + menu de 3 puntos.
- Opciones por menu: ver detalles y activar/programar autopago.
- Popup de detalle y popup de autopago (cuenta + dia).
- Facturas pasadas con descarga de comprobante.

6. Seguridad Social:
- Datos de afiliacion.
- Powered by SOI ACH visible en la seccion de planilla.
- Generacion de planilla para independientes (periodo unico seleccionable).
- Modal de liquidacion con calculo automatico (IBC, salud, pension, ARL, solidaridad).
- Modalidades en panel izquierdo:
	- Cuenta local
	- Cuenta internacional
	- Llave PSE
- Presta-PILA solo en panel derecho (ad destacado) con estudio de credito.
- Pago por Presta-PILA desde panel derecho.
- Historial de planillas pagadas + descarga PDF de comprobante.
- Historial de novedades con soporte PDF descargable.
- Novedades por lista desplegable + descriptor opcional.
- Registro de uso Presta-PILA.

7. Configuracion:
- Preferencias basicas (notificaciones e idioma).

### 3) Despliegue
1. Workflow GitHub Pages ajustado para monorepo/subcarpeta.
2. Build y artifact desde portal-usuarios-ach-web.
3. Next config preparado para export estatico y basePath dinamico por repositorio.
4. Build local validado para salida en out.

## Calidad y Validacion
- Lint ejecutado y en estado OK tras cada iteracion importante.
- Build de produccion validado en estado OK.
- Rutas App Router estaticas generadas correctamente.

## Pendientes Prioritarios (proxima fase)
1. UX fina:
- Cierre por click-outside en menus flotantes.
- Estados vacios mas ricos y loaders por modulo.

2. Calidad:
- Pruebas unitarias y e2e de flujos criticos (login, pago, autopago, planilla).

3. Integracion:
- Sustituir mock data por API real.
- Persistencia backend de pagos, autopagos, cuentas y planillas.

4. Seguridad y negocio:
- Reglas de autorizacion reales.
- Auditoria de eventos transaccionales.

## Entregable actual
Prototipo funcional navegable end-to-end, alineado al alcance funcional definido, con base tecnica lista para iteracion de producto y conexion a servicios reales.
