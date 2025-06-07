# Documentación de Arquitectura: Microservicio de Órdenes

## 1. Introducción y Alineación con Bounded Contexts

El presente microservicio ha sido diseñado para gestionar el ciclo de vida completo de las **Órdenes** dentro de un sistema más amplio (ej. una plataforma de delivery de comida). Su propósito principal es encapsular toda la lógica de negocio, reglas y datos relacionados exclusivamente con las órdenes, desde su creación hasta su finalización o cancelación.

Este enfoque se alinea directamente con el concepto de **Bounded Context (Contexto Delimitado)** de Domain-Driven Design (DDD). El microservicio de Órdenes define un límite claro y explícito alrededor del subdominio de "Gestión de Órdenes". Dentro de este contexto, términos como "Orden", "Ítem de Orden", "Estado de la Orden" tienen un significado preciso y único, evitando ambigüedades que podrían surgir en un modelo de datos monolítico.

**Características clave de este Bounded Context:**

*   **Coherencia Interna:** Todas las entidades, valores objeto y lógica dentro de este microservicio están altamente cohesionados y enfocados en el dominio de las órdenes.
*   **Autonomía:** El microservicio puede evolucionar de forma independiente en lo que respecta a la lógica de órdenes, siempre y cuando se respeten los contratos con otros posibles microservicios (ej. Clientes, Restaurantes, Pagos) con los que podría interactuar a través de APIs bien definidas.
*   **Lenguaje Ubicuo Específico:** El código y la estructura del microservicio reflejan el lenguaje utilizado por los expertos del dominio al referirse a las órdenes. Por ejemplo, la entidad `Order` y sus atributos (`status`, `deliveryAddress`, `items`) son un reflejo directo de este lenguaje.

Al delimitar claramente el contexto de las órdenes, se facilita la comprensión del modelo, se reduce la complejidad y se permite un diseño más robusto y mantenible, desacoplado de otras áreas del sistema que pueden tener sus propios contextos y modelos de dominio.

## 2. Separación de Capas (Clean Architecture)

El microservicio de Órdenes adopta los principios de la **Arquitectura Limpia** (Clean Architecture) para asegurar una clara separación de responsabilidades, facilitar la mantenibilidad, la testabilidad y reducir el acoplamiento entre los diferentes componentes del sistema. Esta separación se refleja directamente en la estructura de directorios del proyecto:

*   `src/domain`: El corazón del microservicio.
*   `src/application`: Contiene los casos de uso de la aplicación.
*   `src/infrastructure`: Se encarga de los detalles técnicos como la base de datos.
*   `src/presentation`: Expone la funcionalidad a través de la API.

A continuación, se detalla el rol de cada capa:

### 2.1. Domain Layer (Capa de Dominio)

Esta es la capa más interna y central de la arquitectura. Encapsula la lógica de negocio y las reglas fundamentales del subdominio de Órdenes. Es completamente independiente de cualquier otra capa y no tiene conocimiento sobre frameworks, bases de datos o interfaces de usuario.

*   **Entidades (`src/domain/entities`):** Son los objetos centrales del dominio que poseen una identidad y un ciclo de vida. En este microservicio, `Order.ts` y `OrderItem.ts` son las entidades principales. Contienen atributos y métodos que implementan la lógica de negocio intrínseca a una orden.
    *   *Ejemplo:* La entidad `Order` podría tener métodos como `confirm()`, `addItem()`, `calculateTotalPrice()`, etc.
*   **Value Objects (`src/domain/vo`):** Son objetos inmutables que describen atributos de las entidades y no tienen identidad propia. Aseguran la validez y consistencia de los datos. Ejemplos incluyen `OrderStatus.vo.ts`, `Price.vo.ts`, `DeliveryAddress.vo.ts`, y `Quantity.vo.ts`. Estos VOs encapsulan reglas de validación y formato.
    *   *Ejemplo:* `OrderStatus` asegura que el estado de una orden solo pueda tomar valores predefinidos (`CONFIRMED`, `PENDING`, `CANCELLED`, etc.). `Price` podría encapsular la lógica de manejo de moneda y formato.
