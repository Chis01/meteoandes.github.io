# DNS de Cloudflare para MeteoAndes

El dominio raíz todavía debe resolver hacia GitHub Pages. En **Cloudflare → DNS → Records**, todos en **DNS only** (nube gris):

| Tipo | Nombre | Contenido |
|---|---|---|
| A | @ | 185.199.108.153 |
| A | @ | 185.199.109.153 |
| A | @ | 185.199.110.153 |
| A | @ | 185.199.111.153 |
| CNAME | www | chis01.github.io |

Mantener también el TXT de verificación generado por GitHub. Después de la propagación:

```powershell
Resolve-DnsName meteoandes.com -Type A
Resolve-DnsName www.meteoandes.com -Type CNAME
```

En GitHub: **Settings → Pages → Custom domain → meteoandes.com → Enforce HTTPS**.
