# HANOTEX — Thiết kế Kiến trúc & Microservices (Kong Gateway)

## Tổng quan
- Sàn giao dịch KH&CN với quy trình: Niêm yết → NDA → Thẩm định/Định giá → Đấu giá/Chào giá → Hợp đồng → Chuyển giao.
- Kiến trúc: Microservices + Kong Gateway + PostgreSQL + Redis + RabbitMQ + OpenSearch + Docker/K8s.
- Tuân thủ pháp lý Việt Nam và chuẩn quốc tế (CE, FDA, ISO/IEC, PCT).

## Kiến trúc cao cấp với Kong
```
[Client Web/Mobile]
   |
 [Kong API Gateway]
   |----> Listing Service
   |----> NDA Service
   |----> Valuation Service
   |----> Deals/Contracts Service
   |----> Auctions Service
   |----> Brokerage Service
   |----> User/Org Service
   |----> Notification Service
   |----> Search/Taxonomy Service
```
- Kong chịu trách nhiệm ingress, auth (OIDC/JWT), rate limiting, observability.
- Nginx làm reverse proxy static frontend.

## Microservices chính
- **Auth/Identity**: người dùng, tổ chức, phân quyền.
- **Listing**: công nghệ niêm yết, artifacts, intellectual_properties.
- **NDA**: thỏa thuận bảo mật, watermark, token truy cập.
- **Valuation**: yêu cầu/đề xuất thẩm định, chứng thư định giá.
- **Deals/Contracts**: hợp đồng điện tử, milestone, thanh toán.
- **Auctions/Offers**: đấu giá và chào giá.
- **Brokerage**: môi giới, ủy quyền, hoa hồng.
- **Notification**: email, SMS, web push.
- **Search/Taxonomy**: phân loại lĩnh vực, tìm kiếm OpenSearch.
- **Analytics**: KPI, báo cáo.

## Data & Storage
- PostgreSQL (SQL + JSONB) làm core DB cho mỗi service (schema riêng).
- Redis cache, RabbitMQ/Kafka cho event bus, MinIO/S3 cho artifacts.
- OpenSearch cho full-text & matching.

## Triển khai & CI/CD
- Docker-compose cho dev, K8s cho production.
- GitHub Actions/ArgoCD cho CI/CD, decK quản lý config Kong.
- Observability: Prometheus/Grafana, ELK, OpenTelemetry.

---

# Bổ sung Yêu cầu Kỹ thuật & Công nghệ (Chuẩn hóa “Dev-Ready”)

## 1. Prompt chuẩn cho dev
- **Mục tiêu & Success Metrics**: 
  - KPIs: số giao dịch thành công, số niêm yết/nhu cầu, thời gian kết nối cung–cầu < X ngày.
  - SLA: 99.9% uptime, latency < 200ms tại API Gateway.
- **Scope**: core sàn giao dịch KH&CN (niêm yết, kết nối, NDA, hợp đồng, môi giới).
- **Non-Scope**: không triển khai chức năng TMĐT bán lẻ.
- **NFRs**: hiệu năng (10k concurrent users), bảo mật (ISO 27001, MFA), chi phí tối ưu (cloud auto-scale), observability đầy đủ.
- **Data model sơ bộ**: schema riêng cho từng service (Users, TechAssets, Transactions, MatchingEngine).
- **Interface contract**: REST (OpenAPI), gRPC/Protobuf cho event, idempotent write APIs, error model chuẩn JSON (Problem+JSON).
- **Môi trường deploy**: Kubernetes (K8s), secret manager, Docker local.
- **Testing expectation**: unit + contract (Pact) + e2e (Playwright) + load test (p95, p99).

## 2. Microservices decomposition (DDD-based)
- **User Service**: user/org profile, authN/Z.
- **Tech Asset Service**: công nghệ, sản phẩm KH&CN, IP.
- **Transaction Service**: hợp đồng, đấu giá, thanh toán, NDA.
- **Valuation Service**: thẩm định/định giá bên thứ ba.
- **Matching Engine Service**: gợi ý cung–cầu (AI/ML).
- **Legal & Compliance Service**: chứng nhận, IP, pháp lý.
- **Brokerage Service**: môi giới, hoa hồng, ủy quyền.
- **Notification Service**: email, SMS, web push.
- **Gateway/API Service**: Kong API Gateway.

**Nguyên tắc**: 1 service = 1 owner dữ liệu. Không share bảng; giao tiếp qua API/event. High cohesion – low coupling. Fail isolation.  

## 3. Contract-First & Event-First
- HTTP cho query/sync; event cho state change/async.
- Write APIs idempotent (Idempotency-Key).
- Retry with backoff, circuit breaker, timeout budget chuẩn.
- Event schema: Protobuf/Avro versioned.  

## 4. Data & Consistency
- Mỗi service có schema riêng; không cross-query DB.
- Transactional Outbox + CDC để phát event tin cậy.
- Strong consistency trong service.
- Eventual consistency giữa services (saga/process manager cho multi-step).  

## 5. Observability & Vận hành
- **Logs**: JSON log (traceId, spanId, userId, idempotencyKey).
- **Metrics**: RED (Rate, Errors, Duration) + USE (Utilization, Saturation, Errors).
- **Traces**: OpenTelemetry liên-service.
- **Health check**: /healthz, /readyz.
- **Runbook**: rollback, reprocess event, rehydrate read model.  

## 6. Testing Strategy
- Contract tests (Pact consumer/provider).
- Test idempotency & retry.
- Resilience tests: timeout, partial failure, network partition.
- Load smoke: p95, p99 đúng SLO.