*   **Interfaces de Repositorio (`src/domain/interfaces`):** Definen los contratos (abstracciones) para las operaciones de persistencia. La capa de dominio define *qué* operaciones se pueden realizar con las entidades, pero no *cómo* se realizan. `OrderRepository.ts` es un ejemplo que define métodos como `save(order: Order)`, `findById(orderId: string)`, etc.

### 2.2. Application Layer (Capa de Aplicación)

Esta capa orquesta los flujos de datos y las interacciones entre la capa de dominio y las capas externas. Contiene los casos de uso específicos de la aplicación.

*   **Casos de Uso (`src/application/use-cases`):** Representan las acciones que el sistema puede realizar. Coordinan la recuperación de entidades del dominio (a través de las interfaces de repositorio), ejecutan lógica de negocio sobre ellas (invocando métodos de las entidades) y persisten los cambios (nuevamente, a través de las interfaces de repositorio). No contienen lógica de negocio en sí mismos, sino que la delegan a las entidades del dominio.
    *   *Ejemplo:* `CreateOrderUseCase.ts` tomaría los datos de entrada, utilizaría la entidad `Order` para crear una nueva orden y luego usaría `OrderRepository` para guardarla. Otros ejemplos son `FindOrderByIdUseCase.ts` o `UpdateOrderStatusUseCase.ts`.
*   **Excepciones de Aplicación (`src/application/exceptions`):** Se pueden definir excepciones específicas de la aplicación, como `BusinessRuleViolationException.ts`, para manejar errores de una manera más controlada.

### 2.3. Infrastructure Layer (Capa de Infraestructura)

Esta capa contiene las implementaciones concretas de las abstracciones definidas en las capas internas, especialmente las interfaces de repositorio. También maneja la comunicación con sistemas externos como bases de datos, servicios de mensajería, etc.

*   **Repositorios (`src/infrastructure/repositories`):** Aquí se encuentran las implementaciones de las interfaces de repositorio. `PrismaOrderRepository.ts` es la implementación concreta de `OrderRepository`, utilizando Prisma ORM para interactuar con la base de datos. Esta capa se encarga de traducir los objetos del dominio a un formato adecuado para la persistencia y viceversa.
    *   *Ejemplo:* `PrismaOrderRepository.save(order: Order)` tomaría una entidad `Order` y la mapearía a las tablas correspondientes en la base de datos usando Prisma.

### 2.4. Presentation Layer (Capa de Presentación)

Es la capa más externa y actúa como la interfaz del microservicio con el mundo exterior. En este caso, se trata de una API REST.

*   **Controladores (`src/presentation/controllers`):** Reciben las solicitudes HTTP, validan y transforman los datos de entrada (generalmente a DTOs), invocan los casos de uso apropiados de la capa de aplicación y luego formatean la respuesta para el cliente.
    *   *Ejemplo:* `CreateOrderController.ts` manejaría una solicitud POST a `/orders`, extraería los datos del cuerpo de la solicitud, los pasaría al `CreateOrderUseCase` y devolvería una respuesta HTTP.
*   **DTOs (Data Transfer Objects) (`src/presentation/dtos`):** Son objetos simples utilizados para transferir datos entre la capa de presentación y la capa de aplicación. Ayudan a desacoplar el modelo de la API del modelo interno del dominio.
    *   *Ejemplo:* `CreateOrderDto.ts` definiría la estructura esperada para los datos de creación de una orden. `OrderResponseDto.ts` podría definir cómo se presenta una orden al cliente.

### Principio de Dependencia

La arquitectura sigue estrictamente el **Principio de Dependencia**: todas las dependencias del código fuente apuntan hacia adentro. La capa de Dominio no depende de ninguna otra capa. La capa de Aplicación depende del Dominio, pero no de la Infraestructura ni de la Presentación. La capa de Infraestructura y la de Presentación dependen de la capa de Aplicación y del Dominio, pero nunca al revés. Esto se logra mediante el uso de interfaces (abstracciones) en las capas internas, que son implementadas por las capas externas (Inversión de Dependencias).

Esta separación clara de capas y el cumplimiento del principio de dependencia hacen que el microservicio sea:
*   **Independiente de Frameworks:** La lógica de negocio no depende de NestJS.
*   **Testable:** Cada capa puede ser probada de forma aislada.
*   **Independiente de la UI:** La lógica de negocio no cambia si la API REST se reemplaza o complementa.
*   **Independiente de la Base de Datos:** El dominio y la aplicación no saben qué motor de base de datos se está utilizando.

