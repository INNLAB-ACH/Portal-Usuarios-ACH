# PRD - Portal de Usuarios ACH

## 1. Resumen Ejecutivo
El Portal de Usuarios ACH es una plataforma web para centralizar la operacion financiera personal en un solo canal: transacciones, facturas, creditos, cuentas bancarias y seguridad social.

El objetivo del producto es reducir friccion operativa, aumentar trazabilidad de pagos y habilitar una base escalable para evolucionar de prototipo con datos mock a producto conectado con APIs y reglas reales de negocio.

## 2. Problema
Hoy los usuarios gestionan pagos, prestamos y seguridad social en experiencias separadas, con baja visibilidad del estado consolidado y poca capacidad de automatizacion.

Problemas clave:
- Multiples canales para tareas relacionadas.
- Falta de seguimiento integral de obligaciones proximas.
- Poca automatizacion de pagos recurrentes.
- Baja trazabilidad de comprobantes y programaciones.

## 3. Objetivos del Producto
### Objetivos de negocio
- Aumentar adopcion de canales digitales para pagos y recaudos.
- Incrementar uso de autopago y pagos programados.
- Preparar integracion con servicios ACH y aliados (SOI, comercios, entidades).

### Objetivos de usuario
- Ver y operar sus obligaciones desde un unico lugar.
- Pagar de forma inmediata y programar pagos en segundos.
- Descargar soportes y comprobantes de manera simple.

### Objetivos tecnicos
- Mantener arquitectura modular y escalable.
- Garantizar rendimiento y experiencia responsive.
- Dejar trazabilidad lista para analytics y auditoria.

## 4. Alcance del Release (MVP actual)
### Incluido
- Autenticacion mock y sesion cliente.
- Dashboard con KPIs, pagos pendientes y transacciones recientes.
- Cuentas bancarias locales/internacionales con persistencia local.
- Transacciones con filtros, paginacion, exportes PDF/CSV.
- Prestamos con analitica, pago inmediato y programacion de pago.
- Facturas activas/futuras/pasadas con autopago por factura.
- Seguridad social (planilla independientes, Presta-PILA, historial y soportes).
- Navegacion responsive, estado activo en menu, titulos dinamicos por seccion.

### No incluido (fuera de alcance en este release)
- Integracion backend real y autenticacion productiva.
- Motor transaccional real, conciliacion y reversos.
- Reglas antifraude/AML y autorizacion multinivel real.
- Notificaciones push, email y SMS en produccion.

## 5. Personas
### Persona 1: Usuario bancario digital (principal)
- Necesidad: pagar rapido, programar obligaciones y visualizar estado financiero.
- Dolor: procesos dispersos y poco seguimiento de vencimientos.

### Persona 2: Independiente con obligaciones de seguridad social
- Necesidad: liquidar y pagar planilla con soporte y continuidad.
- Dolor: complejidad de liquidaciones y fragmentacion de canales.

### Persona 3: Usuario con uso de cupos/creditos por comercio
- Necesidad: monitorear cupo usado/disponible y pagar cuotas.
- Dolor: poca visibilidad del estado por tienda/categoria.

## 6. Propuesta de Valor
- Una sola experiencia para finanzas cotidianas.
- Acciones de alto impacto en pocos pasos: pagar, programar, descargar soporte.
- Visibilidad clara del estado del sistema y de cada modulo.

## 6.1 Historias de Usuario (MVP)
### HU-01 Login
- Como usuario registrado, quiero iniciar sesion con mis credenciales para acceder a mis modulos financieros.
- Criterios de aceptacion:
  - Dado credenciales validas, cuando envio el formulario, entonces ingreso al portal.
  - Dado credenciales invalidas, cuando envio el formulario, entonces veo mensaje de error.

### HU-02 Navegacion contextual
- Como usuario, quiero ver claramente la seccion activa en el menu y en el encabezado para entender donde estoy.
- Criterios de aceptacion:
  - El item activo del sidebar se resalta visualmente.
  - El titulo del topbar cambia segun la seccion activa.

### HU-03 Pago desde dashboard
- Como usuario, quiero pagar obligaciones pendientes desde inicio para reducir pasos.
- Criterios de aceptacion:
  - Desde "Pagos pendientes" puedo abrir el flujo de pago.
  - Al completar el flujo, veo estado de confirmacion.

