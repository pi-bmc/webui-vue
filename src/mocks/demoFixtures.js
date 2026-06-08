/**
 * In-memory Redfish fixtures for demo mode (VITE_DEMO_MODE=true).
 *
 * Covers the core resource graph plus the high-traffic pages (Overview,
 * Sensors, Event Logs, Inventory, Network, Users, Sessions, Firmware). Any
 * path not listed here is served by `genericResource()` as an empty,
 * structurally-valid resource so the page renders its empty state.
 */

const ID = (id) => ({ '@odata.id': id });
const collection = (path, ids, base = path) => ({
  '@odata.id': path,
  '@odata.type': '#Collection',
  Name: 'Collection',
  Members: ids.map((id) => ID(`${base}/${id}`)),
  'Members@odata.count': ids.length,
});

const okStatus = { State: 'Enabled', Health: 'OK' };

export const fixtures = {
  // ---- Service root ---------------------------------------------------------
  '/redfish/v1': {
    '@odata.id': '/redfish/v1',
    '@odata.type': '#ServiceRoot.v1_15_0.ServiceRoot',
    Id: 'RootService',
    Name: 'Root Service',
    RedfishVersion: '1.15.0',
    UUID: '92384634-2938-2342-8820-489239905423',
    ProtocolFeaturesSupported: {
      ExpandQuery: { ExpandAll: false, Levels: false, Links: false, NoLinks: false },
      SelectQuery: false,
      FilterQuery: false,
    },
    Systems: ID('/redfish/v1/Systems'),
    Managers: ID('/redfish/v1/Managers'),
    Chassis: ID('/redfish/v1/Chassis'),
    AccountService: ID('/redfish/v1/AccountService'),
    SessionService: ID('/redfish/v1/SessionService'),
    UpdateService: ID('/redfish/v1/UpdateService'),
    CertificateService: ID('/redfish/v1/CertificateService'),
    TelemetryService: ID('/redfish/v1/TelemetryService'),
    Links: { Sessions: ID('/redfish/v1/SessionService/Sessions') },
  },

  // ---- Systems --------------------------------------------------------------
  '/redfish/v1/Systems': collection('/redfish/v1/Systems', ['system']),
  '/redfish/v1/Systems/system': {
    '@odata.id': '/redfish/v1/Systems/system',
    '@odata.type': '#ComputerSystem.v1_17_0.ComputerSystem',
    Id: 'system',
    Name: 'System',
    SystemType: 'Physical',
    Manufacturer: 'OpenBMC Demo',
    Model: 'Demo Server 1000',
    SubModel: 'Demo',
    SerialNumber: 'DEMO-SN-0001',
    PartNumber: 'DEMO-PN-1000',
    AssetTag: 'demo-asset-tag',
    UUID: 'aa6e4f3b-1f2c-4b6d-9a0e-000000000001',
    BiosVersion: 'DEMO-BIOS-2.14',
    PowerState: 'On',
    Status: okStatus,
    IndicatorLED: 'Off',
    LocationIndicatorActive: false,
    PowerRestorePolicy: 'AlwaysOff',
    Boot: {
      BootSourceOverrideEnabled: 'Disabled',
      BootSourceOverrideTarget: 'None',
      BootSourceOverrideMode: 'UEFI',
      'BootSourceOverrideTarget@Redfish.AllowableValues': [
        'None',
        'Pxe',
        'Hdd',
        'Cd',
        'Diags',
        'BiosSetup',
        'Usb',
      ],
    },
    ProcessorSummary: { Count: 2, Model: 'Demo CPU @ 2.4GHz', Status: okStatus },
    MemorySummary: { TotalSystemMemoryGiB: 64, Status: okStatus },
    Processors: ID('/redfish/v1/Systems/system/Processors'),
    Memory: ID('/redfish/v1/Systems/system/Memory'),
    Storage: ID('/redfish/v1/Systems/system/Storage'),
    EthernetInterfaces: ID('/redfish/v1/Systems/system/EthernetInterfaces'),
    LogServices: ID('/redfish/v1/Systems/system/LogServices'),
    Bios: ID('/redfish/v1/Systems/system/Bios'),
  },

  // ---- Managers -------------------------------------------------------------
  '/redfish/v1/Managers': collection('/redfish/v1/Managers', ['bmc']),
  '/redfish/v1/Managers/bmc': {
    '@odata.id': '/redfish/v1/Managers/bmc',
    '@odata.type': '#Manager.v1_14_0.Manager',
    Id: 'bmc',
    Name: 'OpenBMC Manager',
    ManagerType: 'BMC',
    Manufacturer: 'OpenBMC Demo',
    Model: 'Demo BMC',
    FirmwareVersion: 'demo-fw-2.14.0',
    DateTime: '2024-06-08T12:00:00+00:00',
    DateTimeLocalOffset: '+00:00',
    UUID: 'bb6e4f3b-1f2c-4b6d-9a0e-000000000002',
    PowerState: 'On',
    Status: okStatus,
    EthernetInterfaces: ID('/redfish/v1/Managers/bmc/EthernetInterfaces'),
    LogServices: ID('/redfish/v1/Managers/bmc/LogServices'),
    NetworkProtocol: ID('/redfish/v1/Managers/bmc/NetworkProtocol'),
    GraphicalConsole: { ServiceEnabled: true, MaxConcurrentSessions: 4 },
    SerialConsole: { ServiceEnabled: true, MaxConcurrentSessions: 1 },
  },
  '/redfish/v1/Managers/bmc/NetworkProtocol': {
    '@odata.id': '/redfish/v1/Managers/bmc/NetworkProtocol',
    Id: 'NetworkProtocol',
    Name: 'Manager Network Protocol',
    HostName: 'demo-bmc',
    FQDN: 'demo-bmc.local',
    Status: okStatus,
    HTTPS: { ProtocolEnabled: true, Port: 443 },
    SSH: { ProtocolEnabled: true, Port: 22 },
    IPMI: { ProtocolEnabled: false, Port: 623 },
    NTP: {
      ProtocolEnabled: true,
      NTPServers: ['time.demo.local', 'pool.ntp.org'],
    },
  },

  // ---- Chassis + sensors ----------------------------------------------------
  '/redfish/v1/Chassis': collection('/redfish/v1/Chassis', ['chassis']),
  '/redfish/v1/Chassis/chassis': {
    '@odata.id': '/redfish/v1/Chassis/chassis',
    '@odata.type': '#Chassis.v1_21_0.Chassis',
    Id: 'chassis',
    Name: 'Demo Chassis',
    ChassisType: 'RackMount',
    Manufacturer: 'OpenBMC Demo',
    Model: 'Demo Chassis 1U',
    SerialNumber: 'DEMO-CH-0001',
    PartNumber: 'DEMO-CH-PN',
    PowerState: 'On',
    Status: okStatus,
    LocationIndicatorActive: false,
    Sensors: ID('/redfish/v1/Chassis/chassis/Sensors'),
    Thermal: ID('/redfish/v1/Chassis/chassis/Thermal'),
    Power: ID('/redfish/v1/Chassis/chassis/Power'),
    Assembly: ID('/redfish/v1/Chassis/chassis/Assembly'),
  },
  '/redfish/v1/Chassis/chassis/Sensors': collection(
    '/redfish/v1/Chassis/chassis/Sensors',
    ['cpu_temp', 'inlet_temp', 'fan0', 'fan1', 'p12v', 'total_power'],
  ),
  '/redfish/v1/Chassis/chassis/Sensors/cpu_temp': {
    '@odata.id': '/redfish/v1/Chassis/chassis/Sensors/cpu_temp',
    Id: 'cpu_temp',
    Name: 'CPU Temp',
    ReadingType: 'Temperature',
    Reading: 47.5,
    ReadingUnits: '°C',
    Status: okStatus,
    Thresholds: {
      UpperCaution: { Reading: 85 },
      UpperCritical: { Reading: 95 },
    },
  },
  '/redfish/v1/Chassis/chassis/Sensors/inlet_temp': {
    '@odata.id': '/redfish/v1/Chassis/chassis/Sensors/inlet_temp',
    Id: 'inlet_temp',
    Name: 'Inlet Temp',
    ReadingType: 'Temperature',
    Reading: 24.0,
    ReadingUnits: '°C',
    Status: okStatus,
    Thresholds: { UpperCaution: { Reading: 40 }, UpperCritical: { Reading: 50 } },
  },
  '/redfish/v1/Chassis/chassis/Sensors/fan0': {
    '@odata.id': '/redfish/v1/Chassis/chassis/Sensors/fan0',
    Id: 'fan0',
    Name: 'Fan 0',
    ReadingType: 'Rotational',
    Reading: 8200,
    ReadingUnits: 'RPM',
    Status: okStatus,
    Thresholds: { LowerCaution: { Reading: 1000 }, LowerCritical: { Reading: 500 } },
  },
  '/redfish/v1/Chassis/chassis/Sensors/fan1': {
    '@odata.id': '/redfish/v1/Chassis/chassis/Sensors/fan1',
    Id: 'fan1',
    Name: 'Fan 1',
    ReadingType: 'Rotational',
    Reading: 8100,
    ReadingUnits: 'RPM',
    Status: { State: 'Enabled', Health: 'Warning' },
    Thresholds: { LowerCaution: { Reading: 1000 }, LowerCritical: { Reading: 500 } },
  },
  '/redfish/v1/Chassis/chassis/Sensors/p12v': {
    '@odata.id': '/redfish/v1/Chassis/chassis/Sensors/p12v',
    Id: 'p12v',
    Name: 'P12V',
    ReadingType: 'Voltage',
    Reading: 12.1,
    ReadingUnits: 'V',
    Status: okStatus,
    Thresholds: {
      LowerCritical: { Reading: 10.8 },
      UpperCritical: { Reading: 13.2 },
    },
  },
  '/redfish/v1/Chassis/chassis/Sensors/total_power': {
    '@odata.id': '/redfish/v1/Chassis/chassis/Sensors/total_power',
    Id: 'total_power',
    Name: 'Total Power',
    ReadingType: 'Power',
    Reading: 210,
    ReadingUnits: 'W',
    Status: okStatus,
  },

  // ---- Account service ------------------------------------------------------
  '/redfish/v1/AccountService': {
    '@odata.id': '/redfish/v1/AccountService',
    Id: 'AccountService',
    Name: 'Account Service',
    Status: okStatus,
    MinPasswordLength: 8,
    MaxPasswordLength: 20,
    AccountLockoutThreshold: 5,
    AccountLockoutDuration: 300,
    Accounts: ID('/redfish/v1/AccountService/Accounts'),
    Roles: ID('/redfish/v1/AccountService/Roles'),
    LDAP: { ServiceEnabled: false, RemoteRoleMapping: [], LDAPService: {} },
    ActiveDirectory: { ServiceEnabled: false, RemoteRoleMapping: [] },
  },
  '/redfish/v1/AccountService/Accounts': collection(
    '/redfish/v1/AccountService/Accounts',
    ['admin', 'operator'],
  ),
  '/redfish/v1/AccountService/Accounts/admin': {
    '@odata.id': '/redfish/v1/AccountService/Accounts/admin',
    Id: 'admin',
    Name: 'User Account',
    UserName: 'admin',
    RoleId: 'Administrator',
    Enabled: true,
    Locked: false,
    AccountTypes: ['Redfish', 'WebUI'],
    Links: { Role: ID('/redfish/v1/AccountService/Roles/Administrator') },
  },
  '/redfish/v1/AccountService/Accounts/operator': {
    '@odata.id': '/redfish/v1/AccountService/Accounts/operator',
    Id: 'operator',
    Name: 'User Account',
    UserName: 'operator',
    RoleId: 'Operator',
    Enabled: true,
    Locked: false,
    AccountTypes: ['Redfish', 'WebUI'],
    Links: { Role: ID('/redfish/v1/AccountService/Roles/Operator') },
  },
  '/redfish/v1/AccountService/Roles': collection(
    '/redfish/v1/AccountService/Roles',
    ['Administrator', 'Operator', 'ReadOnly'],
  ),
  '/redfish/v1/AccountService/Roles/Administrator': {
    '@odata.id': '/redfish/v1/AccountService/Roles/Administrator',
    Id: 'Administrator',
    Name: 'User Role',
    RoleId: 'Administrator',
    IsPredefined: true,
    AssignedPrivileges: [
      'Login',
      'ConfigureManager',
      'ConfigureUsers',
      'ConfigureComponents',
      'ConfigureSelf',
    ],
  },
  '/redfish/v1/AccountService/Roles/Operator': {
    '@odata.id': '/redfish/v1/AccountService/Roles/Operator',
    Id: 'Operator',
    Name: 'User Role',
    RoleId: 'Operator',
    IsPredefined: true,
    AssignedPrivileges: ['Login', 'ConfigureComponents', 'ConfigureSelf'],
  },
  '/redfish/v1/AccountService/Roles/ReadOnly': {
    '@odata.id': '/redfish/v1/AccountService/Roles/ReadOnly',
    Id: 'ReadOnly',
    Name: 'User Role',
    RoleId: 'ReadOnly',
    IsPredefined: true,
    AssignedPrivileges: ['Login', 'ConfigureSelf'],
  },

  // ---- Sessions -------------------------------------------------------------
  '/redfish/v1/SessionService': {
    '@odata.id': '/redfish/v1/SessionService',
    Id: 'SessionService',
    Name: 'Session Service',
    SessionTimeout: 3600,
    Status: okStatus,
    Sessions: ID('/redfish/v1/SessionService/Sessions'),
  },
  '/redfish/v1/SessionService/Sessions': collection(
    '/redfish/v1/SessionService/Sessions',
    ['demo'],
  ),
  '/redfish/v1/SessionService/Sessions/demo': {
    '@odata.id': '/redfish/v1/SessionService/Sessions/demo',
    Id: 'demo',
    Name: 'User Session',
    UserName: 'demo',
    ClientOriginIPAddress: '127.0.0.1',
    Created: '2024-06-08T12:00:00+00:00',
  },

  // ---- Update service / firmware -------------------------------------------
  '/redfish/v1/UpdateService': {
    '@odata.id': '/redfish/v1/UpdateService',
    Id: 'UpdateService',
    Name: 'Update Service',
    ServiceEnabled: true,
    HttpPushUri: '/redfish/v1/UpdateService/update',
    FirmwareInventory: ID('/redfish/v1/UpdateService/FirmwareInventory'),
    Actions: {
      '#UpdateService.SimpleUpdate': {
        target:
          '/redfish/v1/UpdateService/Actions/UpdateService.SimpleUpdate',
      },
    },
  },
  '/redfish/v1/UpdateService/FirmwareInventory': collection(
    '/redfish/v1/UpdateService/FirmwareInventory',
    ['bmc_active', 'bios_active'],
  ),
  '/redfish/v1/UpdateService/FirmwareInventory/bmc_active': {
    '@odata.id': '/redfish/v1/UpdateService/FirmwareInventory/bmc_active',
    Id: 'bmc_active',
    Name: 'BMC Firmware',
    Version: 'demo-fw-2.14.0',
    Updateable: true,
    Status: okStatus,
    RelatedItem: [ID('/redfish/v1/Managers/bmc')],
  },
  '/redfish/v1/UpdateService/FirmwareInventory/bios_active': {
    '@odata.id': '/redfish/v1/UpdateService/FirmwareInventory/bios_active',
    Id: 'bios_active',
    Name: 'Host Firmware',
    Version: 'DEMO-BIOS-2.14',
    Updateable: true,
    Status: okStatus,
    RelatedItem: [ID('/redfish/v1/Systems/system/Bios')],
  },

  // ---- Ethernet interfaces (System + Manager) ------------------------------
  '/redfish/v1/Systems/system/EthernetInterfaces': collection(
    '/redfish/v1/Systems/system/EthernetInterfaces',
    ['eth0'],
  ),
  '/redfish/v1/Managers/bmc/EthernetInterfaces': collection(
    '/redfish/v1/Managers/bmc/EthernetInterfaces',
    ['eth0'],
  ),
  '/redfish/v1/Managers/bmc/EthernetInterfaces/eth0': ethernetInterface(
    '/redfish/v1/Managers/bmc/EthernetInterfaces/eth0',
  ),
  '/redfish/v1/Systems/system/EthernetInterfaces/eth0': ethernetInterface(
    '/redfish/v1/Systems/system/EthernetInterfaces/eth0',
  ),

  // ---- Log services ---------------------------------------------------------
  '/redfish/v1/Systems/system/LogServices/EventLog/Entries': {
    '@odata.id': '/redfish/v1/Systems/system/LogServices/EventLog/Entries',
    Name: 'System Event Log Entries',
    'Members@odata.count': 3,
    Members: [
      {
        '@odata.id':
          '/redfish/v1/Systems/system/LogServices/EventLog/Entries/1',
        Id: '1',
        Name: 'System Event Log Entry',
        EntryType: 'Event',
        Severity: 'OK',
        Created: '2024-06-08T09:15:00+00:00',
        Modified: '2024-06-08T09:15:00+00:00',
        Message: 'System booted successfully.',
        Resolved: true,
      },
      {
        '@odata.id':
          '/redfish/v1/Systems/system/LogServices/EventLog/Entries/2',
        Id: '2',
        Name: 'System Event Log Entry',
        EntryType: 'Event',
        Severity: 'Warning',
        Created: '2024-06-08T10:42:00+00:00',
        Modified: '2024-06-08T10:42:00+00:00',
        Message: 'Fan 1 speed below expected threshold.',
        Resolved: false,
      },
      {
        '@odata.id':
          '/redfish/v1/Systems/system/LogServices/EventLog/Entries/3',
        Id: '3',
        Name: 'System Event Log Entry',
        EntryType: 'Event',
        Severity: 'Critical',
        Created: '2024-06-08T11:05:00+00:00',
        Modified: '2024-06-08T11:05:00+00:00',
        Message: 'Voltage P12V briefly exceeded upper critical threshold.',
        Resolved: false,
      },
    ],
  },
};