## 3. Modelo del Dominio

El modelo del dominio es el corazón de la lógica de negocio del microservicio de Órdenes. Está diseñado para ser rico y expresivo, reflejando fielmente las reglas y conceptos del subdominio de gestión de órdenes. Se evita el patrón de "Modelo de Dominio Anémico" al incluir tanto datos como comportamiento dentro de las entidades y utilizando Value Objects para asegurar la integridad y el significado de los datos.

### 3.1. Entidades Principales

*   **`Order` (`src/domain/entities/order.entity.ts`):**
    Es la entidad raíz del agregado de Órdenes. Representa una orden realizada por un cliente.
    *   **Identidad:** Posee un `id` único que la distingue de otras órdenes.
    *   **Atributos:** Contiene información crucial como `restaurantId`, `customerId`, `deliveryAddress` (un VO), `items` (una colección de entidades `OrderItem`), `status` (un VO), y `createdAt`.
    *   **Comportamiento (Lógica de Negocio):** La entidad `Order` no es solo un contenedor de datos. Incluye métodos que encapsulan reglas de negocio.
        *   Por ejemplo, el método `confirm()`:
            ```typescript
            // Dentro de src/domain/entities/order.entity.ts
            confirm(): void {
                this.status = new OrderStatus(OrderStatusEnum.CONFIRMED);
            }
            ```
            Este método no solo cambia un campo, sino que asegura que el cambio de estado se realice de acuerdo con las reglas del dominio (en este caso, instanciando un `OrderStatus` válido). Se podrían añadir otras validaciones aquí, como verificar si la orden ya fue confirmada o si cumple ciertas condiciones antes de confirmarse.
    *   **Reconstrucción:** Incluye un método estático `fromPrisma(record: any): Order` que permite reconstruir una entidad `Order` a partir de los datos recuperados de la capa de persistencia. Si bien este método está en la entidad por conveniencia en este proyecto, en implementaciones más estrictas, esta lógica de mapeo podría residir completamente en la capa de infraestructura (el repositorio) para mantener la entidad del dominio aún más pura. Sin embargo, su presencia aquí demuestra cómo la entidad puede controlar su propia creación e hidratación.

*   **`OrderItem` (`src/domain/entities/order-item.entity.ts`):**
    Representa un ítem individual dentro de una orden.
    *   **Atributos:** Incluye `productId`, `quantity` (VO), `price` (VO), y `specialInstructions` (VO).
    *   **Relación:** Es una entidad hija de `Order` y forma parte del agregado de la Orden. Su ciclo de vida está ligado al de la `Order`.

### 3.2. Value Objects (VOs)

Los Value Objects (VOs) son un componente crucial para enriquecer el modelo del dominio, proporcionando significado, validación y comportamiento a los atributos de las entidades. Son inmutables y se distinguen por su valor, no por su identidad.

*   **`OrderStatus` (`src/domain/vo/order-status.vo.ts`):**
    Representa el estado de una orden (ej. `PENDING`, `CONFIRMED`, `SHIPPED`, `DELIVERED`, `CANCELLED`).
    *   Utiliza un `OrderStatusEnum` para restringir los posibles valores, asegurando que el estado de una orden sea siempre uno válido y conocido por el dominio.
    *   Encapsula la lógica relacionada con los estados, por ejemplo, podría tener métodos para validar transiciones de estado.

*   **`Price` (`src/domain/vo/price.vo.ts`):**
    Representa un valor monetario, incluyendo `amount` (cantidad) y `currency` (moneda).
    *   Asegura que todas las operaciones relacionadas con precios se manejen de forma consistente, potencialmente encapsulando lógica de formato o comparación de precios.

*   **`Quantity` (`src/domain/vo/quantity.vo.ts`):**
    Representa la cantidad de un producto en un ítem de orden.
    *   Puede incluir validaciones como asegurar que la cantidad sea un entero positivo.

*   **`DeliveryAddress` (`src/domain/vo/delivery-address.vo.ts`):**
    Describe la dirección de entrega, incluyendo `street`, `city`, `number`, `postalCode` y `gpsCoordinates`.
    *   Agrupa todos los campos relacionados con la dirección en un objeto cohesivo, facilitando su manejo y validación.

