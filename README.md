# Printodome — Enterprise E-Commerce Platform for Commercial Printers & Supplies

Printodome is a production-ready enterprise e-commerce platform architected using **Clean / Onion Architecture**, **.NET 8 Web API**, **Entity Framework Core (Code First)** with optimistic concurrency control, and a modern **React 19 / TypeScript / Material-UI (MUI)** client.

---

## 1. High-Level Architecture Overview

Printodome strictly adheres to **Clean Architecture / Onion Architecture** principles to achieve separation of concerns, enterprise testability, and zero domain coupling:

```
                              ┌───────────────────────────────────┐
                              │     Presentation / Client         │
                              │   React 19 (Vite, TypeScript,     │
                              │           MUI Core)               │
                              └─────────────────┬─────────────────┘
                                                │ REST / JSON (RFC 7807)
                                                ▼
┌─────────────────────────────────────────────────────────────────────────────────┐
│ Printodome.Api (.NET 8 Web API)                                                 │
│  - ProductsController, OrdersController, ReportsController                      │
│  - ExceptionHandlingMiddleware (RFC 7807 ProblemDetails mapping)                │
│  - Swagger / OpenAPI Integration & CORS Policy                                  │
└───────────────────────────────────────┬─────────────────────────────────────────┘
                                        │
                                        ▼
┌─────────────────────────────────────────────────────────────────────────────────┐
│ Printodome.Application                                                          │
│  - Use Cases & Handlers: ProductService, OrderProcessingService, ReportingService│
│  - Interfaces: IProductRepository, IOrderRepository, IUnitOfWork, IProductService│
│  - DTOs & Domain Invariant Verifications                                         │
└───────────────────────┬─────────────────────────────────┬───────────────────────┘
                        │                                 │
                        ▼                                 ▼
┌──────────────────────────────────────┐  ┌───────────────────────────────────────┐
│ Printodome.Infrastructure            │  │ Printodome.Domain                     │
│  - EF Core DbContext (Code First)    │  │  - Entities: Product, Order, OrderItem│
│  - Fluent API Configurations         │  │    Customer, BaseEntity               │
│  - Optimistic Concurrency (RowVersion)│ │  - Enums: OrderStatus, ProductCategory │
│  - SQL Server / PostgreSQL / InMem   │  │  - Domain Invariants & Exceptions     │
│  - Unit of Work & Repositories       │  │  - Zero External Dependencies         │
└──────────────────────────────────────┘  └───────────────────────────────────────┘
```

---

## 2. Directory Structure

```
Printodome/
├── Printodome.sln
├── src/
│   ├── Printodome.Domain/
│   │   ├── Common/
│   │   │   └── BaseEntity.cs
│   │   ├── Entities/
│   │   │   ├── Product.cs               # Concurrency token (RowVersion), DeductStock()
│   │   │   ├── Order.cs                 # Order aggregate root & state machine
│   │   │   ├── OrderItem.cs             # Order line item snapshot
│   │   │   └── Customer.cs              # Customer entity
│   │   ├── Enums/
│   │   │   ├── OrderStatus.cs           # Pending, Processing, Completed, Cancelled, Refunded
│   │   │   └── ProductCategory.cs       # Printers, TonerCartridges, Accessories, etc.
│   │   └── Exceptions/
│   │       └── DomainExceptions.cs      # InsufficientStockException, ConcurrencyConflictException
│   │
│   ├── Printodome.Application/
│   │   ├── Common/
│   │   │   └── Interfaces/
│   │   │       └── IRepositories.cs     # IProductRepository, IOrderRepository, IUnitOfWork
│   │   ├── DTOs/
│   │   │   ├── ProductDTOs.cs           # ProductDto, ProductFilterRequest, PaginatedResult
│   │   │   ├── OrderDTOs.cs             # CreateOrderRequest, OrderDto, CustomerRequest
│   │   │   └── ReportDTOs.cs            # SalesReportDto, TopSellingProductDto
│   │   ├── Services/
│   │   │   ├── ProductService.cs        # Catalog search & deferred IQueryable execution
│   │   │   ├── OrderProcessingService.cs# Atomic order checkout inside DB transaction
│   │   │   └── ReportingService.cs      # Advanced LINQ GroupBy, Join, & Projection
│   │   └── DependencyInjection.cs
│   │
│   ├── Printodome.Infrastructure/
│   │   ├── Data/
│   │   │   ├── Configurations/
│   │   │   │   ├── ProductConfiguration.cs   # RowVersion concurrency token, indices
│   │   │   │   ├── OrderConfigurations.cs    # Order & OrderItem relationship mapping
│   │   │   │   └── CustomerConfiguration.cs # Unique email index & field constraints
│   │   │   ├── Seed/
│   │   │   │   └── PrintodomeDataSeeder.cs  # Enterprise seed data (printers, toners, orders)
│   │   │   └── PrintodomeDbContext.cs       # Code First DbContext & Transaction scopes
│   │   ├── Repositories/
│   │   │   ├── ProductRepository.cs
│   │   │   ├── OrderAndCustomerRepositories.cs
│   │   │   └── UnitOfWork.cs                # Detects EF DbUpdateConcurrencyException
│   │   └── DependencyInjection.cs           # Multi-provider setup (InMemory/SqlServer/Postgres)
│   │
│   └── Printodome.Api/
│       ├── Controllers/
│       │   ├── ProductsController.cs        # Paginated catalog & filtering endpoints
│       │   ├── OrdersController.cs          # Secure transactional checkout endpoint
│       │   └── ReportsController.cs         # LINQ top printers & sales summary
│       ├── Middleware/
│       │   └── ExceptionHandlingMiddleware.cs # Maps domain exceptions to RFC 7807 JSON
│       ├── Program.cs                       # DI, Swagger, CORS, and Seeder pipeline
│       └── appsettings.json
│
├── tests/
│   └── Printodome.Tests/
│       └── OrderProcessingServiceTests.cs   # xUnit & Moq business rule test suite
│
└── client/                                  # React 19 + TypeScript + Vite + MUI
    ├── src/
    │   ├── components/
    │   │   ├── Navbar.tsx                   # Search, cart badge, analytics trigger
    │   │   ├── FilterSidebar.tsx            # Category, price slider, brand & stock filters
    │   │   ├── ProductCard.tsx              # Equipment display, stock chips, quick add
    │   │   ├── ProductGrid.tsx              # Responsive grid, skeletons, pagination
    │   │   ├── ProductDetailModal.tsx       # Equipment specs & concurrency notice
    │   │   ├── CartDrawer.tsx               # Cart drawer with quantity modifiers
    │   │   ├── CheckoutModal.tsx            # Enterprise checkout & audited receipt
    │   │   └── AnalyticsDashboardModal.tsx  # LINQ report metrics & top-sellers table
    │   ├── context/
    │   │   └── CartContext.tsx              # Cart state & localStorage persistence
    │   ├── hooks/
    │   │   ├── useCart.ts
    │   │   ├── useProducts.ts               # Product browsing & debounce hooks
    │   │   └── useReports.ts                # Real-time analytics fetching
    │   ├── services/
    │   │   └── api.ts                       # Axios client with enterprise fallbacks
    │   ├── types/
    │   │   └── index.ts                     # TypeScript DTO interfaces
    │   ├── theme.ts                         # Custom MUI palette & typography
    │   ├── App.tsx                          # Responsive storefront dashboard
    │   └── main.tsx
    ├── package.json
    └── vite.config.ts
```