function ethernetInterface(path) {
  return {
    '@odata.id': path,
    Id: 'eth0',
    Name: 'Manager Ethernet Interface',
    InterfaceEnabled: true,
    LinkStatus: 'LinkUp',
    SpeedMbps: 1000,
    MACAddress: 'de:ad:be:ef:00:01',
    HostName: 'demo-bmc',
    FQDN: 'demo-bmc.local',
    Status: okStatus,
    DHCPv4: { DHCPEnabled: false, UseDNSServers: false, UseNTPServers: false },
    IPv4Addresses: [
      {
        Address: '192.168.1.50',
        SubnetMask: '255.255.255.0',
        Gateway: '192.168.1.1',
        AddressOrigin: 'Static',
      },
    ],
    IPv4StaticAddresses: [
      {
        Address: '192.168.1.50',
        SubnetMask: '255.255.255.0',
        Gateway: '192.168.1.1',
      },
    ],
    IPv6Addresses: [
      { Address: 'fe80::dead:beef:1', PrefixLength: 64, AddressOrigin: 'LinkLocal' },
    ],
    IPv6StaticAddresses: [],
    StaticNameServers: ['192.168.1.1'],
    NameServers: ['192.168.1.1'],
  };
}

/**
 * Fallback for any unmapped GET. Valid both as an empty collection (Members)
 * and a benign singleton (Status), so neither shape crashes a consumer.
 */
export function genericResource(path) {
  const segments = path.split('/').filter(Boolean);
  const last = segments[segments.length - 1] || 'Resource';
  return {
    '@odata.id': path,
    '@odata.type': '#DemoResource',
    Id: last,
    Name: last.replace(/([a-z])([A-Z])/g, '$1 $2'),
    Description: 'Demo placeholder resource',
    Status: { State: 'Enabled', Health: 'OK' },
    Members: [],
    'Members@odata.count': 0,
  };
}

export default fixtures;