*   **`SpecialInstructions` (`src/domain/vo/special-instructions.vo.ts`):**
    Encapsula las instrucciones especiales para un ítem de orden.
    *   Permite tratar las instrucciones especiales como un concepto propio del dominio.

El uso de estas entidades y VOs resulta en un modelo de dominio que es robusto, expresivo y alineado con el lenguaje ubicuo del subdominio de Órdenes. La lógica de negocio reside donde debe estar: en las entidades y VOs, haciendo que el sistema sea más fácil de entender, mantener y evolucionar.

## 4. Servicios de Aplicación (Casos de Uso)

Los Servicios de Aplicación, implementados como Casos de Uso (`src/application/use-cases`), son responsables de orquestar los flujos de trabajo y las interacciones que representan las operaciones que el sistema puede realizar. Actúan como un puente entre la capa de Presentación (que recibe las solicitudes externas) y la capa de Dominio (que contiene la lógica de negocio).

La característica principal de los Casos de Uso en esta arquitectura es que **no contienen lógica de dominio ni conocimiento de la infraestructura**. Su rol es puramente de orquestación:

1.  Reciben datos de entrada (generalmente a través de DTOs provenientes de la capa de Presentación).
2.  Utilizan las interfaces de repositorio para recuperar o persistir entidades del dominio.
3.  Invocan métodos en las entidades del dominio para ejecutar la lógica de negocio.
4.  Devuelven un resultado (posiblemente también un DTO) a la capa de Presentación.

Están completamente desacoplados de la implementación específica de la persistencia (ej. Prisma) y de la interfaz de usuario (ej. controladores de NestJS).

### 4.1. Ejemplo: `CreateOrderUseCase`

El caso de uso `CreateOrderUseCase.ts` (`src/application/use-cases/create-order.uc.ts`) es un excelente ejemplo de este patrón:

```typescript
// Fragmento de src/application/use-cases/create-order.uc.ts
import { Inject, Injectable } from "@nestjs/common";
import { ORDER_REPOSITORY } from "src/domain/constants/repository-tokens";
import { OrderItem } from "src/domain/entities/order-item.entity";
import { Order } from "src/domain/entities/order.entity";
import { OrderRepository } from "src/domain/interfaces/order.repository";
import { DeliveryAddress } from "src/domain/vo/delivery-address.vo";
import { OrderStatus, OrderStatusEnum } from "src/domain/vo/order-status.vo";
// ... otros VOs y DTOs
import { v4 as uuid} from "uuid";

@Injectable()
export class CreateOrderUseCase {
    constructor(
        @Inject(ORDER_REPOSITORY) private readonly orderRepository: OrderRepository
    ){}

    async execute(input: CreateOrderDto): Promise<Order> {
        const order = new Order(
            uuid(), // Genera un ID único para la nueva orden
            input.restaurantId,
            input.customerId,
            new DeliveryAddress( // Crea el VO DeliveryAddress
                input.deliveryAddress.street,
                input.deliveryAddress.city,
                input.deliveryAddress.number,
                input.deliveryAddress.postalCode,
                { lat: input.deliveryAddress.latitude, lng: input.deliveryAddress.longitude }
            ),
            input.items.map(item => { // Mapea los items del DTO a entidades OrderItem
                return new OrderItem(
                    item.productId,
                    new Quantity(item.quantity),
                    new Price(
                        item.price.amount,
                        item.price.currency
                    ),
                    new SpecialInstructions(item.specialInstructions || "")
                );
            }),
            new OrderStatus(OrderStatusEnum.CONFIRMED) // Establece el estado inicial
        );

        // Delega la persistencia a la implementación del OrderRepository
        return await this.orderRepository.save(order);
    }
}
```

**Análisis del `CreateOrderUseCase`:**

