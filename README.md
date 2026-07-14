# Visor SLO - Restriccion Aeronautica Las Palmas

Aplicacion web estatica para consultar la Restriccion Aeronautica derivada de las Superficies Limitadoras de Obstaculos (SLO) del Aerodromo Las Palmas, en el marco del Decreto de Alcaldia N. 003-2026-MSB-A.

## Requisitos de desarrollo

- Node.js
- npm

## Comandos principales

```bash
npm install
npm run dev
npm run build
npm run preview
```

La publicacion debe realizarse desde la carpeta `dist` generada por:

```bash
npm run build
```

## Configuracion Recomendada de Cabeceras de Seguridad

El archivo `vercel.json` solo aplica cuando el visor se despliega en Vercel. Si el visor se publica en infraestructura institucional, OGTI debe configurar estas cabeceras en el servidor web correspondiente.

La guia lista para entregar a OGTI esta en `documents/CONFIGURACION_SERVIDOR_GOBIERNO.md`.

Cabeceras aplicadas actualmente:

```http
Content-Security-Policy: default-src 'self'; base-uri 'self'; object-src 'none'; frame-ancestors 'none'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data: blob: https://mt1.google.com https://*.google.com; font-src 'self' data:; connect-src 'self' https://mt1.google.com https://*.google.com
X-Frame-Options: DENY
X-Content-Type-Options: nosniff
Strict-Transport-Security: max-age=31536000
Referrer-Policy: strict-origin-when-cross-origin
Permissions-Policy: geolocation=(), camera=(), microphone=()
```

### Nginx

Agregar dentro del bloque `server` HTTPS:

```nginx
add_header Content-Security-Policy "default-src 'self'; base-uri 'self'; object-src 'none'; frame-ancestors 'none'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data: blob: https://mt1.google.com https://*.google.com; font-src 'self' data:; connect-src 'self' https://mt1.google.com https://*.google.com" always;
add_header X-Frame-Options "DENY" always;
add_header X-Content-Type-Options "nosniff" always;
add_header Strict-Transport-Security "max-age=31536000" always;
add_header Referrer-Policy "strict-origin-when-cross-origin" always;
add_header Permissions-Policy "geolocation=(), camera=(), microphone=()" always;
```

### Apache HTTP Server

Requiere `mod_headers` habilitado. Agregar en el `VirtualHost` HTTPS o en la configuracion del sitio:

```apache
Header always set Content-Security-Policy "default-src 'self'; base-uri 'self'; object-src 'none'; frame-ancestors 'none'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data: blob: https://mt1.google.com https://*.google.com; font-src 'self' data:; connect-src 'self' https://mt1.google.com https://*.google.com"
Header always set X-Frame-Options "DENY"
Header always set X-Content-Type-Options "nosniff"
Header always set Strict-Transport-Security "max-age=31536000"
Header always set Referrer-Policy "strict-origin-when-cross-origin"
Header always set Permissions-Policy "geolocation=(), camera=(), microphone=()"
```

### IIS

Agregar en `web.config` dentro de la carpeta publicada:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<configuration>
  <system.webServer>
    <httpProtocol>
      <customHeaders>
        <add name="Content-Security-Policy" value="default-src 'self'; base-uri 'self'; object-src 'none'; frame-ancestors 'none'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data: blob: https://mt1.google.com https://*.google.com; font-src 'self' data:; connect-src 'self' https://mt1.google.com https://*.google.com" />
        <add name="X-Frame-Options" value="DENY" />
        <add name="X-Content-Type-Options" value="nosniff" />
        <add name="Strict-Transport-Security" value="max-age=31536000" />
        <add name="Referrer-Policy" value="strict-origin-when-cross-origin" />
        <add name="Permissions-Policy" value="geolocation=(), camera=(), microphone=()" />
      </customHeaders>
    </httpProtocol>
  </system.webServer>
</configuration>
```

## Nota sobre WAF institucional

En Vercel, la mitigacion de trafico malicioso y ataques volumetricos depende de la red y protecciones del proveedor. Al migrar el visor a un dominio o servidor institucional, esta proteccion ya no depende de Vercel.

Para entorno de gobierno, se recomienda publicar el visor detras del WAF perimetral administrado por OGTI, por ejemplo Cloudflare Enterprise, Fortinet FortiWeb, F5 BIG-IP, ModSecurity u otra solucion equivalente definida por la entidad.

El visor no requiere configuracion especial de aplicacion para operar detras de un WAF, siempre que se permita:

- Servir archivos estaticos HTML, CSS, JS, JSON, GeoJSON, PNG, GIF y WebP.
- Consumir teselas satelitales desde `https://mt1.google.com` y dominios `https://*.google.com`.
- Mantener HTTPS activo con TLS vigente.

## Verificaciones recomendadas despues del despliegue

- Validar cabeceras con Security Headers.
- Ejecutar OWASP ZAP Baseline Scan.
- Verificar WAF con WAFW00F.
- Revisar TLS con herramienta institucional o Nmap NSE.
- Probar concurrencia con JMeter o autocannon.
- Confirmar que `assets/js`, `data` y `vendor/resources` responden con `200 OK` y tipo MIME correcto.
