import { IFingerprint } from '@/models/fingerprint';

export interface IFingerprintGroupBase {
  key: string;
}

export interface IFingerprintGroupRelation {
  fingerprints: Partial<IFingerprint>[];
}

export type IFingerprintGroup = IFingerprintGroupBase & IFingerprintGroupRelation;