*   **Inyección de Dependencias:** Recibe una instancia de `OrderRepository` (la interfaz del dominio) a través de inyección de dependencias (`@Inject(ORDER_REPOSITORY)`). Esto significa que el caso de uso no sabe si está trabajando con Prisma, TypeORM o cualquier otra tecnología de base de datos; solo conoce el contrato definido por `OrderRepository`.
*   **Orquestación:**
    *   Toma `CreateOrderDto` como entrada.
    *   Utiliza los datos del DTO para construir una nueva instancia de la entidad `Order`. Es importante notar que la creación y validación de los Value Objects (`DeliveryAddress`, `Quantity`, `Price`, `OrderStatus`, `SpecialInstructions`) y la entidad `OrderItem` es responsabilidad de sus respectivos constructores, encapsulando la lógica de creación y validación del dominio.
    *   Genera un ID único para la orden utilizando `uuid`.
    *   Una vez que la entidad `Order` (con sus `OrderItem` y VOs) está completamente construida y validada por el propio dominio, el caso de uso invoca `this.orderRepository.save(order)`.
*   **Sin Lógica de Dominio:** La lógica de qué constituye una orden válida, cómo se calculan los totales (si aplicara), o qué transiciones de estado son permitidas, reside en las entidades `Order` y `OrderItem` y sus VOs, no en el caso de uso.
*   **Sin Lógica de Infraestructura:** El caso de uso no contiene código SQL, ni llamadas directas a Prisma o cualquier otro ORM. Simplemente utiliza la interfaz `OrderRepository`.

Otros casos de uso como `FindOrderByIdUseCase.ts`, `UpdateOrderStatusUseCase.ts`, o `DeleteOrderUseCase.ts` seguirían un patrón similar: reciben un input, interactúan con el repositorio para obtener/modificar entidades del dominio, posiblemente llaman a métodos de estas entidades, y devuelven un resultado. Este enfoque mantiene los servicios de aplicación delgados, enfocados en la coordinación y altamente testables de forma aislada (mockeando el repositorio).

## 5. Persistencia y Repositorios

La capa de persistencia es responsable de almacenar y recuperar las entidades del dominio. En línea con los principios de la Arquitectura Limpia y DDD, la interacción con la base de datos se abstrae mediante el uso del patrón Repositorio.

### 5.1. Interfaz del Repositorio (Contrato del Dominio)

La capa de Dominio define una interfaz que actúa como contrato para las operaciones de persistencia. Esta interfaz es agnóstica a la tecnología de base de datos específica.

*   **`OrderRepository` (`src/domain/interfaces/order.repository.ts`):**
    Define las operaciones que se pueden realizar sobre las entidades `Order`.

    ```typescript
    // Fragmento de src/domain/interfaces/order.repository.ts
    import { Order } from "../entities/order.entity";
    import { OrderStatus } from "../vo/order-status.vo";

    export interface OrderRepository {
        save(order: Order): Promise<Order>;
        findById(orderId: string): Promise<Order | null>;
        findByCustomerId(customerId: string): Promise<Order[]>;
        updateStatus(orderId: string, status: OrderStatus): Promise<void>;
        delete(orderId: string): Promise<void>;
    }
    ```
    *   **Responsabilidad del Dominio:** El dominio dicta qué operaciones de persistencia son necesarias desde la perspectiva del negocio (ej. guardar una orden, encontrar una orden por su ID, etc.).
    *   **Abstracción:** La capa de aplicación y la de dominio dependen de esta interfaz, no de su implementación concreta.

### 5.2. Implementación del Repositorio (Detalle de Infraestructura)

La capa de Infraestructura proporciona la implementación concreta de la interfaz del repositorio, utilizando una tecnología de persistencia específica.