### HU-04 Detalle de transacciones recientes
- Como usuario, quiero ver el detalle de una transaccion y descargar su comprobante.
- Criterios de aceptacion:
  - Cada transaccion reciente permite abrir un popup de detalle.
  - Desde el popup puedo descargar un PDF del comprobante.

### HU-05 Gestion de cuentas
- Como usuario, quiero registrar cuentas bancarias en un popup para mantener la vista principal limpia.
- Criterios de aceptacion:
  - Existe boton "Agregar cuenta" en listado de cuentas.
  - El formulario abre en modal y guarda la cuenta en la tabla.

### HU-06 Filtros en transacciones
- Como usuario, quiero filtrar transacciones sin perder acceso a los chips de tipo.
- Criterios de aceptacion:
  - Los filtros avanzados se muestran/ocultan con boton "Filtrar".
  - Los chips de tipo siempre permanecen visibles.

### HU-07 Pagos automaticos programados
- Como usuario, quiero ver mis pagos automaticos programados para monitorear proximos debitos.
- Criterios de aceptacion:
  - La seccion de transacciones incluye bloque inferior de pagos programados.
  - Cada fila muestra concepto, frecuencia, cuenta, proximo cobro, monto y estado.

### HU-08 Facturas activas
- Como usuario, quiero seleccionar y pagar facturas activas para cumplir vencimientos rapidamente.
- Criterios de aceptacion:
  - Puedo seleccionar una o varias facturas activas.
  - Puedo pagar seleccionadas en un solo flujo.

### HU-09 Autopago de facturas futuras
- Como usuario, quiero programar autopago para facturas futuras y evitar mora.
- Criterios de aceptacion:
  - Desde la factura futura puedo abrir detalle y configurar autopago.
  - Puedo definir cuenta de debito y dia de cobro.

### HU-10 Prestamos activos
- Como usuario con credito, quiero pagar cuotas y programar pagos en mis creditos activos.
- Criterios de aceptacion:
  - En Prestamos (columna izquierda) cada credito activo tiene accion "Pagar ahora".
  - Existe accion "Programar pago" con modal de cuenta y dia.

### HU-11 Visibilidad de ofertas de credito
- Como usuario, quiero ver ofertas de credito por tienda/categoria para tomar decisiones.
- Criterios de aceptacion:
  - En Prestamos existe columna derecha (25%) con ofertas.
  - Cada oferta muestra tienda, categoria, cupo y tasa de referencia.

### HU-12 Seguridad social independientes
- Como trabajador independiente, quiero generar, pagar y descargar soporte de planilla.
- Criterios de aceptacion:
  - Puedo calcular liquidacion y completar pago desde la seccion.
  - Puedo descargar comprobante PDF y ver historial.

## 7. Requisitos Funcionales
### RF-01 Autenticacion y sesion
- Login mock con validacion de credenciales predefinidas.
- Cierre de sesion y proteccion de rutas internas.

### RF-02 Navegacion y estado de seccion
- Sidebar con seccion activa visualmente destacada.
- Topbar con titulo y subtitulo dinamicos por seccion.

### RF-03 Dashboard
- Mostrar KPIs clave: monto transado, proximos pagos, cupos.
- Mostrar ultimas transacciones con detalle y comprobante PDF.
- Mostrar pagos pendientes con accion inmediata y programacion.

### RF-04 Cuentas
- Listar cuentas y bancos registrados.
- Crear cuenta en popup modal (no embebido en vista principal).
- Soportar cuentas locales e internacionales.
- Marcar cuenta principal.

### RF-05 Transacciones
- Tabla con filtros (texto, tipo, fecha, rango de monto).
- Filtros ocultos bajo boton "Filtrar".
- Chips de tipo siempre visibles.
- Paginacion y exportes CSV/PDF.
- Bloque de pagos automaticos programados en la parte inferior.

### RF-06 Prestamos
- KPIs de cupo aprobado/usado/disponible.
- Graficas de deuda en el tiempo y deuda por tienda.
- Layout 75/25 bajo graficas:
  - Izquierda: creditos activos por pagar (pago inmediato + programacion).
  - Derecha: ofertas de credito por tienda/categoria.

### RF-07 Facturas
- Segmentacion por tipo: activas/futuras/pasadas.
- Filtros avanzados colapsables y chips siempre visibles.
- Facturas activas: seleccion y pago inmediato.
- Facturas futuras: detalle y configuracion de autopago.
- Facturas pasadas: descarga de comprobante.

