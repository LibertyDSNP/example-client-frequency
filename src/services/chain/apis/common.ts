import { bnToBn, bnToHex } from "@polkadot/util";
import { AnyJson } from "@polkadot/types-codec/types";
import { ExtrinsicStatus } from  "@polkadot/api/node_modules/@polkadot/types/interfaces/author/types"; //"@polkadot/types/interfaces/author/types";
import { EventRecord } from "@polkadot/api/node_modules/@polkadot/types/interfaces/system/types";//"@polkadot/types/interfaces/system/types";

// Notice: any changes to this should be reflected on scaleEncode(data: DelegateData) also
export interface DelegateData {
  authorizedMsaId: bigint;  // BigNumber?
  permission: bigint;
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
  const permission = bnToHex(bnToBn(data.permission), {
    bitLength: 8,
    isLe: true,
  }).substr(2);
  const authorizedMsaId = bnToHex(bnToBn(data.authorizedMsaId), {
    bitLength: 64,
    isLe: true,
  });
  return authorizedMsaId + permission;
}

export const getEventName = (ev: Record<string, AnyJson>): string =>
  `${ev.section}:${ev.method}`;