*   **`PrismaOrderRepository` (`src/infrastructure/repositories/prisma-order.repository.ts`):**
    Esta clase implementa la interfaz `OrderRepository` utilizando Prisma como ORM para interactuar con la base de datos.

    ```typescript
    // Fragmento de src/infrastructure/repositories/prisma-order.repository.ts
    import { Injectable, OnModuleInit } from "@nestjs/common";
    import { PrismaClient } from "../../../generated/prisma/client"; // Cliente Prisma generado
    import { Order } from "src/domain/entities/order.entity";
    import { OrderRepository } from "src/domain/interfaces/order.repository";
    import { OrderStatus } from "src/domain/vo/order-status.vo";

    @Injectable()
    export class PrismaOrderRepository
      extends PrismaClient // Extiende PrismaClient para la conexión
      implements OrderRepository, OnModuleInit
    {
      async onModuleInit() {
        await this.$connect(); // Conecta a la base de datos al iniciar el módulo
      }

      async save(order: Order): Promise<Order> {
        const data = this.toPrisma(order); // Mapea la entidad de dominio al formato de Prisma

        const saved = await this.$transaction(async (prisma) => {
          // Lógica transaccional para asegurar la consistencia,
          // especialmente al manejar OrderItems.
          await prisma.orderItem.deleteMany({
            where: { orderId: order.id },
          });

          const upsertedOrder = await prisma.order.upsert({
            where: { id: order.id },
            update: data,
            create: data,
            include: { items: true }, // Incluye los items para la respuesta
          });

          return upsertedOrder;
        });

        return this.toDomain(saved); // Mapea el resultado de Prisma de vuelta a la entidad de dominio
      }

      // ... implementaciones de findById, findByCustomerId, updateStatus, delete ...

      private toPrisma(order: Order) {
        // Lógica para convertir la entidad Order a un objeto que Prisma puede persistir
        return {
          id: order.id,
          customerId: order.customerId,
          restaurantId: order.restaurantId,
          status: order.status.status,
          deliveryAddress: { // Manejo de tipos compuestos/embebidos en Prisma
            street: order.deliveryAddress.street,
            number: order.deliveryAddress.number,
            city: order.deliveryAddress.city,
            postalCode: order.deliveryAddress.postalCode,
            latitude: order.deliveryAddress.gpsCoordinates.lat,
            longitude: order.deliveryAddress.gpsCoordinates.lng,
          },
          items: {
            create: order.items.map((item) => ({ // Creación de OrderItems anidados
              productId: item.productId,
              quantity: item.quantity.value,
              price: item.price.amount,
              currency: item.price.currency,
              specialInstructions: item.specialInstructions?.text ?? null,
            })),
          },
        };
      }

      private toDomain(record: any): Order {
        // Lógica para convertir un registro de Prisma a una entidad Order del dominio
        // Utiliza el método estático de la entidad Order para la reconstrucción
        return Order.fromPrisma(record);
      }
    }
    ```
    *   **Dependencia de Infraestructura:** Esta clase conoce los detalles de Prisma y cómo interactuar con el esquema de la base de datos.
    *   **Mapeo:** Es crucial la presencia de métodos de mapeo (`toPrisma` y `toDomain`). Estos métodos traducen entre las entidades del dominio (ej. `Order`) y los modelos o estructuras de datos que Prisma utiliza (ej. el formato esperado por `prisma.order.create` o `prisma.order.update`). Este mapeo es fundamental para desacoplar el modelo del dominio del esquema de la base de datos. La entidad `Order` también colabora en este mapeo con su método `Order.fromPrisma()`.
    *   **Transaccionalidad:** Como se ve en el método `save`, el repositorio puede manejar transacciones de base de datos para asegurar la atomicidad de las operaciones, especialmente cuando se modifican múltiples tablas relacionadas (como `Order` y `OrderItem`).

### 5.3. Inyección de Dependencias y Desacoplamiento

La conexión entre la capa de aplicación (que necesita persistir datos) y la capa de infraestructura (que sabe cómo persistirlos) se realiza mediante **Inversión de Dependencias** y **Inyección de Dependencias**.

*   En el `OrderModule` (`src/modules/order.module.ts`):
    ```typescript
    // Fragmento de src/modules/order.module.ts
    {
        provide: ORDER_REPOSITORY, // Token de la interfaz del dominio
        useClass: PrismaOrderRepository // Implementación concreta de la infraestructura
    },
    ```
    NestJS se encarga de instanciar `PrismaOrderRepository` y proporcionarlo cada vez que un componente (como un caso de uso) solicite una dependencia con el token `ORDER_REPOSITORY`.

Este enfoque asegura que:
*   El **Dominio** y la **Aplicación** permanezcan puros y sin conocimiento de los detalles de persistencia.
*   La **implementación de la persistencia puede cambiarse** (ej. migrar de Prisma a TypeORM, o a otra base de datos) con un impacto mínimo en las capas internas, siempre y cuando la nueva implementación cumpla con la interfaz `OrderRepository`.
*   La **testabilidad** mejora significativamente, ya que los repositorios pueden ser fácilmente mockeados en las pruebas unitarias de los casos de uso.

