# 🐘 PostgreSQL Plugin Documentation

## 📋 Overview

The PostgreSQL Plugin allows seamless integration with PostgreSQL databases, providing a powerful and flexible way to connect, query, and manage PostgreSQL instances from your application. This plugin supports multiple database connections, connection pooling, and advanced query capabilities.

---

## 🔧 Installation

### Prerequisites
- Node.js 16+ 
- PostgreSQL 12+ 
- NestJS application with Plugin System

### Installation Steps

```bash
# Navigate to your plugins directory
cd plugins/

# Clone or create the postgres plugin
mkdir postgres-plugin
cd postgres-plugin

# Initialize package.json
npm init -y

# Install required dependencies
npm install pg pg-pool
npm install --save-dev @types/pg
```

### Package.json Example
```json
{
  "name": "postgres-plugin",
  "version": "1.0.0",
  "description": "PostgreSQL database plugin with connection pooling and advanced query capabilities",
  "main": "dist/index.js",
  "scripts": {
    "build": "tsc",
    "dev": "tsc -w",
    "test": "jest"
  },
  "dependencies": {
    "pg": "^8.11.3",
    "pg-pool": "^3.6.1"
  },
  "devDependencies": {
    "@types/pg": "^8.10.2",
    "typescript": "^5.1.3",
    "jest": "^29.6.1"
  },
  "keywords": [
    "postgresql",
    "database",
    "plugin",
    "connection-pool"
  ]
}
```

---

## ⚙️ Configuration Options

### Basic Configuration
```typescript
{
  "host": "localhost",
  "port": 5432,
  "database": "mydatabase",
  "user": "myuser",
  "password": "mypassword",
  "ssl": false,
  "max": 20,           // maximum number of clients in pool
  "idleTimeoutMillis": 30000,
  "connectionTimeoutMillis": 2000
}
```

### Advanced Configuration
```typescript
{
  "connection": {
    "host": "cluster-host.postgres.database.azure.com",
    "port": 5432,
    "database": "production-db",
    "user": "adminuser",
    "password": process.env.DB_PASSWORD,
    "ssl": {
      "rejectUnauthorized": true,
      "ca": process.env.DB_SSL_CA
    }
  },
  "pool": {
    "max": 50,
    "min": 5,
    "idleTimeoutMillis": 30000,
    "connectionTimeoutMillis": 5000,
    "allowExitOnIdle": false
  },
  "options": {
    "preparedStatements": true,
    "queryTimeout": 10000,
    "autoReconnect": true,
    "reconnectInterval": 5000,
    "maxReconnectAttempts": 10
  }
}
```

---

## 🚀 Usage Examples

### Basic Connection and Query
```typescript
// Using the plugin through the plugin manager
const result = await pluginManager.executePlugin(
  'postgres-plugin',
  'user-123:production-db',
  {
    host: 'localhost',
    port: 5432,
    database: 'mydb',
    user: 'admin',
    password: 'secret'
  },
  'query',
  {
    sql: 'SELECT * FROM users WHERE id = $1',
    params: [123],
    timeout: 5000
  }
);
```

### Transaction Management
```typescript
// Execute transaction
const transactionResult = await pluginManager.executePlugin(
  'postgres-plugin',
  'user-123:inventory-db',
  config,
  'transaction',
  {
    operations: [
      {
        sql: 'UPDATE inventory SET quantity = quantity - $1 WHERE product_id = $2',
        params: [5, 'prod-001']
      },
      {
        sql: 'INSERT INTO orders (product_id, quantity, user_id) VALUES ($1, $2, $3)',
        params: ['prod-001', 5, 'user-123']
      }
    ],
    isolationLevel: 'READ_COMMITTED'
  }
);
```

### Batch Operations
```typescript
// Batch insert
const batchResult = await pluginManager.executePlugin(
  'postgres-plugin',
  'user-123:analytics-db',
  config,
  'batchInsert',
  {
    table: 'user_events',
    records: [
      { user_id: 1, event_type: 'login', timestamp: new Date() },
      { user_id: 2, event_type: 'purchase', timestamp: new Date() },
      { user_id: 3, event_type: 'logout', timestamp: new Date() }
    ],
    conflictStrategy: 'ignore' // or 'update'
  }
);
```

---

## 📊 Supported Operations

### Query Operations
| Operation | Description | Parameters |
|-----------|-------------|------------|
| `query` | Execute SQL query | `sql`, `params`, `timeout` |
| `queryOne` | Get single row | `sql`, `params`, `timeout` |
| `queryValue` | Get single value | `sql`, `params`, `timeout` |
| `execute` | Execute command | `sql`, `params`, `timeout` |

### Transaction Operations
| Operation | Description |
|-----------|-------------|
| `transaction` | Execute transaction |
| `beginTransaction` | Start transaction |
| `commit` | Commit transaction |
| `rollback` | Rollback transaction |

### CRUD Operations
| Operation | Description |
|-----------|-------------|
| `insert` | Insert record |
| `update` | Update records |
| `delete` | Delete records |
| `find` | Find records |
| `findOne` | Find single record |
| `count` | Count records |