### RF-08 Seguridad social
- Mostrar informacion de afiliacion.
- Generar y pagar planilla de independientes.
- Mostrar opciones de pago y Presta-PILA.
- Descargar soportes de pagos y novedades.

## 8. Requisitos No Funcionales
### RNF-01 Performance
- Tiempo de carga inicial objetivo: menor a 2.5 segundos en red 4G promedio.
- Interacciones UI con respuesta visual menor a 200 ms.

### RNF-02 Responsive
- Soporte completo para mobile, tablet y desktop.

### RNF-03 Accesibilidad
- Navegacion por teclado en acciones principales.
- Contraste suficiente en textos y estados.

### RNF-04 Confiabilidad visual
- Evitar hydration mismatch entre SSR/CSR.
- Mantener estados persistentes locales sin romper render inicial.

### RNF-05 Seguridad (objetivo de evolucion)
- Migrar a autenticacion segura y autorizacion basada en roles.
- Trazabilidad de eventos transaccionales y auditoria.

## 9. Flujos Criticos
### Flujo A: Pago inmediato de obligacion
1. Usuario entra a modulo (Facturas, Prestamos o Inicio).
2. Selecciona item por pagar.
3. Abre wizard de pago.
4. Confirma datos y completa operacion.
5. Recibe estado y comprobante.

### Flujo B: Programacion de pago/autopago
1. Usuario abre accion "Programar" o "Autopago".
2. Selecciona cuenta y dia de cobro.
3. Guarda configuracion.
4. Ve estado programado en el item correspondiente.

### Flujo C: Seguridad social independientes
1. Usuario selecciona periodo.
2. Sistema calcula liquidacion.
3. Usuario elige modalidad de pago.
4. Completa pago y descarga soporte.

## 10. Metricas de Exito (KPIs)
### Producto
- Tasa de finalizacion de pago inmediato.
- Tasa de configuracion de pagos programados.
- Uso de descarga de comprobantes.

### Operacion
- Errores por flujo critico por cada 1,000 sesiones.
- Tiempo promedio para completar pago.
- Porcentaje de sesiones con navegacion en 2 o mas modulos.

### UX
- Tiempo a primera accion en dashboard.
- Tasa de abandono en wizard de pago.

## 11. Instrumentacion de Analytics (propuesta)
Eventos sugeridos:
- `login_success`, `login_error`
- `dashboard_view`
- `payment_wizard_open`, `payment_wizard_complete`
- `autopay_config_open`, `autopay_config_saved`
- `receipt_downloaded`
- `loan_payment_scheduled`
- `social_security_settlement_generated`, `social_security_payment_complete`

## 12. Dependencias y Supuestos
### Dependencias
- Integraciones API ACH y entidades aliadas.
- Servicio de autenticacion y autorizacion.
- Servicio de notificaciones y mensajeria.

### Supuestos
- Usuarios disponen de al menos una cuenta valida para debito.
- Catalogos de servicios/comercios estaran disponibles por API.
- Reglas de negocio finales seran definidas con compliance y operaciones.

## 13. Riesgos
- Riesgo de discrepancia entre datos mock y logica real de backend.
- Riesgo regulatorio en seguridad social y creditos si no se formalizan reglas.
- Riesgo UX en menus/modales si no se estandariza cierre y feedback.

Mitigaciones:
- Contratos API tempranos y pruebas de integracion.
- Validacion legal/compliance por flujo.
- Suite e2e para flujos criticos.

## 14. Roadmap Propuesto
### Fase 1 (actual)
- Prototipo funcional end-to-end con persistencia local y exportes.

### Fase 2
- Integracion backend (auth, pagos, cuentas, autopago, planillas).
- Estados reales y trazabilidad transaccional.

### Fase 3
- Seguridad avanzada, antifraude, auditoria y observabilidad.
- Notificaciones multicanal y optimizacion por datos de uso.

## 15. Criterios de Aceptacion del Release
- Navegacion entre modulos sin errores de render.
- Flujos de pago y programacion operativos en UI.
- Exportes PDF/CSV funcionales.
- Indicadores de seccion activa y titulo dinamico visibles.
- Lint y build sin errores.

## 16. Estado Actual
El producto se encuentra en estado de prototipo funcional navegable, validado en lint/build, con base tecnica lista para evolucion a integraciones reales y endurecimiento de seguridad/calidad.