export type Incident = {
  id: string;
  anomalyName: string;
  resource: string;
  category: string;
  severity: "Low" | "Medium" | "High" | "Critical";
  confidence: number;
  status: "Pending" | "Approved" | "Rejected" | "Modified";
  createdAt: string;
  description: string;
  command: string;
};

export const mockIncidents: Incident[] = [
  {
    id: "INC-001",
    anomalyName: "High CPU Usage",
    resource: "vm-prod-01",
    category: "Infrastructure",
    severity: "High",
    confidence: 92,
    status: "Pending",
    createdAt: "2026-03-30T10:15:00Z",
    description: "CPU usage exceeded 90% on vm-prod-01 for 5 minutes.",
    command: "top -b -n1 | head -n20",
  },
  {
    id: "INC-002",
    anomalyName: "Memory Leak Detected",
    resource: "service-payments-2",
    category: "Application",
    severity: "Critical",
    confidence: 88,
    status: "Pending",
    createdAt: "2026-03-30T09:42:00Z",
    description: "Process memory steadily growing beyond expected limits.",
    command: "ps aux --sort=-rss | head -n 10",
  },
  {
    id: "INC-003",
    anomalyName: "Disk Almost Full",
    resource: "db-node-03",
    category: "Infrastructure",
    severity: "Medium",
    confidence: 75,
    status: "Pending",
    createdAt: "2026-03-29T22:10:00Z",
    description: "Root partition at 92% capacity.",
    command: "df -h / | tail -n1",
  },
  {
    id: "INC-004",
    anomalyName: "Pod CrashLoopBackOff",
    resource: "k8s/payment-api-7f8b9",
    category: "Kubernetes",
    severity: "High",
    confidence: 85,
    status: "Pending",
    createdAt: "2026-03-30T02:05:00Z",
    description: "pod payment-api repeatedly crashing on startup.",
    command: "kubectl describe pod payment-api-7f8b9",
  },
  {
    id: "INC-005",
    anomalyName: "Network Latency Spike",
    resource: "us-east-1-router-2",
    category: "Network",
    severity: "Medium",
    confidence: 68,
    status: "Pending",
    createdAt: "2026-03-29T18:30:00Z",
    description: "Increased latency observed to backend services from router.",
    command: "mtr --report -c 20 backend.service.local",
  },
  {
    id: "INC-006",
    anomalyName: "Unauthorized Access Attempt",
    resource: "auth-gateway",
    category: "Security",
    severity: "Critical",
    confidence: 95,
    status: "Pending",
    createdAt: "2026-03-30T11:03:00Z",
    description: "Multiple failed login attempts from suspicious IPs.",
    command: "grep 'Failed password' /var/log/auth.log | tail -n50",
  },
  {
    id: "INC-007",
    anomalyName: "High Garbage Collection",
    resource: "java-app-4",
    category: "Application",
    severity: "Low",
    confidence: 55,
    status: "Pending",
    createdAt: "2026-03-28T14:12:00Z",
    description: "Long GC pauses observed impacting throughput.",
    command: "jstat -gcutil <pid> 1000 5",
  },
  {
    id: "INC-008",
    anomalyName: "Database Connection Errors",
    resource: "orders-db-cluster",
    category: "Database",
    severity: "High",
    confidence: 80,
    status: "Pending",
    createdAt: "2026-03-30T06:50:00Z",
    description: "Connection errors and timeouts to primary DB instance.",
    command: "kubectl logs deployment/db-proxy --since=1h",
  },
  {
    id: "INC-009",
    anomalyName: "Filesystem I/O Wait",
    resource: "storage-node-12",
    category: "Storage",
    severity: "Medium",
    confidence: 60,
    status: "Pending",
    createdAt: "2026-03-27T09:00:00Z",
    description: "Elevated iowait impacting service latency.",
    command: "iostat -x 1 3",
  },
  {
    id: "INC-010",
    anomalyName: "Service Throttling",
    resource: "api-gateway",
    category: "Platform",
    severity: "High",
    confidence: 78,
    status: "Pending",
    createdAt: "2026-03-30T08:20:00Z",
    description: "Rate limiting causing 429 responses to clients.",
    command: "curl -s -o /dev/null -w '%{http_code}' https://api.service/health",
  },
];

export default mockIncidents;
