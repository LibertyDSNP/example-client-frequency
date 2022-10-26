/**
 * ChainError is a base class for chain-related errors. All errors thrown
 * extending this class can be assumed to have originated here, not
 * in any underlying adapters or higher level client code.
 */
export class ChainError extends Error {
  constructor(message: string) {
    super(`ChainError: ${message}`);
    this.name = this.constructor.name;
  }
}

/**
 * ConfigError indicates that some piece of configuration is not set and that
 * the current action cannot proceed without it.
 */
export class ConfigError extends ChainError {
  constructor(message: string) {
    super(message);
  }
}

/**
 * MissingSignerConfigError indicates that the signer config is not set.
 */
export class MissingSignerConfigError extends ConfigError {
  constructor() {
    super("Signer is not set.");
  }
}

/**
 * MissingProviderConfigError indicates that the provider config is not set.
 */
export class MissingProviderConfigError extends ConfigError {
  constructor() {
    super("Blockchain provider is not set.");
  }
}

/**
 * MissingStoreConfigError indicates that the store config is not set.
 */
export class MissingStoreConfigError extends ConfigError {
  constructor() {
    super("Store adapter was not found");
  }
}

/**
 * MissingFromIdConfigError indicates that the current from id is missing.
 */
export class MissingFromIdConfigError extends ConfigError {
  constructor() {
    super("No from id found. Please authenticate a handle.");
  }
}

/**
 * MissingWalletConfigError indicates that the current wallet is missing.
 */
export class MissingWalletConfigError extends ConfigError {
  constructor() {
    super("No wallet found. Please set a wallet.");
  }
}

/**
 * MissingServiceKeyConfigError indicates that the service key config is not set.
 */
export class MissingServiceKeyConfigError extends ConfigError {
  constructor() {
    super("Service key is not set.");
  }
}

/** MissingServiceMsaIdConfigError indicates that the MSA Service ID config is not set.
 *
 */
export class MissingServiceMsaIdConfigError extends ConfigError {
  constructor() {
    super("Service MSA ID is not set.");
  }
}
