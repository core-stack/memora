export enum Permission {
  CREATE_USER = 1 << 0,       // 1
  READ_USER = 1 << 1,         // 2
  UPDATE_USER = 1 << 2,       // 4
  DELETE_USER = 1 << 3,       // 8
  BAN_USER = 1 << 4,          // 16
  MANAGE_TENANT = 1 << 5,  // 32

  UPDATE_TENANT = 1 << 6,  // 64
  DELETE_TENANT = 1 << 7,  // 128

  GET_MEMBERS = 1 << 8,       // 256
  UPDATE_MEMBER = 1 << 9,     // 512
  DELETE_MEMBER = 1 << 10,    // 1024

  CREATE_INVITE = 1 << 11,    // 2048
  DELETE_INVITE = 1 << 12,    // 4096

  GET_BILLING = 1 << 13,      // 8192
  UPDATE_BILLING = 1 << 14,   // 16384
  DELETE_BILLING = 1 << 15    // 32768
}
