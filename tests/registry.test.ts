import { describe, it, expect, beforeEach } from 'vitest'

const mockRegistryContract = {
  admin: 'ST000ADMIN0000000000000000000000000000',
  protocols: new Map(),

  isAdmin(caller: string) {
    return caller === this.admin
  },

  registerProtocol(caller: string, protocol: string, name: string, meta: string) {
    if (!this.isAdmin(caller)) {
      return { error: 100 } // ERR-NOT-AUTHORIZED
    }
    if (this.protocols.has(protocol)) {
      return { error: 101 } // ERR-ALREADY-REGISTERED
    }
    this.protocols.set(protocol, {
      owner: protocol,
      name,
      meta,
      active: true,
    })
    return { value: true }
  },

  deactivateProtocol(caller: string, protocol: string) {
    const entry = this.protocols.get(protocol)
    if (!entry) return { error: 102 } // ERR-NOT-REGISTERED
    if (caller !== entry.owner) return { error: 103 } // ERR-NOT-OWNER
    this.protocols.set(protocol, { ...entry, active: false })
    return { value: true }
  },

  updateMetadata(caller: string, protocol: string, newMeta: string) {
    const entry = this.protocols.get(protocol)
    if (!entry) return { error: 102 }
    if (caller !== entry.owner) return { error: 103 }
    this.protocols.set(protocol, { ...entry, meta: newMeta })
    return { value: true }
  },

  transferOwnership(caller: string, protocol: string, newOwner: string) {
    const entry = this.protocols.get(protocol)
    if (!entry) return { error: 102 }
    if (caller !== entry.owner) return { error: 103 }
    this.protocols.set(protocol, { ...entry, owner: newOwner })
    return { value: true }
  },

  transferAdmin(caller: string, newAdmin: string) {
    if (!this.isAdmin(caller)) return { error: 100 }
    this.admin = newAdmin
    return { value: true }
  },

  getProtocol(protocol: string) {
    return this.protocols.get(protocol) || null
  },

  isRegistered(protocol: string) {
    return this.protocols.has(protocol)
  },

  isActive(protocol: string) {
    const entry = this.protocols.get(protocol)
    return entry ? entry.active : false
  },
}

describe('ByteSentry Registry Contract (Mock)', () => {
  beforeEach(() => {
    mockRegistryContract.admin = 'ST000ADMIN0000000000000000000000000000'
    mockRegistryContract.protocols = new Map()
  })

  it('allows admin to register a new protocol', () => {
    const result = mockRegistryContract.registerProtocol(
      'ST000ADMIN0000000000000000000000000000',
      'STPROT001',
      'Test Protocol',
      'Initial Metadata'
    )
    expect(result).toEqual({ value: true })
    expect(mockRegistryContract.getProtocol('STPROT001')).toMatchObject({ name: 'Test Protocol' })
  })

  it('prevents non-admins from registering protocols', () => {
    const result = mockRegistryContract.registerProtocol(
      'STNOTADMIN',
      'STPROT002',
      'Invalid Protocol',
      'Invalid Metadata'
    )
    expect(result).toEqual({ error: 100 })
    expect(mockRegistryContract.isRegistered('STPROT002')).toBe(false)
  })

  it('does not allow duplicate protocol registration', () => {
    mockRegistryContract.registerProtocol('ST000ADMIN0000000000000000000000000000', 'STPROT003', 'Alpha', 'Meta')
    const result = mockRegistryContract.registerProtocol('ST000ADMIN0000000000000000000000000000', 'STPROT003', 'Beta', 'Meta')
    expect(result).toEqual({ error: 101 })
  })

  it('allows the owner to deactivate a protocol', () => {
    mockRegistryContract.registerProtocol('ST000ADMIN0000000000000000000000000000', 'STPROT004', 'Gamma', 'Meta')
    const result = mockRegistryContract.deactivateProtocol('STPROT004', 'STPROT004')
    expect(result).toEqual({ value: true })
    expect(mockRegistryContract.isActive('STPROT004')).toBe(false)
  })

  it('prevents non-owners from deactivating protocols', () => {
    mockRegistryContract.registerProtocol('ST000ADMIN0000000000000000000000000000', 'STPROT005', 'Delta', 'Meta')
    const result = mockRegistryContract.deactivateProtocol('STHACKER', 'STPROT005')
    expect(result).toEqual({ error: 103 })
  })

  it('updates metadata when called by the protocol owner', () => {
    mockRegistryContract.registerProtocol('ST000ADMIN0000000000000000000000000000', 'STPROT006', 'Zeta', 'Meta')
    const result = mockRegistryContract.updateMetadata('STPROT006', 'STPROT006', 'Updated Meta')
    expect(result).toEqual({ value: true })
    expect(mockRegistryContract.getProtocol('STPROT006')?.meta).toBe('Updated Meta')
  })

  it('transfers protocol ownership correctly', () => {
    mockRegistryContract.registerProtocol('ST000ADMIN0000000000000000000000000000', 'STPROT007', 'Omega', 'Meta')
    const result = mockRegistryContract.transferOwnership('STPROT007', 'STPROT007', 'STNEWOWNER')
    expect(result).toEqual({ value: true })
    expect(mockRegistryContract.getProtocol('STPROT007')?.owner).toBe('STNEWOWNER')
  })

  it('transfers admin role correctly', () => {
    const result = mockRegistryContract.transferAdmin('ST000ADMIN0000000000000000000000000000', 'STNEWADMIN')
    expect(result).toEqual({ value: true })
    expect(mockRegistryContract.admin).toBe('STNEWADMIN')
  })
})
