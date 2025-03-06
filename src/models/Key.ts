export type KeyType = 'primary' | 'foreign'

export class Key {
  keyType: KeyType;
  constructor({
    keyType,
  }: {
    keyType: KeyType,
  }) {
    this.keyType = keyType;
  }
}