---

## 3. Key Enterprise Features Demonstrated

### A. Optimistic Concurrency Control (Race Condition Prevention)
During high-traffic events (e.g., promotional sales on high-demand workgroup printers), multiple concurrent checkout requests can target the same inventory.
1. `Product.RowVersion` is configured as a concurrency token in EF Core:
   ```csharp
   builder.Property(p => p.RowVersion)
       .IsRowVersion()
       .IsConcurrencyToken();
   ```
2. When multiple transactions attempt to update stock simultaneously:
   - The first transaction commits and updates the concurrency stamp.
   - Subsequent transactions detect the token mismatch; EF Core throws `DbUpdateConcurrencyException`.
   - The `UnitOfWork` catches this and throws a `ConcurrencyConflictException`.
   - The `ExceptionHandlingMiddleware` automatically transforms this into an **HTTP 409 Conflict** response conforming to **RFC 7807 ProblemDetails**.
   - The database transaction automatically rolls back via `_unitOfWork.RollbackTransactionAsync()`.

### B. Advanced LINQ Querying with Deferred Execution
Located in [`ReportingService.cs`](src/Printodome.Application/Services/ReportingService.cs):
```csharp
var topSellingQuery = from order in ordersQuery
                      from item in order.Items
                      join product in productsQuery on item.ProductId equals product.Id
                      where product.Category == ProductCategory.Printers
                      group new { item, product } by new
                      {
                          product.Id,
                          product.SKU,
                          product.Name,
                          product.Category
                      } into g
                      orderby g.Sum(x => x.item.Quantity) descending
                      select new TopSellingProductDto(
                          g.Key.Id,
                          g.Key.SKU,
                          g.Key.Name,
                          g.Key.Category.ToString(),
                          g.Sum(x => x.item.Quantity),
                          g.Sum(x => x.item.TotalPrice));
```
- **Deferred Execution:** Filters (`Where`), Joins, and Projections are built as `IQueryable` expressions and executed on the database server in a single round-trip without in-memory buffering.

### C. Regulatory & Audit-Ready Checkout Security
- Strict atomic database transactions (`BeginTransactionAsync` / `CommitTransactionAsync`).
- Customer data isolation with dedicated aggregate root boundaries.
- Consistent RFC 7807 Problem Details for all validation and domain errors (HTTP 400, 404, 409, 422, 500).

---

## 4. How to Run the Solution

### Prerequisites
- [.NET 8 / 9 SDK](https://dotnet.microsoft.com/download)
- [Node.js v20+ & npm](https://nodejs.org/)

### Running the Backend API
```bash
# Navigate to the API project
cd src/Printodome.Api

# Run the API server (uses In-Memory DB by default with rich seeded data)
dotnet run
```
- API Base URL: `http://localhost:5000`
- Swagger UI Documentation: `http://localhost:5000/swagger`

### Running the Frontend Client
```bash
# In another terminal window:
cd client

# Install dependencies (already installed in workspace)
npm install

# Start Vite development server
npm run dev
```
- Frontend URL: `http://localhost:5173`

### Executing Unit Tests
```bash
# Run the complete xUnit test suite
dotnet test
```
All tests pass verifying atomic stock deduction, insufficient inventory exceptions, missing product handling, and concurrency rollback.