## 6. Conclusión y Pruebas

### 6.1. Adherencia a DDD y Clean Architecture

La arquitectura implementada en el microservicio de Órdenes demuestra una sólida adherencia a los principios de **Domain-Driven Design (DDD)** y **Clean Architecture**.

*   **Bounded Context:** El microservicio se centra en un Bounded Context claro y bien definido (Gestión de Órdenes), con un lenguaje ubicuo reflejado en el código (entidades como `Order`, `OrderItem`, VOs como `OrderStatus`).
*   **Modelo de Dominio Rico:** Las entidades (`Order`) contienen lógica de negocio y no son anémicas. Los Value Objects (`Price`, `DeliveryAddress`, etc.) enriquecen el modelo y aseguran la integridad de los datos.
*   **Separación de Capas:** Se observa una clara distinción entre las capas de Dominio, Aplicación, Infraestructura y Presentación.
    *   El **Dominio** es puro y no depende de detalles externos.
    *   Los **Servicios de Aplicación** (Casos de Uso) orquestan la lógica sin contenerla, dependiendo de abstracciones del dominio.
    *   La **Infraestructura** (ej. `PrismaOrderRepository`) implementa las abstracciones del dominio, encapsulando los detalles técnicos.
    *   La **Presentación** (controladores y DTOs) maneja la interacción con el exterior, manteniéndose desacoplada del dominio.
*   **Principio de Dependencia:** Todas las dependencias apuntan hacia adentro, protegiendo el núcleo del negocio (Dominio y Aplicación) de cambios en capas externas. Esto se logra mediante la Inversión de Dependencias, donde las capas internas definen interfaces que las externas implementan.

Esta estructura resulta en un sistema que es:
*   **Mantenible:** Los cambios en una capa tienen un impacto mínimo en otras.
*   **Testable:** Cada capa, especialmente el dominio y los casos de uso, puede ser probada de forma aislada.
*   **Flexible:** Permite cambiar detalles de implementación (como el ORM o la base de datos) sin reescribir la lógica de negocio.
*   **Comprensible:** La clara separación de responsabilidades facilita la comprensión del código y la incorporación de nuevos desarrolladores.

### 6.2. Consideraciones sobre Pruebas

Aunque la implementación de pruebas automatizadas está fuera del alcance de esta documentación específica, la arquitectura adoptada sienta una base excelente para una estrategia de pruebas completa. La rúbrica de evaluación menciona la importancia de "diversos casos de prueba para realizar las pruebas automatizadas (Se sugiere utilizar Postman)".

La separación de capas facilita enormemente los siguientes tipos de pruebas:

*   **Pruebas Unitarias:**
    *   **Dominio:** Las entidades y Value Objects pueden ser probados de forma aislada para verificar su lógica interna y validaciones. Por ejemplo, se puede probar el método `confirm()` de la entidad `Order` o las validaciones en el constructor de `Price`.
    *   **Casos de Uso:** Los servicios de aplicación pueden ser probados unitariamente mockeando las dependencias de los repositorios. Esto permite verificar que la orquestación del caso de uso es correcta sin necesidad de una base de datos.
    *   **Controladores:** Se pueden realizar pruebas unitarias para verificar el manejo de solicitudes y respuestas, mockeando los casos de uso.

*   **Pruebas de Integración:**
    *   **Repositorios:** Se pueden probar las implementaciones de los repositorios (`PrismaOrderRepository`) contra una base de datos de prueba para asegurar que las operaciones de persistencia funcionan correctamente y los mapeos son correctos.
    *   **API (End-to-End):** Utilizando herramientas como Postman (como sugiere la rúbrica) o frameworks de prueba de NestJS (como `@nestjs/testing`), se pueden realizar pruebas de integración a nivel de API. Estas pruebas envían solicitudes HTTP reales a los endpoints del microservicio y verifican que las respuestas sean las esperadas, asegurando que todas las capas interactúan correctamente. Por ejemplo, se podría probar el flujo completo de creación de una orden (`POST /orders`).

Una suite de pruebas robusta es esencial para garantizar la calidad y la fiabilidad del microservicio a lo largo del tiempo, especialmente a medida que evoluciona y se añaden nuevas funcionalidades. La arquitectura actual es un habilitador clave para construir dicha suite.
