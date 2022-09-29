import { Json } from "@polkadot/types";
import React from "react";

export interface SchemaDetails {
  key: React.Key;
  schema_id: string;
  model_type: string;
  payload_location: string;
  model_structure: Json;
}

export interface MessageDetails {
  key: React.Key;
  payload: Json;
}
