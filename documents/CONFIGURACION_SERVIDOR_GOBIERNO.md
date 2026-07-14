# Configuracion para servidor institucional OGTI


## 1. Generacion de carpeta publicable

En el equipo o servidor de preparacion:

```bash
npm install
npm run build
```

La carpeta que debe publicarse en el servidor web es:

```text
dist/
```

## 2. Cabeceras HTTP de seguridad

Estas cabeceras equivalen a la configuracion usada en `vercel.json`.

```http
Content-Security-Policy: default-src 'self'; base-uri 'self'; object-src 'none'; frame-ancestors 'none'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data: blob: https://mt1.google.com https://*.google.com; font-src 'self' data:; connect-src 'self' https://mt1.google.com https://*.google.com
X-Frame-Options: DENY
X-Content-Type-Options: nosniff
Strict-Transport-Security: max-age=31536000
Referrer-Policy: strict-origin-when-cross-origin
Permissions-Policy: geolocation=(), camera=(), microphone=()
```

## 3. Nginx

Agregar dentro del bloque `server` HTTPS:

```nginx
add_header Content-Security-Policy "default-src 'self'; base-uri 'self'; object-src 'none'; frame-ancestors 'none'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data: blob: https://mt1.google.com https://*.google.com; font-src 'self' data:; connect-src 'self' https://mt1.google.com https://*.google.com" always;
add_header X-Frame-Options "DENY" always;
add_header X-Content-Type-Options "nosniff" always;
add_header Strict-Transport-Security "max-age=31536000" always;
add_header Referrer-Policy "strict-origin-when-cross-origin" always;
add_header Permissions-Policy "geolocation=(), camera=(), microphone=()" always;
```

## 4. Apache HTTP Server

Requiere `mod_headers` habilitado.

```apache
Header always set Content-Security-Policy "default-src 'self'; base-uri 'self'; object-src 'none'; frame-ancestors 'none'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data: blob: https://mt1.google.com https://*.google.com; font-src 'self' data:; connect-src 'self' https://mt1.google.com https://*.google.com"
Header always set X-Frame-Options "DENY"
Header always set X-Content-Type-Options "nosniff"
Header always set Strict-Transport-Security "max-age=31536000"
Header always set Referrer-Policy "strict-origin-when-cross-origin"
Header always set Permissions-Policy "geolocation=(), camera=(), microphone=()"
```

## 5. IIS

Agregar como `web.config` dentro de la carpeta publicada:

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

## 6. WAF institucional

En Vercel, la proteccion de red depende del proveedor. En infraestructura institucional, el visor debe publicarse detras del WAF perimetral definido por OGTI.

El WAF debe permitir:

- Archivos estaticos HTML, CSS, JS, JSON, GeoJSON, PNG, GIF y WebP.
- Conexion saliente o carga de recursos hacia `https://mt1.google.com`.
- Carga de recursos desde dominios `https://*.google.com` usados por el mapa satelital.
- Trafico HTTPS con TLS vigente.

## 7. Pruebas posteriores al despliegue

Validar:

- Carga de `index.html`.
- Carga correcta de mapa y modal inicial.
- Buscador de vias.
- Popup de consulta SLO.
- Cabeceras en Security Headers.
- OWASP ZAP Baseline Scan.
- WAFW00F.
- Prueba de concurrencia con JMeter o autocannon.
- Recursos criticos con respuesta `200 OK` y MIME correcto:
  - `assets/js/config.js`
  - `vendor/resources/qgis2web_expressions.js`
  - `data/layers/lotesSanBorja_1.js`
  - `data/vias.geojson`
