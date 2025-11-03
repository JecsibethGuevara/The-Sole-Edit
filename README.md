## 🛍️ Simple-Ecommerce Backend (NestJS + PostgreSQL)

MVP para una plataforma de e-commerce simple, diseñado para demostrar un criterio técnico sólido utilizando NestJS, TypeScript, PostgreSQL, TypeORM, JWT para autenticación, y Docker para la contenerización.

## ✨ MVP Funcionalidad

El objetivo de este MVP es reflejar buen criterio técnico a través de:

- Autenticación Básica (JWT): Registro e inicio de sesión.

- Catálogo: Gestión de entidades clave (Stores, Products, StoreProducts).

- Vistas: Endpoints CRUD (Crear, Leer, Actualizar, Borrar) para operar el catálogo.

## Setup Local y Ejecución con Docker

La manera recomendada de levantar el proyecto en tu entorno local es usando Docker Compose, que gestiona el backend (NestJS) y la base de datos (PostgreSQL).

1. Requisitos Previos

- Docker
- Docker Compose

2. Variables de Entorno
   Crea un archivo llamado .env en la raíz del proyecto. Este archivo provee las credenciales para la base de datos local y la configuración de seguridad.

## Production Considerations

Este proyecto utiliza una base de datos PostgreSQL local para simplicidad durante el desarrollo.

En un entorno de producción, las siguientes prácticas son críticas y reflejan el criterio técnico:

- Base de Datos Gestionada: Usar un servicio de PostgreSQL Gestionado (ej. Render PostgreSQL) con backups automáticos y gestión de mantenimiento.

- Configuración por Entorno: Implementar configuraciones específicas (ej. database.config.production.ts) y variables de entorno seguras.

- Desactivar Sincronización: El flag synchronize de TypeORM debe ser false; el control del esquema debe hacerse exclusivamente a través de Migraciones.

- CI/CD: Configurar pipelines de Integración y Despliegue Continuo (CI/CD) para automatizar el build, el testing y el despliegue a plataformas como Render o DigitalOcean.

## Setup Local y Ejecución con Docker
