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

export const getEventName = (ev: Record<string, AnyJson>): string =>
  `${ev.section}:${ev.method}`;