### Schema Operations
| Operation | Description |
|-----------|-------------|
| `createTable` | Create table |
| `alterTable` | Alter table |
| `dropTable` | Drop table |
| `listTables` | List tables |
| `describeTable` | Describe table structure |

---

## 🔌 API Reference

### initialize(context: PluginContext)
```typescript
export async function initialize(context: PluginContext): Promise<PostgresPlugin> {
  return new PostgresPlugin(context);
}
```

### Main Plugin Class Methods
```typescript
class PostgresPlugin {
  // Connection management
  async connect(): Promise<void>;
  async disconnect(): Promise<void>;
  async isConnected(): Promise<boolean>;
  
  // Query execution
  async query(options: QueryOptions): Promise<QueryResult>;
  async queryOne(options: QueryOptions): Promise<any>;
  async queryValue(options: QueryOptions): Promise<any>;
  
  // Transactions
  async transaction(options: TransactionOptions): Promise<any>;
  async beginTransaction(): Promise<string>;
  async commit(transactionId: string): Promise<void>;
  async rollback(transactionId: string): Promise<void>;
  
  // CRUD operations
  async insert(table: string, data: any): Promise<any>;
  async update(table: string, data: any, where: any): Promise<any>;
  async delete(table: string, where: any): Promise<any>;
  async find(table: string, options?: FindOptions): Promise<any[]>;
  async findOne(table: string, where: any): Promise<any>;
  
  // Schema operations
  async createTable(table: string, schema: TableSchema): Promise<void>;
  async alterTable(table: string, alterations: TableAlteration[]): Promise<void>;
  async listTables(): Promise<string[]>;
  async describeTable(table: string): Promise<TableDescription>;
  
  // Utility methods
  async ping(): Promise<boolean>;
  async getStats(): Promise<ConnectionStats>;
  async closeAllConnections(): Promise<void>;
}
```

---

## 🛡️ Error Handling

### Common Error Codes
```typescript
const ErrorCodes = {
  CONNECTION_FAILED: 'POSTGRES_CONNECTION_FAILED',
  QUERY_TIMEOUT: 'POSTGRES_QUERY_TIMEOUT',
  TRANSACTION_FAILED: 'POSTGRES_TRANSACTION_FAILED',
  POOL_EXHAUSTED: 'POSTGRES_POOL_EXHAUSTED',
  SSL_REQUIRED: 'POSTGRES_SSL_REQUIRED',
  AUTH_FAILED: 'POSTGRES_AUTH_FAILED'
};
```

### Error Response Format
```json
{
  "success": false,
  "error": {
    "code": "POSTGRES_CONNECTION_FAILED",
    "message": "Could not connect to PostgreSQL database",
    "details": {
      "host": "localhost",
      "port": 5432,
      "originalError": "connection refused"
    },
    "timestamp": "2023-12-07T10:30:00.000Z"
  }
}
```

---

## 📈 Performance Optimization

### Connection Pooling Settings
```typescript
// Optimal settings for high-traffic applications
{
  "pool": {
    "max": 100,                    // Maximum connections
    "min": 10,                     // Minimum connections
    "idleTimeoutMillis": 30000,    // Close idle connections after 30s
    "connectionTimeoutMillis": 2000, // Connection timeout
    "maxUses": 7500,               // Maximum uses per connection
    "allowExitOnIdle": true        // Allow process exit when idle
  }
}
```

### Query Optimization Tips
```typescript
// Use parameterized queries to prevent SQL injection and allow query caching
const result = await plugin.query({
  sql: 'SELECT * FROM users WHERE age > $1 AND status = $2',
  params: [18, 'active'],
  timeout: 10000
});

// Use transactions for multiple related operations
await plugin.transaction({
  operations: [
    { sql: 'UPDATE accounts SET balance = balance - $1 WHERE id = $2', params: [100, 1] },
    { sql: 'UPDATE accounts SET balance = balance + $1 WHERE id = $2', params: [100, 2] }
  ]
});
```

---

## 🔐 Security Considerations

### SSL Configuration
```typescript
{
  "ssl": {
    "rejectUnauthorized": true,
    "ca": fs.readFileSync('/path/to/ca-certificate.crt').toString(),
    "key": fs.readFileSync('/path/to/client-key.key').toString(),
    "cert": fs.readFileSync('/path/to/client-certificate.crt').toString()
  }
}
```

### Credential Management
```typescript
// Always use environment variables or secure config stores
{
  "user": process.env.DB_USER,
  "password": process.env.DB_PASSWORD,
  "host": process.env.DB_HOST,
  "database": process.env.DB_NAME
}
```

---

## 🧪 Testing

### Unit Test Example
```typescript
import { PostgresPlugin } from './postgres-plugin';
import { PluginContext } from '../interfaces/plugin-context.interface';

describe('PostgresPlugin', () => {
  let plugin: PostgresPlugin;
  let mockContext: PluginContext;

  beforeEach(async () => {
    mockContext = {
      config: {
        host: 'localhost',
        port: 5432,
        database: 'testdb',
        user: 'testuser',
        password: 'testpass'
      },
      services: {
        getService: jest.fn(),
        hasService: jest.fn()
      },
      logger: console
    };

    plugin = new PostgresPlugin(mockContext);
  });

  it('should connect successfully', async () => {
    await expect(plugin.connect()).resolves.not.toThrow();
  });

  it('should execute query', async () => {
    const result = await plugin.query({
      sql: 'SELECT 1 as test',
      params: []
    });
    expect(result.rows[0].test).toBe(1);
  });
});
```

