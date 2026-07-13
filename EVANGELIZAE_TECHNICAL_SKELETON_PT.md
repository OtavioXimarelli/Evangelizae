# Evangelizae — Esqueleto Técnico, Arquitetura e Manual de Operação para Agentes de IA

> **Status:** Blueprint Técnico Oficial & Guia de Inicialização do Projeto do Zero ("From Zero")  
> **Versão:** 2.0 (AI-Agent Ready)  
> **Arquitetura Geral:** Decoupled Monorepo/Polyrepo (Frontend Next.js/React + Backend Java/Spring Boot + MongoDB)  
> **Idioma deste Documento:** Português (`pt`)

---

## 1. Topologia do Repositório e Separação Estrita (Frontend vs. Backend)

Para garantir escalabilidade, segurança e independência de deploy, o projeto **Evangelizae** adota uma **separação estrita entre Frontend e Backend**. Seja estruturado em um Monorepo (`/frontend` e `/backend` na mesma raiz) ou em repositórios separados, as seguintes regras de fronteira e isolamento são **violáveis sob nenhuma hipótese**:

```mermaid
graph LR
    subgroup Client Side / Frontend
        Next[Next.js 15 App Router - Porta 3000]
        Store[Zustand Local Store / localStorage]
    end
    
    subgroup Network Boundary
        CORS[CORS Gateway & JWT Bearer Header]
    end
    
    subgroup Server Side / Backend
        API[Spring Boot 4 / Java 25 - Porta 8080]
        Security[Spring Security 6 Stateless Filter]
        Mongo[(MongoDB 7+ - Porta 27017)]
        Atlas[(MongoDB Atlas Vector Search / OpenAI)]
    end
    
    Next <-->|HTTPS / REST / JSON| CORS
    CORS <--> API
    API --> Security
    API --> Mongo
    API --> Atlas
    
    classDef frontend fill:#1e293b,stroke:#f59e0b,stroke-width:2px,color:#fff;
    classDef backend fill:#0f172a,stroke:#3b82f6,stroke-width:2px,color:#fff;
    class Next,Store frontend;
    class API,Security,Mongo,Atlas backend;
```

### 1.1 Regras de Isolamento Arquitetural
1. **Zero Acesso Direto:** O Frontend (`Next.js`) **nunca** se conecta diretamente ao banco de dados `MongoDB` ou a serviços vetoriais/IA. Todo fluxo de dados, autenticação, verificação teológica e persistência **deve** passar exclusivamente pelos endpoints REST do Backend (`Spring Boot`).
2. **Comunicação por Contrato REST/JSON:** Toda comunicação entre Frontend e Backend se dá através de requisições HTTP `Content-Type: application/json`.
3. **Autenticação Stateless (CORS + Bearer Token):**
   * O Backend expõe cabeçalhos CORS restritos apenas à origem do Frontend (`NEXT_PUBLIC_APP_URL`).
   * Após o login/cadastro (`POST /api/v1/auth/login`), o Backend emite um **JWT (JSON Web Token)** assinado com chave secreta HS512/RS256.
   * O Frontend armazena esse token em memória ou cookie HTTP-Only e o anexa em todas as chamadas autenticadas via header: `Authorization: Bearer <jwt_token>`.

### 1.2 Estrutura do Projeto "Do Zero" (Monorepo Recomendado para Agentes IA)

Ao inicializar o repositório do zero, o Agente de IA deve organizar a estrutura da seguinte forma:

```
evangelizae-root/
├── compose.yaml                      # Orquestração Docker (MongoDB 7+, Mongo Express, Backend, Frontend)
├── docs/                             # Documentação Oficial e Manifestos (PT/EN)
├── frontend/                         # Aplicação Web Next.js 15 / React 19 / TypeScript
│   ├── package.json
│   ├── next.config.ts
│   ├── tailwind.config.ts
│   ├── messages/                     # Dicionários i18n (pt.json, en.json)
│   ├── public/                       # Ícones sagrados, manifest.json, manifestos pwa
│   └── src/
│       ├── app/[locale]/             # Páginas (Santuário, Rosário Guiado, Liturgia, Intenções, IA, Perfil)
│       ├── components/               # Componentes Catedral e Primitivos UI
│       ├── hooks/                    # Hooks de Hidratação e Mutações React Query
│       ├── i18n/                     # Configuração do next-intl
│       ├── services/                 # Clientes Axios/Fetch tipados apontando para API Spring
│       ├── store/                    # Stores Zustand com resiliência offline
│       └── types/                    # Contratos de DTOs espelhados do Backend
└── backend/                          # Aplicação Java 25 / Spring Boot 4 / MongoDB
    ├── pom.xml (ou build.gradle)
    ├── src/main/java/com/evangelizae/backend/
    │   ├── EvangelizaeApplication.java
    │   ├── config/                   # Security, Mongo, Loom (Virtual Threads), CORS, Spring AI
    │   ├── domain/                   # Entidades de Domínio (@Document, Records, Repositories, Services)
    │   ├── security/                 # Filtros e Provedores JWT
    │   └── web/                      # Controllers REST e DTOs Record Java
    └── src/main/resources/
        ├── application.yml           # Configuração Geral Spring Boot
        ├── application-dev.yml       # Perfil de Desenvolvimento / Docker Local
        └── application-prod.yml      # Perfil de Produção / Cloud
```

---

## 2. Guia de Inicialização e Variáveis de Ambiente Sensíveis (`.env` Config)

Para que qualquer Agente de IA trabalhe no projeto desde o dia zero, as variáveis de ambiente devem ser rigorosamente separadas por camada e documentadas em seus respectivos arquivos `.env.example`.

### 2.1 Variáveis do Frontend (`frontend/.env.example`)
O Frontend só pode expor variáveis iniciadas por `NEXT_PUBLIC_` para o cliente browser. Segredos de servidor devem permanecer estritamente no lado servidor.
```env
# URL Base da API Java Spring Boot
NEXT_PUBLIC_API_BASE_URL=http://localhost:8080/api/v1

# Identidade do App e Ambiente
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_APP_ENV=development

# Feature Flags (Ativação gradual de funcionalidades no MVP)
NEXT_PUBLIC_FEATURE_CURSOR_GLOW=true
NEXT_PUBLIC_FEATURE_COMMUNITY_COMMENTS=false # Estritamente desativado no MVP por regra teológica/fraterna
```

### 2.2 Variáveis do Backend (`backend/.env.example` / `application-dev.yml`)
O Backend centraliza **todas** as credenciais sensíveis, chaves de criptografia e conexões com bancos de dados e motores de IA.
```env
# Configuração MongoDB Core
SPRING_DATA_MONGODB_URI=mongodb://root:secret@localhost:27017/evangelizae_core?authSource=admin
SPRING_DATA_MONGODB_DATABASE=evangelizae_core

# Segurança JWT (Chave secreta HS512 de no mínimo 64 bytes hexadecimais)
SECURITY_JWT_SECRET=8f9d2a1b3c4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a
SECURITY_JWT_EXPIRATION_MILLISECONDS=86400000 # 24 horas

# Spring AI & RAG Católico (OpenAI / Atlas Vector Search)
SPRING_AI_OPENAI_API_KEY=sk-proj-................................................
SPRING_AI_OPENAI_CHAT_OPTIONS_MODEL=gpt-4o-mini
SPRING_AI_OPENAI_EMBEDDING_OPTIONS_MODEL=text-embedding-3-small

# CORS Config (Origens Permitidas)
APP_CORS_ALLOWED_ORIGINS=http://localhost:3000,https://evangelizae.org
```

---

## 3. Diretrizes e Regras Operacionais Obrigatórias para Agentes de IA

Sempre que um Agente de IA (como Antigravity/Gemini ou subagentes) for acionado para criar, refatorar ou depurar código no projeto **Evangelizae**, ele deve checar e obedecer estritamente às seguintes **6 Regras de Ouro**:

### 🛡️ Regra 1: Isolamento e Preservação Intocável do Rosário Guiado
O motor interativo do Rosário Guiado (`guia-interativo`) e o cálculo de Mistérios do Dia (`misterios-do-dia`) são o **coração espiritual do projeto**.
* **O que o Agente DEVE fazer:** Se o projeto for recriado do zero, o Agente **deve migrar/recriar integralmente a lógica de `buildRosarySequence()`**, o gerenciamento visual das contas (`BeadMap`) e a persistência de sessão local (`localStorage: rosary-guide-session`), garantindo que o usuário consiga rezar sem interrupções.
* **O que o Agente NUNCA deve fazer:** Nunca simplificar, truncar ou remover etapas do Terço (Sinal da Cruz, Oferecimento, Credo, Pai-Nosso, Ave-Marias, Glória, Jaculatórias de Fátima e Salve-Rainha) com a justificativa de "simplificar código".

### 🌍 Regra 2: Zero Strings Hardcoded (Internacionalização i18n Estrita)
* Qualquer texto apresentado na interface do usuário (labels de botões, títulos, erros, reflexões) **nunca** pode ser escrito hardcoded diretamente no JSX/TSX.
* Toda chave de texto deve ser externalizada e sincronizada simultaneamente nos dicionários `frontend/messages/pt.json` (idioma primário) e `frontend/messages/en.json` (idioma secundário).
* Uso de hooks do `next-intl`: `useTranslations('Namespace')` em Client Components e `getTranslations('Namespace')` em Server Components.

### ⛪ Regra 3: Guardrails Teológicos no RAG e IA Católica do Magistério
Ao programar o serviço `MagisteriumAiService.java` no Spring Boot:
* A IA **deve ser programada com um System Prompt inegociável**, instruindo-a a responder apenas com base no Catecismo da Igreja Católica, Sagradas Escrituras, Direito Canônico, Documentos do Vaticano e Santos Doutores.
* **Mecanismo Anti-Alucinação:** Se a busca vetorial no MongoDB Atlas Vector Search retornar uma pontuação de similaridade baixa (abaixo do limiar de confiança, ex: `< 0.75`) ou não encontrar fonte oficial sobre o tema indagado, a IA **deve ser programada para recusar especulações** e retornar o aviso:
  > *"Não encontrei uma resposta direta nas fontes oficiais do Magistério católico indexadas para esta dúvida específica. Recomendo consultar um sacerdote de sua paróquia ou o Catecismo da Igreja Católica para uma orientação espiritual e doutrinal segura."*

### ⚡ Regra 4: Segurança contra Mismatch de Hidratação e Resiliência Offline
No Frontend (`Next.js 15` com SSR):
* O acesso ao `localStorage` para leitura de tema (`rosario-theme`), token JWT ou sequência diária do Zustand (`usePrayerStore`) **nunca** deve ocorrer diretamente no corpo de renderização de componentes.
* O Agente deve utilizar o hook `useIsMounted()` ou a checagem `typeof window !== 'undefined'` dentro de um `useEffect` para carregar o estado apenas após a montagem no cliente, evitando `Hydration failed because the initial UI does not match what was rendered on the server`.
* **Sincronização Offline-First:** O usuário deve conseguir rezar o Rosário mesmo sem internet (lendo do cache/Zustand local). Quando a conexão for restabelecida, o React Query dispara a mutação `POST /api/v1/prayer/checkin` para atualizar a sequência no MongoDB do Backend.

### 🔒 Regra 5: Padrão Uniforme de Erros e Contratos DTO
Todos os endpoints REST do Backend Java devem capturar exceções (`@ControllerAdvice`) e retornar um contrato de erro padronizado JSON, para que o Frontend possa exibir mensagens limpas via `Toaster`:
```json
{
  "timestamp": "2026-07-12T23:35:00Z",
  "status": 400,
  "error": "Bad Request",
  "message": "Você já registrou a conclusão do Santo Rosário hoje.",
  "path": "/api/v1/prayer/checkin"
}
```

---

## 4. Orquestração Docker do Zero (`compose.yaml`)

Para que o Agente ou o desenvolvedor suba todo o ecossistema localmente com um único comando (`docker compose up --build`), a raiz do projeto deve conter:

```yaml
services:
  mongodb:
    image: mongo:7.0
    container_name: evangelizae-mongo
    restart: always
    environment:
      MONGO_INITDB_ROOT_USERNAME: root
      MONGO_INITDB_ROOT_PASSWORD: secret
      MONGO_INITDB_DATABASE: evangelizae_core
    ports:
      - "27017:27017"
    volumes:
      - mongo_data:/data/db

  mongo-express:
    image: mongo-express:latest
    container_name: evangelizae-mongo-express
    restart: always
    ports:
      - "8081:8081"
    environment:
      ME_CONFIG_MONGODB_ADMINUSERNAME: root
      ME_CONFIG_MONGODB_ADMINPASSWORD: secret
      ME_CONFIG_MONGODB_SERVER: mongodb
    depends_on:
      - mongodb

  backend:
    build:
      context: ./backend
      dockerfile: Dockerfile
    container_name: evangelizae-backend
    restart: always
    ports:
      - "8080:8080"
    environment:
      SPRING_DATA_MONGODB_URI: mongodb://root:secret@mongodb:27017/evangelizae_core?authSource=admin
      SECURITY_JWT_SECRET: 8f9d2a1b3c4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a
      APP_CORS_ALLOWED_ORIGINS: http://localhost:3000
    depends_on:
      - mongodb

  frontend:
    build:
      context: ./frontend
      dockerfile: Dockerfile
    container_name: evangelizae-frontend
    restart: always
    ports:
      - "3000:3000"
    environment:
      NEXT_PUBLIC_API_BASE_URL: http://localhost:8080/api/v1
    depends_on:
      - backend

volumes:
  mongo_data:
```

---

## 5. Esqueleto Detalhado do Domínio Java (`com.evangelizae.backend`)

### 5.1 Entidade MongoDB: `UserDocument.java`
```java
package com.evangelizae.backend.domain.user;

import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;
import java.time.Instant;
import java.util.Set;

@Document(collection = "users")
public class UserDocument {
    @Id
    private String id;

    @Indexed(unique = true)
    private String email;
    
    private String passwordHash;
    private String fullName;
    private String preferredLocale; // "pt" ou "en"
    private Set<String> roles;      // ex: Set.of("ROLE_USER")
    
    private SpiritualPlan spiritualPlan;
    private UserStats stats;

    @CreatedDate
    private Instant createdAt;
    @LastModifiedDate
    private Instant updatedAt;

    // Constructors, Getters & Setters
}
```

### 5.2 Record de DTO: `CheckInRequestDto.java` (Java 25 Record Pattern)
```java
package com.evangelizae.backend.web.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Min;
import java.util.List;

public record CheckInRequestDto(
    @NotBlank(message = "O tipo do mistério (gozosos, luminosos, dolorosos, gloriosos) é obrigatório.")
    String mysteryType,

    @Min(value = 50, message = "O rosário deve ter pelo menos 50 Ave-Marias rezadas.")
    int prayedBeadsCount,

    List<String> intentions,
    String reflection
) {}
```

### 5.3 Controlador REST de Oração: `PrayerController.java`
```java
package com.evangelizae.backend.web.controller;

import com.evangelizae.backend.domain.prayer.PrayerService;
import com.evangelizae.backend.web.dto.CheckInRequestDto;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/prayer")
public class PrayerController {

    private final PrayerService prayerService;

    public PrayerController(PrayerService prayerService) {
        this.prayerService = prayerService;
    }

    @PostMapping("/checkin")
    public ResponseEntity<Void> submitCheckIn(
            @AuthenticationPrincipal UserDetails userDetails,
            @Valid @RequestBody CheckInRequestDto request) {
        prayerService.registerRosaryCheckIn(userDetails.getUsername(), request);
        return ResponseEntity.ok().build();
    }
}
```

Com este esqueleto técnico, diagramas de arquitetura, separação estrita de variáveis `.env` e as regras de operação para Inteligência Artificial, qualquer Agente de IA iniciará a reconstrução do projeto do **absoluto zero com total acurácia, segurança, escalabilidade e fidelidade ao propósito católico**.
