import { bnToBn, bnToHex } from "@polkadot/util";
import { AnyJson } from "@polkadot/types-codec/types";
import { ExtrinsicStatus } from "@polkadot/types/interfaces/author/types";
import { EventRecord } from "@polkadot/types/interfaces/system/types";

// Notice: any changes to this should be reflected on scaleEncode(data: DelegateData) also
export interface DelegateData {
  authorizedMsaId: number;
  permission: number;
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

export function scaleEncode(data: DelegateData): string {
  const permission = bnToHex(bnToBn(data.permission), {
    bitLength: 8,
    isLe: true,
  });
  console.log("permission", permission);
  const account = bnToHex(bnToBn(data.authorizedMsaId), {
    bitLength: 32,
    isLe: true,
  }).substr(2);
  console.log("account: ", account)
  return permission + account;
}

export const getEventName = (ev: Record<string, AnyJson>): string =>
  `${ev.section}:${ev.method}`;