### Integration Test Setup
```typescript
// test-setup.ts
import { Test } from '@nestjs/testing';
import { PluginsModule } from '../src/plugins/plugins.module';
import { PluginManagerService } from '../src/plugins/manager/plugin-manager.service';

let pluginManager: PluginManagerService;

beforeAll(async () => {
  const moduleRef = await Test.createTestingModule({
    imports: [PluginsModule.forRoot('./plugins')],
  }).compile();

  pluginManager = moduleRef.get<PluginManagerService>();
});

afterAll(async () => {
  // Cleanup connections
});
```

---

## 📋 Logging and Monitoring

### Logging Configuration
```typescript
{
  "logging": {
    "level": "debug", // error, warn, info, debug
    "logQueries": false, // Log all queries (careful in production)
    "logParameters": false, // Log query parameters
    "slowQueryThreshold": 1000, // Log queries slower than 1000ms
    "logConnections": true // Log connection events
  }
}
```

### Monitoring Metrics
```typescript
interface ConnectionStats {
  total: number;
  idle: number;
  waiting: number;
  max: number;
  min: number;
  queryCount: number;
  errorCount: number;
  avgQueryTime: number;
  maxQueryTime: number;
}
```

---

## 🚨 Troubleshooting

### Common Issues and Solutions

| Issue | Solution |
|-------|----------|
| Connection refused | Check host/port, firewall settings, PostgreSQL service status |
| Authentication failed | Verify username/password, check pg_hba.conf |
| SSL connection error | Ensure SSL certificates are properly configured |
| Connection timeout | Increase connectionTimeoutMillis, check network latency |
| Pool exhausted | Increase max connections, optimize query performance |
| Query timeout | Optimize slow queries, increase query timeout |

### Debug Mode
```typescript
// Enable debug logging
{
  "logging": {
    "level": "debug",
    "logQueries": true,
    "logParameters": true
  }
}
```

---

## 📚 Examples

### Complex Query Example
```typescript
const analyticsData = await pluginManager.executePlugin(
  'postgres-plugin',
  'user-123:analytics-db',
  config,
  'query',
  {
    sql: `
      WITH user_stats AS (
        SELECT 
          user_id,
          COUNT(*) as total_events,
          COUNT(DISTINCT event_type) as unique_events,
          MAX(timestamp) as last_event
        FROM user_events 
        WHERE timestamp >= $1
        GROUP BY user_id
      )
      SELECT 
        u.id,
        u.username,
        u.email,
        COALESCE(us.total_events, 0) as total_events,
        COALESCE(us.unique_events, 0) as unique_events,
        us.last_event
      FROM users u
      LEFT JOIN user_stats us ON u.id = us.user_id
      WHERE u.created_at >= $2
      ORDER BY us.total_events DESC
      LIMIT $3 OFFSET $4
    `,
    params: [
      new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // 30 days ago
      new Date(Date.now() - 90 * 24 * 60 * 60 * 1000), // 90 days ago
      100, // limit
      0    // offset
    ],
    timeout: 30000
  }
);
```

### Migration Example
```typescript
await pluginManager.executePlugin(
  'postgres-plugin',
  'user-123:production-db',
  config,
  'transaction',
  {
    operations: [
      {
        sql: `
          CREATE TABLE IF NOT EXISTS user_preferences (
            id SERIAL PRIMARY KEY,
            user_id INTEGER NOT NULL REFERENCES users(id),
            theme VARCHAR(50) DEFAULT 'light',
            notifications_enabled BOOLEAN DEFAULT true,
            created_at TIMESTAMP DEFAULT NOW(),
            updated_at TIMESTAMP DEFAULT NOW()
          )
        `
      },
      {
        sql: `
          CREATE INDEX IF NOT EXISTS idx_user_preferences_user_id 
          ON user_preferences(user_id)
        `
      }
    ]
  }
);
```

---

## 🔄 Version History

| Version | Date | Changes |
|---------|------|---------|
| 1.0.0 | 2023-12-07 | Initial release with basic CRUD operations |
| 1.1.0 | 2023-12-15 | Added transaction support and connection pooling |
| 1.2.0 | 2023-12-20 | Added schema operations and advanced query options |
| 1.3.0 | 2024-01-05 | Added SSL support and performance optimizations |

---

## 📞 Support

For issues and questions:
- 📧 Email: support@yourapp.com
- 🐛 GitHub Issues: [YourRepo/issues](https://github.com/yourrepo/issues)
- 📚 Documentation: [docs.yourapp.com](https://docs.yourapp.com)

---

## 📄 License

MIT License - feel free to use this plugin in your commercial and personal projects.

---

*This documentation was generated on December 7, 2023. Always refer to the latest version for the most up-to-date information.*