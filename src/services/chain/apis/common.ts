import { bnToBn, bnToHex } from "@polkadot/util";
import { AnyJson } from "@polkadot/types-codec/types";
import { ExtrinsicStatus } from "@polkadot/types/interfaces";
import { EventRecord } from "@polkadot/types/interfaces";

// Notice: any changes to this should be reflected on scaleEncode(data: DelegateData) also
export interface DelegateData {
  authorizedMsaId: bigint; // BigNumber?
  schemaIds: Uint16Array;
  expiration: bigint;
}
/**
 * DsnpCallback represents a type for publication callback function
 */
export type DsnpCallback = (
  status: ExtrinsicStatus,
  events: EventRecord[]
) => void;

/**
 * DsnpErrorCallback represents a type for publication callback function
 */
export type DsnpErrorCallback = (error: any) => void;

/**
 * UnsubscribeFunction represents a function to unsubscribe to events
 */
export type UnsubscribeFunction = () => void;

// Convert a hex string to a byte array
export function hexToBytes(hex: string): number[] {
  const bytes = [];
  let c = 0;
  for (; c < hex.length; c += 2) bytes.push(parseInt(hex.substr(c, 2), 16));
  return bytes;
}

export function scaleEncodeDelegateData(data: DelegateData): string {
  const expiration = bnToHex(bnToBn(data.expiration), {
    bitLength: 32,
    isLe: true,
  }).substr(2);

  const bitLength = data.schemaIds.length * 16 + 8;

  const schemaIds = bnToHex(bnToBn(data.schemaIds.toString()), {
    bitLength,
    isLe: true,
  }).substr(2);

  const authorizedMsaId = bnToHex(bnToBn(data.authorizedMsaId), {
    bitLength: 64,
    isLe: true,
  });
  return authorizedMsaId + schemaIds + expiration;
}

export const getEventName = (ev: Record<string, AnyJson>): string =>
  `${ev.section}:${ev.method}`;
